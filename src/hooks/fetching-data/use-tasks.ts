// src/hooks/fetching-data/use-tasks.ts
import { useEffect, useState, useCallback } from "react";
import { Task, TaskStatus, TaskType } from "@/models/tasks";
import { usePlantStore } from "@/store/plant-store";
import { Timestamp } from "firebase/firestore";
import { Plant, AcquiredTimeOption } from "@/models/plant";

export interface TaskUpdateResult {
  success: boolean;
  message: string;
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const {
    plants,
    fetchPlants,
    isLoading: plantsLoading,
    updatePlant,
  } = usePlantStore();

  // This function generates task ID in a consistent way
  const generateTaskId = useCallback(
    (plantId: string, taskType: TaskType, timestamp: Timestamp) => {
      return `${taskType}-${plantId}-${timestamp.seconds}`;
    },
    []
  );

  // Generate watering task from plant
  const generateWateringTask = useCallback(
    (plant: Plant): Task | null => {
      if (!plant.lastWatered || !plant.wateringFrequency) {
        return null;
      }

      const lastWateredDate = plant.lastWatered.toDate();
      const dueDate = new Date(lastWateredDate);
      dueDate.setDate(dueDate.getDate() + plant.wateringFrequency);

      return {
        id: generateTaskId(plant.id, TaskType.WATERING, plant.lastWatered),
        plantId: plant.id,
        plantName: plant.name,
        plantImageUrl: plant.imageUrl,
        taskType: TaskType.WATERING,
        dueDate: Timestamp.fromDate(dueDate),
        status: TaskStatus.PENDING,
      };
    },
    [generateTaskId]
  );

  const generateRepottingTask = useCallback(
    (plant: Plant): Task | null => {
      if (!plant.lastRepotted || !plant.repottingFrequency) {
        return null;
      }

      const lastRepottedDate = plant.lastRepotted.toDate();
      const dueDate = new Date(lastRepottedDate);
      dueDate.setMonth(dueDate.getMonth() - plant.repottingFrequency + 0.5);

      return {
        id: generateTaskId(plant.id, TaskType.REPOTTING, plant.lastRepotted),
        plantId: plant.id,
        plantName: plant.name,
        plantImageUrl: plant.imageUrl,
        taskType: TaskType.REPOTTING,
        dueDate: Timestamp.fromDate(dueDate),
        status: TaskStatus.PENDING,
      };
    },
    [generateTaskId]
  );

  const generateAllTasks = useCallback(() => {
    // Create an array to hold all new tasks
    const newTasks: Task[] = [];

    // For each plant, generate watering tasks
    plants.forEach((plant) => {
      const wateringTask = generateWateringTask(plant);
      if (wateringTask) {
        newTasks.push(wateringTask);
      }
      const repottingTask = generateRepottingTask(plant);
      if (repottingTask) {
        newTasks.push(repottingTask);
      }
    });

    // Keep track of completed tasks by ID using the tasks state from the hook's scope
    const completedTaskMap = new Map<string, Task>();
    // This reads the 'tasks' state available in the current render's scope
    tasks.forEach((task) => {
      if (task.status === TaskStatus.COMPLETED) {
        completedTaskMap.set(task.id, task);
      }
    });

    // Apply completed status to new tasks if they were completed before
    const finalTasks = newTasks.map((task) => {
      const completedTask = completedTaskMap.get(task.id);
      if (completedTask) {
        return {
          ...task,
          status: TaskStatus.COMPLETED,
          completed: true,
          completedAt: completedTask.completedAt || Timestamp.now(), // Ensure completedAt is preserved
        };
      }
      return task;
    });

    return finalTasks;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plants, generateWateringTask, generateRepottingTask]);

  // Load data and generate tasks
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        if (plants.length === 0 && !plantsLoading) {
          await fetchPlants();
        } else if (!plantsLoading) {
          // Plants are loaded, generate tasks
          const generatedTasks = generateAllTasks();
          setTasks(generatedTasks);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error loading tasks:", error);
        setIsLoading(false);
      }
    };

    loadData();
  }, [plants, plantsLoading, fetchPlants, generateAllTasks]);

  // Update tasks when plants change
  useEffect(() => {
    if (!plantsLoading && plants.length > 0) {
      const generatedTasks = generateAllTasks();
      setTasks(generatedTasks);
      setIsLoading(false);
    }
  }, [plants, plantsLoading, generateAllTasks]);

  // Complete a task and update the plant properties accordingly
  const completeTask = useCallback(
    async (taskId: string): Promise<TaskUpdateResult> => {
      // Find the task to update
      const taskToComplete = tasks.find((task) => task.id === taskId);

      if (!taskToComplete) {
        return {
          success: false,
          message: "Task not found",
        };
      }

      // Find the related plant
      const plant = plants.find((p) => p.id === taskToComplete.plantId);

      if (!plant) {
        return {
          success: false,
          message: "Plant not found",
        };
      }

      // Update plant properties based on the task type
      try {
        const plantUpdateData: Partial<Plant> = {};
        const now = Timestamp.now();

        switch (taskToComplete.taskType) {
          case TaskType.WATERING:
            plantUpdateData.lastWatered = now;
            break;

          case TaskType.REPOTTING:
            plantUpdateData.lastRepotted = now;
            if (plant.acquiredTimeOption === AcquiredTimeOption.JUST_BOUGHT) {
              plantUpdateData.acquiredTimeOption = AcquiredTimeOption.LAST_WEEK;
            }
            break;
          case TaskType.FERTILIZING:
          case TaskType.PRUNING:
          default:
            break;
        }

        // Update the plant in Firestore
        const updateSuccess = await updatePlant(plant.id, plantUpdateData);

        if (!updateSuccess) {
          return {
            success: false,
            message: "Failed to update plant data",
          };
        }

        // Update the local task state
        setTasks((prevTasks) =>
          prevTasks.map((task) => {
            if (task.id === taskId) {
              return {
                ...task,
                status: TaskStatus.COMPLETED,
                completed: true,
                completedAt: now,
              };
            }
            return task;
          })
        );

        return {
          success: true,
          message: `${taskToComplete.taskType} task completed successfully`,
        };
      } catch (error) {
        console.error("Error completing task:", error);
        return {
          success: false,
          message: "An error occurred while updating plant data",
        };
      }
    },
    [tasks, plants, updatePlant]
  );

  // Filter functions with fixed dependencies
  const getDueTasks = useCallback(() => {
    const now = new Date();
    return tasks.filter(
      (task) =>
        task.status === TaskStatus.PENDING && task.dueDate.toDate() <= now
    );
  }, [tasks]);

  const getUpcomingTasks = useCallback(() => {
    const now = new Date();
    return tasks.filter(
      (task) =>
        task.status === TaskStatus.PENDING && task.dueDate.toDate() > now
    );
  }, [tasks]);

  const getCompletedTasks = useCallback(() => {
    return tasks.filter((task) => task.status === TaskStatus.COMPLETED);
  }, [tasks]);

  return {
    tasks,
    isLoading: isLoading || plantsLoading,
    completeTask,
    getDueTasks,
    getUpcomingTasks,
    getCompletedTasks,
  };
};
