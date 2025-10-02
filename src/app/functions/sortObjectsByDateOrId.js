function sortObjectsByDateOrId(array) {
  if (!Array.isArray(array)) return array;
  if (array.length === 0) {
    return [];
  }

  // Create a copy of the array to avoid mutating the original
  return array.slice().sort((a, b) => {
    // First, compare issue_date
    if (a.issue_date && b.issue_date) {
      const dateA = new Date(a.issue_date);
      const dateB = new Date(b.issue_date);
      if (dateB - dateA !== 0) {
        return dateB - dateA; // Latest issue_date first
      }
    } else if (a.issue_date) {
      return -1; // a comes before b (a has issue_date, b doesn't)
    } else if (b.issue_date) {
      return 1; // b comes before a (b has issue_date, a doesn't)
    }
    // If issue_date is the same or missing in both, proceed to expiry_date

    // Next, compare expiry_date
    if (a.expiry_date && b.expiry_date) {
      const dateA = new Date(a.expiry_date);
      const dateB = new Date(b.expiry_date);
      if (dateB - dateA !== 0) {
        return dateB - dateA; // Latest expiry_date first
      }
    } else if (a.expiry_date) {
      return -1; // a comes before b (a has expiry_date, b doesn't)
    } else if (b.expiry_date) {
      return 1; // b comes before a (b has expiry_date, a doesn't)
    }
    // If expiry_date is the same or missing in both, proceed to id

    // Finally, compare id
    return b.id - a.id; // Highest id first
  });
}

export default sortObjectsByDateOrId;
