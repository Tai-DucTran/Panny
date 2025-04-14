import { Plant } from "./plant";
import { Timestamp } from "firebase/firestore";

export enum TaskType {
  WATERING = "Watering",
  REPOTTING = "Repotting",
  FERTILIZING = "Fertilizing",
  PRUNING = "Pruning",
  LIGHT = "light",
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

// Function to generate tasks from a plant
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
