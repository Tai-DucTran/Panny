// src/store/task-store.ts
import { create } from "zustand";

import { usePlantStore } from "./plant-store";
import { Timestamp } from "firebase/firestore";
import {
  generateWateringTaskFromPlant,
  generateRepottingTaskFromPlant, // Add this import
  Task,
  TaskStatus,
  TaskType,
} from "@/models/tasks";

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  generateTasks: () => void;
  completeTask: (taskId: string) => void;
  getPendingTasks: () => Task[];
  getCompletedTasks: () => Task[];
  hasWatered?: boolean;
  hasRepotted?: boolean;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  generateTasks: () => {
    const { tasks } = get();
    const { plants } = usePlantStore.getState();

    // Start with a fresh set of tasks
    const wateringTasks: Task[] = [];
    const repottingTasks: Task[] = []; // New array for repotting tasks

    // Generate watering tasks for each plant
    plants.forEach((plant) => {
      const wateringTask = generateWateringTaskFromPlant(plant);
      if (wateringTask) {
        wateringTasks.push(wateringTask);
      }

      // Generate repotting tasks for each plant
      const repottingTask = generateRepottingTaskFromPlant(plant);
      if (repottingTask) {
        repottingTasks.push(repottingTask);
      }
    });

    // Filter out completed tasks and keep any existing completed tasks
    const completedTasks = tasks.filter(
      (task) => task.status === TaskStatus.COMPLETED
    );

    set({
      tasks: [...wateringTasks, ...repottingTasks, ...completedTasks], // Include repotting tasks
      isLoading: false,
    });
  },

  completeTask: (taskId: string) => {
    const { tasks } = get();
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const taskType = task.taskType;
        return {
          ...task,
          status: TaskStatus.COMPLETED,
          completed: true,
          completedAt: Timestamp.now(),
          ...(taskType === TaskType.WATERING && {
            hasWatered: true,
          }),
          ...(taskType === TaskType.REPOTTING && {
            hasRepotted: true,
          }),
        };
      }
      return task;
    });

    set({ tasks: updatedTasks });
  },

  getPendingTasks: () => {
    const now = new Date();
    return get().tasks.filter(
      (task) =>
        task.status === TaskStatus.PENDING && task.dueDate.toDate() <= now
    );
  },

  getCompletedTasks: () => {
    return get().tasks.filter((task) => task.status === TaskStatus.COMPLETED);
  },
}));
