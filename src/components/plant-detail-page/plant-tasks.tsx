import React, { useState } from "react";
import { Task, TaskStatus } from "@/models/tasks";
import { formatTimestamp } from "@/utils/timestamp-utils";
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
  const { completeTask, getTaskStatus } = useEnhancedTaskStore();
  const [completingTasks, setCompletingTasks] = useState<Set<string>>(
    new Set()
  );
  const [statusMessages, setStatusMessages] = useState<
    Record<string, { message: string; isError: boolean }>
  >({});

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

      // Remove message after delay if successful
      if (result.success) {
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

  if (tasks.length === 0) {
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

  return (
    <DetailsList>
      {tasks.map((task) => {
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
