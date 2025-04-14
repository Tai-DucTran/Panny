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

  // Generate repotting task from plant
  const generateRepottingTask = useCallback(
    (plant: Plant): Task | null => {
      // If we don't have lastRepotted information yet, check if this is a newly bought plant
      if (!plant.lastRepotted && !plant.repottingFrequency) {
        // If it's a newly acquired plant, we should suggest repotting within a week
        if (plant.acquiredTimeOption === "just_bought") {
          // Create a timestamp for now to use as a base for the ID
          const nowTimestamp = Timestamp.now();

          // Set due date to one week from now
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + 7);

          return {
            id: generateTaskId(plant.id, TaskType.REPOTTING, nowTimestamp),
            plantId: plant.id,
            plantName: plant.name,
            plantImageUrl: plant.imageUrl,
            taskType: TaskType.REPOTTING,
            dueDate: Timestamp.fromDate(dueDate),
            status: TaskStatus.PENDING,
          };
        }
        return null;
      }

      // Handle regular repotting schedule based on lastRepotted and frequency
      if (!plant.lastRepotted || !plant.repottingFrequency) {
        return null;
      }

      const lastRepottedDate = plant.lastRepotted.toDate();
      const dueDate = new Date(lastRepottedDate);

      // Add months to the due date based on repotting frequency (in months)
      dueDate.setMonth(dueDate.getMonth() + plant.repottingFrequency);

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

      // Also generate repotting tasks
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
