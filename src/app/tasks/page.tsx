"use client";
import { usePlantStore } from "@/store/plant-store";
import { useTasks } from "@/hooks/fetching-data/use-tasks";

import { Task, TaskStatus } from "@/models/tasks";

import { useEffect, useMemo } from "react";
import {
  EmptyTasksMessage,
  TaskListContainer,
} from "@/components/task-list/index.sc";
import { Timestamp } from "firebase/firestore"; // Import Timestamp
import { LoadingSpinner } from "@/components/spinner";
import { PlantTaskCard } from "@/components/task-list";
import { AppBar } from "@/components/app-bar/indext";
import Spacer from "@/components/utils/spacer/spacer";

// Helper function to find the earliest due date for a plant's tasks
const getEarliestDueDate = (tasks: Task[]): Timestamp | null => {
  if (!tasks || tasks.length === 0) {
    return null;
  }
  // Sort tasks by due date ascending and return the first one's dueDate
  return tasks.reduce((earliest, current) => {
    if (!earliest) return current.dueDate;
    return current.dueDate.toMillis() < earliest.toMillis()
      ? current.dueDate
      : earliest;
  }, null as Timestamp | null);
};

const TasksPage = () => {
  const { plants, fetchPlants, isLoading: plantsLoading } = usePlantStore();
  const { tasks, isLoading: tasksLoading, completeTask } = useTasks();

  useEffect(() => {
    if (plants.length === 0) {
      fetchPlants();
    }
  }, [fetchPlants, plants.length]);

  const pendingTasksByPlant = useMemo(() => {
    const pendingTasks = tasks.filter(
      (task) => task.status === TaskStatus.PENDING
    );
    const grouped: Record<string, Task[]> = {};
    for (const task of pendingTasks) {
      if (!grouped[task.plantId]) {
        grouped[task.plantId] = [];
      }
      grouped[task.plantId].push(task);
    }
    return grouped;
  }, [tasks]);

  // --- MODIFIED useMemo for plantsWithPendingTasks ---
  const plantsWithPendingTasks = useMemo(() => {
    // Filter plants first
    const filteredPlants = plants.filter(
      (plant) => pendingTasksByPlant[plant.id]?.length > 0
    );

    // Then sort the filtered plants
    filteredPlants.sort((plantA, plantB) => {
      const tasksA = pendingTasksByPlant[plantA.id] || [];
      const tasksB = pendingTasksByPlant[plantB.id] || [];

      const earliestDueDateA = getEarliestDueDate(tasksA);
      const earliestDueDateB = getEarliestDueDate(tasksB);

      // Handle cases where due dates might be null (shouldn't happen with filter, but good practice)
      if (!earliestDueDateA && !earliestDueDateB) return 0; // Keep original order if both have no date
      if (!earliestDueDateA) return 1; // Put plants with no due date last
      if (!earliestDueDateB) return -1; // Put plants with no due date last

      // Compare milliseconds
      return earliestDueDateA.toMillis() - earliestDueDateB.toMillis();
    });

    return filteredPlants; // Return the sorted array
  }, [plants, pendingTasksByPlant]);

  const isLoading = plantsLoading || tasksLoading;

  if (isLoading) {
    return <LoadingSpinner size="large" />;
  }

  return (
    <>
      <AppBar title="Take Care List" />
      <Spacer size={24} />
      <TaskListContainer>
        {plantsWithPendingTasks.length === 0 ? (
          <EmptyTasksMessage>
            No pending tasks for your plants right now!
          </EmptyTasksMessage>
        ) : (
          // The map function now iterates over the *sorted* array
          plantsWithPendingTasks.map((plant) => (
            <PlantTaskCard
              key={plant.id}
              plant={plant}
              tasks={pendingTasksByPlant[plant.id] || []}
              onCompleteTask={completeTask}
            />
          ))
        )}
      </TaskListContainer>
    </>
  );
};

export default TasksPage;
