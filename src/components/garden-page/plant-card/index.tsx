import { HealthStatus, Plant } from "@/models/plant";
import Image from "next/image";
import Link from "next/link";
import {
  CardContainer,
  CardContent,
  CardFooter,
  ImageContainer,
  PlantName,
  PlantSpecies,
  StatusBadge,
  WateringInfo,
  WateringLabel,
  WateringStatus,
  WateringValue,
} from "./index.sc";

const defaultImageUrl = "/images/plants/normal-plants/plant-1.jpg";

export const PlantCard = ({ plant }: { plant: Plant }) => {
  // Function to get the appropriate color based on health status
  const getHealthStatusColor = (status: HealthStatus) => {
    switch (status) {
      case HealthStatus.EXCELLENT:
        return "#2E7D32"; // Dark green
      case HealthStatus.GOOD:
        return "#4CAF50"; // Green
      case HealthStatus.FAIR:
        return "#FFC107"; // Amber
      case HealthStatus.POOR:
        return "#FF5722"; // Deep Orange
      case HealthStatus.CRITICAL:
        return "#D32F2F"; // Red
      default:
        return "#4CAF50"; // Default green
    }
  };

  // Calculate days since last watered
  const getDaysSinceLastWatered = () => {
    if (!plant.lastWatered) return "Unknown";

    const lastWateredDate = plant.lastWatered.toDate();
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastWateredDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays === 0
      ? "Today"
      : `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  };

  // Determine watering status
  const getWateringStatus = () => {
    if (!plant.lastWatered || !plant.wateringFrequency) return "Unknown";

    const lastWateredDate = plant.lastWatered.toDate();
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastWateredDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= plant.wateringFrequency) {
      return "Needs water";
    } else if (diffDays >= Math.floor(plant.wateringFrequency * 0.8)) {
      return "Soon";
    } else {
      return "Watered";
    }
  };

  // Get watering status color
  const getWateringStatusColor = () => {
    const status = getWateringStatus();
    switch (status) {
      case "Needs water":
        return "#D32F2F"; // Red
      case "Soon":
        return "#FFC107"; // Amber
      case "Watered":
        return "#4CAF50"; // Green
      default:
        return "#757575"; // Grey
    }
  };

  // Process image URL with fallback
  const imageUrl =
    plant.imageUrl && plant.imageUrl.trim() !== ""
      ? plant.imageUrl
      : defaultImageUrl;

  return (
    <Link
      href={`/plant/${plant.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <CardContainer>
        <ImageContainer>
          <Image
            src={imageUrl}
            alt={plant.name || "Plant"}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            style={{
              objectFit: "cover",
              objectPosition: "center",
            }}
            loading="lazy"
            priority={false}
          />

          {/* Health status indicator */}
          <StatusBadge color={getHealthStatusColor(plant.healthStatus)}>
            {plant.healthStatus}
          </StatusBadge>
        </ImageContainer>

        <CardContent>
          <PlantName>{plant.name || "Unnamed Plant"}</PlantName>
          <PlantSpecies>
            {plant.species || plant.name || "Unknown Species"}
          </PlantSpecies>

          <CardFooter>
            <WateringInfo>
              <WateringLabel>Last watered:</WateringLabel>
              <WateringValue>{getDaysSinceLastWatered()}</WateringValue>
            </WateringInfo>

            <WateringStatus color={getWateringStatusColor()}>
              {getWateringStatus()}
            </WateringStatus>
          </CardFooter>
        </CardContent>
      </CardContainer>
    </Link>
  );
};
