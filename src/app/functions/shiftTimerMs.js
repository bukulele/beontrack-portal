// utils/shiftTimerMs.js
export function shiftTimerMs(row, now = new Date()) {
  const { last_shift: ls, schedule } = row;
  if (!ls) return 0;

  // CASE A – driver is on a shift right now → how long they’ve been working
  if (ls.check_out_time == null || ls.check_out_time === "") {
    return now.getTime() - new Date(ls.check_in_time).getTime(); // positive ms
  }

  // CASE B – driver is off but still resting → how many ms *until* free
  const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const todayKey = days[now.getDay()];
  const requiredRestHrs = schedule && schedule[todayKey] === false ? 36 : 10; // 36 h if today is a day off, else 10 h

  const MS_PER_HOUR = 60 * 60 * 1000;
  const availableAt =
    new Date(ls.check_out_time).getTime() + requiredRestHrs * MS_PER_HOUR;

  // Positive → still resting, Negative → rest period ended
  return availableAt - now.getTime();
}
