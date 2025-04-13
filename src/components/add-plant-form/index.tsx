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
import SuccessDialog from "@/components/add-plant-form/success-dialog";
import { usePlantInfo } from "@/hooks/fetching-data/use-plant-info";
import {
  Plant,
  PlantLocationType,
  LightExposure,
  HealthStatus,
} from "@/models/plant";
import { useState } from "react";

export default function AddedNewPlantForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [formData, setFormData] = useState<Partial<Plant>>({
    name: "",
    species: "",
    nickname: "",
    acquiredTimeOption: AcquiredTimeOption.JUST_BOUGHT,
    location: {
      type: PlantLocationType.INDOOR,
      lightExposure: LightExposure.MEDIUM,
    },
    healthStatus: HealthStatus.GOOD,
    healthHistory: [
      {
        date: new Date(),
        status: HealthStatus.GOOD,
      },
    ],
  });

  const { fetchPlantInfo, loading } = usePlantInfo();
  const [plantDescription, setPlantDescription] = useState("");

  const updateFormData = (data: Partial<Plant>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const fetchPlantDetails = async () => {
    if (!formData.name) return;

    // Use the plant name to fetch species info from Gemini
    const response = await fetchPlantInfo(formData.name);

    if (response) {
      setPlantDescription(response.description);
      // Merge the AI data with user data, but don't overwrite user inputs
      updateFormData({
        ...response.plantData,
        // Keep user inputs
        name: formData.name,
        species: response.plantData.species || formData.name, // Use Gemini's identified species or default to name
        nickname: formData.nickname,
        location: formData.location,
        acquiredTimeOption: formData.acquiredTimeOption,
      });
    }
  };

  const handleNext = async () => {
    if (currentStep === 1 && formData.name) {
      // Fetch plant data when moving from step 1 to step 2
      await fetchPlantDetails();
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // On final submit
      const newPlant: Plant = {
        id: Date.now().toString(),
        name: formData.name || "",
        species: formData.species || formData.name || "",
        nickname: formData.nickname,
        acquiredTimeOption:
          formData.acquiredTimeOption || AcquiredTimeOption.JUST_BOUGHT,
        location: formData.location || {
          type: PlantLocationType.INDOOR,
        },
        careDifficulty: formData.careDifficulty!,
        sensitivityFactors: formData.sensitivityFactors || [],
        wateringFrequency: formData.wateringFrequency || 7,
        lastWatered: formData.lastWatered,
        sunlightNeeds: formData.sunlightNeeds!,
        humidityPreference: formData.humidityPreference!,
        temperature: formData.temperature || {
          min: 15,
          max: 30,
          ideal: 22,
        },
        soilType: formData.soilType || [],
        lastRepotted: formData.lastRepotted,
        repottingFrequency: formData.repottingFrequency || 12,
        healthStatus: formData.healthStatus || HealthStatus.GOOD,
        healthHistory: formData.healthHistory || [
          {
            date: new Date(),
            status: HealthStatus.GOOD,
          },
        ],
        notes: formData.notes,
        toxicity: formData.toxicity,
        growthHabit: formData.growthHabit,
        origin: formData.origin,
      };

      onSubmit(newPlant);
    }
  };

  const onSubmit = (newPlant: Plant) => {
    console.log("DEBUG in creating new plant", newPlant);
    // Here you would typically save the plant to your database or state
    // For now, just show the success dialog
    setShowSuccessDialog(true);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <StyledFormContainer>
      <FormTitle>Add a New Plant</FormTitle>

      <StepIndicator>
        <StepDot active={currentStep >= 1}>1</StepDot>
        <StepConnector active={currentStep >= 2} />
        <StepDot active={currentStep >= 2}>2</StepDot>
        <StepConnector active={currentStep >= 3} />
        <StepDot active={currentStep >= 3}>3</StepDot>
      </StepIndicator>

      {currentStep === 1 && (
        <StepOne formData={formData} updateFormData={updateFormData} />
      )}

      {currentStep === 2 && (
        <StepTwo
          formData={formData}
          updateFormData={updateFormData}
          plantDescription={plantDescription}
        />
      )}

      {currentStep === 3 && (
        <StepThree formData={formData} updateFormData={updateFormData} />
      )}

      <ButtonContainer>
        {currentStep > 1 && (
          <StyledButton type="button" onClick={handleBack} variant="secondary">
            Back
          </StyledButton>
        )}

        <StyledButton
          type="button"
          onClick={handleNext}
          disabled={(currentStep === 1 && !formData.name) || loading}
          variant="primary"
        >
          {loading ? "Loading..." : currentStep === 3 ? "Add Plant" : "Next"}
        </StyledButton>
      </ButtonContainer>

      {/* Success Dialog */}
      <SuccessDialog
        plantName={formData.name || "Your plant"}
        isOpen={showSuccessDialog}
      />
    </StyledFormContainer>
  );
}
