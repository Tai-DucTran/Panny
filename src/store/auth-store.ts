// src/store/auth-store.ts
import { create } from "zustand";
import { User } from "@/models/user";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInAnonymously as firebaseSignInAnonymously,
  User as FirebaseUser,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/services/firebase/firebase-config";

// Convert Firebase user to our User model
const convertFirebaseUserToUser = (firebaseUser: FirebaseUser): User => {
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    isAnonymous: firebaseUser.isAnonymous,
    createdAt: new Date(parseInt(firebaseUser.metadata.creationTime || "0")),
    lastLoginAt: new Date(
      parseInt(firebaseUser.metadata.lastSignInTime || "0")
    ),
  };
};

// Check if user exists in Firestore and create if not
const ensureUserInFirestore = async (
  firebaseUser: FirebaseUser
): Promise<void> => {
  try {
    const userRef = doc(db, "users", firebaseUser.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      // User doesn't exist in Firestore, create a new document
      await setDoc(userRef, {
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        isAnonymous: firebaseUser.isAnonymous,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      });
    } else {
      // User exists, update last login time
      await setDoc(
        userRef,
        { lastLoginAt: serverTimestamp() },
        { merge: true }
      );
    }
  } catch (error) {
    // Don't throw here, just log the error
    // This prevents Firestore issues from breaking authentication
    console.error("Error updating Firestore user:", getErrorMessage(error));
  }
};

// Helper function to extract error message from unknown error
const getErrorMessage = (error: unknown): string => {
  if (error instanceof FirebaseError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unknown error occurred";
};

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInAnonymously: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,
  initialized: false,

  signUp: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Don't await this - we'll handle it separately to prevent blocking auth flow
      ensureUserInFirestore(userCredential.user);
      set({ user: convertFirebaseUserToUser(userCredential.user) });
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage });
      console.error("Error in sign-up process: ", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Don't await this - we'll handle it separately to prevent blocking auth flow
      ensureUserInFirestore(userCredential.user);
      set({ user: convertFirebaseUserToUser(userCredential.user) });
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage });
      console.error("Error in sign-in process: ", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signInAnonymously: async () => {
    try {
      set({ loading: true, error: null });
      const userCredential = await firebaseSignInAnonymously(auth);
      // Don't await this - we'll handle it separately to prevent blocking auth flow
      ensureUserInFirestore(userCredential.user);
      set({ user: convertFirebaseUserToUser(userCredential.user) });
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage });
      console.error("Error in sign-in anonymously process: ", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      set({ loading: true, error: null });
      await firebaseSignOut(auth);
      set({ user: null });
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage });
      console.error("Error in sign-out process: ", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));

// Initialize auth state listener
if (typeof window !== "undefined") {
  onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      useAuthStore.setState({
        user: convertFirebaseUserToUser(firebaseUser),
        loading: false,
        initialized: true,
      });
      // Handle Firestore updates separately to avoid blocking auth flow
      ensureUserInFirestore(firebaseUser);
    } else {
      useAuthStore.setState({
        user: null,
        loading: false,
        initialized: true,
      });
    }
  });
}
