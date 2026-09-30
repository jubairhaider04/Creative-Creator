import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser 
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc,
  getDocFromServer,
  updateDoc, 
  deleteDoc,
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  serverTimestamp, 
  setDoc, 
  where 
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";
import { ServicePillar, Project, UserProfile } from "../types";
import { SERVICE_PILLARS } from "../data/servicesData";
import { PORTFOLIO_PROJECTS } from "../data/portfolioData";

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

// Initialize Firestore
export const db = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Validate Connection on Boot
export const testFirestoreConnection = async () => {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.warn("Firestore offline or pending connection:", error.message);
    }
  }
};
testFirestoreConnection();

// 1. User Profiles & Firestore Synchronization (Source of Truth)
export const syncUserProfile = async (user: FirebaseUser, additionalData?: { phone?: string; company?: string }): Promise<UserProfile | null> => {
  if (!user.uid) return null;
  const userDocRef = doc(db, "users", user.uid);
  try {
    const snap = await getDoc(userDocRef);
    const nowIso = new Date().toISOString();
    
    if (snap.exists()) {
      const data = snap.data() as UserProfile;
      // Preserve existing role and status from database
      const existingRole = data.role || "client";
      const existingStatus = data.status || "active";
      
      const updatedProfile: Partial<UserProfile> = {
        uid: user.uid,
        email: user.email || data.email,
        displayName: user.displayName || data.displayName || "Client User",
        photoURL: user.photoURL || data.photoURL || "",
        phone: additionalData?.phone || data.phone || "",
        company: additionalData?.company || data.company || "",
        role: existingRole,
        status: existingStatus,
        updatedAt: nowIso
      };

      await setDoc(userDocRef, {
        ...updatedProfile,
        lastLoginAt: serverTimestamp()
      }, { merge: true });

      return {
        ...data,
        ...updatedProfile,
        role: existingRole,
        status: existingStatus
      } as UserProfile;
    } else {
      // First time user profile creation
      // Default role is always "client". Initial owner bootstrap for jubair04sale@gmail.com
      const initialRole: "admin" | "client" = user.email?.toLowerCase().trim() === "jubair04sale@gmail.com" ? "admin" : "client";
      
      const newProfile: UserProfile = {
        uid: user.uid,
        email: user.email || "",
        displayName: user.displayName || "Client User",
        photoURL: user.photoURL || "",
        phone: additionalData?.phone || "",
        company: additionalData?.company || "",
        role: initialRole,
        status: "active",
        createdAt: nowIso,
        updatedAt: nowIso
      };

      await setDoc(userDocRef, {
        ...newProfile,
        lastLoginAt: serverTimestamp()
      });

      return newProfile;
    }
  } catch (error) {
    console.warn("User profile sync notice:", error);
    return null;
  }
};

// Real-time listener for current user's profile
export const subscribeToUserProfile = (uid: string, callback: (profile: UserProfile | null) => void) => {
  const userDocRef = doc(db, "users", uid);
  return onSnapshot(userDocRef, (snap) => {
    if (snap.exists()) {
      callback(snap.data() as UserProfile);
    } else {
      callback(null);
    }
  }, (err) => {
    console.warn("User profile snapshot warning:", err);
  });
};

// Auth Actions
export const loginWithEmail = async (email: string, password: string): Promise<{ user: FirebaseUser; profile: UserProfile | null }> => {
  const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
  const profile = await syncUserProfile(userCredential.user);
  return { user: userCredential.user, profile };
};

export const registerWithEmail = async (data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  company?: string;
}): Promise<{ user: FirebaseUser; profile: UserProfile | null }> => {
  const userCredential = await createUserWithEmailAndPassword(auth, data.email.trim(), data.password);
  const user = userCredential.user;
  
  // Set display name in Firebase Auth
  await updateProfile(user, { displayName: data.name.trim() });
  
  // Always create profile as "client"
  const nowIso = new Date().toISOString();
  const profileData: UserProfile = {
    uid: user.uid,
    email: user.email || data.email.trim(),
    displayName: data.name.trim(),
    phone: data.phone?.trim() || "",
    company: data.company?.trim() || "",
    photoURL: "",
    role: "client", // Registration strictly defaults to client
    status: "active",
    createdAt: nowIso,
    updatedAt: nowIso
  };

  const userDocRef = doc(db, "users", user.uid);
  await setDoc(userDocRef, {
    ...profileData,
    lastLoginAt: serverTimestamp()
  });

  return { user, profile: profileData };
};

export const loginWithGoogle = async (): Promise<{ user: FirebaseUser; profile: UserProfile | null }> => {
  const result = await signInWithPopup(auth, googleProvider);
  const profile = await syncUserProfile(result.user);
  return { user: result.user, profile };
};

export const sendPasswordReset = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email.trim());
};

export const signOutUser = async (): Promise<void> => {
  await signOut(auth);
};

export const updateUserProfileData = async (uid: string, updates: { displayName?: string; phone?: string; company?: string; photoURL?: string }) => {
  const userDocRef = doc(db, "users", uid);
  const cleanUpdates = {
    ...(updates.displayName && { displayName: updates.displayName.trim() }),
    ...(updates.phone !== undefined && { phone: updates.phone.trim() }),
    ...(updates.company !== undefined && { company: updates.company.trim() }),
    ...(updates.photoURL !== undefined && { photoURL: updates.photoURL.trim() }),
    updatedAt: new Date().toISOString()
  };
  await updateDoc(userDocRef, cleanUpdates);
  if (auth.currentUser && updates.displayName) {
    await updateProfile(auth.currentUser, { 
      displayName: updates.displayName.trim(),
      ...(updates.photoURL ? { photoURL: updates.photoURL.trim() } : {})
    });
  }
};

export const updateUserRoleFirestore = async (userId: string, newRole: "admin" | "client") => {
  const userDocRef = doc(db, "users", userId);
  await updateDoc(userDocRef, { role: newRole, updatedAt: new Date().toISOString() });
};

export const updateUserStatusFirestore = async (userId: string, newStatus: "active" | "suspended") => {
  const userDocRef = doc(db, "users", userId);
  await updateDoc(userDocRef, { status: newStatus, updatedAt: new Date().toISOString() });
};

export const fetchAllUsersFirestore = async (): Promise<UserProfile[]> => {
  try {
    const snap = await getDocs(collection(db, "users"));
    return snap.docs.map(d => ({ ...d.data(), id: d.id } as unknown as UserProfile));
  } catch (err) {
    console.warn("Could not fetch users list:", err);
    return [];
  }
};

export const subscribeToAuthState = (callback: (user: FirebaseUser | null, profile?: UserProfile | null) => void) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const profile = await syncUserProfile(user);
      callback(user, profile);
    } else {
      callback(null, null);
    }
  });
};

// 2. Services Collection (Realtime & Seed)
export const seedServicesFirestore = async (): Promise<boolean> => {
  try {
    for (const pillar of SERVICE_PILLARS) {
      const docRef = doc(db, "services", pillar.id);
      await setDoc(docRef, {
        ...pillar,
        updatedAt: serverTimestamp()
      }, { merge: true });
    }
    return true;
  } catch (err) {
    console.warn("Notice: Services seed in Firestore skipped or pending permissions:", err);
    return false;
  }
};

export const subscribeToServicesFirestore = (callback: (services: ServicePillar[]) => void) => {
  try {
    const colRef = collection(db, "services");
    return onSnapshot(colRef, async (snapshot) => {
      if (snapshot.empty) {
        callback(SERVICE_PILLARS);
        seedServicesFirestore().catch(() => {});
      } else {
        const services = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ServicePillar));
        callback(services);
      }
    }, (error) => {
      console.warn("Services subscription warning:", error);
      callback(SERVICE_PILLARS);
    });
  } catch (err) {
    console.warn("Services subscription error:", err);
    callback(SERVICE_PILLARS);
    return () => {};
  }
};

export const saveServiceFirestore = async (service: ServicePillar) => {
  try {
    const docRef = doc(db, "services", service.id);
    await setDoc(docRef, {
      ...service,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    console.error("Error saving service in Firestore:", err);
    throw err;
  }
};

export const deleteServiceFirestore = async (serviceId: string) => {
  try {
    const docRef = doc(db, "services", serviceId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error("Error deleting service in Firestore:", err);
    throw err;
  }
};

// 3. Portfolio Collection (Realtime & Seed)
export const seedPortfolioFirestore = async (): Promise<boolean> => {
  try {
    for (const project of PORTFOLIO_PROJECTS) {
      const docRef = doc(db, "portfolio", project.id);
      await setDoc(docRef, {
        ...project,
        updatedAt: serverTimestamp()
      }, { merge: true });
    }
    return true;
  } catch (err) {
    console.warn("Notice: Portfolio seed in Firestore skipped or pending permissions:", err);
    return false;
  }
};

export const subscribeToPortfolioFirestore = (callback: (projects: Project[]) => void) => {
  try {
    const colRef = collection(db, "portfolio");
    return onSnapshot(colRef, async (snapshot) => {
      if (snapshot.empty) {
        callback(PORTFOLIO_PROJECTS);
        seedPortfolioFirestore().catch(() => {});
      } else {
        const projects = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Project));
        callback(projects);
      }
    }, (error) => {
      console.warn("Portfolio subscription warning:", error);
      callback(PORTFOLIO_PROJECTS);
    });
  } catch (err) {
    console.warn("Portfolio subscription error:", err);
    callback(PORTFOLIO_PROJECTS);
    return () => {};
  }
};

export const saveProjectFirestore = async (project: Project) => {
  try {
    const docRef = doc(db, "portfolio", project.id);
    await setDoc(docRef, {
      ...project,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    console.error("Error saving project in Firestore:", err);
    throw err;
  }
};

export const deleteProjectFirestore = async (projectId: string) => {
  try {
    const docRef = doc(db, "portfolio", projectId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error("Error deleting project in Firestore:", err);
    throw err;
  }
};

// 4. Inquiries & CRM Leads
export const saveInquiryToFirestore = async (leadData: {
  name: string;
  email: string;
  company?: string;
  services: string[];
  budget: string;
  timeline: string;
  description: string;
  estimatedValue?: number;
  userId?: string;
}) => {
  try {
    const docRef = await addDoc(collection(db, "leads"), {
      ...leadData,
      status: "new",
      createdAt: new Date().toISOString(),
      timestamp: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving lead to Firestore:", error);
    throw error;
  }
};

export const subscribeToLeadsFirestore = (callback: (leads: any[]) => void) => {
  try {
    const q = query(collection(db, "leads"), orderBy("timestamp", "desc"), limit(50));
    return onSnapshot(q, (snapshot) => {
      const leads = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(leads);
    }, (error) => {
      console.warn("Firestore leads snapshot warning:", error);
    });
  } catch (err) {
    console.warn("Firestore subscription error:", err);
    return () => {};
  }
};

export const updateLeadStatusFirestore = async (leadId: string, status: string) => {
  try {
    const docRef = doc(db, "leads", leadId);
    await updateDoc(docRef, { status });
  } catch (error) {
    console.error("Error updating lead status in Firestore:", error);
    throw error;
  }
};

// 5. Saved AI Scopes & Roadmaps
export const saveAiPlanToFirestore = async (plan: any, userId?: string, userEmail?: string) => {
  try {
    const docRef = await addDoc(collection(db, "user_ai_plans"), {
      plan,
      userId: userId || "anonymous",
      userEmail: userEmail || "anonymous",
      createdAt: new Date().toISOString(),
      timestamp: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving AI plan to Firestore:", error);
    throw error;
  }
};

export const getUserAiPlansFirestore = async (userId: string) => {
  try {
    const q = query(
      collection(db, "user_ai_plans"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc"),
      limit(20)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("Error fetching AI plans:", error);
    return [];
  }
};

// 6. Blog Comments & Claps
export const subscribeToBlogComments = (postId: string, callback: (comments: any[]) => void) => {
  try {
    const q = query(
      collection(db, `blog_posts/${postId}/comments`),
      orderBy("timestamp", "desc"),
      limit(50)
    );
    return onSnapshot(q, (snapshot) => {
      const comments = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(comments);
    }, (err) => {
      console.warn("Blog comments snapshot warning:", err);
    });
  } catch (err) {
    console.warn("Comments subscription error:", err);
    return () => {};
  }
};

export const addBlogCommentFirestore = async (postId: string, commentData: {
  name: string;
  email?: string;
  avatar?: string;
  text: string;
}) => {
  try {
    const colRef = collection(db, `blog_posts/${postId}/comments`);
    const docRef = await addDoc(colRef, {
      ...commentData,
      time: "Just now",
      createdAt: new Date().toISOString(),
      timestamp: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding blog comment to Firestore:", error);
    throw error;
  }
};

// 7. Newsletter Subscribers
export const saveNewsletterSubscriberFirestore = async (email: string, topics: string[]) => {
  try {
    const docRef = await addDoc(collection(db, "newsletter_subscribers"), {
      email: email.toLowerCase().trim(),
      topics,
      subscribedAt: new Date().toISOString(),
      timestamp: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving subscriber to Firestore:", error);
    throw error;
  }
};
