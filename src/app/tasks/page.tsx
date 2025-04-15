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

  // Single isLoading state to control the spinner
  const [isLoading, setIsLoading] = useState(true);

  // Use a ref to track if we've attempted to load data
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);

  // Load plants and generate tasks
  useEffect(() => {
    let mounted = true;

    const initializeData = async () => {
      if (!mounted || hasAttemptedLoad) return;

      setHasAttemptedLoad(true);

      try {
        // If plants aren't loaded yet, fetch them first
        if (plants.length === 0) {
          await fetchPlants();
        }

        // Generate tasks once plants are available
        generateTasks();

        // Set loading state to false once everything is initialized
        if (mounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error initializing data:", error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeData();

    // Add a safety timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (mounted && isLoading) {
        console.log("Loading timeout reached");
        setIsLoading(false);
      }
    }, 5000); // 5 seconds timeout

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchPlants, generateTasks, plants, hasAttemptedLoad]);

  // Effect to update loading state when store's loading state changes
  useEffect(() => {
    if (!plantsLoading && !tasksLoading && hasAttemptedLoad) {
      setIsLoading(false);
    }
  }, [plantsLoading, tasksLoading, hasAttemptedLoad]);

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
