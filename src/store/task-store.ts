// src/store/task-store.ts
import { create } from "zustand";

import { usePlantStore } from "./plant-store";
import { Timestamp } from "firebase/firestore";
import {
  generateWateringTaskFromPlant,
  generateRepottingTaskFromPlant,
  Task,
  TaskStatus,
} from "@/models/tasks";

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  generateTasks: () => void;
  completeTask: (taskId: string) => void;
  getPendingTasks: () => Task[];
  getCompletedTasks: () => Task[];
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  generateTasks: () => {
    const { tasks } = get();
    const { plants } = usePlantStore.getState();

    // Start with fresh sets of tasks
    const generatedTasks: Task[] = [];

    // Generate watering and repotting tasks for each plant
    plants.forEach((plant) => {
      // Generate watering task if applicable
      const wateringTask = generateWateringTaskFromPlant(plant);
      if (wateringTask) {
        generatedTasks.push(wateringTask);
      }

      // Generate repotting task
      // This now includes special handling for newly purchased plants
      const repottingTask = generateRepottingTaskFromPlant(plant);
      if (repottingTask) {
        generatedTasks.push(repottingTask);
      }
    });

    // Filter out completed tasks and keep any existing completed tasks
    const completedTasks = tasks.filter(
      (task) => task.status === TaskStatus.COMPLETED
    );

    set({
      tasks: [...generatedTasks, ...completedTasks],
      isLoading: false,
    });
  },

  completeTask: (taskId: string) => {
    const { tasks } = get();
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          status: TaskStatus.COMPLETED,
          completed: true,
          completedAt: Timestamp.now(),
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
