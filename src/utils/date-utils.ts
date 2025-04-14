// src/utils/date-utils.ts

/**
 * Formats a date relative to now (e.g., "2 days ago", "today")
 */
export function formatDistanceToNow(date: Date): string {
  const now = new Date();
  const diffInDays = Math.floor(
    Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Check if the date is today
  if (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  ) {
    return "today";
  }

  // Check if the date is yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  ) {
    return "yesterday";
  }

  // Check if the date is tomorrow
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear()
  ) {
    return "tomorrow";
  }

  // For future dates
  if (date > now) {
    if (diffInDays <= 30) {
      return `in ${diffInDays} ${diffInDays === 1 ? "day" : "days"}`;
    } else {
      return `on ${formatDate(date)}`;
    }
  }

  // For past dates
  if (diffInDays <= 30) {
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
  } else {
    return `on ${formatDate(date)}`;
  }
}

/**
 * Formats a date in a user-friendly format (e.g., "Apr 15, 2023")
 */
export function formatDate(date: Date): string {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}
