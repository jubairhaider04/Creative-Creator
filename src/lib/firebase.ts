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
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "firebase/storage";
import firebaseAppletConfig from "../../firebase-applet-config.json";
import { 
  ServicePillar, 
  Project, 
  UserProfile, 
  ServiceRequest, 
  ClientProject, 
  ChatMessage, 
  ContactMessage, 
  TestimonialDoc, 
  AppNotification, 
  CrmLead, 
  ActivityLog 
} from "../types";
import { SERVICE_PILLARS } from "../data/servicesData";
import { PORTFOLIO_PROJECTS } from "../data/portfolioData";

// Environment Variable Configuration with Fallback
const metaEnv = typeof import.meta !== "undefined" ? (import.meta as any).env : undefined;
const firebaseConfig = {
  apiKey: metaEnv?.VITE_FIREBASE_API_KEY || firebaseAppletConfig.apiKey,
  authDomain: metaEnv?.VITE_FIREBASE_AUTH_DOMAIN || firebaseAppletConfig.authDomain,
  projectId: metaEnv?.VITE_FIREBASE_PROJECT_ID || firebaseAppletConfig.projectId,
  storageBucket: metaEnv?.VITE_FIREBASE_STORAGE_BUCKET || firebaseAppletConfig.storageBucket,
  messagingSenderId: metaEnv?.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseAppletConfig.messagingSenderId,
  appId: metaEnv?.VITE_FIREBASE_APP_ID || firebaseAppletConfig.appId,
  firestoreDatabaseId: metaEnv?.VITE_FIREBASE_DATABASE_ID || firebaseAppletConfig.firestoreDatabaseId
};

// Initialize Singleton Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

// Initialize Firestore
export const db = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Initialize Firebase Storage
export const storage = getStorage(app);

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

// ==========================================
// 1. FIREBASE STORAGE UTILITIES
// ==========================================
export const uploadFileToStorage = async (file: File, folderPath: string): Promise<string> => {
  try {
    const cleanName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const fullPath = `${folderPath}/${cleanName}`;
    const storageRef = ref(storage, fullPath);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.error("Storage upload error:", error);
    throw error;
  }
};

// ==========================================
// 2. USER AUTHENTICATION & PROFILES
// ==========================================
export const syncUserProfile = async (
  user: FirebaseUser, 
  additionalData?: { phone?: string; companyName?: string; country?: string; website?: string }
): Promise<UserProfile | null> => {
  if (!user.uid) return null;
  const userDocRef = doc(db, "users", user.uid);
  try {
    const snap = await getDoc(userDocRef);
    const nowIso = new Date().toISOString();
    
    if (snap.exists()) {
      const data = snap.data() as UserProfile;
      const existingRole = data.role || "client";
      const existingStatus = data.status || "active";
      
      const updatedProfile: Partial<UserProfile> = {
        uid: user.uid,
        email: user.email || data.email,
        displayName: user.displayName || data.displayName || data.fullName || "Client User",
        fullName: user.displayName || data.fullName || data.displayName || "Client User",
        photoURL: user.photoURL || data.photoURL || data.avatarUrl || "",
        avatarUrl: user.photoURL || data.avatarUrl || data.photoURL || "",
        phone: additionalData?.phone || data.phone || "",
        company: additionalData?.companyName || data.company || data.companyName || "",
        companyName: additionalData?.companyName || data.companyName || data.company || "",
        country: additionalData?.country || data.country || "",
        website: additionalData?.website || data.website || "",
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
      // First time user profile creation.
      // Owner account bootstrap for jubair04sale@gmail.com
      const isOwnerAdmin = user.email?.toLowerCase().trim() === "jubair04sale@gmail.com";
      const initialRole: "admin" | "client" = isOwnerAdmin ? "admin" : "client";
      
      const newProfile: UserProfile = {
        uid: user.uid,
        email: user.email || "",
        displayName: user.displayName || "Client User",
        fullName: user.displayName || "Client User",
        photoURL: user.photoURL || "",
        avatarUrl: user.photoURL || "",
        phone: additionalData?.phone || "",
        company: additionalData?.companyName || "",
        companyName: additionalData?.companyName || "",
        country: additionalData?.country || "",
        website: additionalData?.website || "",
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

export const loginWithEmail = async (email: string, password: string): Promise<{ user: FirebaseUser; profile: UserProfile | null }> => {
  const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
  const profile = await syncUserProfile(userCredential.user);
  return { user: userCredential.user, profile };
};

export const registerWithEmail = async (data: {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  companyName?: string;
  country?: string;
  website?: string;
}): Promise<{ user: FirebaseUser; profile: UserProfile | null }> => {
  const userCredential = await createUserWithEmailAndPassword(auth, data.email.trim(), data.password);
  const user = userCredential.user;
  
  await updateProfile(user, { displayName: data.fullName.trim() });
  
  const nowIso = new Date().toISOString();
  const profileData: UserProfile = {
    uid: user.uid,
    email: user.email || data.email.trim(),
    displayName: data.fullName.trim(),
    fullName: data.fullName.trim(),
    phone: data.phone?.trim() || "",
    company: data.companyName?.trim() || "",
    companyName: data.companyName?.trim() || "",
    country: data.country?.trim() || "",
    website: data.website?.trim() || "",
    photoURL: "",
    avatarUrl: "",
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

export const updateUserProfileData = async (
  uid: string, 
  updates: { 
    fullName?: string; 
    displayName?: string; 
    phone?: string; 
    companyName?: string; 
    company?: string; 
    country?: string; 
    website?: string; 
    photoURL?: string; 
    avatarUrl?: string; 
  }
) => {
  const userDocRef = doc(db, "users", uid);
  const finalName = updates.fullName || updates.displayName;
  const finalCompany = updates.companyName || updates.company;
  const finalAvatar = updates.avatarUrl || updates.photoURL;

  const cleanUpdates = {
    ...(finalName && { displayName: finalName.trim(), fullName: finalName.trim() }),
    ...(updates.phone !== undefined && { phone: updates.phone.trim() }),
    ...(finalCompany !== undefined && { company: finalCompany.trim(), companyName: finalCompany.trim() }),
    ...(updates.country !== undefined && { country: updates.country.trim() }),
    ...(updates.website !== undefined && { website: updates.website.trim() }),
    ...(finalAvatar !== undefined && { photoURL: finalAvatar.trim(), avatarUrl: finalAvatar.trim() }),
    updatedAt: new Date().toISOString()
  };

  await updateDoc(userDocRef, cleanUpdates);
  if (auth.currentUser && finalName) {
    await updateProfile(auth.currentUser, { 
      displayName: finalName.trim(),
      ...(finalAvatar ? { photoURL: finalAvatar.trim() } : {})
    });
  }
};

export const updateUserRoleFirestore = async (userId: string, newRole: "admin" | "client") => {
  const userDocRef = doc(db, "users", userId);
  await updateDoc(userDocRef, { role: newRole, updatedAt: new Date().toISOString() });
};

export const updateUserStatusFirestore = async (userId: string, newStatus: "active" | "inactive" | "suspended") => {
  const userDocRef = doc(db, "users", userId);
  await updateDoc(userDocRef, { status: newStatus, updatedAt: new Date().toISOString() });
};

export const fetchAllUsersFirestore = async (): Promise<UserProfile[]> => {
  try {
    const snap = await getDocs(collection(db, "users"));
    return snap.docs.map(d => ({ ...d.data(), uid: d.id } as unknown as UserProfile));
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

// ==========================================
// 3. SERVICE REQUESTS (CLIENT & ADMIN)
// ==========================================
export const createServiceRequestFirestore = async (
  requestData: Omit<ServiceRequest, "id" | "createdAt" | "updatedAt">, 
  files?: File[]
): Promise<string> => {
  try {
    let attachments: string[] = requestData.attachments || [];
    if (files && files.length > 0) {
      for (const file of files) {
        const url = await uploadFileToStorage(file, `users/${requestData.clientId}/requests`);
        attachments.push(url);
      }
    }

    const docRef = await addDoc(collection(db, "serviceRequests"), {
      ...requestData,
      attachments,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timestamp: serverTimestamp()
    });

    // Create activity log
    await logActivityFirestore({
      actorId: requestData.clientId,
      actorRole: "client",
      action: "submitted_service_request",
      entityType: "serviceRequests",
      entityId: docRef.id,
      description: `Client ${requestData.clientName} requested ${requestData.service}: ${requestData.projectTitle}`
    });

    // Notify admins
    await createNotificationFirestore({
      userId: "admin",
      title: "New Service Request",
      message: `${requestData.clientName} requested ${requestData.service} (${requestData.budget})`,
      type: "request",
      link: "/admin/dashboard"
    });

    return docRef.id;
  } catch (error) {
    console.error("Error creating service request:", error);
    throw error;
  }
};

export const subscribeToClientServiceRequests = (clientId: string, callback: (requests: ServiceRequest[]) => void) => {
  try {
    const q = query(collection(db, "serviceRequests"), where("clientId", "==", clientId));
    return onSnapshot(q, (snapshot) => {
      const reqs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ServiceRequest));
      reqs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(reqs);
    }, (err) => {
      console.warn("Client service requests warning:", err);
    });
  } catch (err) {
    console.warn("Service requests error:", err);
    return () => {};
  }
};

export const subscribeToAllServiceRequests = (callback: (requests: ServiceRequest[]) => void) => {
  try {
    const colRef = collection(db, "serviceRequests");
    return onSnapshot(colRef, (snapshot) => {
      const reqs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ServiceRequest));
      reqs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(reqs);
    }, (err) => {
      console.warn("All service requests warning:", err);
    });
  } catch (err) {
    console.warn("All service requests error:", err);
    return () => {};
  }
};

export const updateServiceRequestStatusFirestore = async (
  requestId: string, 
  status: ServiceRequest["status"], 
  notes?: string
) => {
  try {
    const docRef = doc(db, "serviceRequests", requestId);
    await updateDoc(docRef, {
      status,
      ...(notes !== undefined && { notes }),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error updating service request status:", error);
    throw error;
  }
};

// ==========================================
// 4. CLIENT PROJECTS (ACTIVE PRODUCTION SPRINTS)
// ==========================================
export const createClientProjectFirestore = async (
  projectData: Omit<ClientProject, "id" | "createdAt" | "updatedAt">
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "projects"), {
      ...projectData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timestamp: serverTimestamp()
    });

    // Notify client
    await createNotificationFirestore({
      userId: projectData.clientId,
      title: "New Project Started",
      message: `Your project "${projectData.projectName}" is now active in production!`,
      type: "project",
      link: "/dashboard"
    });

    // Log activity
    await logActivityFirestore({
      actorId: projectData.assignedTo || "admin",
      actorRole: "admin",
      action: "created_project",
      entityType: "projects",
      entityId: docRef.id,
      description: `Admin created project "${projectData.projectName}" for client ${projectData.clientName}`
    });

    return docRef.id;
  } catch (error) {
    console.error("Error creating client project:", error);
    throw error;
  }
};

export const subscribeToClientProjects = (clientId: string, callback: (projects: ClientProject[]) => void) => {
  try {
    const q = query(collection(db, "projects"), where("clientId", "==", clientId));
    return onSnapshot(q, (snapshot) => {
      const projs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ClientProject));
      projs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(projs);
    }, (err) => {
      console.warn("Client projects warning:", err);
    });
  } catch (err) {
    console.warn("Client projects subscription error:", err);
    return () => {};
  }
};

export const subscribeToAllClientProjects = (callback: (projects: ClientProject[]) => void) => {
  try {
    const colRef = collection(db, "projects");
    return onSnapshot(colRef, (snapshot) => {
      const projs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ClientProject));
      projs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(projs);
    }, (err) => {
      console.warn("All client projects warning:", err);
    });
  } catch (err) {
    console.warn("All client projects error:", err);
    return () => {};
  }
};

export const updateProjectProgressFirestore = async (
  projectId: string, 
  progress: number, 
  status?: ClientProject["status"]
) => {
  try {
    const docRef = doc(db, "projects", projectId);
    await updateDoc(docRef, {
      progress: Math.min(100, Math.max(0, Math.round(progress))),
      ...(status && { status }),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error updating project progress:", error);
    throw error;
  }
};

export const deleteClientProjectFirestore = async (projectId: string) => {
  try {
    await deleteDoc(doc(db, "projects", projectId));
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};

// ==========================================
// 5. MESSAGES (CLIENT & ADMIN CONVERSATIONS)
// ==========================================
export const sendMessageFirestore = async (
  messageData: Omit<ChatMessage, "id" | "createdAt">, 
  file?: File
): Promise<string> => {
  try {
    let attachments = messageData.attachments || [];
    if (file) {
      const url = await uploadFileToStorage(file, `messages/${messageData.conversationId}`);
      attachments.push(url);
    }

    const docRef = await addDoc(collection(db, "messages"), {
      ...messageData,
      attachments,
      createdAt: new Date().toISOString(),
      timestamp: serverTimestamp()
    });

    // Notify recipient
    await createNotificationFirestore({
      userId: messageData.receiverId,
      title: `New message from ${messageData.senderName}`,
      message: messageData.message.slice(0, 80),
      type: "info",
      link: messageData.senderRole === "client" ? "/admin/dashboard" : "/dashboard"
    });

    return docRef.id;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const subscribeToMessagesFirestore = (conversationId: string, callback: (messages: ChatMessage[]) => void) => {
  try {
    const q = query(collection(db, "messages"), where("conversationId", "==", conversationId));
    return onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ChatMessage));
      msgs.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      callback(msgs);
    }, (err) => {
      console.warn("Messages warning:", err);
    });
  } catch (err) {
    console.warn("Messages error:", err);
    return () => {};
  }
};

// ==========================================
// 6. CONTACT MESSAGES (PUBLIC FORM & N8N READY)
// ==========================================
export const submitContactMessageFirestore = async (
  contactData: Omit<ContactMessage, "id" | "createdAt" | "status">
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "contactMessages"), {
      ...contactData,
      status: "new",
      createdAt: new Date().toISOString(),
      timestamp: serverTimestamp()
    });

    // Also record as a CRM lead
    await addDoc(collection(db, "leads"), {
      name: contactData.name,
      email: contactData.email,
      phone: contactData.phone || "",
      company: contactData.company || "",
      source: "Website Contact Form",
      service: contactData.subject || "General Inquiry",
      budget: "Standard Tier",
      message: contactData.message,
      status: "new",
      createdAt: new Date().toISOString(),
      timestamp: serverTimestamp()
    });

    // Notify admin
    await createNotificationFirestore({
      userId: "admin",
      title: "New Contact Message",
      message: `${contactData.name}: ${contactData.subject}`,
      type: "info",
      link: "/admin/dashboard"
    });

    // Optional webhook trigger for n8n
    try {
      fetch("/api/webhooks/n8n/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: docRef.id, ...contactData })
      }).catch(() => {});
    } catch {}

    return docRef.id;
  } catch (error) {
    console.error("Error submitting contact message:", error);
    throw error;
  }
};

export const subscribeToContactMessagesFirestore = (callback: (messages: ContactMessage[]) => void) => {
  try {
    const colRef = collection(db, "contactMessages");
    return onSnapshot(colRef, (snapshot) => {
      const msgs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ContactMessage));
      msgs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(msgs);
    }, (err) => {
      console.warn("Contact messages warning:", err);
    });
  } catch (err) {
    console.warn("Contact messages error:", err);
    return () => {};
  }
};

export const updateContactMessageStatusFirestore = async (messageId: string, status: ContactMessage["status"]) => {
  try {
    await updateDoc(doc(db, "contactMessages", messageId), { status });
  } catch (error) {
    console.error("Error updating contact message status:", error);
    throw error;
  }
};

// ==========================================
// 7. NOTIFICATIONS
// ==========================================
export const createNotificationFirestore = async (
  notificationData: Omit<AppNotification, "id" | "createdAt" | "read">
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "notifications"), {
      ...notificationData,
      read: false,
      createdAt: new Date().toISOString(),
      timestamp: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.warn("Error creating notification:", error);
    return "";
  }
};

export const subscribeToUserNotificationsFirestore = (
  userId: string, 
  callback: (notifications: AppNotification[]) => void
) => {
  try {
    const q = query(collection(db, "notifications"), where("userId", "in", [userId, "all", "admin"]));
    return onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as AppNotification));
      notifs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(notifs);
    }, (err) => {
      console.warn("Notifications warning:", err);
    });
  } catch (err) {
    console.warn("Notifications error:", err);
    return () => {};
  }
};

export const markNotificationReadFirestore = async (notificationId: string) => {
  try {
    await updateDoc(doc(db, "notifications", notificationId), { read: true });
  } catch (error) {
    console.warn("Error marking notification read:", error);
  }
};

// ==========================================
// 8. ACTIVITY LOGS (AUDIT TRAIL)
// ==========================================
export const logActivityFirestore = async (
  logData: Omit<ActivityLog, "id" | "createdAt">
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "activityLogs"), {
      ...logData,
      createdAt: new Date().toISOString(),
      timestamp: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.warn("Error logging activity:", error);
    return "";
  }
};

export const subscribeToActivityLogsFirestore = (callback: (logs: ActivityLog[]) => void) => {
  try {
    const colRef = collection(db, "activityLogs");
    return onSnapshot(colRef, (snapshot) => {
      const logs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ActivityLog));
      logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(logs.slice(0, 50));
    }, (err) => {
      console.warn("Activity logs warning:", err);
    });
  } catch (err) {
    console.warn("Activity logs error:", err);
    return () => {};
  }
};

// ==========================================
// 9. TESTIMONIALS
// ==========================================
export const subscribeToTestimonialsFirestore = (callback: (testimonials: TestimonialDoc[]) => void) => {
  try {
    const colRef = collection(db, "testimonials");
    return onSnapshot(colRef, (snapshot) => {
      const tests = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as TestimonialDoc));
      callback(tests);
    }, (err) => {
      console.warn("Testimonials warning:", err);
    });
  } catch (err) {
    console.warn("Testimonials error:", err);
    return () => {};
  }
};

export const saveTestimonialFirestore = async (testimonial: Omit<TestimonialDoc, "id" | "createdAt" | "updatedAt">) => {
  try {
    const docRef = await addDoc(collection(db, "testimonials"), {
      ...testimonial,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving testimonial:", error);
    throw error;
  }
};

export const toggleTestimonialPublishedFirestore = async (id: string, published: boolean) => {
  try {
    await updateDoc(doc(db, "testimonials", id), { published, updatedAt: new Date().toISOString() });
  } catch (error) {
    console.error("Error updating testimonial:", error);
    throw error;
  }
};

// ==========================================
// 10. SERVICES & PORTFOLIO CATALOG
// ==========================================
export const seedServicesFirestore = async (): Promise<boolean> => {
  try {
    for (const pillar of SERVICE_PILLARS) {
      const docRef = doc(db, "services", pillar.id);
      await setDoc(docRef, { ...pillar, updatedAt: serverTimestamp() }, { merge: true });
    }
    return true;
  } catch (err) {
    console.warn("Notice: Services seed skipped:", err);
    return false;
  }
};

export const subscribeToServicesFirestore = (callback: (services: ServicePillar[]) => void) => {
  try {
    const colRef = collection(db, "services");
    return onSnapshot(colRef, (snapshot) => {
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
    await setDoc(docRef, { ...service, updatedAt: serverTimestamp() }, { merge: true });
  } catch (err) {
    console.error("Error saving service in Firestore:", err);
    throw err;
  }
};

export const deleteServiceFirestore = async (serviceId: string) => {
  try {
    await deleteDoc(doc(db, "services", serviceId));
  } catch (err) {
    console.error("Error deleting service in Firestore:", err);
    throw err;
  }
};

export const seedPortfolioFirestore = async (): Promise<boolean> => {
  try {
    for (const project of PORTFOLIO_PROJECTS) {
      const docRef = doc(db, "portfolio", project.id);
      await setDoc(docRef, { ...project, updatedAt: serverTimestamp() }, { merge: true });
    }
    return true;
  } catch (err) {
    console.warn("Notice: Portfolio seed skipped:", err);
    return false;
  }
};

export const subscribeToPortfolioFirestore = (callback: (projects: Project[]) => void) => {
  try {
    const colRef = collection(db, "portfolio");
    return onSnapshot(colRef, (snapshot) => {
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
    await setDoc(docRef, { ...project, updatedAt: serverTimestamp() }, { merge: true });
  } catch (err) {
    console.error("Error saving project in Firestore:", err);
    throw err;
  }
};

export const deleteProjectFirestore = async (projectId: string) => {
  try {
    await deleteDoc(doc(db, "portfolio", projectId));
  } catch (err) {
    console.error("Error deleting project in Firestore:", err);
    throw err;
  }
};

// ==========================================
// 11. CRM LEADS
// ==========================================
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
      const leads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(leads);
    }, (error) => {
      console.warn("Firestore leads snapshot warning:", error);
    });
  } catch (err) {
    console.warn("Firestore subscription error:", err);
    return () => {};
  }
};

export const updateLeadStatusFirestore = async (leadId: string, status: string, notes?: string) => {
  try {
    const docRef = doc(db, "leads", leadId);
    await updateDoc(docRef, { 
      status, 
      ...(notes !== undefined && { notes }), 
      updatedAt: new Date().toISOString() 
    });
  } catch (error) {
    console.error("Error updating lead status in Firestore:", error);
    throw error;
  }
};

// ==========================================
// 12. AI SCOPES & NEWSLETTER
// ==========================================
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
    const q = query(collection(db, "user_ai_plans"), where("userId", "==", userId));
    const snap = await getDocs(q);
    const plans = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    plans.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return plans;
  } catch (error) {
    console.error("Error fetching AI plans:", error);
    return [];
  }
};

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

export const subscribeToBlogComments = (postId: string, callback: (comments: any[]) => void) => {
  try {
    const q = query(collection(db, `blog_posts/${postId}/comments`), limit(50));
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
