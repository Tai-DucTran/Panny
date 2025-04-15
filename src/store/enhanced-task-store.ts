// src/store/enhanced-task-store.ts
import { create } from "zustand";
import { Plant, HealthStatus } from "@/models/plant";
import { Timestamp, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/services/firebase/firebase-config";
import {
  Task,
  TaskStatus,
  TaskType,
  generateWateringTaskFromPlant,
  generateRepottingTaskFromPlant,
} from "@/models/tasks";
import { usePlantStore } from "./plant-store";

export interface TaskUpdateResult {
  success: boolean;
  message: string;
  taskId: string;
}

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  generateTasks: () => void;
  completeTask: (taskId: string) => Promise<TaskUpdateResult>;
  isTaskCompletable: (task: Task) => boolean;
  getTaskStatus: (task: Task) => {
    status: string;
    color: string;
    isCompletable: boolean;
  };
  getPlantTasks: (plantId: string) => Task[];
  getDueTasks: () => Task[];
  getUpcomingTasks: () => Task[];
  getCompletedTasks: () => Task[];
}

export const useEnhancedTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  generateTasks: () => {
    const { plants } = usePlantStore.getState();
    const { tasks } = get();

    // Create maps for completed tasks and for storing task IDs we've seen
    // This prevents duplicates and ensures we track completion status correctly
    const completedTaskMap = new Map<string, Task>();
    const taskIdsByPlantAndType = new Map<string, Task>();

    // Process existing tasks
    tasks.forEach((task) => {
      const key = `${task.taskType.toLowerCase()}-${task.plantId}`;

      if (task.status === TaskStatus.COMPLETED) {
        completedTaskMap.set(task.id, task);
      }

      // For each plant-type combination, keep the most recent task
      // This ensures we don't have duplicate watering or repotting tasks
      if (
        !taskIdsByPlantAndType.has(key) ||
        taskIdsByPlantAndType.get(key)!.dueDate.toMillis() <
          task.dueDate.toMillis()
      ) {
        taskIdsByPlantAndType.set(key, task);
      }
    });

    // Generate all fresh tasks
    const generatedTasks: Task[] = [];

    // Process each plant
    plants.forEach((plant) => {
      // Generate watering task
      const wateringTask = generateWateringTaskFromPlant(plant);
      if (wateringTask) {
        generatedTasks.push(wateringTask);
      }

      // Generate repotting task
      const repottingTask = generateRepottingTaskFromPlant(plant);
      if (repottingTask) {
        generatedTasks.push(repottingTask);
      }
    });

    // Apply completed status from previous tasks and deduplicate
    const processedTaskIds = new Set<string>();
    const finalTasks: Task[] = [];

    generatedTasks.forEach((task) => {
      // Skip if we've already processed this task ID
      if (processedTaskIds.has(task.id)) {
        return;
      }

      // Mark as processed
      processedTaskIds.add(task.id);

      // Check if task was completed
      const completedTask = completedTaskMap.get(task.id);
      if (completedTask) {
        finalTasks.push({
          ...task,
          status: TaskStatus.COMPLETED,
          completed: true,
          completedAt: completedTask.completedAt || Timestamp.now(),
        });
      } else {
        finalTasks.push(task);
      }
    });

    // Add completed tasks that might not be in the generated set
    // This ensures we don't lose completed tasks when regenerating
    tasks.forEach((task) => {
      if (
        task.status === TaskStatus.COMPLETED &&
        !processedTaskIds.has(task.id)
      ) {
        processedTaskIds.add(task.id);
        finalTasks.push(task);
      }
    });

    set({ tasks: finalTasks, isLoading: false });
  },

  isTaskCompletable: (task: Task): boolean => {
    // Task is already completed
    if (task.status === TaskStatus.COMPLETED) {
      return false;
    }

    const now = new Date();
    const dueDate = task.dueDate.toDate();
    const diffInDays = Math.ceil(
      (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    switch (task.taskType) {
      case TaskType.WATERING:
        // For watering tasks:
        // - Always enable completion for tasks that are due today
        // - Always enable completion for tasks that are 1 day overdue
        // - Disable for tasks that are 2 or more days in the future
        if (diffInDays >= 2) {
          return false; // Task is 2+ days in the future
        }
        return true; // Task is due today, tomorrow, or overdue

      case TaskType.REPOTTING:
        // For repotting tasks:
        // - Enable when due date is up to 1 month (30 days) before the due date
        // - Enable when the task is overdue (always allow repotting when late)
        // - Disable only when the task is more than 1 month in the future
        if (diffInDays > 30) {
          return false; // Task is more than 1 month in the future
        }
        return true; // Task is within 1 month or overdue

      default:
        return false;
    }
  },

  getTaskStatus: (task: Task) => {
    const isCompletable = get().isTaskCompletable(task);
    const now = new Date();
    const dueDate = task.dueDate.toDate();
    const diffInDays = Math.ceil(
      (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    // For completed tasks
    if (task.status === TaskStatus.COMPLETED) {
      return {
        status: task.taskType === TaskType.WATERING ? "Watered" : "Repotted",
        color: "#4CAF50", // Green
        isCompletable: false,
      };
    }

    // For pending tasks
    if (task.taskType === TaskType.WATERING) {
      if (diffInDays < 0) {
        return {
          status: "Overdue",
          color: "#D32F2F", // Red
          isCompletable: isCompletable,
        };
      } else if (diffInDays === 0) {
        return {
          status: "Today",
          color: "#FFC107", // Amber
          isCompletable: isCompletable,
        };
      } else if (diffInDays === 1) {
        return {
          status: "Tomorrow",
          color: "#2196F3", // Blue
          isCompletable: isCompletable,
        };
      } else {
        return {
          status: `In ${diffInDays} days`,
          color: "#757575", // Gray
          isCompletable: isCompletable,
        };
      }
    } else if (task.taskType === TaskType.REPOTTING) {
      if (diffInDays < 0) {
        return {
          status: "Overdue",
          color: "#D32F2F", // Red
          isCompletable: isCompletable,
        };
      } else if (diffInDays <= 7) {
        return {
          status: "This week",
          color: "#FFC107", // Amber
          isCompletable: isCompletable,
        };
      } else if (diffInDays <= 30) {
        return {
          status: "This month",
          color: "#2196F3", // Blue
          isCompletable: isCompletable,
        };
      } else {
        return {
          status: `In ${Math.floor(diffInDays / 30)} months`,
          color: "#757575", // Gray
          isCompletable: isCompletable,
        };
      }
    }

    return {
      status: "Pending",
      color: "#757575", // Gray
      isCompletable: isCompletable,
    };
  },

  completeTask: async (taskId: string): Promise<TaskUpdateResult> => {
    const { tasks } = get();
    const taskToComplete = tasks.find((task) => task.id === taskId);

    if (!taskToComplete) {
      return {
        success: false,
        message: "Task not found",
        taskId,
      };
    }

    const isCompletable = get().isTaskCompletable(taskToComplete);
    if (!isCompletable) {
      return {
        success: false,
        message: "Task cannot be completed at this time",
        taskId,
      };
    }

    const { plants, updatePlant } = usePlantStore.getState();
    const plant = plants.find((p) => p.id === taskToComplete.plantId);

    if (!plant) {
      return {
        success: false,
        message: "Plant not found",
        taskId,
      };
    }

    try {
      const now = Timestamp.now();
      const plantUpdateData: Partial<Plant> = {
        updatedAt: now,
      };

      // Create a new task ID that will be used after updating the plant
      // This ensures task IDs are tied to the updated timestamps
      let newTaskId = "";

      // Update specific fields based on task type
      if (taskToComplete.taskType === TaskType.WATERING) {
        plantUpdateData.lastWatered = now;
        // Generate a new task ID based on the new lastWatered timestamp
        newTaskId = `watering-${plant.id}-${now.seconds}`;

        // Optionally improve health status if it was poor due to underwatering
        if (
          plant.healthStatus === HealthStatus.POOR ||
          plant.healthStatus === HealthStatus.FAIR
        ) {
          plantUpdateData.healthStatus = HealthStatus.GOOD;
        }
      } else if (taskToComplete.taskType === TaskType.REPOTTING) {
        plantUpdateData.lastRepotted = now;
        // Generate a new task ID based on the new lastRepotted timestamp
        newTaskId = `repotting-${plant.id}-${now.seconds}`;
      }

      // Update plant in Firestore
      const plantRef = doc(db, "plants", plant.id);
      await updateDoc(plantRef, {
        ...plantUpdateData,
        updatedAt: serverTimestamp(),
      });

      // Update local plant state
      await updatePlant(plant.id, plantUpdateData);

      // First mark the current task as completed in local state
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status: TaskStatus.COMPLETED,
                completed: true,
                completedAt: now,
              }
            : task
        ),
      }));

      // Then regenerate tasks to ensure they reflect the latest plant data
      // This is crucial for correctly showing the next pending task with updated timestamps
      setTimeout(() => {
        get().generateTasks();
      }, 300);

      return {
        success: true,
        message:
          taskToComplete.taskType === TaskType.WATERING
            ? "Plant watered successfully"
            : "Plant repotted successfully",
        taskId: newTaskId, // Return the new task ID
      };
    } catch (error) {
      console.error(`Error completing task ${taskId}:`, error);
      return {
        success: false,
        message: "Error updating plant data",
        taskId,
      };
    }
  },

  getPlantTasks: (plantId: string): Task[] => {
    return get().tasks.filter((task) => task.plantId === plantId);
  },

  getDueTasks: (): Task[] => {
    const now = new Date();
    return get().tasks.filter(
      (task) =>
        task.status === TaskStatus.PENDING && task.dueDate.toDate() <= now
    );
  },

  getUpcomingTasks: (): Task[] => {
    const now = new Date();
    return get().tasks.filter(
      (task) =>
        task.status === TaskStatus.PENDING && task.dueDate.toDate() > now
    );
  },

  getCompletedTasks: (): Task[] => {
    return get().tasks.filter((task) => task.status === TaskStatus.COMPLETED);
  },
}));
