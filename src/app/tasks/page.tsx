"use client";

import { useEffect, useState } from "react";
import Spacer from "@/components/utils/spacer/spacer";

import { AppBar } from "@/components/app-bar/indext";
import { LoadingSpinner } from "@/components/spinner";
import { usePlantStore } from "@/store/plant-store";
import { Task } from "@/models/tasks";
import { useTasks } from "@/hooks/fetching-data/use-tasks";
import TaskList from "@/components/task-list";
import EmptyTasks from "@/components/task-list/empty-task";

export default function TasksPage() {
  // Using local state to store filtered tasks after they're calculated
  const [dueTasks, setDueTasks] = useState<Task[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);

  const { isLoading, getDueTasks, getUpcomingTasks, getCompletedTasks } =
    useTasks();
  const { plants } = usePlantStore();

  // Update the filtered tasks only when the tasks change
  useEffect(() => {
    if (!isLoading) {
      setDueTasks(getDueTasks());
      setUpcomingTasks(getUpcomingTasks());
      setCompletedTasks(getCompletedTasks());
    }
  }, [isLoading, getDueTasks, getUpcomingTasks, getCompletedTasks]);

  const hasNoTasks =
    dueTasks.length === 0 &&
    upcomingTasks.length === 0 &&
    completedTasks.length === 0;
  const hasPlants = plants.length > 0;

  // Show loading state during initial load
  if (isLoading) {
    return (
      <div>
        <AppBar title="Take Care List" />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <AppBar title="Take Care List" />
      <Spacer size={24} />

      {hasNoTasks ? (
        <EmptyTasks hasPlants={hasPlants} />
      ) : (
        <>
          {dueTasks.length > 0 && (
            <>
              <TaskList tasks={dueTasks} type="pending" />
              <Spacer size={24} />
            </>
          )}

          {upcomingTasks.length > 0 && (
            <>
              <TaskList tasks={upcomingTasks} type="upcoming" />
              <Spacer size={24} />
            </>
          )}

          {completedTasks.length > 0 && (
            <TaskList tasks={completedTasks} type="completed" />
          )}
        </>
      )}
    </div>
  );
}
