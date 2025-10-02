function sanitizeData(data, defaultValue = "") {
  if (Array.isArray(data)) {
    return data.map((item) => sanitizeData(item, defaultValue));
  } else if (data !== null && typeof data === "object") {
    return Object.keys(data).reduce((acc, key) => {
      acc[key] = sanitizeData(data[key], defaultValue);
      return acc;
    }, {});
  } else {
    return data !== null && data !== undefined ? data : defaultValue;
  }
}

export default sanitizeData;
