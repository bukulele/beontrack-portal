const parseCoordinates = (coords) => {
  if (typeof coords === "string" && coords.length > 0) {
    return coords.split(",").map(Number); // Convert "lat, lng" to [lat, lng]
  }
  return coords;
};

export default parseCoordinates;
