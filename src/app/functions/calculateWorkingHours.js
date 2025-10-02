const calculateWorkingHours = (inTime, outTime, rounded = true) => {
  if (inTime === null || outTime === null) return 0;

  const start = new Date(inTime);
  const end = new Date(outTime);
  let hours = (end - start) / (1000 * 60 * 60);

  if (isNaN(hours)) return 0;

  // Multiply by 4, round to the nearest integer, then divide by 4 to round to the nearest quarter.
  if (rounded) {
    hours = Math.round(hours * 4) / 4;
  }
  return hours.toFixed(2);
};

export default calculateWorkingHours;
