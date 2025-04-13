import React from "react";

import {
  StepContainer,
  FormGroup,
  StyledLabel,
  StyledInput,
  StyledSelect,
  StepTitle,
  StyledTextarea,
  CheckboxGroup,
  StyledCheckbox,
  CheckboxLabel,
} from "./index.sc";
import { HealthStatus, Plant, SoilType } from "@/models/plant";
import { getDefaultPlantImageURL } from "./helpers";

interface StepThreeProps {
  formData: Partial<Plant>;
  updateFormData: (data: Partial<Plant>) => void;
}

const StepThree: React.FC<StepThreeProps> = ({ formData, updateFormData }) => {
  const handleLastWateredChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({
      lastWatered: e.target.value ? new Date(e.target.value) : undefined,
    });
  };

  const handleSoilTypeChange = (type: SoilType, checked: boolean) => {
    let updatedSoilTypes = [...(formData.soilType || [])];

    if (checked) {
      updatedSoilTypes.push(type);
    } else {
      updatedSoilTypes = updatedSoilTypes.filter((t) => t !== type);
    }

    updateFormData({ soilType: updatedSoilTypes });
  };

  // Function to set a random image based on health status
  const handleHealthStatusChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const status = e.target.value as HealthStatus;
    const imageUrl = getDefaultPlantImageURL(e);
    updateFormData({
      healthStatus: status,
      imageUrl: imageUrl,
      healthHistory: [
        ...(formData.healthHistory || []),
        { date: new Date(), status },
      ],
    });
  };

  return (
    <StepContainer>
      <StepTitle>Care Information</StepTitle>

      <FormGroup>
        <StyledLabel htmlFor="wateringFrequency">
          How often should this plant be watered? (days)
        </StyledLabel>
        <StyledInput
          id="wateringFrequency"
          type="number"
          min="1"
          max="90"
          value={formData.wateringFrequency || 7}
          onChange={(e) =>
            updateFormData({
              wateringFrequency: parseInt(e.target.value),
            })
          }
        />
      </FormGroup>

      <FormGroup>
        <StyledLabel htmlFor="lastWatered">
          When did you last water this plant?
        </StyledLabel>
        <StyledInput
          id="lastWatered"
          type="date"
          value={
            formData.lastWatered
              ? new Date(formData.lastWatered).toISOString().substring(0, 10)
              : ""
          }
          onChange={handleLastWateredChange}
        />
      </FormGroup>

      <FormGroup>
        <StyledLabel>Soil type (select all that apply):</StyledLabel>
        <CheckboxGroup>
          {Object.values(SoilType).map((type) => (
            <div key={type}>
              <StyledCheckbox
                id={`soil-${type}`}
                type="checkbox"
                checked={(formData.soilType || []).includes(type as SoilType)}
                onChange={(e) =>
                  handleSoilTypeChange(type as SoilType, e.target.checked)
                }
              />
              <CheckboxLabel htmlFor={`soil-${type}`}>{type}</CheckboxLabel>
            </div>
          ))}
        </CheckboxGroup>
      </FormGroup>

      <FormGroup>
        <StyledLabel htmlFor="healthStatus">
          How healthy is your plant now?
        </StyledLabel>
        <StyledSelect
          id="healthStatus"
          value={formData.healthStatus || HealthStatus.GOOD}
          onChange={handleHealthStatusChange}
        >
          <option value={HealthStatus.EXCELLENT}>Excellent - Thriving</option>
          <option value={HealthStatus.GOOD}>Good - Healthy</option>
          <option value={HealthStatus.FAIR}>Fair - Some issues</option>
          <option value={HealthStatus.POOR}>Poor - Struggling</option>
        </StyledSelect>
      </FormGroup>

      <FormGroup>
        <StyledLabel htmlFor="notes">
          Notes about your plant (optional):
        </StyledLabel>
        <StyledTextarea
          id="notes"
          value={formData.notes || ""}
          onChange={(e) => updateFormData({ notes: e.target.value })}
          placeholder="Add any special notes about caring for your plant..."
          rows={4}
        />
      </FormGroup>
    </StepContainer>
  );
};

export default StepThree;
