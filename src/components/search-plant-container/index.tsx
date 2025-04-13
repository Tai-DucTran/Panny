"use client";

import { usePlantInfo } from "@/hooks/fetching-data/use-plant-info";
import { Plant } from "@/models/plant";
import { useState } from "react";
import * as S from "./index.sc";

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
    <S.Container>
      <S.Title>Add New Plant</S.Title>

      <S.Form onSubmit={handleSubmit}>
        <S.FormGroup>
          <S.Label htmlFor="plantSpecies">Plant Species:</S.Label>
          <S.Input
            id="plantSpecies"
            type="text"
            value={plantSpecies}
            onChange={handleInputChange}
            placeholder="e.g., Monstera deliciosa"
            required
          />
        </S.FormGroup>

        <S.Button type="submit" disabled={loading || !plantSpecies.trim()}>
          {loading ? "Loading..." : "Get Plant Info"}
        </S.Button>
      </S.Form>

      {error && <S.ErrorContainer>{error}</S.ErrorContainer>}

      {plantInfo.description && (
        <S.InfoSection>
          <S.SectionTitle>Plant Description</S.SectionTitle>
          <S.DescriptionBox>{plantInfo.description}</S.DescriptionBox>

          <S.SectionTitle>Plant Data</S.SectionTitle>
          <S.CodeBox>{JSON.stringify(plantInfo.data, null, 2)}</S.CodeBox>
        </S.InfoSection>
      )}
    </S.Container>
  );
}
