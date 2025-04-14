// src/store/task-store.ts
import { create } from "zustand";

import { usePlantStore } from "./plant-store";
import { Timestamp } from "firebase/firestore";
import {
  generateWateringTaskFromPlant,
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

    // Start with a fresh set of watering tasks
    const wateringTasks: Task[] = [];

    // Generate watering tasks for each plant
    plants.forEach((plant) => {
      const task = generateWateringTaskFromPlant(plant);
      if (task) {
        wateringTasks.push(task);
      }
    });

    // Filter out completed tasks and keep any existing completed tasks
    const completedTasks = tasks.filter(
      (task) => task.status === TaskStatus.COMPLETED
    );

    set({
      tasks: [...wateringTasks, ...completedTasks],
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
