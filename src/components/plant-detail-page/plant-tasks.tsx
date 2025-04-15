import React, { useState, useEffect } from "react";
import { Task, TaskStatus, TaskType } from "@/models/tasks";
import { formatTimestamp } from "@/utils/timestamp-utils";
import { LoadingSpinner } from "@/components/spinner";
import { useEnhancedTaskStore } from "@/store/enhanced-task-store";
import { Timestamp } from "firebase/firestore";
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

// Helper function to check if two timestamps represent the same day
const isSameDay = (timestamp1?: Timestamp, timestamp2?: Timestamp): boolean => {
  if (!timestamp1 || !timestamp2) return false;

  const date1 = timestamp1.toDate();
  const date2 = timestamp2.toDate();

  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const PlantTasks: React.FC<PlantTasksProps> = ({ tasks, isLoading }) => {
  const { completeTask, getTaskStatus, generateTasks } = useEnhancedTaskStore();
  const [completingTasks, setCompletingTasks] = useState<Set<string>>(
    new Set()
  );
  const [statusMessages, setStatusMessages] = useState<
    Record<string, { message: string; isError: boolean }>
  >({});
  const [localTasks, setLocalTasks] = useState<Task[]>([]);

  // Update local tasks when props tasks change, but deduplicate them
  useEffect(() => {
    // Deduplicate tasks by type - keep only the most recent of each type
    const deduplicatedTasks = deduplicateTasks(tasks);
    setLocalTasks(deduplicatedTasks);
  }, [tasks]);

  // Function to deduplicate tasks by type (keeping only the most recent of each)
  const deduplicateTasks = (taskList: Task[]): Task[] => {
    // Create maps to store the most recent tasks by type
    const pendingTasksByType = new Map<TaskType, Task>();
    const completedTasksByTypeAndDate = new Map<string, Task>();

    // First, process all tasks to find the latest of each type
    taskList.forEach((task) => {
      if (task.status === TaskStatus.PENDING) {
        const existingTask = pendingTasksByType.get(task.taskType);

        // If we don't have a task of this type yet, or if this task is newer
        if (
          !existingTask ||
          task.dueDate.toMillis() > existingTask.dueDate.toMillis()
        ) {
          pendingTasksByType.set(task.taskType, task);
        }
      } else if (task.status === TaskStatus.COMPLETED && task.completedAt) {
        // For completed tasks, deduplicate by type AND completion date
        // Create a key combining the task type and the completion date (year, month, day)
        const completionDate = task.completedAt.toDate();
        const dateKey = `${completionDate.getFullYear()}-${completionDate.getMonth()}-${completionDate.getDate()}`;
        const key = `${task.taskType}-${dateKey}`;

        const existingTask = completedTasksByTypeAndDate.get(key);

        // If we don't have a task with this key yet, or if this task was completed later in the day
        if (
          !existingTask ||
          (existingTask.completedAt &&
            task.completedAt.toMillis() > existingTask.completedAt.toMillis())
        ) {
          completedTasksByTypeAndDate.set(key, task);
        }
      }
    });

    // Combine all deduplicated tasks
    return [
      ...Array.from(pendingTasksByType.values()),
      ...Array.from(completedTasksByTypeAndDate.values()),
    ];
  };

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
        // Find the task being completed
        const taskBeingCompleted = localTasks.find((t) => t.id === taskId);

        if (taskBeingCompleted) {
          const now = Timestamp.now();

          // Mark the task as completed locally
          const updatedTask = {
            ...taskBeingCompleted,
            status: TaskStatus.COMPLETED,
            completed: true,
            completedAt: now,
          };

          // Filter out other tasks to prevent duplication
          const filteredTasks = localTasks.filter((t) => {
            // Keep the task we're updating
            if (t.id === taskId) return true;

            // Keep tasks of different types
            if (t.taskType !== taskBeingCompleted.taskType) return true;

            // For tasks of the same type:
            if (t.taskType === taskBeingCompleted.taskType) {
              // If it's pending, filter it out (we only want one pending task per type)
              if (t.status === TaskStatus.PENDING) return false;

              // If it's completed, keep it only if it wasn't completed today
              if (t.status === TaskStatus.COMPLETED) {
                return !isSameDay(t.completedAt, now);
              }
            }

            return true;
          });

          // Add the updated task to the filtered list
          setLocalTasks([...filteredTasks, updatedTask]);
        }

        // Regenerate all tasks to ensure consistency, but after a delay
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

    // Then sort by type (alphabetically)
    if (a.taskType !== b.taskType) {
      return a.taskType.localeCompare(b.taskType);
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
