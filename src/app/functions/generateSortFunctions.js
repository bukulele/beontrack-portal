import getValueByPath from "./getValueByPath";
import isValidDate from "./isValidDate";

const generateSortFunctions = (data) => {
  if (!data || !data.length) return {};

  const sortFunctions = {};

  // Get all unique keys from the array
  const allKeys = data.filter((item) => item.sort).map((item) => item.dataKey);

  allKeys.forEach((key) => {
    sortFunctions[key] = (array) =>
      array.sort((a, b) => {
        let valueA = getValueByPath(a, key);
        let valueB = getValueByPath(b, key);

        // Handle undefined or null values
        if (valueA === undefined || valueA === null) valueA = "";
        if (valueB === undefined || valueB === null) valueB = "";

        // Handle cases where values are dates
        if (isValidDate(valueA) && isValidDate(valueB)) {
          valueA = new Date(valueA);
          valueB = new Date(valueB);
          return valueA - valueB;
        } else if (isValidDate(valueA)) {
          valueA = new Date(valueA);
          valueB = new Date("9999-12-31"); // Fallback date
          return valueA - valueB;
        } else if (isValidDate(valueB)) {
          valueA = new Date("9999-12-31"); // Fallback date
          valueB = new Date(valueB);
          return valueA - valueB;
        }

        // Handle cases where values are numbers
        if (!isNaN(valueA) && !isNaN(valueB)) {
          return Number(valueA) - Number(valueB);
        }

        // Handle cases where values are strings
        return valueA.toString().localeCompare(valueB.toString(), undefined, {
          numeric: true,
        });
      });
  });

  return sortFunctions;
};

export default generateSortFunctions;
