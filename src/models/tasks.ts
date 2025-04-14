// src/models/tasks.ts
import { Plant } from "./plant";
import { Timestamp } from "firebase/firestore";

export enum TaskType {
  WATERING = "Watering",
  REPOTTING = "Repotting",
  FERTILIZING = "Fertilizing",
  PRUNING = "Pruning",
  LIGHT = "Light",
}

export enum TaskStatus {
  PENDING = "Pending",
  COMPLETED = "Completed",
}

export interface Task {
  id: string;
  plantId: string;
  plantName: string;
  plantImageUrl?: string;
  taskType: TaskType;
  dueDate: Timestamp;
  status: TaskStatus;
  completed?: boolean;
  completedAt?: Timestamp;
}

// Function to generate watering task from a plant
export function generateWateringTaskFromPlant(plant: Plant): Task | null {
  if (!plant.lastWatered || !plant.wateringFrequency) {
    return null;
  }

  const lastWateredDate = plant.lastWatered.toDate();
  const dueDate = new Date(lastWateredDate);
  dueDate.setDate(dueDate.getDate() + plant.wateringFrequency);

  // Generate a stable ID that won't change between renders
  const taskId = `watering-${plant.id}-${plant.lastWatered.seconds}`;

  return {
    id: taskId,
    plantId: plant.id,
    plantName: plant.name,
    plantImageUrl: plant.imageUrl,
    taskType: TaskType.WATERING,
    dueDate: Timestamp.fromDate(dueDate),
    status: TaskStatus.PENDING,
  };
}

// Function to generate repotting task from a plant
export function generateRepottingTaskFromPlant(plant: Plant): Task | null {
  // For newly purchased plants, create a repotting task due in one week
  if (plant.acquiredTimeOption === "just_bought") {
    // If the plant already has a specific lastRepotted date, don't override it
    if (plant.lastRepotted && plant.repottingFrequency) {
      const lastRepottedDate = plant.lastRepotted.toDate();
      const dueDate = new Date(lastRepottedDate);
      dueDate.setMonth(dueDate.getMonth() + plant.repottingFrequency);

      const taskId = `repotting-${plant.id}-${plant.lastRepotted.seconds}`;

      return {
        id: taskId,
        plantId: plant.id,
        plantName: plant.name,
        plantImageUrl: plant.imageUrl,
        taskType: TaskType.REPOTTING,
        dueDate: Timestamp.fromDate(dueDate),
        status: TaskStatus.PENDING,
      };
    }

    // For newly purchased plants without specific repotting data, suggest repotting in a week
    const now = Timestamp.now();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7); // One week from now

    const taskId = `repotting-new-${plant.id}-${now.seconds}`;

    return {
      id: taskId,
      plantId: plant.id,
      plantName: plant.name,
      plantImageUrl: plant.imageUrl,
      taskType: TaskType.REPOTTING,
      dueDate: Timestamp.fromDate(dueDate),
      status: TaskStatus.PENDING,
    };
  }

  // Regular repotting schedule based on lastRepotted and frequency
  if (!plant.lastRepotted || !plant.repottingFrequency) {
    return null;
  }

  const lastRepottedDate = plant.lastRepotted.toDate();
  const dueDate = new Date(lastRepottedDate);
  dueDate.setMonth(dueDate.getMonth() + plant.repottingFrequency);

  // Generate a stable ID that won't change between renders
  const taskId = `repotting-${plant.id}-${plant.lastRepotted.seconds}`;

  return {
    id: taskId,
    plantId: plant.id,
    plantName: plant.name,
    plantImageUrl: plant.imageUrl,
    taskType: TaskType.REPOTTING,
    dueDate: Timestamp.fromDate(dueDate),
    status: TaskStatus.PENDING,
  };
}
