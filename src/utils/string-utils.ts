/**
 * Converts a snake_case or SCREAMING_SNAKE_CASE string to Title Case
 * Example: "TEMPERATURE_FLUCTUATIONS" -> "Temperature Fluctuations"
 * @param {string} str - The string to convert
 * @returns {string} - The converted string in Title Case
 */
export const toTitleCase = (str: string): string => {
  if (!str) return "";

  // Split the string by underscores
  return str
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Usage examples:
// toTitleCase("TEMPERATURE_FLUCTUATIONS") => "Temperature Fluctuations"
// toTitleCase("OVERWATERING") => "Overwatering"
// toTitleCase("LIGHT_CHANGES") => "Light Changes"
