// src/components/add-plant-form/step-one.tsx
import React from "react";

import {
  StepContainer,
  FormGroup,
  StyledLabel,
  StyledInput,
  StepTitle,
  StyledSelect,
} from "./index.sc";
import { Plant } from "@/models/plant";

export enum AcquiredTimeOption {
  JUST_BOUGHT = "just_bought",
  LAST_WEEK = "last_week",
  LONG_TIME_AGO = "long_time_ago",
}

interface StepOneProps {
  formData: Partial<Plant>;
  updateFormData: (data: Partial<Plant>) => void;
}

const StepOne: React.FC<StepOneProps> = ({ formData, updateFormData }) => {
  return (
    <StepContainer>
      <StepTitle>General Information</StepTitle>

      <FormGroup>
        <StyledLabel htmlFor="name">Plant Name*</StyledLabel>
        <StyledInput
          id="name"
          type="text"
          value={formData.name || ""}
          onChange={(e) => updateFormData({ name: e.target.value })}
          placeholder="e.g., My Swiss Cheese Plant"
          required
        />
      </FormGroup>

      <FormGroup>
        <StyledLabel htmlFor="acquiredTimeOption">
          When did you get this plant?
        </StyledLabel>
        <StyledSelect
          id="acquiredTimeOption"
          value={formData.acquiredTimeOption || AcquiredTimeOption.JUST_BOUGHT}
          onChange={(e) =>
            updateFormData({
              acquiredTimeOption: e.target.value as AcquiredTimeOption,
            })
          }
        >
          <option value={AcquiredTimeOption.JUST_BOUGHT}>
            {`I've just bought it`}
          </option>
          <option value={AcquiredTimeOption.LAST_WEEK}>
            {`I've had/planted it last week`}
          </option>
          <option value={AcquiredTimeOption.LONG_TIME_AGO}>
            {`I don't remember; I planted/bought it very long time ago`}
          </option>
        </StyledSelect>
      </FormGroup>
    </StepContainer>
  );
};

export default StepOne;
