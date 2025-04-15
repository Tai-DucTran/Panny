import React from "react";
import { Timestamp } from "firebase/firestore";
import {
  StepContainer,
  FormGroup,
  StyledLabel,
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
  getMonthsDifference,
} from "./helpers";
import { theme } from "@/styles/theme";
import { AcquiredTimeOption } from "./step-one";

// Define watering time options
enum LastWateredOption {
  TODAY = "today",
  YESTERDAY = "yesterday",
  TWO_DAYS_AGO = "two_days_ago",
  THREE_DAYS_AGO = "three_days_ago",
  SEVEN_DAYS_AGO = "seven_days_ago",
  DONT_REMEMBER = "dont_remember",
}

interface StepThreeProps {
  formData: Partial<Plant>;
  updateFormData: (data: Partial<Plant>) => void;
}

const StepThree: React.FC<StepThreeProps> = ({ formData, updateFormData }) => {
  // Handle last watered date selection
  const handleLastWateredChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const option = e.target.value as LastWateredOption;
    const now = new Date();
    let lastWateredDate: Date;

    switch (option) {
      case LastWateredOption.TODAY:
        lastWateredDate = now;
        break;
      case LastWateredOption.YESTERDAY:
        lastWateredDate = new Date(now);
        lastWateredDate.setDate(now.getDate() - 1);
        break;
      case LastWateredOption.TWO_DAYS_AGO:
        lastWateredDate = new Date(now);
        lastWateredDate.setDate(now.getDate() - 2);
        break;
      case LastWateredOption.THREE_DAYS_AGO:
        lastWateredDate = new Date(now);
        lastWateredDate.setDate(now.getDate() - 3);
        break;
      case LastWateredOption.SEVEN_DAYS_AGO:
        lastWateredDate = new Date(now);
        lastWateredDate.setDate(now.getDate() - 7);
        break;
      case LastWateredOption.DONT_REMEMBER:
        lastWateredDate = new Date(now);
        lastWateredDate.setDate(now.getDate() - 14);
        break;
      default:
        lastWateredDate = now;
    }

    updateFormData({
      lastWatered: Timestamp.fromDate(lastWateredDate),
    });
  };

  // Get the selected last watered option based on the timestamp
  const getSelectedLastWateredOption = (): LastWateredOption => {
    if (!formData.lastWatered) return LastWateredOption.DONT_REMEMBER;

    const lastWateredDate = formData.lastWatered.toDate();
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastWateredDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Check if it's today (same day)
    if (
      lastWateredDate.getDate() === now.getDate() &&
      lastWateredDate.getMonth() === now.getMonth() &&
      lastWateredDate.getFullYear() === now.getFullYear()
    ) {
      return LastWateredOption.TODAY;
    }

    // Check other options
    switch (diffDays) {
      case 1:
        return LastWateredOption.YESTERDAY;
      case 2:
        return LastWateredOption.TWO_DAYS_AGO;
      case 3:
        return LastWateredOption.THREE_DAYS_AGO;
      case 7:
        return LastWateredOption.SEVEN_DAYS_AGO;
      default:
        if (diffDays > 10) {
          return LastWateredOption.DONT_REMEMBER;
        }
        // Find the closest option
        if (diffDays < 2) return LastWateredOption.YESTERDAY;
        if (diffDays < 3) return LastWateredOption.TWO_DAYS_AGO;
        if (diffDays < 5) return LastWateredOption.THREE_DAYS_AGO;
        return LastWateredOption.SEVEN_DAYS_AGO;
    }
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
  const selectedLastWateredOption = getSelectedLastWateredOption();

  // Check if the plant was just bought
  const isNewlyBought =
    formData.acquiredTimeOption === AcquiredTimeOption.JUST_BOUGHT;

  return (
    <StepContainer>
      <StepTitle>Care Information</StepTitle>

      <FormGroup>
        <StyledLabel htmlFor="wateringFrequency">
          How often should this plant be watered? (days)
        </StyledLabel>
        <StyledSelect
          id="wateringFrequency"
          value={formData.wateringFrequency || 7}
          onChange={(e) =>
            updateFormData({
              wateringFrequency: parseInt(e.target.value),
            })
          }
        >
          {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
            <option key={day} value={day}>
              {day === 1 ? "Every day" : `Every ${day} days`}
            </option>
          ))}
        </StyledSelect>
      </FormGroup>

      <FormGroup>
        <StyledLabel htmlFor="lastWatered">
          When did you last water this plant?
        </StyledLabel>
        <StyledSelect
          id="lastWatered"
          value={selectedLastWateredOption}
          onChange={handleLastWateredChange}
        >
          <option value={LastWateredOption.TODAY}>Today</option>
          <option value={LastWateredOption.YESTERDAY}>Yesterday</option>
          <option value={LastWateredOption.TWO_DAYS_AGO}>2 days ago</option>
          <option value={LastWateredOption.THREE_DAYS_AGO}>3 days ago</option>
          <option value={LastWateredOption.SEVEN_DAYS_AGO}>7 days ago</option>
          <option value={LastWateredOption.DONT_REMEMBER}>
            {`I don't remember`}
          </option>
        </StyledSelect>
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

      {/* Show repotting question only if plant was not just bought */}
      {!isNewlyBought && (
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
      )}

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
