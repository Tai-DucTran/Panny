// src/components/add-plant-form/helpers.ts

import { HealthStatus } from "@/models/plant";

// Function to set a random image based on health status
export const getDefaultPlantImageURL = (
  e: React.ChangeEvent<HTMLSelectElement>
): string => {
  const status = e.target.value as HealthStatus;
  let imageUrl: string;

  if (status === HealthStatus.EXCELLENT || status === HealthStatus.GOOD) {
    const randomNum = Math.floor(Math.random() * 8) + 1;
    imageUrl = `/images/plants/normal-plants/plant-${randomNum}.jpg`;
  } else {
    const randomNum = Math.floor(Math.random() * 5) + 1;
    imageUrl = `/images/plants/illness-plants/illness-plant-${randomNum}.jpg`;
  }

  return imageUrl;
};

// Repotting options for the dropdown
export enum RepottingTimeOption {
  THIS_WEEK = "this_week",
  LAST_MONTH = "last_month",
  THREE_MONTHS_AGO = "three_months_ago",
  SIX_MONTHS_AGO = "six_months_ago",
  TWELVE_MONTHS_AGO = "twelve_months_ago",
  NEVER = "never",
}

// Convert repotting option to actual Date
export const getRepottingDateFromOption = (
  option: RepottingTimeOption
): Date => {
  const now = new Date();
  let monthsToSubtract = 0;

  switch (option) {
    case RepottingTimeOption.THIS_WEEK:
      // Current month, but first day
      monthsToSubtract = 0;
      break;
    case RepottingTimeOption.LAST_MONTH:
      // 1 month ago
      monthsToSubtract = 1;
      break;
    case RepottingTimeOption.THREE_MONTHS_AGO:
      // 3 months ago
      monthsToSubtract = 3;
      break;
    case RepottingTimeOption.SIX_MONTHS_AGO:
      // 6 months ago
      monthsToSubtract = 6;
      break;
    case RepottingTimeOption.TWELVE_MONTHS_AGO:
    case RepottingTimeOption.NEVER:
      // 12 months ago (default for "never" option)
      monthsToSubtract = 12;
      break;
  }

  // Calculate the target month by subtracting from current date
  const targetMonth = now.getMonth() - monthsToSubtract;
  const targetYear = now.getFullYear() + Math.floor(targetMonth / 12);
  const normalizedTargetMonth = ((targetMonth % 12) + 12) % 12; // Handle negative month values

  // Create date for the first day of the target month
  const targetDate = new Date(targetYear, normalizedTargetMonth, 1);

  // Reset time to midnight
  targetDate.setHours(0, 0, 0, 0);

  return targetDate;
};

// Helper to get today's date in YYYY-MM-DD format for input[type="date"] max attribute
export const getTodayForDateInput = (): string => {
  return new Date().toISOString().split("T")[0];
};
