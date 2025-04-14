// src/store/plant-store.ts
import { create } from "zustand";
import { Plant } from "@/models/plant";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/services/firebase/firebase-config";
import { FirebaseError } from "firebase/app";
import { getCurrentUser } from "@/services/firebase/firebase-auth-service";

// Collection names
const PLANTS_COLLECTION = "plants";

interface PlantState {
  plants: Plant[];
  isLoading: boolean;
  error: string | null;
  fetchPlants: () => Promise<void>;
  addPlant: (plantData: Plant) => Promise<Plant | null>;
  setPlants: (plants: Plant[]) => void;
}

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

export const usePlantStore = create<PlantState>((set, get) => ({
  plants: [],
  isLoading: false,
  error: null,

  fetchPlants: async () => {
    set({ isLoading: true, error: null });

    try {
      const currentUser = getCurrentUser();

      if (!currentUser) {
        throw new Error("User not authenticated");
      }

      // Query plants for the current user
      const plantsQuery = query(
        collection(db, PLANTS_COLLECTION),
        where("userId", "==", currentUser.uid),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(plantsQuery);

      // Map the documents to our Plant model
      const plants = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
        } as Plant;
      });

      set({ plants, isLoading: false });
    } catch (error) {
      console.error("Error fetching plants:", error);
      set({
        error: getErrorMessage(error),
        isLoading: false,
      });
    }
  },

  addPlant: async (plantData: Plant) => {
    set({ isLoading: true, error: null });

    try {
      const currentUser = getCurrentUser();

      if (!currentUser) {
        throw new Error("User not authenticated");
      }

      // Add user ID to associate the plant with the current user
      const plantWithUserId = {
        ...plantData,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Add document to Firestore
      const docRef = await addDoc(
        collection(db, PLANTS_COLLECTION),
        plantWithUserId
      );

      // Return the newly created plant with its Firestore ID
      const newPlant = {
        ...plantData,
        id: docRef.id,
      };

      // Update the store with the new plant
      const currentPlants = get().plants;
      set({
        plants: [newPlant, ...currentPlants],
        isLoading: false,
      });

      return newPlant;
    } catch (error) {
      console.error("Error adding plant:", error);
      set({
        error: getErrorMessage(error),
        isLoading: false,
      });
      return null;
    }
  },

  setPlants: (plants) => set({ plants }),
}));
