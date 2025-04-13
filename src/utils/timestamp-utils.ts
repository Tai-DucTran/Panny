// src/utils/timestamp-utils.ts
import { Timestamp } from "firebase/firestore";

/**
 * Converts a JavaScript Date to a Firestore Timestamp
 */
export const dateToTimestamp = (
  date: Date | undefined
): Timestamp | undefined => {
  if (!date) return undefined;
  return Timestamp.fromDate(date);
};

/**
 * Converts a Firestore Timestamp to a JavaScript Date
 */
export const timestampToDate = (
  timestamp: Timestamp | undefined
): Date | undefined => {
  if (!timestamp) return undefined;
  return timestamp.toDate();
};

/**
 * Gets the current date as a Firestore Timestamp
 */
export const nowTimestamp = (): Timestamp => {
  return Timestamp.now();
};

/**
 * Formats a Timestamp for display in YYYY-MM-DD format
 * Used for input[type="date"] values
 */
export const formatTimestampForDateInput = (
  timestamp: Timestamp | undefined
): string => {
  if (!timestamp) return "";
  const date = timestamp.toDate();
  return date.toISOString().split("T")[0];
};

/**
 * Gets today's date in YYYY-MM-DD format for input[type="date"] max attribute
 */
export const getTodayForDateInput = (): string => {
  return new Date().toISOString().split("T")[0];
};

/**
 * Creates a Timestamp from a date string (YYYY-MM-DD)
 */
export const dateStringToTimestamp = (dateString: string): Timestamp => {
  const date = new Date(dateString);
  return Timestamp.fromDate(date);
};
