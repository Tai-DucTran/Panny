// src/models/tasks.ts
import { Plant, AcquiredTimeOption } from "./plant";
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

/**
 * Generate a consistent task ID based on plant ID, task type, and timestamp
 */
export function generateTaskId(
  plantId: string,
  taskType: TaskType,
  timestamp: Timestamp
): string {
  return `${taskType.toLowerCase()}-${plantId}-${timestamp.seconds}`;
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
  const taskId = generateTaskId(plant.id, TaskType.WATERING, plant.lastWatered);

  // Determine if the task should be considered completed
  const now = new Date();
  const isPastDue = dueDate <= now;

  // A watering task is only completed if the due date hasn't passed yet
  // If it's past due, it should show as pending (needs watering)
  const isCompleted = !isPastDue;

  return {
    id: taskId,
    plantId: plant.id,
    plantName: plant.name,
    plantImageUrl: plant.imageUrl,
    taskType: TaskType.WATERING,
    dueDate: Timestamp.fromDate(dueDate),
    status: isCompleted ? TaskStatus.COMPLETED : TaskStatus.PENDING,
    completed: isCompleted,
    completedAt: isCompleted ? plant.lastWatered : undefined,
  };
}

// Function to generate repotting task from a plant
export function generateRepottingTaskFromPlant(plant: Plant): Task | null {
  // For newly purchased plants, create a repotting task due in one week
  if (plant.acquiredTimeOption === AcquiredTimeOption.JUST_BOUGHT) {
    // If the plant already has a specific lastRepotted date, use that instead
    if (plant.lastRepotted && plant.repottingFrequency) {
      return generateRegularRepottingTask(plant);
    }

    // For newly purchased plants without specific repotting data, suggest repotting in a week
    const now = Timestamp.now();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7); // One week from now

    const taskId = generateTaskId(plant.id, TaskType.REPOTTING, now);

    return {
      id: taskId,
      plantId: plant.id,
      plantName: plant.name,
      plantImageUrl: plant.imageUrl,
      taskType: TaskType.REPOTTING,
      dueDate: Timestamp.fromDate(dueDate),
      status: TaskStatus.PENDING,
      completed: false,
    };
  }

  // Regular repotting schedule based on lastRepotted and frequency
  return generateRegularRepottingTask(plant);
}

/**
 * Helper function to generate a regular repotting task based on plant data
 */
function generateRegularRepottingTask(plant: Plant): Task | null {
  if (!plant.lastRepotted || !plant.repottingFrequency) {
    return null;
  }

  const lastRepottedDate = plant.lastRepotted.toDate();
  const dueDate = new Date(lastRepottedDate);
  dueDate.setMonth(dueDate.getMonth() + plant.repottingFrequency);

  // Generate a stable ID that won't change between renders
  const taskId = generateTaskId(
    plant.id,
    TaskType.REPOTTING,
    plant.lastRepotted
  );

  // Determine if the task should be pending or completed
  // A task is completed if the plant was repotted after the calculated due date
  const wasRepottedAfterDueDate = lastRepottedDate >= dueDate;

  // If the plant was repotted after the due date was calculated,
  // then we know the task was completed
  const isCompleted = wasRepottedAfterDueDate;

  return {
    id: taskId,
    plantId: plant.id,
    plantName: plant.name,
    plantImageUrl: plant.imageUrl,
    taskType: TaskType.REPOTTING,
    dueDate: Timestamp.fromDate(dueDate),
    status: isCompleted ? TaskStatus.COMPLETED : TaskStatus.PENDING,
    completed: isCompleted,
    completedAt: isCompleted ? plant.lastRepotted : undefined,
  };
}
