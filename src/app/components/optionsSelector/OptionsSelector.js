import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

function OptionsSelector({
  value,
  updateState,
  label,
  name,
  data,
  disabled,
  checkAllFields,
  style,
  background,
  setDefault,
  mandatory,
}) {
  const handleChange = (event) => {
    let value = event.target.value;
    updateState((prev) => {
      // If `prev` is not an object, this will simply return the new value.
      // If it is an object, it assumes a function is used to update a specific field within that object.
      return typeof prev === "object" && prev !== null
        ? { ...prev, [name]: value }
        : value;
    });
  };

  useEffect(() => {
    if (setDefault) {
      updateState((prev) => {
        let valueToSet = value.length === 0 ? Object.keys(data)[0] : value;

        // If `prev` is not an object, this will simply return the new value.
        // If it is an object, it assumes a function is used to update a specific field within that object.
        return typeof prev === "object" && prev !== null
          ? { ...prev, [name]: valueToSet }
          : valueToSet;
      });
    }
  }, [setDefault, value]);

  return (
    <div
      className={`flex flex-col relative ${
        style === "small" ? "custom-select" : ""
      }`}
    >
      {label && (
        <label htmlFor={name}>
          {label}
          {mandatory ? "*" : ""}
        </label>
      )}
      <select
        className={`rounded text-${
          background ? "white" : disabled ? "gray-400" : ""
        } ${
          checkAllFields && mandatory && value.length === 0
            ? "border-pink-500"
            : "border-gray-300"
        } ${style === "small" ? "py-0" : ""}`}
        id={name}
        onChange={handleChange}
        disabled={disabled}
        style={{
          backgroundColor: background,
        }}
        value={value}
      >
        {Object.entries(data).map(([key, value]) => (
          <option key={key} value={key}>
            {value}
          </option>
        ))}
      </select>
      {style === "small" && (
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`custom-icon text-${background ? "white" : ""}`}
        />
      )}
    </div>
  );
}

export default OptionsSelector;
