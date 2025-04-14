import React from "react";
import Image from "next/image";
import { Plant, HealthStatus } from "@/models/plant";
import { Task, TaskStatus } from "@/models/tasks";
import { formatDistanceToNow } from "@/utils/date-utils";
import * as SC from "./index.sc";

interface PlantTaskCardProps {
  plant: Plant;
  tasks: Task[];
  onCompleteTask: (taskId: string) => void;
}

const MAX_TASKS_DISPLAY = 2;

export const PlantTaskCard: React.FC<PlantTaskCardProps> = ({
  plant,
  tasks,
  onCompleteTask,
}) => {
  const sortedTasks = [...tasks].sort(
    (a, b) => a.dueDate.toMillis() - b.dueDate.toMillis()
  );
  const tasksToDisplay = sortedTasks.slice(0, MAX_TASKS_DISPLAY);
  const remainingTasksCount = sortedTasks.length - tasksToDisplay.length;
  const now = new Date();
  const locationString =
    plant.location?.room || plant.location?.city || "Unknown Location";
  const imageUrl = plant.imageUrl || "/images/plants/normal-plants/plant-2.jpg";

  const handleCheckboxChange = (taskId: string) => {
    onCompleteTask(taskId);
    // Optionally add visual feedback here (e.g., temporary strikethrough)
    // Note: The task will disappear from this list on next render if task state updates correctly
  };

  return (
    <SC.CardWrapper>
      {/* Plant Info Section (remains the same) */}
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

      {/* Divider (remains the same) */}
      <SC.Divider />

      {/* Updated Task Section */}
      <SC.TaskSection>
        {tasksToDisplay.map((task) => {
          const dueDate = task.dueDate.toDate();
          const isOverdue =
            task.status === TaskStatus.PENDING && dueDate <= now;
          return (
            <SC.TaskItem key={task.id}>
              {/* Group Name and Date */}
              <SC.TaskTextContainer>
                <SC.TaskName>{task.taskType}</SC.TaskName>
                <SC.TaskDueDate isOverdue={isOverdue}>
                  {formatDistanceToNow(dueDate)}
                </SC.TaskDueDate>
              </SC.TaskTextContainer>

              {/* Checkbox */}
              <SC.TaskCheckbox
                checked={false} // Checkbox is always unchecked initially in this view (pending tasks)
                onChange={() => handleCheckboxChange(task.id)}
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
