"use client";

import PlantDetails from "@/components/plant-detail-page/indext";
import { useParams } from "next/navigation";

export default function PlantDetailPage() {
  const params = useParams();
  const plantId = params.id as string;

  return (
    <div>
      <PlantDetails plantId={plantId} />
    </div>
  );
}
