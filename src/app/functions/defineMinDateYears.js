function defineMinDateYears(years) {
  const today = new Date();
  const targetDate = new Date(
    today.getFullYear() - years,
    today.getMonth(),
    today.getDate()
  );

  // Format the date as YYYY-MM-DD
  const formattedDate = targetDate.toISOString().split("T")[0];

  return formattedDate;
}

export default defineMinDateYears;
