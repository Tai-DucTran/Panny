// src/store/plant-store.ts
import { create } from "zustand";
import { Plant } from "@/models/plant";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  Timestamp,
  doc,
  updateDoc,
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
  updatePlant: (plantId: string, plantData: Partial<Plant>) => Promise<boolean>;
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

      // Query plants for the current user - removed orderBy to avoid needing an index
      const plantsQuery = query(
        collection(db, PLANTS_COLLECTION),
        where("userId", "==", currentUser.uid)
        // Removed the orderBy clause to fix the indexing issue
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

      // Sort plants client-side instead of using Firestore's orderBy
      // This is a temporary solution until you create the composite index
      const sortedPlants = plants.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime(); // Descending order (newest first)
      });

      set({ plants: sortedPlants, isLoading: false });
    } catch (error) {
      console.error("Error fetching plants:", error);
      set({
        error: getErrorMessage(error),
        isLoading: false,
      });
    }
  },

  addPlant: async (plantData: Plant) => {
    // plantData type now includes the optional new field
    set({ isLoading: true, error: null });

    try {
      const currentUser = getCurrentUser();

      if (!currentUser) {
        throw new Error("User not authenticated");
      }

      // Include plantCharacteristicDescription along with other fields
      const plantWithUserId = {
        ...plantData, // This will include plantCharacteristicDescription if present
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Add document to Firestore
      const docRef = await addDoc(
        collection(db, PLANTS_COLLECTION),
        plantWithUserId // Pass the complete object
      );

      // Return the plant with ID
      const newPlant: Plant = {
        ...plantData,
        id: docRef.id,
        userId: currentUser.uid,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      // Update the store
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

  updatePlant: async (plantId: string, plantData: Partial<Plant>) => {
    set({ isLoading: true, error: null });

    try {
      // Create an update object with the updated fields and add updatedAt
      const updateData = {
        ...plantData,
        updatedAt: serverTimestamp(),
      };

      // Get reference to the plant document
      const plantRef = doc(db, PLANTS_COLLECTION, plantId);

      // Update the document in Firestore
      await updateDoc(plantRef, updateData);

      // Update the plant in the local state
      const updatedPlants = get().plants.map((plant) => {
        if (plant.id === plantId) {
          return {
            ...plant,
            ...plantData,
            updatedAt: Timestamp.now(), // Local placeholder until we refresh
          };
        }
        return plant;
      });

      set({
        plants: updatedPlants,
        isLoading: false,
      });

      return true;
    } catch (error) {
      console.error("Error updating plant:", error);
      set({
        error: getErrorMessage(error),
        isLoading: false,
      });
      return false;
    }
  },

  setPlants: (plants) => set({ plants }),
}));
