function phoneNumberFormatter(numbers) {
  let formattedNumber = "";
  if (numbers.length > 0) {
    formattedNumber += numbers.substring(0, 3);
    if (numbers.length > 3) {
      formattedNumber += " " + numbers.substring(3, 6);
      if (numbers.length > 6) {
        formattedNumber += " " + numbers.substring(6, 10);
      }
    }
  }
  return formattedNumber;
}

export default phoneNumberFormatter;
