import React from "react";

import {
  StepContainer,
  FormGroup,
  StyledLabel,
  StyledSelect,
  StepTitle,
  PlantDescription,
} from "./index.sc";

import { LightExposure, Plant, PlantLocationType } from "@/models/plant";
import { StyledInput } from "./index.sc";

interface StepTwoProps {
  formData: Partial<Plant>;
  updateFormData: (data: Partial<Plant>) => void;
  plantDescription: string;
}

const StepTwo: React.FC<StepTwoProps> = ({
  formData,
  updateFormData,
  plantDescription,
}) => {
  return (
    <StepContainer>
      <StepTitle>Current Condition</StepTitle>

      {plantDescription && (
        <PlantDescription>
          <h4>About {formData.name}</h4>
          <p>{plantDescription}</p>
        </PlantDescription>
      )}

      <FormGroup>
        <StyledLabel htmlFor="locationType">
          Where is your plant located?
        </StyledLabel>
        <StyledSelect
          id="locationType"
          value={formData.location?.type || PlantLocationType.INDOOR}
          onChange={(e) =>
            updateFormData({
              location: {
                ...formData.location,
                type: e.target.value as PlantLocationType,
              },
            })
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
          onChange={(e) =>
            updateFormData({
              location: {
                type: formData.location?.type || PlantLocationType.INDOOR,
                ...formData.location,
                room: e.target.value,
              },
            })
          }
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
            updateFormData({
              location: {
                type: formData.location?.type || PlantLocationType.INDOOR,
                ...formData.location,
                lightExposure: e.target.value as LightExposure,
              },
            })
          }
        >
          <option value={LightExposure.LOW}>Low Light</option>
          <option value={LightExposure.MEDIUM}>Medium Light</option>
          <option value={LightExposure.BRIGHT}>Bright Light</option>
          <option value={LightExposure.DIRECT_SUN}>Direct Sunlight</option>
        </StyledSelect>
      </FormGroup>

      <FormGroup>
        <StyledLabel htmlFor="city">Your City</StyledLabel>
        <StyledInput
          id="city"
          type="text"
          value={formData.location?.city || ""}
          onChange={(e) =>
            updateFormData({
              location: {
                type: formData.location?.type || PlantLocationType.INDOOR,
                ...formData.location,
                city: e.target.value,
              },
            })
          }
          placeholder="e.g., New York"
        />
      </FormGroup>

      <FormGroup>
        <StyledLabel htmlFor="country">Your Country</StyledLabel>
        <StyledInput
          id="country"
          type="text"
          value={formData.location?.country || ""}
          onChange={(e) =>
            updateFormData({
              location: {
                type: formData.location?.type || PlantLocationType.INDOOR,
                ...formData.location,
                country: e.target.value,
              },
            })
          }
          placeholder="e.g., United States"
        />
      </FormGroup>
    </StepContainer>
  );
};

export default StepTwo;
