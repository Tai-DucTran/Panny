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
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { auth, db } from "@/services/firebase/firebase-config";

// Convert Firebase user to our User model
const convertFirebaseUserToUser = (firebaseUser: FirebaseUser): User => {
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    isAnonymous: firebaseUser.isAnonymous,
    // Convert creation time string to a number for timestamp creation
    createdAt: Timestamp.fromMillis(
      parseInt(firebaseUser.metadata.creationTime || "0")
    ),
    // Convert last sign-in time string to a number for timestamp creation
    lastLoginAt: Timestamp.fromMillis(
      parseInt(firebaseUser.metadata.lastSignInTime || "0")
    ),
  };
};
// Check if user exists in Firestore and create if not
const ensureUserInFirestore = async (
  firebaseUser: FirebaseUser
): Promise<void> => {
  try {
    if (!db) {
      console.error("Firestore not initialized");
      return;
    }

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
  initializeAuthListener: () => () => void; // Returns unsubscribe function
}

export const useAuthStore = create<AuthState>((set, get) => ({
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
      ensureUserInFirestore(userCredential.user).catch((error) => {
        console.error("Error ensuring user in Firestore after signup:", error);
      });
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
      ensureUserInFirestore(userCredential.user).catch((error) => {
        console.error("Error ensuring user in Firestore after signin:", error);
      });
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
      ensureUserInFirestore(userCredential.user).catch((error) => {
        console.error(
          "Error ensuring user in Firestore after anonymous signin:",
          error
        );
      });
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

  // New method to initialize auth state listener
  initializeAuthListener: () => {
    if (typeof window === "undefined") {
      console.warn("Auth listener not initialized: Running on server");
      return () => {}; // Return empty function for SSR
    }

    // Check if we're already initialized to prevent duplicate listeners
    if (get().initialized) {
      console.log("Auth listener already initialized");
      return () => {}; // Return empty function if already initialized
    }

    // Set up the auth state listener
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        set({
          user: convertFirebaseUserToUser(firebaseUser),
          loading: false,
          initialized: true,
        });
        // Handle Firestore updates separately to avoid blocking auth flow
        ensureUserInFirestore(firebaseUser).catch((error) => {
          console.error(
            "Error ensuring user in Firestore from auth state change:",
            error
          );
        });
      } else {
        set({
          user: null,
          loading: false,
          initialized: true,
        });
      }
    });

    // Return the unsubscribe function to allow manual cleanup
    return unsubscribe;
  },
}));

// Initialize auth state listener only on the client side
let unsubscribeAuthListener: (() => void) | null = null;

if (typeof window !== "undefined") {
  // Initialize the auth listener when the file loads
  unsubscribeAuthListener = useAuthStore.getState().initializeAuthListener();

  // Safe check for HMR without TypeScript errors
  if (typeof module !== "undefined") {
    // Use type assertion to avoid TypeScript errors
    const moduleWithHot = module as {
      hot?: { dispose: (callback: () => void) => void };
    };
    if (moduleWithHot.hot) {
      moduleWithHot.hot.dispose(() => {
        if (unsubscribeAuthListener) {
          unsubscribeAuthListener();
          unsubscribeAuthListener = null;
        }
      });
    }
  }
}

// Export the unsubscribe function if needed elsewhere
export const cleanupAuthListener = () => {
  if (unsubscribeAuthListener) {
    unsubscribeAuthListener();
    unsubscribeAuthListener = null;
  }
};
