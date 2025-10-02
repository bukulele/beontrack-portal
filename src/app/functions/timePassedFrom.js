function timePassedFrom(dateString, leavingDate) {
  const inputDate = new Date(dateString);
  const endDate = leavingDate ? new Date(leavingDate) : new Date();

  let years = endDate.getFullYear() - inputDate.getFullYear();
  let months = endDate.getMonth() - inputDate.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  let result = "";
  if (years > 0) {
    result += `${years} y. `;
  }
  if (months > 0) {
    result += `${months} m.`;
  }

  return result.trim();
}

export default timePassedFrom;
