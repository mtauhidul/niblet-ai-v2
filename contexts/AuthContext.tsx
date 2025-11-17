"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut 
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User, CreateUser } from '@/lib/schemas';

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      // Use popup for better UX, fallback to redirect if popup fails
      try {
        const result = await signInWithPopup(auth, provider);
        
        // Create or update user profile in Firestore
        if (result.user) {
          await createUserProfileIfNeeded(result.user);
        }
      } catch (popupError: unknown) {
        // If popup is blocked or fails, use redirect
        const error = popupError as { code?: string };
        if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
          const { signInWithRedirect } = await import('firebase/auth');
          await signInWithRedirect(auth, provider);
        } else {
          throw popupError;
        }
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const refreshUserProfile = async () => {
    if (!user?.uid) return;
    
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserProfile({
          ...userData,
          id: user.uid,
          createdAt: userData.createdAt?.toDate?.() || userData.createdAt || new Date(),
          updatedAt: userData.updatedAt?.toDate?.() || userData.updatedAt || new Date(),
          goalTargetDate: userData.goalTargetDate?.toDate?.() || userData.goalTargetDate || null,
          goalCreatedAt: userData.goalCreatedAt?.toDate?.() || userData.goalCreatedAt || null,
        } as User);
      }
    } catch (error) {
      console.error('Error refreshing user profile:', error);
    }
  };

  const createUserProfileIfNeeded = async (firebaseUser: FirebaseUser) => {
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      // Create new user profile
      const newUser: CreateUser = {
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || '',
        photoURL: firebaseUser.photoURL || '',
        firstName: firebaseUser.displayName?.split(' ')[0] || '',
        lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
        goalType: 'maintain_weight', // Default goal
        isOnboardingComplete: false, // New users need to complete onboarding
      };

      await setDoc(userDocRef, {
        ...newUser,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Set the user profile with the document ID
      setUserProfile({
        id: firebaseUser.uid,
        ...newUser,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } else {
      // Set existing user profile
      const userData = userDoc.data() as User;
      setUserProfile({
        ...userData,
        id: firebaseUser.uid,
      });
    }
  };

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const { getRedirectResult } = await import('firebase/auth');
        const result = await getRedirectResult(auth);
        if (result?.user) {
          await createUserProfileIfNeeded(result.user);
        }
      } catch (error) {
        console.error('Error handling redirect result:', error);
      }
    };

    handleRedirectResult();

    let userDocUnsubscribe: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      // Clean up previous user document listener
      if (userDocUnsubscribe) {
        userDocUnsubscribe();
        userDocUnsubscribe = null;
      }
      
      if (firebaseUser) {
        // Set up real-time listener for user document
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        
        userDocUnsubscribe = onSnapshot(userDocRef, (userDoc) => {
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log('User profile updated from Firestore:', userData);
            setUserProfile({
              ...userData,
              id: firebaseUser.uid,
              createdAt: userData.createdAt?.toDate?.() || userData.createdAt || new Date(),
              updatedAt: userData.updatedAt?.toDate?.() || userData.updatedAt || new Date(),
              goalTargetDate: userData.goalTargetDate?.toDate?.() || userData.goalTargetDate || null,
              goalCreatedAt: userData.goalCreatedAt?.toDate?.() || userData.goalCreatedAt || null,
            } as User);
          }
        }, (error: Error) => {
          console.error('Error listening to user document:', error);
        });
        
        // For new users, still need to check if document exists and create if needed
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
          await createUserProfileIfNeeded(firebaseUser);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => {
      unsubscribe();
      if (userDocUnsubscribe) {
        userDocUnsubscribe();
      }
    };
  }, []);

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signInWithGoogle,
    logout,
    refreshUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};