import React from "react";
import { Timestamp } from "firebase/firestore";
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
import {
  getDefaultPlantImageURL,
  RepottingTimeOption,
  getRepottingDateFromOption,
  getTodayForDateInput,
  getMonthsDifference,
} from "./helpers";
import {
  formatTimestampForDateInput,
  dateStringToTimestamp,
} from "@/utils/timestamp-utils";
import { theme } from "@/styles/theme";

interface StepThreeProps {
  formData: Partial<Plant>;
  updateFormData: (data: Partial<Plant>) => void;
}

const StepThree: React.FC<StepThreeProps> = ({ formData, updateFormData }) => {
  const handleLastWateredChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({
      lastWatered: e.target.value
        ? dateStringToTimestamp(e.target.value)
        : undefined,
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

  // Handle repotting time option changes - only update lastRepotted
  const handleRepottingTimeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const option = e.target.value as RepottingTimeOption;
    const repottingDate = getRepottingDateFromOption(option);

    updateFormData({
      lastRepotted: repottingDate,
    });
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
        { date: Timestamp.now(), status },
      ],
    });
  };

  // Get today's date for input max attribute
  const today = getTodayForDateInput();

  // Find the closest repotting option based on lastRepotted date, for the dropdown default value
  const getSelectedRepottingOption = (): RepottingTimeOption => {
    if (!formData.lastRepotted) return RepottingTimeOption.NEVER;

    const now = Timestamp.now();
    const monthsDiff = getMonthsDifference(formData.lastRepotted, now);

    if (monthsDiff < 1) return RepottingTimeOption.THIS_WEEK;
    if (monthsDiff < 2) return RepottingTimeOption.LAST_MONTH;
    if (monthsDiff < 4) return RepottingTimeOption.THREE_MONTHS_AGO;
    if (monthsDiff < 9) return RepottingTimeOption.SIX_MONTHS_AGO;
    if (monthsDiff < 15) return RepottingTimeOption.TWELVE_MONTHS_AGO;
    return RepottingTimeOption.NEVER;
  };

  const selectedRepottingOption = getSelectedRepottingOption();

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
          value={formData.wateringFrequency || 2}
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
          max={today}
          value={formatTimestampForDateInput(formData.lastWatered)}
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
        <StyledLabel htmlFor="repottingTime">
          When was the last time you repotted this plant?
        </StyledLabel>
        <StyledSelect
          id="repottingTime"
          value={selectedRepottingOption}
          onChange={handleRepottingTimeChange}
        >
          <option value={RepottingTimeOption.THIS_WEEK}>
            {`I've repotted it this week`}
          </option>
          <option value={RepottingTimeOption.LAST_MONTH}>Last month</option>
          <option value={RepottingTimeOption.THREE_MONTHS_AGO}>
            3 months ago
          </option>
          <option value={RepottingTimeOption.SIX_MONTHS_AGO}>
            6 months ago
          </option>
          <option value={RepottingTimeOption.TWELVE_MONTHS_AGO}>
            12 months ago
          </option>
          <option value={RepottingTimeOption.NEVER}>
            I never did that within the last 12 months
          </option>
        </StyledSelect>
      </FormGroup>

      <FormGroup>
        <StyledLabel
          htmlFor="healthStatus"
          style={{
            color: theme.colors.palette.bigFootFeet,
            fontWeight: "bolder",
          }}
        >
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
        <StyledLabel
          htmlFor="notes"
          style={{
            color: theme.colors.palette.bigFootFeet,
            fontWeight: "bolder",
          }}
        >
          Tell Panny about your plant condition (recommend):
        </StyledLabel>
        <StyledTextarea
          id="notes"
          value={formData.notes || ""}
          onChange={(e) => updateFormData({ notes: e.target.value })}
          placeholder="Add any special notes about your current plant health..."
          rows={4}
        />
      </FormGroup>
    </StepContainer>
  );
};

export default StepThree;
