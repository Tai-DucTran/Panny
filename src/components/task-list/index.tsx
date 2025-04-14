// src/components/tasks/task-list.tsx
import React, { useState, useCallback } from "react";
import Image from "next/image";
import { Task, TaskStatus } from "@/models/tasks";

import {
  TaskListContainer,
  SectionTitle,
  EmptyTasksMessage,
  TaskCard,
  PlantImageContainer,
  TaskInfo,
  PlantName,
  TaskDetails,
  TaskLabel,
  DueDate,
  ActionButton,
  CompletedButton,
  StatusDot,
} from "./index.sc";
import { formatDistanceToNow } from "@/utils/date-utils";
import { useTasks } from "@/hooks/fetching-data/use-tasks";

interface TaskListProps {
  tasks: Task[];
  type: "pending" | "upcoming" | "completed";
}

// Default image for plants without an image
const defaultImageUrl = "/images/plants/normal-plants/plant-1.jpg";

const TaskList: React.FC<TaskListProps> = ({ tasks, type }) => {
  // Track locally completed tasks to avoid immediate re-fetching
  const [localCompletedTaskIds, setLocalCompletedTaskIds] = useState<
    Set<string>
  >(new Set());
  const { completeTask } = useTasks();

  // Handle task completion with local state update
  const handleCompleteTask = useCallback(
    (taskId: string) => {
      setLocalCompletedTaskIds((prev) => {
        const newSet = new Set(prev);
        newSet.add(taskId);
        return newSet;
      });
      completeTask(taskId);
    },
    [completeTask]
  );

  // Get current date for comparison
  const now = new Date();

  if (tasks.length === 0) {
    return (
      <TaskListContainer>
        <SectionTitle>
          {type === "pending"
            ? "Due Tasks"
            : type === "upcoming"
            ? "Upcoming Tasks"
            : "Completed Tasks"}
        </SectionTitle>
        <EmptyTasksMessage>
          {type === "pending"
            ? "No tasks need your attention right now."
            : type === "upcoming"
            ? "No upcoming tasks scheduled."
            : "You haven't completed any tasks yet."}
        </EmptyTasksMessage>
      </TaskListContainer>
    );
  }

  return (
    <TaskListContainer>
      <SectionTitle>
        {type === "pending"
          ? "Tasks Due Now"
          : type === "upcoming"
          ? "Upcoming Tasks"
          : "Completed Tasks"}
      </SectionTitle>

      {tasks.map((task) => {
        // Skip rendering if we've locally marked this task as completed
        // and we're not on the completed list
        if (localCompletedTaskIds.has(task.id) && type !== "completed") {
          return null;
        }

        const dueDate = task.dueDate.toDate();
        const isOverdue = dueDate < now && task.status === TaskStatus.PENDING;
        const isCompleted = task.status === TaskStatus.COMPLETED;
        const isUpcoming = type === "upcoming";

        // Format relative date (e.g., "2 days ago", "today")
        const timeFromNow = formatDistanceToNow(dueDate);

        // Process image URL with fallback
        const imageUrl =
          task.plantImageUrl && task.plantImageUrl.trim() !== ""
            ? task.plantImageUrl
            : defaultImageUrl;

        return (
          <TaskCard key={task.id} isCompleted={isCompleted}>
            <PlantImageContainer>
              <Image
                src={imageUrl}
                alt={task.plantName}
                fill
                sizes="60px"
                style={{ objectFit: "cover" }}
              />
            </PlantImageContainer>

            <TaskInfo>
              <PlantName>{task.plantName}</PlantName>
              <TaskDetails>
                <div>
                  <TaskLabel isCompleted={isCompleted}>
                    <StatusDot
                      status={
                        isCompleted
                          ? "completed"
                          : isOverdue
                          ? "overdue"
                          : isUpcoming
                          ? "upcoming"
                          : "pending"
                      }
                    />
                    {task.taskType} {isCompleted ? "completed" : "needed"}
                  </TaskLabel>
                  <div>
                    <DueDate isOverdue={isOverdue} isCompleted={isCompleted}>
                      {isCompleted
                        ? "Completed " + timeFromNow
                        : isOverdue
                        ? "Overdue by " + timeFromNow
                        : "Due " + timeFromNow}
                    </DueDate>
                  </div>
                </div>
              </TaskDetails>
            </TaskInfo>

            {!isCompleted ? (
              <ActionButton onClick={() => handleCompleteTask(task.id)}>
                Mark Done
              </ActionButton>
            ) : (
              <CompletedButton disabled>Completed</CompletedButton>
            )}
          </TaskCard>
        );
      })}
    </TaskListContainer>
  );
};

export default TaskList;
