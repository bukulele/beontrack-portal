import React from "react";

function TextInput({
  name,
  label,
  value,
  placeholder,
  updateState,
  checkAllFields,
  disabled,
  mandatory,
  style,
  lettersOnly,
}) {
  const handleChangeText = (event) => {
    const { name, value } = event.target;

    // If lettersOnly is true, replace non-letter characters with an empty string
    const filteredValue = lettersOnly
      ? value.replace(/[^a-zA-Z\s]/g, "")
      : value;

    updateState((prev) => {
      // If `prev` is not an object, this will simply return the new value.
      // If it is an object, it assumes a function is used to update a specific field within that object.
      return typeof prev === "object" && prev !== null
        ? { ...prev, [name]: filteredValue }
        : filteredValue;
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
        type={"text"}
        value={value}
        onChange={handleChangeText}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
}

export default TextInput;
