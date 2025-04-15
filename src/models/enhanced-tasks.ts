// src/models/enhanced-tasks.ts
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
  createdAt?: Timestamp;
}

/**
 * Generates a unique ID for a task based on plant, task type, and timestamp
 */
export function generateTaskId(
  plantId: string,
  taskType: TaskType,
  timestamp: Timestamp
): string {
  return `${taskType.toLowerCase()}-${plantId}-${timestamp.seconds}`;
}

/**
 * Determines if a watering task can be completed based on the due date
 * Only allow completion when due date is today or 1 day ago/ahead
 */
export function canCompleteWateringTask(dueDate: Timestamp): boolean {
  const now = new Date();
  const taskDueDate = dueDate.toDate();
  const diffInDays = Math.floor(
    Math.abs(now.getTime() - taskDueDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return diffInDays <= 1;
}

/**
 * Determines if a repotting task can be completed based on the due date
 * Only allow completion up to 1 month before the due date
 */
export function canCompleteRepottingTask(dueDate: Timestamp): boolean {
  const now = new Date();
  const taskDueDate = dueDate.toDate();

  // Only allow early completion (up to 30 days before due date)
  if (taskDueDate > now) {
    const diffInDays = Math.floor(
      (taskDueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffInDays <= 30;
  }

  // Or on/after the due date
  return true;
}

/**
 * Generates a watering task from a plant
 */
export function generateWateringTaskFromPlant(plant: Plant): Task | null {
  if (!plant.lastWatered || !plant.wateringFrequency) {
    return null;
  }

  const lastWateredDate = plant.lastWatered.toDate();
  const dueDate = new Date(lastWateredDate);
  dueDate.setDate(dueDate.getDate() + plant.wateringFrequency);

  // Generate task ID
  const taskId = generateTaskId(plant.id, TaskType.WATERING, plant.lastWatered);

  // Check if the due date is in the future
  const now = new Date();
  const isPending = dueDate > now;

  return {
    id: taskId,
    plantId: plant.id,
    plantName: plant.name,
    plantImageUrl: plant.imageUrl,
    taskType: TaskType.WATERING,
    dueDate: Timestamp.fromDate(dueDate),
    status: isPending ? TaskStatus.PENDING : TaskStatus.COMPLETED,
    completed: !isPending,
    completedAt: isPending ? undefined : plant.lastWatered,
    createdAt: Timestamp.now(),
  };
}
/**
 * Generates a repotting task from a plant
 */
export function generateRepottingTaskFromPlant(plant: Plant): Task | null {
  // Skip task generation if no repotting data available
  if (
    !plant.lastRepotted &&
    !plant.repottingFrequency &&
    plant.acquiredTimeOption !== AcquiredTimeOption.JUST_BOUGHT
  ) {
    return null;
  }

  let dueDate: Date;
  let taskId: string;

  // For newly purchased plants, create a repotting task due in one week
  if (plant.acquiredTimeOption === AcquiredTimeOption.JUST_BOUGHT) {
    // If the plant already has a specific lastRepotted date, use that instead
    if (plant.lastRepotted && plant.repottingFrequency) {
      const lastRepottedDate = plant.lastRepotted.toDate();
      dueDate = new Date(lastRepottedDate);
      dueDate.setMonth(dueDate.getMonth() + plant.repottingFrequency);
      taskId = generateTaskId(plant.id, TaskType.REPOTTING, plant.lastRepotted);
    } else {
      // For newly purchased plants without specific repotting data
      const now = Timestamp.now();
      dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7); // One week from now
      taskId = generateTaskId(plant.id, TaskType.REPOTTING, now);
    }
  } else if (plant.lastRepotted && plant.repottingFrequency) {
    // Regular repotting schedule based on lastRepotted and frequency
    const lastRepottedDate = plant.lastRepotted.toDate();
    dueDate = new Date(lastRepottedDate);
    dueDate.setMonth(dueDate.getMonth() + plant.repottingFrequency);
    taskId = generateTaskId(plant.id, TaskType.REPOTTING, plant.lastRepotted);
  } else {
    return null; // No data to generate a task
  }

  // Check if the task should be marked as completed
  const now = new Date();

  // Important: determine if the task is already completed based on:
  // 1. If the last repotting date is AFTER the calculated due date, the task is complete
  // 2. If the due date is in the future, the task is pending
  const lastRepottedTime = plant.lastRepotted
    ? plant.lastRepotted.toDate().getTime()
    : 0;
  const isDueDateInPast = dueDate.getTime() <= now.getTime();
  const wasRepottedAfterDueDate = lastRepottedTime > dueDate.getTime();

  // The task is completed if it was either:
  // - repotted after the due date was calculated
  // - or the due date is in the past and there's a recent repotting date
  const isCompleted =
    wasRepottedAfterDueDate ||
    (isDueDateInPast &&
      lastRepottedTime > now.getTime() - 90 * 24 * 60 * 60 * 1000); // within last 90 days

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
    createdAt: Timestamp.now(),
  };
}
