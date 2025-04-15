"use client";
import { usePlantStore } from "@/store/plant-store";
import { useEnhancedTaskStore } from "@/store/enhanced-task-store";
import { Task } from "@/models/tasks";
import { useEffect, useMemo, useState } from "react";
import { TaskListContainer } from "@/components/task-list/index.sc";
import { Timestamp } from "firebase/firestore";
import { AppBar } from "@/components/app-bar/indext";
import Spacer from "@/components/utils/spacer/spacer";
import EmptyTasks from "@/components/task-list/empty-task";
import SubscriptionContainer from "@/components/task-list/subscription-container";
import { LoadingSpinner } from "@/components/spinner";
import { PlantTaskCard } from "@/components/task-list";

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
  const { plants, fetchPlants, isLoading: plantsLoading } = usePlantStore();
  const {
    tasks,
    isLoading: tasksLoading,
    generateTasks,
  } = useEnhancedTaskStore();
  const [initialized, setInitialized] = useState(false);

  // Load plants and generate tasks
  useEffect(() => {
    const initializeData = async () => {
      if (plants.length === 0 && !plantsLoading) {
        await fetchPlants();
      } else if (!plantsLoading && plants.length > 0 && !initialized) {
        generateTasks();
        setInitialized(true);
      }
    };

    initializeData();
  }, [fetchPlants, generateTasks, initialized, plants, plantsLoading]);

  // Group pending tasks by plant
  const pendingTasksByPlant = useMemo(() => {
    const grouped: Record<string, Task[]> = {};

    for (const task of tasks) {
      if (task.status === "Pending") {
        if (!grouped[task.plantId]) {
          grouped[task.plantId] = [];
        }
        grouped[task.plantId].push(task);
      }
    }

    return grouped;
  }, [tasks]);

  // Filter and sort plants with pending tasks
  const plantsWithTasks = useMemo(() => {
    // Get plants that have pending tasks
    const filtered = plants.filter(
      (plant) => pendingTasksByPlant[plant.id]?.length > 0
    );

    // Sort plants by earliest due date
    if (filtered.length > 0) {
      filtered.sort((plantA, plantB) => {
        const tasksA = pendingTasksByPlant[plantA.id] || [];
        const tasksB = pendingTasksByPlant[plantB.id] || [];

        const earliestA = getEarliestDueDate(tasksA);
        const earliestB = getEarliestDueDate(tasksB);

        if (!earliestA && !earliestB) return 0;
        if (!earliestA) return 1;
        if (!earliestB) return -1;

        return earliestA.toMillis() - earliestB.toMillis();
      });
    }

    return filtered;
  }, [plants, pendingTasksByPlant]);

  const isLoading = plantsLoading || tasksLoading;

  if (isLoading) {
    return (
      <>
        <AppBar title="Take Care List" />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "4rem",
          }}
        >
          <LoadingSpinner size="large" />
        </div>
      </>
    );
  }

  return (
    <>
      <AppBar title="Take Care List" />
      <Spacer size={24} />
      <TaskListContainer>
        <SubscriptionContainer />

        {plantsWithTasks.length === 0 ? (
          <EmptyTasks hasPlants={plants.length > 0} />
        ) : (
          plantsWithTasks.map((plant) => (
            <PlantTaskCard
              key={plant.id}
              plant={plant}
              tasks={pendingTasksByPlant[plant.id] || []}
            />
          ))
        )}
      </TaskListContainer>
    </>
  );
};

export default TasksPage;
