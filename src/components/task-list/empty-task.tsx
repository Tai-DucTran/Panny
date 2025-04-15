import Image from "next/image";
import {
  AddPlantButton,
  EmptyContainer,
  EmptyText,
  EmptyTitle,
} from "./empty-task.sc";
import { LoadingSpinner } from "@/components/spinner";

interface EmptyTasksProps {
  hasPlants: boolean;
  isLoading?: boolean;
}

const EmptyTasks: React.FC<EmptyTasksProps> = ({
  hasPlants,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <EmptyContainer>
        <LoadingSpinner size="large" />
      </EmptyContainer>
    );
  }

  return (
    <EmptyContainer>
      <Image
        src="/images/panny-baby-logo.webp"
        alt="Panny Logo"
        width={150}
        height={150}
        priority={false}
      />
      <EmptyTitle>
        {hasPlants ? "All Caught Up!" : "No Plants to Care For"}
      </EmptyTitle>
      <EmptyText>
        {hasPlants
          ? "All your plants are healthy and don't need attention right now. Check back later for upcoming care tasks."
          : "Start by adding plants to your garden. Once you've added some plants, you'll see tasks for watering and other care needs here."}
      </EmptyText>

      {!hasPlants && (
        <AddPlantButton href="/add-new-plant">
          Add Your First Plant
        </AddPlantButton>
      )}
    </EmptyContainer>
  );
};

export default EmptyTasks;
