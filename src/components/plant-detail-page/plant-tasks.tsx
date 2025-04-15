import React, { useState, useEffect } from "react";
import { Task, TaskStatus } from "@/models/tasks";
import { formatTimestamp } from "@/utils/timestamp-utils";
import { Timestamp } from "firebase/firestore";
import { LoadingSpinner } from "@/components/spinner";
import { useEnhancedTaskStore } from "@/store/enhanced-task-store";
import {
  DetailsList,
  TaskItem,
  TaskInfo,
  TaskName,
  TaskDate,
  TaskStatusBadge,
  ActionButton,
} from "./index.sc";

interface PlantTasksProps {
  tasks: Task[];
  isLoading: boolean;
}

const PlantTasks: React.FC<PlantTasksProps> = ({ tasks, isLoading }) => {
  const { completeTask, getTaskStatus, generateTasks } = useEnhancedTaskStore();
  const [completingTasks, setCompletingTasks] = useState<Set<string>>(
    new Set()
  );
  const [statusMessages, setStatusMessages] = useState<
    Record<string, { message: string; isError: boolean }>
  >({});
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);

  // Update local tasks when props tasks change
  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const handleCompleteTask = async (taskId: string) => {
    if (completingTasks.has(taskId)) return;

    // Set loading state
    setCompletingTasks((prev) => {
      const newSet = new Set(prev);
      newSet.add(taskId);
      return newSet;
    });

    try {
      const result = await completeTask(taskId);

      // Set status message
      setStatusMessages((prev) => ({
        ...prev,
        [taskId]: {
          message: result.message,
          isError: !result.success,
        },
      }));

      if (result.success) {
        // Update local task state to immediately show as completed
        setLocalTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  status: TaskStatus.COMPLETED,
                  completed: true,
                  completedAt: Timestamp.now(), // Use Timestamp instead of Date
                }
              : task
          )
        );

        // Regenerate all tasks to ensure consistency
        setTimeout(() => {
          generateTasks();
        }, 300);

        // Remove message after delay if successful
        setTimeout(() => {
          setStatusMessages((prev) => {
            const newMessages = { ...prev };
            delete newMessages[taskId];
            return newMessages;
          });
        }, 3000);
      }
    } catch (error) {
      console.error("Error while completing task:", error);
    } finally {
      // Remove loading state
      setCompletingTasks((prev) => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  if (isLoading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "1rem" }}
      >
        <LoadingSpinner size="small" />
      </div>
    );
  }

  if (localTasks.length === 0) {
    return (
      <DetailsList>
        <TaskItem>
          <TaskInfo>
            <TaskName>No current tasks for this plant</TaskName>
          </TaskInfo>
        </TaskItem>
      </DetailsList>
    );
  }

  // Sort tasks by status (pending first) and then by due date
  const sortedTasks = [...localTasks].sort((a, b) => {
    // First sort by status (pending first)
    if (a.status !== b.status) {
      return a.status === TaskStatus.PENDING ? -1 : 1;
    }

    // Then sort by date (earliest first for pending, latest first for completed)
    if (a.status === TaskStatus.PENDING) {
      return a.dueDate.toMillis() - b.dueDate.toMillis();
    } else {
      // For completed tasks, sort by completion date (most recent first)
      const aTime = a.completedAt?.toMillis() || 0;
      const bTime = b.completedAt?.toMillis() || 0;
      return bTime - aTime;
    }
  });

  return (
    <DetailsList>
      {sortedTasks.map((task) => {
        const isCompleting = completingTasks.has(task.id);
        const statusMessage = statusMessages[task.id];
        const { status, color, isCompletable } = getTaskStatus(task);

        return (
          <TaskItem key={task.id}>
            <TaskInfo>
              <TaskName>{task.taskType}</TaskName>
              <TaskDate>
                {statusMessage
                  ? statusMessage.message
                  : task.status === TaskStatus.COMPLETED
                  ? `Completed: ${formatTimestamp(task.completedAt)}`
                  : `Due: ${formatTimestamp(task.dueDate)}`}
              </TaskDate>
            </TaskInfo>

            <div style={{ display: "flex", alignItems: "center" }}>
              {/* Show status badge for all tasks */}
              <TaskStatusBadge
                status={task.status}
                style={{ backgroundColor: color }}
              >
                {status}
              </TaskStatusBadge>

              {/* Show Complete button only for pending and completable tasks */}
              {task.status === TaskStatus.PENDING && isCompletable && (
                <ActionButton
                  onClick={() => handleCompleteTask(task.id)}
                  disabled={isCompleting}
                  data-testid={`complete-button-${task.id}`}
                >
                  {isCompleting ? "..." : "Complete"}
                </ActionButton>
              )}
            </div>
          </TaskItem>
        );
      })}
    </DetailsList>
  );
};

export default PlantTasks;
