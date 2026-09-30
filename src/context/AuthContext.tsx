import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { UserProfile } from "../types";
import { 
  auth, 
  loginWithEmail, 
  registerWithEmail, 
  loginWithGoogle, 
  sendPasswordReset, 
  signOutUser,
  subscribeToUserProfile,
  syncUserProfile,
  updateUserProfileData
} from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isClient: boolean;
  isSuspended: boolean;
  login: (email: string, password: string) => Promise<UserProfile | null>;
  register: (data: { name: string; email: string; password: string; phone?: string; company?: string }) => Promise<UserProfile | null>;
  loginWithGoogle: () => Promise<UserProfile | null>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: { displayName?: string; phone?: string; company?: string; photoURL?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubProfile: (() => void) | null = null;

    const unsubAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        // Initial sync of profile
        const userProfile = await syncUserProfile(firebaseUser);
        setProfile(userProfile);

        // Real-time listener on user doc
        if (unsubProfile) unsubProfile();
        unsubProfile = subscribeToUserProfile(firebaseUser.uid, (liveProfile) => {
          if (liveProfile) {
            setProfile(liveProfile);
          }
        });
      } else {
        if (unsubProfile) {
          unsubProfile();
          unsubProfile = null;
        }
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      unsubAuth();
      if (unsubProfile) unsubProfile();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const res = await loginWithEmail(email, password);
    setUser(res.user);
    setProfile(res.profile);
    return res.profile;
  };

  const register = async (data: { name: string; email: string; password: string; phone?: string; company?: string }) => {
    const res = await registerWithEmail(data);
    setUser(res.user);
    setProfile(res.profile);
    return res.profile;
  };

  const handleGoogleLogin = async () => {
    const res = await loginWithGoogle();
    setUser(res.user);
    setProfile(res.profile);
    return res.profile;
  };

  const logout = async () => {
    await signOutUser();
    setUser(null);
    setProfile(null);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordReset(email);
  };

  const updateProfile = async (updates: { displayName?: string; phone?: string; company?: string; photoURL?: string }) => {
    if (!user) throw new Error("No authenticated user");
    await updateUserProfileData(user.uid, updates);
    if (profile) {
      setProfile({
        ...profile,
        ...updates
      });
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = profile?.role === "admin";
  const isClient = profile?.role === "client";
  const isSuspended = profile?.status === "suspended";

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAuthenticated,
        isAdmin,
        isClient,
        isSuspended,
        login,
        register,
        loginWithGoogle: handleGoogleLogin,
        logout,
        resetPassword,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
