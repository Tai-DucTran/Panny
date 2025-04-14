"use client";

import { useParams } from "next/navigation";

export default function EditPlantPage() {
  const params = useParams();
  const plantId = params.id as string;

  return (
    <div>
      <h1>Edit Plant</h1>
      <p>Edit form for plant ID: {plantId}</p>
      {/* 
        TODO: Implement plant edit form.
        This will be similar to the AddPlantForm but pre-populated with the plant data.
      */}
    </div>
  );
}
