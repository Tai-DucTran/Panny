import { Timestamp } from "firebase/firestore";

// Format a Timestamp for display in the UI (e.g., "Apr 14, 2023")
export const formatTimestamp = (timestamp: Timestamp | undefined): string => {
  if (!timestamp) return "Unknown";

  const date = timestamp.toDate();
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Format a Timestamp for an HTML date input (YYYY-MM-DD)
export const formatTimestampForDateInput = (
  timestamp: Timestamp | undefined
): string => {
  if (!timestamp) return "";

  const date = timestamp.toDate();
  return date.toISOString().split("T")[0];
};

// Convert a date string (YYYY-MM-DD) to a Timestamp
export const dateStringToTimestamp = (dateString: string): Timestamp => {
  const date = new Date(dateString);
  return Timestamp.fromDate(date);
};

// Calculate days ago from a Timestamp
export const daysAgo = (timestamp: Timestamp | undefined): string => {
  if (!timestamp) return "Unknown";

  const date = timestamp.toDate();
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
};
