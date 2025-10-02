function postalCodeFormatter(value) {
  let formattedValue = value;
  if (formattedValue.length > 3 && formattedValue.length <= 6) {
    formattedValue = `${formattedValue.slice(0, 3)} ${formattedValue.slice(3)}`;
  }
  return formattedValue;
}

export default postalCodeFormatter;
