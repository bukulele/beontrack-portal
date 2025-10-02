function checkDate(date, daysThreshold) {
  const targetDate = new Date(date);
  const currentDate = new Date();

  // Calculate the difference in time
  const timeDifference = targetDate - currentDate;

  // Convert time difference from milliseconds to days
  const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  if (daysDifference <= 0) {
    return "daysWarn_red"; // Date has already passed
  } else if (daysDifference < daysThreshold) {
    return "daysWarn_yellow"; // Less than the specified number of days left
  } else {
    return "";
  }
}

export default checkDate;
