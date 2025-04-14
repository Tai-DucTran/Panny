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

interface PlantDetailsProps {
  plantId: string;
}

const defaultImageUrl = "/images/plants/normal-plants/plant-1.jpg";

const PlantDetails: React.FC<PlantDetailsProps> = ({ plantId }) => {
  const { plants, fetchPlants, isLoading } = usePlantStore();
  const [plant, setPlant] = useState<Plant | null>(null);

  useEffect(() => {
    const loadPlant = async () => {
      if (plants.length === 0) {
        await fetchPlants();
      }

      // Find the plant with the matching ID
      const foundPlant = plants.find((p) => p.id === plantId);
      setPlant(foundPlant || null);
    };

    loadPlant();
  }, [plantId, plants, fetchPlants]);

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

      <DetailsSection>
        <SectionTitle>Sunlight Needs</SectionTitle>
        <DetailItem>
          <DetailItemValue>{plant.sunlightNeeds || "Unknown"}</DetailItemValue>
        </DetailItem>
      </DetailsSection>

      <DetailsSection>
        <SectionTitle>Sensitivity Factors</SectionTitle>
        <DetailsList>
          {plant.sensitivityFactors && plant.sensitivityFactors.length > 0 ? (
            plant.sensitivityFactors.map((factor, index) => (
              <DetailItem key={index}>
                <DetailItemValue>{factor}</DetailItemValue>
              </DetailItem>
            ))
          ) : (
            <DetailItem>
              <DetailItemValue>No sensitivity factors listed</DetailItemValue>
            </DetailItem>
          )}
        </DetailsList>
      </DetailsSection>
    </div>
  );
};

export default PlantDetails;
