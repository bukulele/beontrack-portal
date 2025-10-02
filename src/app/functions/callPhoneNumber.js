const callPhoneNumber = (phoneNumber) => {
  const link = document.createElement("a");
  link.href = `tel:${phoneNumber}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default callPhoneNumber;
