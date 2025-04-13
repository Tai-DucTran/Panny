// src/models/plant.ts
import { Timestamp } from "firebase/firestore";

export interface Plant {
  id: string;
  name: string;
  species: string;
  nickname?: string;
  imageUrl?: string;
  acquiredTimeOption: AcquiredTimeOption;

  // Care difficulty
  careDifficulty: CareDifficulty;
  sensitivityFactors?: SensitivityFactor[];

  // Location information
  location: PlantLocation;

  // Care requirements
  wateringFrequency: number;
  lastWatered?: Timestamp; // Changed from Date to Timestamp
  sunlightNeeds: SunlightLevel;
  humidityPreference: HumidityLevel;
  temperature: {
    min: number;
    max: number;
    ideal: number;
  };

  // Soil information
  soilType: SoilType[];
  lastRepotted?: Timestamp; // Changed from Date to Timestamp
  repottingFrequency: number;

  // Health tracking
  healthStatus: HealthStatus;
  healthHistory: HealthRecord[];

  // Additional info
  notes?: string;
  toxicity?: ToxicityLevel;
  growthHabit?: GrowthHabit;
  origin?: string;
}

export enum SunlightLevel {
  LOW = "Low light",
  MEDIUM = "Medium light",
  BRIGHT_INDIRECT = "Bright indirect light",
  DIRECT = "Direct sunlight",
}

export enum HumidityLevel {
  LOW = "Low (20-40%)",
  MEDIUM = "Medium (40-60%)",
  HIGH = "High (60%+)",
}

export enum SoilType {
  STANDARD = "Standard potting mix",
  CACTUS = "Cactus/succulent mix",
  ORCHID = "Orchid mix",
  PEAT = "Peat moss",
  PERLITE = "Perlite",
  VERMICULITE = "Vermiculite",
  COCO_COIR = "Coconut coir",
  SAND = "Sand",
  BARK = "Bark chips",
}

export enum HealthStatus {
  EXCELLENT = "Excellent",
  GOOD = "Good",
  FAIR = "Fair",
  POOR = "Poor",
  CRITICAL = "Critical",
}

export enum ToxicityLevel {
  NONE = "Non-toxic",
  MILD = "Mildly toxic",
  MODERATE = "Moderately toxic",
  SEVERE = "Severely toxic",
}

export enum GrowthHabit {
  UPRIGHT = "Upright",
  BUSHY = "Bushy",
  TRAILING = "Trailing",
  CLIMBING = "Climbing",
  ROSETTE = "Rosette",
}

export interface HealthRecord {
  date: Timestamp; // Changed from Date to Timestamp
  status: HealthStatus;
  notes?: string;
  issues?: PlantIssue[];
}

export enum PlantIssue {
  YELLOWING_LEAVES = "Yellowing leaves",
  BROWNING_TIPS = "Browning leaf tips",
  DROPPING_LEAVES = "Dropping leaves",
  WILTING = "Wilting",
  STRETCHING = "Stretching (etiolation)",
  PESTS = "Pest infestation",
  ROOT_ROT = "Root rot",
  MOLD = "Mold/fungus",
}

export enum CareDifficulty {
  VERY_EASY = "Very Easy",
  EASY = "Easy",
  MODERATE = "Moderate",
  DIFFICULT = "Difficult",
  EXPERT = "Expert",
}

export enum SensitivityFactor {
  OVERWATERING = "Sensitive to overwatering",
  UNDERWATERING = "Sensitive to underwatering",
  TEMPERATURE_FLUCTUATIONS = "Sensitive to temperature fluctuations",
  DRAFTS = "Sensitive to drafts/air currents",
  HUMIDITY_CHANGES = "Sensitive to humidity changes",
  LIGHT_CHANGES = "Sensitive to light changes",
  ROOT_DISTURBANCE = "Sensitive to root disturbance",
  FERTILIZER = "Sensitive to fertilizer",
  WATER_QUALITY = "Sensitive to water quality/minerals",
  PESTS = "Highly susceptible to pests",
}

export enum PlantLocationType {
  INDOOR = "Indoor",
  OUTDOOR = "Outdoor",
}

export interface PlantLocation {
  type: PlantLocationType;
  room?: string;
  lightExposure?: LightExposure;
  city?: string;
  country?: string;
}

export enum LightExposure {
  LOW = "Low light",
  MEDIUM = "Medium light",
  BRIGHT = "Bright light",
  DIRECT_SUN = "Direct sunlight",
}

export enum AcquiredTimeOption {
  JUST_BOUGHT = "just_bought",
  LAST_WEEK = "last_week",
  LONG_TIME_AGO = "long_time_ago",
}
