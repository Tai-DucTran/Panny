"use client";

import { PlantCard } from "../plant-card";
import {
  AddPlantButton,
  EmptyGarden,
  EmptyMessage,
  EmptyTitle,
  ListOfItems,
} from "./index.sc";
import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePlantStore } from "@/store/plant-store";
import { LoadingSpinner } from "@/components/spinner";
import { HealthStatus } from "@/models/plant";

const healthStatusOrder: HealthStatus[] = [
  HealthStatus.CRITICAL,
  HealthStatus.POOR,
  HealthStatus.FAIR,
  HealthStatus.GOOD,
  HealthStatus.EXCELLENT,
];

export default function GardenList() {
  const { plants, fetchPlants, isLoading } = usePlantStore();

  const sortedPlants = [...plants].sort((a, b) => {
    const indexA = healthStatusOrder.indexOf(a.healthStatus);
    const indexB = healthStatusOrder.indexOf(b.healthStatus);
    return indexA - indexB; // Sorts in ascending order based on the index in healthStatusOrder
  });

  useEffect(() => {
    const loadPlants = async () => {
      await fetchPlants();
    };

    loadPlants();
  }, [fetchPlants]);

  if (isLoading) {
    return <LoadingSpinner size="large" />;
  }

  if (sortedPlants.length > 0) {
    return (
      <ListOfItems>
        {sortedPlants.map((plant) => (
          <PlantCard key={plant.id} plant={plant} />
        ))}
      </ListOfItems>
    );
  } else {
    return (
      <EmptyGarden>
        <Image
          src="/images/panny-baby-logo.webp"
          alt="panny-baby-logo"
          width={200}
          height={200}
          loading="lazy"
        />
        <EmptyTitle>Your garden is empty</EmptyTitle>
        <EmptyMessage>
          Start building your plant collection by adding your first plant. Track
          watering schedules, monitor growth, and get personalized care
          recommendations.
        </EmptyMessage>
        <Link href="/add-new-plant">
          <AddPlantButton>Add Your First Plant</AddPlantButton>
        </Link>
      </EmptyGarden>
    );
  }
}
