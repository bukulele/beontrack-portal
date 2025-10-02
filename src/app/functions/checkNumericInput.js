function checkNumericInput(value, maxDigits) {
  // const nonDigits = /\D+/g;
  const allowedCharacters = /[^0-9*]+/g;

  // Remove non-digits
  let cleanedValue = value
    .replace(allowedCharacters, "")
    .substring(0, maxDigits);

  // Insert whitespace after every 3 digits from the end to start
  let formattedValue = cleanedValue
    .split("") // Convert to array to manipulate
    .reverse() // Reverse the array to start grouping from the end
    .join("") // Join back into a string
    .replace(/(.{3})(?=.)/g, "$1 ") // Insert space after every 3rd character
    .split("") // Split again to reverse back
    .reverse() // Reverse again to get the original order
    .join(""); // Join into the final formatted string

  return formattedValue;
}

export default checkNumericInput;
