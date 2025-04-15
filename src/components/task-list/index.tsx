import React, { useState } from "react";
import Image from "next/image";
import { Plant, HealthStatus } from "@/models/plant";
import { Task, TaskStatus } from "@/models/tasks";
import * as SC from "./index.sc";
import { useEnhancedTaskStore } from "@/store/enhanced-task-store";
import { formatDistanceToNow } from "@/utils/date-utils";

interface PlantTaskCardProps {
  plant: Plant;
  tasks: Task[];
}

const MAX_TASKS_DISPLAY = 2;

export const PlantTaskCard: React.FC<PlantTaskCardProps> = ({
  plant,
  tasks,
}) => {
  const { completeTask, getTaskStatus } = useEnhancedTaskStore();
  const [completingTasks, setCompletingTasks] = useState<Set<string>>(
    new Set()
  );
  const [completionMessages, setCompletionMessages] = useState<
    Map<string, { message: string; isError: boolean }>
  >(new Map());

  // Sort tasks by due date (earliest first)
  const sortedTasks = [...tasks].sort(
    (a, b) => a.dueDate.toMillis() - b.dueDate.toMillis()
  );

  const tasksToDisplay = sortedTasks.slice(0, MAX_TASKS_DISPLAY);
  const remainingTasksCount = sortedTasks.length - tasksToDisplay.length;

  const locationString =
    plant.location?.room || plant.location?.city || "Unknown Location";
  const imageUrl = plant.imageUrl || "/images/plants/normal-plants/plant-2.jpg";

  const handleCheckboxChange = async (taskId: string) => {
    // Set loading state
    setCompletingTasks((prev) => {
      const newSet = new Set(prev);
      newSet.add(taskId);
      return newSet;
    });

    try {
      // Call the async function that completes the task and updates plant data
      const result = await completeTask(taskId);

      // Show a message based on the result
      setCompletionMessages((prev) => {
        const newMap = new Map(prev);
        newMap.set(taskId, {
          message: result.message,
          isError: !result.success,
        });
        return newMap;
      });

      // If successful, remove the task from view after a delay
      if (result.success) {
        setTimeout(() => {
          setCompletionMessages((prev) => {
            const newMap = new Map(prev);
            newMap.delete(taskId);
            return newMap;
          });
        }, 3000);
      }
    } catch (error) {
      console.error("Error during task completion:", error);
    } finally {
      // Remove loading state
      setCompletingTasks((prev) => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  return (
    <SC.CardWrapper>
      <SC.PlantInfoSection>
        <SC.PlantImageContainer>
          <Image
            src={imageUrl}
            alt={plant.name}
            fill
            style={{ objectFit: "cover" }}
          />
        </SC.PlantImageContainer>
        <SC.PlantDetails>
          <SC.PlantNameLocation>
            {plant.name} | <SC.LocationText>{locationString}</SC.LocationText>
          </SC.PlantNameLocation>
          <SC.HealthStatusBadge
            status={plant.healthStatus || HealthStatus.GOOD}
          >
            {plant.healthStatus || "Good"}
          </SC.HealthStatusBadge>
        </SC.PlantDetails>
      </SC.PlantInfoSection>

      {/* Divider */}
      <SC.Divider />

      {/* Task Section */}
      <SC.TaskSection>
        {tasksToDisplay.map((task) => {
          const isCompleting = completingTasks.has(task.id);
          const completionInfo = completionMessages.get(task.id);
          const { status, color, isCompletable } = getTaskStatus(task);

          // For completed tasks, only show the status badge
          if (task.status === TaskStatus.COMPLETED) {
            return (
              <SC.TaskItem key={task.id}>
                {/* Task info */}
                <SC.TaskTextContainer>
                  <SC.TaskName>{task.taskType}</SC.TaskName>
                  <SC.TaskDueDate isOverdue={false}>
                    {formatDistanceToNow(
                      task.completedAt?.toDate() || new Date()
                    )}
                  </SC.TaskDueDate>
                </SC.TaskTextContainer>

                <SC.WateringStatus
                  color={color}
                  data-testid={`task-status-${task.id}`}
                >
                  {status}
                </SC.WateringStatus>
              </SC.TaskItem>
            );
          }

          // For pending tasks, show either a checkbox or status badge
          return (
            <SC.TaskItem key={task.id}>
              {/* Task info */}
              <SC.TaskTextContainer>
                <SC.TaskName>{task.taskType}</SC.TaskName>
                {completionInfo ? (
                  <SC.TaskCompletionMessage isError={completionInfo.isError}>
                    {completionInfo.message}
                  </SC.TaskCompletionMessage>
                ) : (
                  <SC.TaskDueDate
                    isOverdue={color === "#D32F2F"} // Red color for overdue
                  >
                    {isCompleting
                      ? "Updating..."
                      : formatDistanceToNow(task.dueDate.toDate())}
                  </SC.TaskDueDate>
                )}
              </SC.TaskTextContainer>

              {/* Show checkbox for completable tasks or status for non-completable */}
              {isCompletable ? (
                <SC.TaskCheckbox
                  checked={false}
                  onChange={() => handleCheckboxChange(task.id)}
                  disabled={isCompleting}
                  data-testid={`task-checkbox-${task.id}`}
                />
              ) : (
                <SC.WateringStatus
                  color={color}
                  data-testid={`task-status-${task.id}`}
                >
                  {status}
                </SC.WateringStatus>
              )}
            </SC.TaskItem>
          );
        })}

        {remainingTasksCount > 0 && (
          <SC.MoreTasksBadge>
            +{remainingTasksCount} more task{remainingTasksCount > 1 ? "s" : ""}
          </SC.MoreTasksBadge>
        )}
      </SC.TaskSection>
    </SC.CardWrapper>
  );
};
