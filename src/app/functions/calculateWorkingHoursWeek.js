// calculateWorkingHours.js
const calculateWorkingHoursWeek = (
  driverAttendanceData,
  driverId,
  lastShift,
  schedule,
  now = new Date()
) => {
  let totalWorkingHours = 0;
  let shifts = driverAttendanceData.filter(
    (shift) => shift.driver === driverId
  );
  // Exclude the latest shift only if its check_out_time is empty or null.
  if (
    lastShift &&
    (!lastShift.check_out_time || lastShift.check_out_time === "")
  ) {
    shifts = shifts.filter((shift) => shift.id !== lastShift.id);
  }

  // Determine start date for working block:
  // Use the latest day off (up to 7 days back) from schedule, then the day after is the block start.
  let startDate;
  const daysMap = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  if (schedule) {
    let dateCursor = new Date(now);
    dateCursor.setDate(now.getDate() - 1);
    let found = false;
    for (let i = 0; i < 7; i++) {
      const dayKey = daysMap[dateCursor.getDay()];
      if (schedule[dayKey] === false) {
        // Set startDate as the day after the found day off.
        dateCursor.setDate(dateCursor.getDate() + 1);
        startDate = new Date(dateCursor);
        found = true;
        break;
      }
      dateCursor.setDate(dateCursor.getDate() - 1);
    }
    // If no day off was found, default to 7 days ago.
    if (!found) {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }
  } else {
    // Without schedule, consider the last 7 days.
    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }
  startDate.setHours(0, 0, 0, 0);

  // Sum up working hours from shifts within the working block.
  shifts.forEach((shift) => {
    if (
      !shift.check_in_time ||
      !shift.check_out_time ||
      shift.check_in_time === "" ||
      shift.check_out_time === ""
    )
      return;
    // Only calculate hours if there's a check-out time.
    const checkIn = new Date(shift.check_in_time);
    const checkOut = new Date(shift.check_out_time);
    if (checkIn >= startDate && checkOut <= now) {
      totalWorkingHours += (checkOut - checkIn) / (1000 * 60 * 60);
    }
  });
  return totalWorkingHours;
};

export default calculateWorkingHoursWeek;
