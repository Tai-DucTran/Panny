"use client";
import GardenList from "@/components/garden-page/garden-list";
import Spacer from "@/components/utils/spacer/spacer";

export default function Home() {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <h1>Your Garden</h1>
      </div>
      <Spacer size={24} />
      <GardenList />
    </div>
  );
}
