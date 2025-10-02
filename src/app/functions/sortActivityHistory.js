function sortActivityHistory(activityHistory) {
  return activityHistory.sort((a, b) => {
    // Convert date strings to date objects to compare
    return new Date(b.start_date) - new Date(a.start_date);
  });
}

export default sortActivityHistory;
