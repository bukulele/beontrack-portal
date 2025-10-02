const formatHours = (hrs) => {
  if (hrs === 0) {
    return 0;
  }
  // Check if the duration is less than 1 minute
  if (hrs < 1 / 60) {
    return `< 1min`;
  }
  const totalMinutes = Math.floor(hrs * 60);
  const hoursPart = Math.floor(totalMinutes / 60);
  const minutesPart = totalMinutes % 60;
  // Only pad minutes to always have two digits
  const padMinutes = (num) => num.toString().padStart(2, "0");
  return `${hoursPart}h ${padMinutes(minutesPart)}m`;
};

export default formatHours;
