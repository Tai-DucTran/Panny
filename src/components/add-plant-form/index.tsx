"use client";
import {
  ButtonContainer,
  FormTitle,
  StepConnector,
  StepDot,
  StepIndicator,
  StyledButton,
  StyledFormContainer,
} from "@/components/add-plant-form/index.sc";
import StepOne, {
  AcquiredTimeOption,
} from "@/components/add-plant-form/step-one";
import StepThree from "@/components/add-plant-form/step-three";
import StepTwo from "@/components/add-plant-form/step-two";
import PlantInfoView from "@/components/add-plant-form/plant-info-view";
import SuccessDialog from "@/components/add-plant-form/success-dialog";
import {
  Plant,
  PlantLocationType,
  LightExposure,
  HealthStatus,
  CareDifficulty,
} from "@/models/plant";
import { useState } from "react";
import { Timestamp } from "firebase/firestore";
import { usePlantStore } from "@/store/plant-store";

export default function AddedNewPlantForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showPlantInfo, setShowPlantInfo] = useState(false);
  const [formData, setFormData] = useState<Partial<Plant>>({
    name: "",
    species: "",
    nickname: "",
    imageUrl: "",
    acquiredTimeOption: AcquiredTimeOption.JUST_BOUGHT,
    location: {
      type: PlantLocationType.INDOOR,
      lightExposure: LightExposure.MEDIUM,
    },
    healthStatus: HealthStatus.GOOD,
    healthHistory: [
      {
        date: Timestamp.now(),
        status: HealthStatus.GOOD,
      },
    ],
  });

  const { addPlant, isLoading: isSubmitting } = usePlantStore();
  const [formSubmitted, setFormSubmitted] = useState(false);

  const updateFormData = (data: Partial<Plant>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = async () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // After step 3, show the plant info view
      setShowPlantInfo(true);
    }
  };

  const handleBack = () => {
    if (showPlantInfo) {
      // If on plant info view, go back to step 3
      setShowPlantInfo(false);
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    await onSubmit();
  };

  const onSubmit = async () => {
    if (formSubmitted) return; // Prevent multiple submissions
    setFormSubmitted(true);

    try {
      // Ensure we have required fields
      if (
        !formData.name ||
        !formData.careDifficulty ||
        !formData.sunlightNeeds ||
        !formData.humidityPreference
      ) {
        throw new Error("Missing required plant information");
      }

      const plantToSubmit: Plant = {
        id: Date.now().toString(),
        name: formData.name || "",
        species: formData.species || formData.name || "",
        nickname: formData.nickname || "",
        imageUrl: formData.imageUrl || "",
        acquiredTimeOption:
          formData.acquiredTimeOption || AcquiredTimeOption.JUST_BOUGHT,
        location: formData.location || {
          type: PlantLocationType.INDOOR,
        },
        careDifficulty: formData.careDifficulty || CareDifficulty.MODERATE,
        sensitivityFactors: formData.sensitivityFactors || [],
        wateringFrequency: formData.wateringFrequency || 7,
        lastWatered: formData.lastWatered || Timestamp.now(),
        sunlightNeeds: formData.sunlightNeeds!,
        humidityPreference: formData.humidityPreference!,
        temperature: formData.temperature || {
          min: 15,
          max: 30,
          ideal: 22,
        },
        soilType: formData.soilType || [],
        lastRepotted: formData.lastRepotted || Timestamp.now(),
        repottingFrequency: formData.repottingFrequency || 12,
        healthStatus: formData.healthStatus || HealthStatus.GOOD,
        healthHistory: formData.healthHistory || [
          {
            date: Timestamp.now(),
            status: HealthStatus.GOOD,
          },
        ],
        notes: formData.notes || "",
        toxicity: formData.toxicity,
        growthHabit: formData.growthHabit,
        origin: formData.origin || "",
        plantCharacteristicDescription:
          formData.plantCharacteristicDescription || "",
      };

      // Add plant to Firestore via our Zustand store
      const result = await addPlant(plantToSubmit);

      if (result) {
        setShowSuccessDialog(true);
      } else {
        console.error("Failed to add plant");
        setFormSubmitted(false);
      }
    } catch (error) {
      console.error("Error submitting plant:", error);
      setFormSubmitted(false);
    }
  };

  const isLoading = isSubmitting;

  return (
    <StyledFormContainer>
      <FormTitle>Add a New Plant</FormTitle>

      {!showPlantInfo && (
        <StepIndicator>
          <StepDot active={currentStep >= 1}>1</StepDot>
          <StepConnector active={currentStep >= 2} />
          <StepDot active={currentStep >= 2}>2</StepDot>
          <StepConnector active={currentStep >= 3} />
          <StepDot active={currentStep >= 3}>3</StepDot>
        </StepIndicator>
      )}

      {!showPlantInfo ? (
        <>
          {currentStep === 1 && (
            <StepOne formData={formData} updateFormData={updateFormData} />
          )}

          {currentStep === 2 && (
            <StepTwo formData={formData} updateFormData={updateFormData} />
          )}

          {currentStep === 3 && (
            <StepThree formData={formData} updateFormData={updateFormData} />
          )}
        </>
      ) : (
        <PlantInfoView
          plantName={formData.name || ""}
          formData={formData}
          updateFormData={updateFormData}
        />
      )}

      <ButtonContainer>
        <StyledButton
          type="button"
          onClick={handleBack}
          variant="secondary"
          disabled={isLoading || currentStep === 1}
        >
          Back
        </StyledButton>

        {!showPlantInfo ? (
          <StyledButton
            type="button"
            onClick={handleNext}
            disabled={
              (currentStep === 1 && !formData.name) ||
              isLoading ||
              formSubmitted
            }
            variant="primary"
          >
            {isLoading ? (
              <>Loading...</>
            ) : currentStep === 3 ? (
              "Add Plant"
            ) : (
              "Next"
            )}
          </StyledButton>
        ) : (
          <StyledButton
            type="button"
            onClick={handleComplete}
            disabled={isLoading || formSubmitted}
            variant="primary"
          >
            Complete
          </StyledButton>
        )}
      </ButtonContainer>

      {/* Success Dialog */}
      <SuccessDialog
        plantName={formData.name || "Your plant"}
        isOpen={showSuccessDialog}
      />
    </StyledFormContainer>
  );
}
