"use client";
import { usePlantStore } from "@/store/plant-store";
import { useTasks } from "@/hooks/fetching-data/use-tasks";
import { Task, TaskStatus } from "@/models/tasks";
import { useEffect, useMemo, useState } from "react";
import { TaskListContainer } from "@/components/task-list/index.sc";
import { Timestamp } from "firebase/firestore";
import { PlantTaskCard } from "@/components/task-list";
import { AppBar } from "@/components/app-bar/indext";
import Spacer from "@/components/utils/spacer/spacer";
import EmptyTasks from "@/components/task-list/empty-task";
import SubscriptionContainer from "@/components/task-list/subscription-container";

// Helper function to find the earliest due date for a plant's tasks
const getEarliestDueDate = (tasks: Task[]): Timestamp | null => {
  if (!tasks || tasks.length === 0) {
    return null;
  }
  return tasks.reduce((earliest, current) => {
    if (!earliest) return current.dueDate;
    return current.dueDate.toMillis() < earliest.toMillis()
      ? current.dueDate
      : earliest;
  }, null as Timestamp | null);
};

const TasksPage = () => {
  const { plants, fetchPlants } = usePlantStore();
  const { tasks, completeTask } = useTasks();
  const [isTimeoutOccurred] = useState(false);

  useEffect(() => {
    const loadPlants = async () => {
      try {
        await fetchPlants();
      } catch (error) {
        console.error("Error fetching plants:", error);
      }
    };

    if (plants.length === 0) {
      loadPlants();
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

  const plantsWithPendingTasks = useMemo(() => {
    // Filter plants first
    const filteredPlants = plants.filter(
      (plant) => pendingTasksByPlant[plant.id]?.length > 0
    );

    // Only sort if we have plants
    if (filteredPlants.length === 0) return [];

    // Then sort the filtered plants
    filteredPlants.sort((plantA, plantB) => {
      const tasksA = pendingTasksByPlant[plantA.id] || [];
      const tasksB = pendingTasksByPlant[plantB.id] || [];

      const earliestDueDateA = getEarliestDueDate(tasksA);
      const earliestDueDateB = getEarliestDueDate(tasksB);

      // Handle cases where due dates might be null
      if (!earliestDueDateA && !earliestDueDateB) return 0;
      if (!earliestDueDateA) return 1;
      if (!earliestDueDateB) return -1;

      // Compare milliseconds
      return earliestDueDateA.toMillis() - earliestDueDateB.toMillis();
    });

    return filteredPlants;
  }, [plants, pendingTasksByPlant]);

  // Handle the case when the timeout occurred but we still have no data
  const forceShowEmptyState = isTimeoutOccurred && plants.length === 0;

  return (
    <>
      <AppBar title="Take Care List" />
      <Spacer size={24} />
      <TaskListContainer>
        <SubscriptionContainer />

        {forceShowEmptyState || plantsWithPendingTasks.length === 0 ? (
          <EmptyTasks hasPlants={plants.length > 0} />
        ) : (
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
