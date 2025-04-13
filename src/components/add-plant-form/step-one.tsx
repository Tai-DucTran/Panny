// src/components/AddPlantForm/StepOne.tsx
import React from "react";

import {
  StepContainer,
  FormGroup,
  StyledLabel,
  StyledInput,
  StepTitle,
} from "./index.sc";
import { Plant } from "@/models/plant";

interface StepOneProps {
  formData: Partial<Plant>;
  updateFormData: (data: Partial<Plant>) => void;
}

const StepOne: React.FC<StepOneProps> = ({ formData, updateFormData }) => {
  return (
    <StepContainer>
      <StepTitle>General Information</StepTitle>

      <FormGroup>
        <StyledLabel htmlFor="name">Common Name*</StyledLabel>
        <StyledInput
          id="name"
          type="text"
          value={formData.name || ""}
          onChange={(e) => updateFormData({ name: e.target.value })}
          placeholder="e.g., Swiss Cheese Plant"
          required
        />
      </FormGroup>

      <FormGroup>
        <StyledLabel htmlFor="acquiredDate">
          When did you get this plant?
        </StyledLabel>
        <StyledInput
          id="acquiredDate"
          type="date"
          value={
            formData.acquiredDate
              ? new Date(formData.acquiredDate).toISOString().substring(0, 10)
              : ""
          }
          onChange={(e) =>
            updateFormData({ acquiredDate: new Date(e.target.value) })
          }
        />
      </FormGroup>
    </StepContainer>
  );
};

export default StepOne;
