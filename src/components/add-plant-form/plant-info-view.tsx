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
import { HealthStatus, Plant } from "@/models/plant";
import { usePlantInfo } from "@/hooks/fetching-data/use-plant-info";
import { LoadingSpinner } from "@/components/spinner";
import ReactMarkdown from "react-markdown";
import TakeCareRecommendation from "./take-care-recommendation";
import { Timestamp } from "firebase/firestore";
import { AcquiredTimeOption } from "./step-one";

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
  const [diagnosis, setDiagnosis] = useState("");

  const fetchPlantDetails = useCallback(async () => {
    if (!plantName || dataFetched) return;

    try {
      console.log("Fetching plant details for:", plantName);

      // Include health status and notes if plant isn't in good health
      const needsDiagnosis =
        formData.healthStatus &&
        (formData.healthStatus === HealthStatus.FAIR ||
          formData.healthStatus === HealthStatus.POOR ||
          formData.healthStatus === HealthStatus.CRITICAL);

      const response = await fetchPlantInfo(
        plantName,
        needsDiagnosis ? formData.healthStatus : undefined,
        needsDiagnosis ? formData.notes : undefined
      );

      if (response) {
        console.log("Plant details received:", response);
        setPlantDescription(response.description);

        // Calculate lastRepotted date for newly purchased plants
        let lastRepottedDate;
        if (
          formData.acquiredTimeOption === AcquiredTimeOption.JUST_BOUGHT &&
          response.plantData.repottingFrequency
        ) {
          // For newly purchased plants, set lastRepotted to current date + 1 month
          const now = new Date();
          now.setMonth(now.getMonth() + 1);
          lastRepottedDate = Timestamp.fromDate(now);
        }

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
          healthStatus: formData.healthStatus, // Keep user-provided health status
          notes: formData.notes, // Keep user-provided notes
          lastRepotted: lastRepottedDate || formData.lastRepotted,
        });

        // If we received diagnosis information, set it in the TakeCareRecommendation component
        if (response.diagnosis) {
          // Store diagnosis in a state variable that will be passed to TakeCareRecommendation
          setDiagnosis(response.diagnosis);
        }

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
        <>
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

          {/* Add TakeCareRecommendation component if plant health is not optimal */}
          {formData.healthStatus &&
            (formData.healthStatus === HealthStatus.FAIR ||
              formData.healthStatus === HealthStatus.POOR ||
              formData.healthStatus === HealthStatus.CRITICAL) && (
              <TakeCareRecommendation
                healthStatus={formData.healthStatus}
                diagnosis={diagnosis}
              />
            )}
        </>
      )}
    </StepContainer>
  );
};

export default PlantInfoView;
