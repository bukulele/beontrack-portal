function checkActivityPeriod(activityHistory, period) {
  const PERIOD_YEARS_MS = period * 365 * 24 * 60 * 60 * 1000; // period years in milliseconds
  const now = new Date();
  const tenYearsAgo = new Date(now.getTime() - PERIOD_YEARS_MS);

  let recentActivity = activityHistory
    .filter((activity) => !activity.delete)
    .filter((activity) => {
      const start = new Date(activity.start_date);
      const end = activity.till_now ? now : new Date(activity.end_date);
      return start >= tenYearsAgo || (start < tenYearsAgo && end > tenYearsAgo);
    })
    .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

  let lastEndDate = tenYearsAgo; // This keeps track of the end of the last activity
  let gaps = [];

  // Check for gaps
  for (let i = 0; i < recentActivity.length; i++) {
    const activity = recentActivity[i];
    const startDate = new Date(activity.start_date);
    let endDate = activity.till_now ? now : new Date(activity.end_date);

    // Adjust lastEndDate to ignore one-day gaps
    const adjustedLastEndDate = new Date(lastEndDate.getTime() + 86400000); // Adds one day (24 * 60 * 60 * 1000)

    // Check if there is a gap of more than one day
    if (startDate > adjustedLastEndDate) {
      gaps.push({
        start: lastEndDate.toISOString().split("T")[0],
        end: startDate.toISOString().split("T")[0],
      });
    }

    // Update lastEndDate to the end date of the current activity, if it's later than the last recorded end date
    if (endDate > lastEndDate) {
      lastEndDate = endDate;
    }
  }

  // Check for a gap between the last activity end date and now
  if (lastEndDate < now) {
    gaps.push({
      start: lastEndDate.toISOString().split("T")[0],
      end: now.toISOString().split("T")[0],
    });
  }

  return gaps;
}

export default checkActivityPeriod;
