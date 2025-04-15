"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plant } from "@/models/plant";
import { usePlantStore } from "@/store/plant-store";
import { LoadingSpinner } from "@/components/spinner";
import {
  TopFold,
  ImageContainer,
  InfoContainer,
  InfoItem,
  InfoLabel,
  InfoValue,
  DetailsSection,
  SectionTitle,
  DetailsList,
  DetailItem,
  DetailItemValue,
  HealthStatusBadge,
} from "./index.sc";
import { formatTimestamp } from "@/utils/timestamp-utils";
import { AppBar } from "../app-bar/indext";
import Spacer from "../utils/spacer/spacer";
import { toTitleCase } from "@/utils/string-utils";
import { MarkdownContent } from "../add-plant-form/plant-info-view.sc";
import PlantTasks from "./plant-tasks";
import { useEnhancedTaskStore } from "@/store/enhanced-task-store";

interface PlantDetailsProps {
  plantId: string;
}

const defaultImageUrl = "/images/plants/normal-plants/plant-1.jpg";

const PlantDetails: React.FC<PlantDetailsProps> = ({ plantId }) => {
  const { plants, fetchPlants, isLoading } = usePlantStore();
  const {
    getPlantTasks,
    isLoading: tasksLoading,
    generateTasks,
  } = useEnhancedTaskStore();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const findPlantInStore = () => {
      // Check if the plant is already in the Zustand store
      const foundPlant = plants.find((p) => p.id === plantId);
      if (foundPlant) {
        setPlant(foundPlant);
        return true;
      }
      return false;
    };

    const loadPlant = async () => {
      // Try to find the plant in the store first
      if (findPlantInStore()) {
        if (!initialized) {
          generateTasks();
          setInitialized(true);
        }
        return;
      }

      // If plants array is empty, fetch plants
      if (plants.length === 0) {
        await fetchPlants();
        // After fetching, check again if we can find the plant
        if (findPlantInStore() && !initialized) {
          generateTasks();
          setInitialized(true);
        }
      }
    };

    loadPlant();
  }, [plantId, plants, fetchPlants, generateTasks, initialized]);

  if (isLoading) {
    return <LoadingSpinner size="large" />;
  }

  if (!plant) {
    return <div>Plant not found</div>;
  }

  // Process image URL with fallback
  const imageUrl =
    plant.imageUrl && plant.imageUrl.trim() !== ""
      ? plant.imageUrl
      : defaultImageUrl;

  // Get location display text
  const getLocationDisplay = () => {
    if (plant.location?.room) {
      return `${plant.location.type}: ${plant.location.room}`;
    }
    return plant.location?.type || "Unknown";
  };

  const plantTasks = getPlantTasks(plantId);

  return (
    <div>
      <AppBar title={plant.name || "Plant Details Page"} />
      <Spacer size={32} />

      <TopFold>
        <ImageContainer>
          <Image
            src={imageUrl}
            alt={plant.name || "Plant"}
            fill
            sizes="80px"
            style={{ objectFit: "cover" }}
            priority
          />
        </ImageContainer>

        <InfoContainer>
          <InfoItem>
            <InfoLabel>Last Watered:</InfoLabel>
            <InfoValue>
              {plant.lastWatered
                ? formatTimestamp(plant.lastWatered)
                : "Unknown"}
            </InfoValue>
          </InfoItem>

          <InfoItem>
            <InfoLabel>Last Repotted:</InfoLabel>
            <InfoValue>
              {plant.lastRepotted
                ? formatTimestamp(plant.lastRepotted)
                : "Unknown"}
            </InfoValue>
          </InfoItem>

          <InfoItem>
            <InfoLabel>Location:</InfoLabel>
            <InfoValue>{getLocationDisplay()}</InfoValue>
          </InfoItem>

          <InfoItem>
            <InfoLabel>Health:</InfoLabel>
            <HealthStatusBadge status={plant.healthStatus}>
              {plant.healthStatus}
            </HealthStatusBadge>
          </InfoItem>
        </InfoContainer>
      </TopFold>

      <Spacer size={24} />

      <DetailsSection>
        <SectionTitle>Current Tasks</SectionTitle>
        <PlantTasks tasks={plantTasks} isLoading={tasksLoading} />
      </DetailsSection>

      <DetailsSection>
        <SectionTitle>Sunlight Needs</SectionTitle>
        <DetailItem>
          <DetailItemValue>
            {toTitleCase(plant.sunlightNeeds) || "Unknown"}
          </DetailItemValue>
        </DetailItem>
      </DetailsSection>

      <Spacer size={24} />

      <DetailsSection>
        <SectionTitle>Sensitivity Factors</SectionTitle>
        <DetailsList>
          {plant.sensitivityFactors && plant.sensitivityFactors.length > 0 ? (
            plant.sensitivityFactors.map((factor, index) => (
              <DetailItem key={index}>
                <DetailItemValue>{toTitleCase(factor)}</DetailItemValue>
              </DetailItem>
            ))
          ) : (
            <DetailItem>
              <DetailItemValue>No sensitivity factors listed</DetailItemValue>
            </DetailItem>
          )}
        </DetailsList>
      </DetailsSection>

      <Spacer size={24} />

      <DetailsSection>
        <SectionTitle>{`${plant.name}'s characteristics`}</SectionTitle>
        <MarkdownContent>
          {plant.plantCharacteristicDescription}
        </MarkdownContent>
      </DetailsSection>
    </div>
  );
};

export default PlantDetails;
