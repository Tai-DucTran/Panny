// src/hooks/use-enhanced-tasks.ts
import { useEffect, useState } from "react";
import { useEnhancedTaskStore } from "@/store/enhanced-task-store";
import { usePlantStore } from "@/store/plant-store";
import { Task } from "@/models/tasks";

interface UseEnhancedTasksProps {
  plantId?: string; // Optional - if provided, only tasks for this plant will be returned
}

export const useEnhancedTasks = ({ plantId }: UseEnhancedTasksProps = {}) => {
  const {
    tasks,
    isLoading: tasksLoading,
    generateTasks,
    completeTask,
    isTaskCompletable,
    getTaskStatus,
    getDueTasks,
    getUpcomingTasks,
    getCompletedTasks,
    getPlantTasks,
  } = useEnhancedTaskStore();

  const { plants, fetchPlants, isLoading: plantsLoading } = usePlantStore();

  const [initialized, setInitialized] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  // Initialize data
  useEffect(() => {
    const loadData = async () => {
      // If plants aren't loaded yet, fetch them first
      if (plants.length === 0 && !plantsLoading) {
        await fetchPlants();
      }
      // Once plants are loaded, generate tasks
      else if (plants.length > 0 && !plantsLoading) {
        generateTasks();
        setInitialized(true);
      }
    };

    loadData();

    // This will ensure tasks are regenerated whenever plants change
    // (e.g., after watering or repotting)
  }, [fetchPlants, generateTasks, plants, plantsLoading]);

  // Filter tasks if plantId is provided
  useEffect(() => {
    if (plantId) {
      setFilteredTasks(getPlantTasks(plantId));
    } else {
      setFilteredTasks(tasks);
    }
  }, [plantId, tasks, getPlantTasks]);

  return {
    tasks: filteredTasks,
    isLoading: tasksLoading || plantsLoading || !initialized,
    completeTask,
    isTaskCompletable,
    getTaskStatus,
    dueTasks: getDueTasks().filter(
      (task) => !plantId || task.plantId === plantId
    ),
    upcomingTasks: getUpcomingTasks().filter(
      (task) => !plantId || task.plantId === plantId
    ),
    completedTasks: getCompletedTasks().filter(
      (task) => !plantId || task.plantId === plantId
    ),
    refreshTasks: generateTasks,
  };
};
