// src/components/add-plant-form/plant-info-view.tsx
import React, { useState, useEffect, useCallback } from "react";
import { StepContainer, StepTitle } from "./index.sc";
import {
  InfoContainer,
  PlantInfoBox,
  PlantInfoHeader,
  PlantInfoText,
  ExpandableButton,
  LoadingContainer,
  LoadingText,
  MarkdownContent,
  CollapsedMarkdownContent,
} from "./plant-info-view.sc";
import { Plant } from "@/models/plant";
import { usePlantInfo } from "@/hooks/fetching-data/use-plant-info";
import { LoadingSpinner } from "@/components/spinner";
import ReactMarkdown from "react-markdown";

interface PlantInfoViewProps {
  plantName: string;
  formData: Partial<Plant>;
  updateFormData: (data: Partial<Plant>) => void;
}

const PlantInfoView: React.FC<PlantInfoViewProps> = ({
  plantName,
  formData,
  updateFormData,
}) => {
  const [expanded, setExpanded] = useState(false);
  const { fetchPlantInfo, loading } = usePlantInfo();
  const [plantDescription, setPlantDescription] = useState("");
  const [dataFetched, setDataFetched] = useState(false);

  const fetchPlantDetails = useCallback(async () => {
    if (!plantName || dataFetched) return;

    try {
      console.log("Fetching plant details for:", plantName);
      const response = await fetchPlantInfo(plantName);

      if (response) {
        console.log("Plant details received:", response);
        setPlantDescription(response.description);

        // Merge the AI data with user data
        updateFormData({
          ...response.plantData,
          // Keep user inputs
          name: formData.name,
          species: response.plantData.species || formData.name,
          nickname: formData.nickname,
          imageUrl: formData.imageUrl,
          location: formData.location,
          acquiredTimeOption: formData.acquiredTimeOption,
        });

        setDataFetched(true);
      }
    } catch (error) {
      console.error("Error fetching plant info:", error);
      setDataFetched(true); // Mark as fetched even on error to avoid infinite loops
    }
  }, [fetchPlantInfo, plantName, formData, updateFormData, dataFetched]);

  useEffect(() => {
    fetchPlantDetails();
  }, [fetchPlantDetails]);

  // Determine if we should show loading
  const isLoading = loading || (!dataFetched && !plantDescription);

  return (
    <StepContainer>
      <StepTitle>Plant Information</StepTitle>

      {isLoading ? (
        <LoadingContainer>
          <LoadingSpinner size="medium" />
          <LoadingText>Gathering information about your plant...</LoadingText>
        </LoadingContainer>
      ) : (
        <InfoContainer>
          <PlantInfoBox>
            <PlantInfoHeader>{plantName}</PlantInfoHeader>
            <PlantInfoText>
              {expanded ? (
                <MarkdownContent>
                  <ReactMarkdown>{plantDescription}</ReactMarkdown>
                </MarkdownContent>
              ) : (
                <CollapsedMarkdownContent>
                  <ReactMarkdown>{plantDescription}</ReactMarkdown>
                </CollapsedMarkdownContent>
              )}
              <ExpandableButton onClick={() => setExpanded(!expanded)}>
                {expanded ? "Show Less" : "Read More"}
              </ExpandableButton>
            </PlantInfoText>
          </PlantInfoBox>
        </InfoContainer>
      )}
    </StepContainer>
  );
};

export default PlantInfoView;
