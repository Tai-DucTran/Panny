"use client";

import { Plant } from "@/models/plant";
import { PlantCard } from "../plant-card";
import {
  AddPlantButton,
  EmptyGarden,
  EmptyMessage,
  EmptyTitle,
  ListOfItems,
} from "./index.sc";
import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function GardenList() {
  const listOfPlants: Plant[] = [];

  if (listOfPlants.length > 0) {
    return (
      <ListOfItems>
        {listOfPlants.map((plant, index) => (
          <PlantCard key={index} plant={plant} />
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
