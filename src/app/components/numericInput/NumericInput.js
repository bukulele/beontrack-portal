import React from "react";
import checkNumericInput from "@/app/functions/checkNumericInput";

function NumericInput({
  name,
  label,
  value,
  placeholder,
  updateState,
  checkAllFields,
  disabled,
  formatted,
  max,
  allowDecimals,
  style,
  mandatory,
}) {
  const handleChangeNumber = (event) => {
    const { name, value } = event.target;

    let numbers;
    if (allowDecimals) {
      // Allow numbers with one decimal point and up to 'max' digits after the decimal
      numbers = value.replace(/[^0-9.]/g, ""); // Remove any non-numeric and non-period characters
      const parts = numbers.split(".");
      if (parts.length > 2) {
        // If more than one period, keep only the first period
        numbers = `${parts[0]}.${parts.slice(1).join("")}`;
      }
    } else {
      numbers = value.replace(/\D/g, "").slice(0, max);
    }

    updateState((prev) => {
      // If `prev` is not an object, this will simply return the new value.
      // If it is an object, it assumes a function is used to update a specific field within that object.
      return typeof prev === "object" && prev !== null
        ? { ...prev, [name]: numbers }
        : numbers;
    });
  };

  return (
    <div className="flex flex-col">
      {label && (
        <label htmlFor={name}>
          {label}
          {mandatory ? "*" : ""}
        </label>
      )}
      <input
        className={`rounded ${
          checkAllFields && mandatory && value.length === 0
            ? "border-pink-500"
            : style === "small"
            ? "p-0 border-gray-300"
            : "border-gray-300"
        }`}
        id={name}
        name={name}
        type={"text"}
        value={formatted ? checkNumericInput(value) : value}
        onChange={handleChangeNumber}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
}

export default NumericInput;
