function isValidDate(dateString) {
  return !isNaN(new Date(dateString).getTime());
}

export default isValidDate;
