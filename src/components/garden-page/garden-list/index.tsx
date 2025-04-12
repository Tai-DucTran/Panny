"use client";

import { PlantCard } from "../plant-card";
import { ListOfItems } from "./index.sc";

export default function GardenList() {
  return (
    <ListOfItems>
      <PlantCard
        plant={{
          name: "Monstera Deliciosa",
          imageUrl: "/images/plants/normal-plants/plant-3.jpg",
          healthCondition: "Good",
          waterNeed: "Medium",
        }}
      />
      <PlantCard
        plant={{
          name: "Monstera Deliciosa",
          imageUrl: "/images/plants/normal-plants/plant-2.jpg",
          healthCondition: "Good",
          waterNeed: "Medium",
        }}
      />
      <PlantCard
        plant={{
          name: "Monstera Deliciosa",
          imageUrl: "/images/plants/illness-plants/illness-plant-3.jpg",
          healthCondition: "Low",
          waterNeed: "Medium",
        }}
      />
      <PlantCard
        plant={{
          name: "Monstera Deliciosa",
          imageUrl: "/images/plants/illness-plants/illness-plant-2.jpg",
          healthCondition: "Low",
          waterNeed: "Low",
        }}
      />
    </ListOfItems>
  );
}
