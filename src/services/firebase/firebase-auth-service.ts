// src/services/firebase/firebase-auth-service.ts
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInAnonymously,
  User as FirebaseUser,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase-config";
import { User } from "@/models/user";

const auth = getAuth();

// Convert Firebase user to our User model
const convertFirebaseUserToUser = (firebaseUser: FirebaseUser): User => {
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    isAnonymous: firebaseUser.isAnonymous,
    createdAt: Timestamp.fromDate(
      new Date(parseInt(firebaseUser.metadata.creationTime || "0"))
    ),
    lastLoginAt: Timestamp.fromDate(
      new Date(parseInt(firebaseUser.metadata.lastSignInTime || "0"))
    ),
  };
};

// Check if user exists in Firestore and create if not
const ensureUserInFirestore = async (
  firebaseUser: FirebaseUser
): Promise<void> => {
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
    await setDoc(userRef, { lastLoginAt: serverTimestamp() }, { merge: true });
  }
};

// Sign up with email and password
export const signUp = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await ensureUserInFirestore(userCredential.user);
    return convertFirebaseUserToUser(userCredential.user);
  } catch (error) {
    console.error("Error during sign up:", error);
    throw error;
  }
};

// Sign in with email and password
export const signIn = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    await ensureUserInFirestore(userCredential.user);
    return convertFirebaseUserToUser(userCredential.user);
  } catch (error) {
    console.error("Error during sign in:", error);
    throw error;
  }
};

// Sign in anonymously
export const signInAnon = async (): Promise<User> => {
  try {
    const userCredential = await signInAnonymously(auth);
    await ensureUserInFirestore(userCredential.user);
    return convertFirebaseUserToUser(userCredential.user);
  } catch (error) {
    console.error("Error during anonymous sign in:", error);
    throw error;
  }
};

// Sign out
export const signOut = async (): Promise<void> => {
  return firebaseSignOut(auth);
};

// Get current user
export const getCurrentUser = (): FirebaseUser | null => {
  return auth.currentUser;
};

// Subscribe to auth state changes
export const onAuthStateChange = (
  callback: (user: User | null) => void
): (() => void) => {
  return onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      callback(convertFirebaseUserToUser(firebaseUser));
    } else {
      callback(null);
    }
  });
};
