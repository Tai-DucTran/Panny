// src/hooks/use-tasks.ts
import { useEffect, useState, useCallback } from "react";
import { Task, TaskStatus, TaskType } from "@/models/tasks";
import { usePlantStore } from "@/store/plant-store";
import { Timestamp } from "firebase/firestore";
import { Plant } from "@/models/plant";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { plants, fetchPlants, isLoading: plantsLoading } = usePlantStore();

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

  // Generate all tasks from plants
  const generateAllTasks = useCallback(() => {
    // Create an array to hold all new tasks
    const newTasks: Task[] = [];

    // For each plant, generate watering tasks
    plants.forEach((plant) => {
      const wateringTask = generateWateringTask(plant);
      if (wateringTask) {
        newTasks.push(wateringTask);
      }
    });

    // Keep track of completed tasks by ID
    const completedTaskMap = new Map<string, Task>();
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
          completedAt: completedTask.completedAt || Timestamp.now(),
        };
      }
      return task;
    });

    return finalTasks;
  }, [plants, tasks, generateWateringTask]);

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

  // Complete a task
  const completeTask = useCallback((taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            status: TaskStatus.COMPLETED,
            completed: true,
            completedAt: Timestamp.now(),
          };
        }
        return task;
      })
    );
  }, []);

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
