import { Timestamp } from "firebase/firestore";

export interface User {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
}
