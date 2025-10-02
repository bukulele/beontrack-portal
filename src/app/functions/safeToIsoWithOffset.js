/**
 * Takes a user-input local datetime string (e.g., '2025-06-02T15:00')
 * Returns an ISO 8601 string with the current local timezone offset, e.g.:
 *   "2025-06-02T15:00:00-03:00"
 */
export const toLocalIsoWithOffset = (userInput) => {
  // Get local offset in minutes
  const offsetMins = new Date().getTimezoneOffset();
  const sign = offsetMins > 0 ? "-" : "+";
  const abs = Math.abs(offsetMins);
  const hours = String(Math.floor(abs / 60)).padStart(2, "0");
  const minutes = String(abs % 60).padStart(2, "0");
  const offset = `${sign}${hours}:${minutes}`;
  // Ensure seconds are present (ISO 8601 requires them)
  const withSeconds = /T\d{2}:\d{2}$/.test(userInput)
    ? `${userInput}:00`
    : userInput;
  return `${withSeconds}${offset}`;
};

export const hasOffsetOrZ = (str) => {
  // Matches ±hh:mm or a trailing 'Z'
  return /([+-]\d{2}:\d{2}|Z)$/.test(str);
};

const safeToIsoWithOffset = (input) => {
  if (!input) return "";
  // If already has offset or Z, return as is
  if (hasOffsetOrZ(input)) return input;
  // Otherwise, append local offset
  return toLocalIsoWithOffset(input);
};

export default safeToIsoWithOffset;
