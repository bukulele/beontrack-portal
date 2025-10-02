import React from "react";
import postalCodeFormatter from "@/app/functions/postalCodeFormatter";

function PostalCodeInput({
  name,
  label,
  value,
  placeholder,
  updateState,
  checkAllFields,
  disabled,
  mandatory,
  style,
}) {
  const handleChangeText = (event) => {
    let { name, value } = event.target;
    // Remove any non-alphanumeric characters and convert to uppercase for standard postal code format
    let cleanedValue = value
      .replace(/[^a-z0-9]/gi, "")
      .toUpperCase()
      .slice(0, 6);

    updateState((prev) => {
      return typeof prev === "object" && prev !== null
        ? { ...prev, [name]: cleanedValue }
        : cleanedValue;
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
            : "border-gray-300"
        } ${style === "small" ? "p-0" : ""}`}
        id={name}
        name={name}
        type="text"
        value={postalCodeFormatter(value)}
        onChange={handleChangeText}
        placeholder={placeholder || "Format: A1A 1A1"}
        disabled={disabled}
      />
    </div>
  );
}

export default PostalCodeInput;
