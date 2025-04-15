"use client";
import GardenList from "@/components/garden-page/garden-list";
import GuestNotification from "@/components/guest-notification";

import Spacer from "@/components/utils/spacer/spacer";
import { usePlantStore } from "@/store/plant-store";
import { useEffect, useState } from "react";

export default function Home() {
  const { plants, fetchPlants } = usePlantStore();
  const [plantsLoaded, setPlantsLoaded] = useState(false);

  useEffect(() => {
    const loadPlants = async () => {
      await fetchPlants();
      setPlantsLoaded(true);
    };

    loadPlants();
  }, [fetchPlants]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <h1>Your Garden</h1>
      </div>

      {plantsLoaded && plants.length > 0 && <GuestNotification />}

      <Spacer size={24} />
      <GardenList />
    </div>
  );
}
