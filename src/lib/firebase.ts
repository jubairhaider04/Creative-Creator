import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
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
  updateDoc, 
  query, 
  orderBy, 
  limit, 
  onSnapshot,
  serverTimestamp,
  setDoc,
  where
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

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

// Auth helper functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Save/update user in Firestore
    if (user.uid) {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || "Google User",
        photoURL: user.photoURL,
        lastLogin: serverTimestamp()
      }, { merge: true });
    }
    
    return user;
  } catch (error: any) {
    console.error("Firebase Google Sign-In Error:", error);
    throw error;
  }
};

export const signOutUser = async () => {
  return await signOut(auth);
};

export const subscribeToAuthState = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Firestore Data Helpers

// 1. Inquiries & CRM Leads
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

// 2. Saved AI Scopes & Roadmaps
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

// 3. Blog Comments & Claps
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

// 4. Newsletter Subscribers
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
