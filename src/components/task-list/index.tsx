import React, { useState } from "react";
import Image from "next/image";
import { Plant, HealthStatus } from "@/models/plant";
import { Task, TaskStatus } from "@/models/tasks";
import { formatDistanceToNow } from "@/utils/date-utils";
import * as SC from "./index.sc";
import { TaskUpdateResult } from "@/hooks/fetching-data/use-tasks";

interface PlantTaskCardProps {
  plant: Plant;
  tasks: Task[];
  onCompleteTask: (taskId: string) => Promise<TaskUpdateResult>;
}

const MAX_TASKS_DISPLAY = 2;

export const PlantTaskCard: React.FC<PlantTaskCardProps> = ({
  plant,
  tasks,
  onCompleteTask,
}) => {
  const [completingTasks, setCompletingTasks] = useState<Set<string>>(
    new Set()
  );
  const [completionMessages, setCompletionMessages] = useState<
    Map<string, { message: string; isError: boolean }>
  >(new Map());

  const sortedTasks = [...tasks].sort(
    (a, b) => a.dueDate.toMillis() - b.dueDate.toMillis()
  );
  const tasksToDisplay = sortedTasks.slice(0, MAX_TASKS_DISPLAY);
  const remainingTasksCount = sortedTasks.length - tasksToDisplay.length;
  const now = new Date();
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
      const result = await onCompleteTask(taskId);

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
      console.error(
        "Something went wring during handleCheckboxChange: ",
        error
      );
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
      {/* Plant Info Section */}
      <SC.PlantInfoSection>
        <SC.PlantImageContainer>
          <Image
            src={imageUrl}
            alt={plant.name}
            layout="fill"
            objectFit="cover"
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
          const dueDate = task.dueDate.toDate();
          const isOverdue =
            task.status === TaskStatus.PENDING && dueDate <= now;
          const isCompleting = completingTasks.has(task.id);
          const completionInfo = completionMessages.get(task.id);

          return (
            <SC.TaskItem key={task.id}>
              {/* Group Name and Date */}
              <SC.TaskTextContainer>
                <SC.TaskName>{task.taskType}</SC.TaskName>
                {completionInfo ? (
                  <SC.TaskCompletionMessage isError={completionInfo.isError}>
                    {completionInfo.message}
                  </SC.TaskCompletionMessage>
                ) : (
                  <SC.TaskDueDate isOverdue={isOverdue}>
                    {isCompleting
                      ? "Updating..."
                      : formatDistanceToNow(dueDate)}
                  </SC.TaskDueDate>
                )}
              </SC.TaskTextContainer>

              {/* Checkbox */}
              <SC.TaskCheckbox
                checked={task.status === TaskStatus.COMPLETED}
                onChange={() => {
                  if (!isCompleting && task.status !== TaskStatus.COMPLETED) {
                    handleCheckboxChange(task.id);
                  }
                }}
                disabled={isCompleting || task.status === TaskStatus.COMPLETED}
              />
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
