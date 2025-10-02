const getFriendlyZoneName = (ianaTimeZone) => {
  // E.g. "America/Winnipeg" → "Winnipeg"
  // E.g. "America/Argentina/Buenos_Aires" → "Buenos Aires"
  if (!ianaTimeZone) return "";
  const parts = ianaTimeZone.split("/");
  let city = parts[parts.length - 1];
  // Replace underscores with spaces for places like "Buenos_Aires"
  city = city.replace(/_/g, " ");
  return city;
};

export default getFriendlyZoneName;
