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
