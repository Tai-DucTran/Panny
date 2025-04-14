import Link from "next/link";
import Image from "next/image";
import {
  AddPlantButton,
  EmptyContainer,
  EmptyText,
  EmptyTitle,
} from "./empty-task.sc";

interface EmptyTasksProps {
  hasPlants: boolean;
}

const EmptyTasks: React.FC<EmptyTasksProps> = ({ hasPlants }) => {
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
        <Link href="/add-new-plant" passHref legacyBehavior>
          <AddPlantButton>Add Your First Plant</AddPlantButton>
        </Link>
      )}
    </EmptyContainer>
  );
};

export default EmptyTasks;
