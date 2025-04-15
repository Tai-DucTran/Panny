import React from "react";
import {
  StepContainer,
  FormGroup,
  StyledLabel,
  StyledSelect,
  StepTitle,
  StyledInput,
} from "./index.sc";

import { LightExposure, Plant, PlantLocationType } from "@/models/plant";

interface StepTwoProps {
  formData: Partial<Plant>;
  updateFormData: (data: Partial<Plant>) => void;
}

const StepTwo: React.FC<StepTwoProps> = ({ formData, updateFormData }) => {
  // Helper function to safely update location properties
  const updateLocation = (
    updates: Partial<{
      type: PlantLocationType;
      room: string;
      lightExposure: LightExposure;
    }>
  ) => {
    const currentLocation = formData.location || {
      type: PlantLocationType.INDOOR,
    };

    updateFormData({
      location: {
        ...currentLocation,
        ...updates,
      },
    });
  };

  return (
    <StepContainer>
      <StepTitle>Current Condition</StepTitle>

      <FormGroup>
        <StyledLabel htmlFor="locationType">
          Where is your plant located?
        </StyledLabel>
        <StyledSelect
          id="locationType"
          value={formData.location?.type || PlantLocationType.INDOOR}
          onChange={(e) =>
            updateLocation({ type: e.target.value as PlantLocationType })
          }
        >
          <option value={PlantLocationType.INDOOR}>Indoor</option>
          <option value={PlantLocationType.OUTDOOR}>Outdoor</option>
        </StyledSelect>
      </FormGroup>

      <FormGroup>
        <StyledLabel htmlFor="room">Which room/area?</StyledLabel>
        <StyledInput
          id="room"
          type="text"
          value={formData.location?.room || ""}
          onChange={(e) => updateLocation({ room: e.target.value })}
          placeholder="e.g., Living Room, Balcony"
        />
      </FormGroup>

      <FormGroup>
        <StyledLabel htmlFor="lightExposure">
          Light exposure in this location?
        </StyledLabel>
        <StyledSelect
          id="lightExposure"
          value={formData.location?.lightExposure || LightExposure.MEDIUM}
          onChange={(e) =>
            updateLocation({ lightExposure: e.target.value as LightExposure })
          }
        >
          <option value={LightExposure.LOW}>Low Light</option>
          <option value={LightExposure.MEDIUM}>Medium Light</option>
          <option value={LightExposure.BRIGHT}>Bright Light</option>
          <option value={LightExposure.DIRECT_SUN}>Direct Sunlight</option>
        </StyledSelect>
      </FormGroup>
    </StepContainer>
  );
};

export default StepTwo;
