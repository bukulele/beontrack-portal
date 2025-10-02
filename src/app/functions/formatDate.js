function formatDate(inputDate) {
  const date = new Date(inputDate);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return inputDate;
  }

  // Get the day, month, and year in UTC
  const day = date.getUTCDate().toString().padStart(2, "0");
  const month = date.toLocaleString("default", {
    month: "short",
    timeZone: "UTC",
  });
  const year = date.getUTCFullYear();

  return `${day} ${month} ${year}`;
}

export default formatDate;
