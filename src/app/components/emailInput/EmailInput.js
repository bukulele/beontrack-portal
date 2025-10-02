import React from "react";
import { Tooltip } from "react-tooltip";

function EmailInput({
  name,
  label,
  value,
  placeholder,
  updateState,
  checkAllFields,
  disabled,
  mandatory,
  style,
  emailIsCorrect,
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
    <div
      className="flex flex-col"
      data-tooltip-id={`incorrect_email_tooltip_${name}`}
      // data-tooltip-hidden={!tooltipContent}
    >
      {label && (
        <label htmlFor={name}>
          {label}
          {mandatory ? "*" : ""}
        </label>
      )}
      <input
        className={`rounded ${
          checkAllFields &&
          ((mandatory && value.length === 0) ||
            (value.length !== 0 && !emailIsCorrect))
            ? "border-pink-500"
            : "border-gray-300"
        } ${style === "small" ? "p-0" : ""}`}
        id={name}
        name={name}
        type={"email"}
        value={value.toLowerCase()}
        onChange={handleChangeText}
        placeholder={placeholder}
        disabled={disabled}
      />
      {value.length !== 0 && !emailIsCorrect && (
        <Tooltip
          id={`incorrect_email_tooltip_${name}`}
          openEvents={{ mouseenter: true, focus: true, click: true }}
          style={{ maxWidth: "90%", zIndex: 20 }}
        >
          {`Please enter a valid email address`}
        </Tooltip>
      )}
    </div>
  );
}

export default EmailInput;
