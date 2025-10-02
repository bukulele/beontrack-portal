function formatTime(timeStr) {
  // Split the time string into hours, minutes, and seconds.fraction
  const parts = timeStr.split(":");
  if (parts.length !== 3) {
    throw new Error("Invalid time format. Expected format 'H:mm:ss.SSSSSS'");
  }

  const [hoursStr, minutesStr, secondsFractionStr] = parts;

  // Split seconds and fractional seconds
  const secondsParts = secondsFractionStr.split(".");
  const secondsStr = secondsParts[0];
  // Fractional seconds are ignored for this formatting

  // Parse the components to integers
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);
  const seconds = parseInt(secondsStr, 10);

  // Validate parsed numbers
  if (
    isNaN(hours) ||
    isNaN(minutes) ||
    isNaN(seconds) ||
    minutes < 0 ||
    minutes >= 60 ||
    seconds < 0 ||
    seconds >= 60
  ) {
    throw new Error(
      "Invalid time components. Ensure hours, minutes (0-59), and seconds (0-59) are numeric."
    );
  }

  // Calculate total time in minutes (including fractional minutes from seconds)
  const totalMinutes = hours * 60 + minutes + seconds / 60;

  // if (totalMinutes < 1) {
  //   return "1 min";
  // } else
  if (totalMinutes < 60) {
    // Round to the nearest whole number
    const roundedMinutes = Math.round(totalMinutes);
    return `${roundedMinutes} min`;
  } else {
    // Calculate hours and remaining minutes
    const hrs = Math.floor(totalMinutes / 60);
    const mins = Math.round(totalMinutes % 60);
    return `${hrs} h ${mins} min`;
  }
}

export default formatTime;
