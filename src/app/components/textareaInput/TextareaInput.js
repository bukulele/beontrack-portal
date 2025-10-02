import React from "react";

function TextareaInput({
  name,
  label,
  value,
  placeholder,
  updateState,
  checkAllFields,
  disabled,
  style,
  mandatory,
}) {
  const handleChangeText = (event) => {
    const { name, value } = event.target;
    updateState((prev) => {
      // If `prev` is not an object, this will simply return the new value.
      // If it is an object, it assumes a function is used to update a specific field within that object.
      return typeof prev === "object" && prev !== null
        ? { ...prev, [name]: value }
        : value;
    });
  };

  return (
    <div className={`flex flex-col ${style === "compact" ? "w-2/3" : ""}`}>
      {label && (
        <label htmlFor={name}>
          {label}
          {mandatory ? "*" : ""}
        </label>
      )}
      <textarea
        className={`rounded ${
          checkAllFields && mandatory && value.length === 0
            ? "border-pink-500"
            : "border-gray-300"
        }`}
        id={name}
        name={name}
        value={value}
        onChange={handleChangeText}
        placeholder={placeholder}
        style={{ resize: "vertical" }}
        disabled={disabled}
      />
    </div>
  );
}

export default TextareaInput;
