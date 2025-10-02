import parseLocalDate from "./parseLocalDate";
// Helper function to format a Date object as "YYYY-MM-DD"
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const calculateWorkingDaysFromQueryString = (queryString, holidays = []) => {
  const params = new URLSearchParams(queryString);
  const startDateStr = params.get("start_date");
  const endDateStr = params.get("end_date");

  if (!startDateStr || !endDateStr) {
    throw new Error("Query string must contain start_date and end_date");
  }

  const startDate = parseLocalDate(startDateStr);
  const endDate = parseLocalDate(endDateStr);
  let workingDays = 0;
  let holidaysCount = 0;

  // Loop over each day in the interval (inclusive)
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay();
    // Check if the day is a weekday (Monday=1 to Friday=5)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      const currentDate = formatDate(d);
      // If the current date is not found in the holidays array, count it as a working day
      const isHoliday = holidays.some((holiday) => {
        return holiday.date === currentDate;
      });
      if (!isHoliday) {
        workingDays++;
      } else {
        holidaysCount++;
      }
    }
  }

  return [workingDays, holidaysCount];
};

export default calculateWorkingDaysFromQueryString;
