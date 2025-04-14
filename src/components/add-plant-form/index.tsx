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
  CareDifficulty,
} from "@/models/plant";
import { useState } from "react";
import { Timestamp } from "firebase/firestore";
import { usePlantStore } from "@/store/plant-store";

export default function AddedNewPlantForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
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

  const { fetchPlantInfo, loading: loadingPlantInfo } = usePlantInfo();
  const { addPlant, isLoading: isSubmitting } = usePlantStore();
  const [plantDescription, setPlantDescription] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

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
        imageUrl: formData.imageUrl,
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
      await onSubmit();
    }
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
      };

      console.log("Submitting plant:", plantToSubmit);

      // Add plant to Firestore via our Zustand store
      const result = await addPlant(plantToSubmit);

      if (result) {
        console.log("Plant added successfully:", result);
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

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isLoading = loadingPlantInfo || isSubmitting;

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
          <StyledButton
            type="button"
            onClick={handleBack}
            variant="secondary"
            disabled={isLoading}
          >
            Back
          </StyledButton>
        )}

        <StyledButton
          type="button"
          onClick={handleNext}
          disabled={
            (currentStep === 1 && !formData.name) || isLoading || formSubmitted
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
      </ButtonContainer>

      {/* Success Dialog */}
      <SuccessDialog
        plantName={formData.name || "Your plant"}
        isOpen={showSuccessDialog}
      />
    </StyledFormContainer>
  );
}
