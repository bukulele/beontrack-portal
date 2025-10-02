function defineMinDate(days) {
  const today = new Date();
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() - days); // Subtract the days from today's date

  // Format the date as YYYY-MM-DD
  const formattedDate = targetDate.toISOString().split("T")[0];

  return formattedDate;
}

export default defineMinDate;
