import { useContext } from "react";
import SwitchableComponent from "../switchableComponent/SwitchableComponent";
import { DriverAttendanceContext } from "@/app/context/DriverAttendanceContext";
import calculateWorkingHoursWeek from "@/app/functions/calculateWorkingHoursWeek";
import formatDuration from "@/app/functions/formatDuration";

function DriverWorkSwitch({ params, value, handleSwitch }) {
  const { driverAttendanceData } = useContext(DriverAttendanceContext);

  // Helper: map JS day numbers (0=Sun,...6=Sat) to schedule keys.
  const daysMap = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const now = new Date();

  // Retrieve schedule and last_shift (could be an empty string).
  const schedule =
    params.row.schedule && params.row.schedule !== ""
      ? params.row.schedule
      : null;
  const lastShift =
    params.row.last_shift && params.row.last_shift !== ""
      ? params.row.last_shift
      : null;

  // --- Determine disabled state ---
  let disabled = false;

  // (5) On days off, driver is not available.
  if (schedule) {
    const currentDayKey = daysMap[now.getDay()];
    if (schedule[currentDayKey] === false) {
      disabled = true;
    }
  }

  // (2) Calculate weekly working hours (only closed shifts count).
  let totalWorkingHours = calculateWorkingHoursWeek(
    driverAttendanceData,
    params.id,
    lastShift,
    schedule,
    now
  );
  if (totalWorkingHours >= 70) {
    disabled = true;
  }

  // (3) Determine if driver already has a shift today.
  let driverShiftToday = false;
  if (lastShift && lastShift.check_in_time) {
    const shiftStart = new Date(lastShift.check_in_time);
    // Compare local date strings to determine if the shift is today.
    if (shiftStart.toLocaleDateString() === now.toLocaleDateString()) {
      driverShiftToday = true;
    }
  }

  // (4) Determine required rest hours based on which day the last shift occurred.
  // If the driver worked today, use tomorrow's schedule.
  // If the driver did not work today, use today's schedule.
  let requiredRestHours = 0;
  if (lastShift && lastShift.check_in_time && schedule) {
    if (driverShiftToday) {
      // Driver worked today → consult tomorrow's schedule.
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
      const tomorrowKey = daysMap[tomorrow.getDay()];
      requiredRestHours = schedule[tomorrowKey] === false ? 36 : 10;
    } else {
      // Last shift was from an earlier day → consult today's schedule.
      const todayKey = daysMap[now.getDay()];
      requiredRestHours = schedule[todayKey] === false ? 36 : 10;
    }
  }

  // Use check_out_time + requiredRestHours to enforce availability.
  if (lastShift && lastShift.check_out_time) {
    const checkOutTime = new Date(lastShift.check_out_time);
    // Calculate hours since check_out.
    const diffHours = (now - checkOutTime) / (1000 * 60 * 60);
    if (diffHours < requiredRestHours) {
      disabled = true;
    }
  }

  // --- Timer functionality ---
  // Helper: find the next working day (the day where schedule is true).
  // const getNextWorkingDay = () => {
  //   if (!schedule) return null;
  //   let nextDate = new Date(now);
  //   nextDate.setDate(now.getDate() + 1);
  //   for (let i = 0; i < 7; i++) {
  //     const dayKey = daysMap[nextDate.getDay()];
  //     if (schedule[dayKey] === true) {
  //       nextDate.setHours(0, 0, 0, 0);
  //       return nextDate;
  //     }
  //     nextDate.setDate(nextDate.getDate() + 1);
  //   }
  //   return nextDate;
  // };

  // --- Timer candidate calculation ---
  let calculatedTimer = "";
  const currentTime = new Date();
  // Case 1: Driver is working (value === true) — show how long they’ve been on shift
  if (
    value === true &&
    lastShift &&
    lastShift.check_in_time &&
    (!lastShift.check_out_time || lastShift.check_out_time === "")
  ) {
    const checkIn = new Date(lastShift.check_in_time);
    const diffMs = currentTime - checkIn;
    calculatedTimer = formatDuration(diffMs);
  }
  // Case 2: Driver is off AND disabled — show countdown until available
  else if (!value && disabled) {
    // We'll compute the candidate time as the check_out time + requiredRestHours.
    // (We assume that if there is a closed shift—even if it’s not from today—the timer
    // shows when the driver becomes available.)
    if (lastShift && lastShift.check_out_time) {
      const checkOut = new Date(lastShift.check_out_time);
      const availableTime = new Date(
        checkOut.getTime() + requiredRestHours * 60 * 60 * 1000
      );
      const diffMs = availableTime - currentTime;
      calculatedTimer = diffMs > 0 ? formatDuration(diffMs) : "";
    }
    // Optionally, you could also add a candidate from getNextWorkingDay
    // if today is off, etc.—but per your scenarios we now solely use the
    // check_out + requiredRest logic.
  }

  // UNCOMMENT FOR PRODUCTION!
  if (!params.row.compliant && !value) {
    disabled = true;
  }

  if (!schedule && !value) {
    disabled = true;
  }

  // Allow turning off even if disabled, by overriding disabled when value is true.
  const effectiveDisabled = value ? false : disabled;

  // --- Handler for switch change ---
  const onCheckedChange = (val) => {
    handleSwitch(val, params);
  };

  return (
    <div className="flex w-full items-center justify-left gap-2 px-1">
      <SwitchableComponent
        checked={value}
        onCheckedChange={onCheckedChange}
        disabled={effectiveDisabled}
      />
      {(value === true || (!value && effectiveDisabled)) && (
        <p style={!value && effectiveDisabled ? { color: "red" } : {}}>
          {calculatedTimer}
        </p>
      )}
    </div>
  );
}

export default DriverWorkSwitch;
