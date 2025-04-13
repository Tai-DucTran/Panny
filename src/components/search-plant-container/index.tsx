"use client";

import { usePlantInfo } from "@/hooks/fetching-data/use-plant-info";
import { Plant } from "@/models/plant";
import { useState } from "react";

export default function SearchPlantContainer() {
  const [plantSpecies, setPlantSpecies] = useState("");
  const [plantInfo, setPlantInfo] = useState<{
    description: string;
    data: Partial<Plant>;
  }>({
    description: "",
    data: {},
  });
  const { fetchPlantInfo, loading, error } = usePlantInfo();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlantSpecies(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plantSpecies.trim()) return;

    const response = await fetchPlantInfo(plantSpecies);

    if (response) {
      setPlantInfo({
        description: response.description,
        data: response.plantData,
      });
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Add New Plant</h1>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label htmlFor="plantSpecies" className="block mb-2 font-medium">
            Plant Species:
          </label>
          <input
            id="plantSpecies"
            type="text"
            value={plantSpecies}
            onChange={handleInputChange}
            placeholder="e.g., Monstera deliciosa"
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-md"
          disabled={loading || !plantSpecies.trim()}
        >
          {loading ? "Loading..." : "Get Plant Info"}
        </button>
      </form>

      {error && (
        <div className="p-4 mb-4 bg-red-100 border-l-4 border-red-500 text-red-700">
          {error}
        </div>
      )}

      {plantInfo.description && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-3">Plant Description</h2>
          <div className="p-4 bg-green-50 rounded-md mb-6">
            {plantInfo.description}
          </div>

          <h2 className="text-xl font-semibold mb-3">Plant Data</h2>
          <pre className="p-4 bg-gray-100 rounded-md overflow-auto">
            {JSON.stringify(plantInfo.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
