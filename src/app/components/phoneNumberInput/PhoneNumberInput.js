import React, { useEffect, useState } from "react";
import phoneNumberFormatter from "@/app/functions/phoneNumberFormatter";

function PhoneNumberInput({
  name,
  label,
  value,
  placeholder,
  updateState,
  checkAllFields,
  style,
  disabled,
  mandatory,
}) {
  const [warned, setWarned] = useState(false);

  const handlePhoneNumberChange = (event) => {
    const { name } = event.target;

    let value = event.target.value;

    // Remove all non-digit characters
    const numbers = value.replace(/\D/g, "").slice(0, 10);

    updateState((prev) => {
      // If `prev` is not an object, this will simply return the new value.
      // If it is an object, it assumes a function is used to update a specific field within that object.
      return typeof prev === "object" && prev !== null
        ? { ...prev, [name]: numbers }
        : numbers;
    });
  };

  useEffect(() => {
    const regex = /\d{10}$/;
    const phoneNumberIsCorrect = regex.test(value);
    if (!phoneNumberIsCorrect && checkAllFields && mandatory) {
      setWarned(true);
    } else {
      setWarned(false);
    }
  }, [checkAllFields, value]);

  return (
    <div className="flex flex-col">
      {label && (
        <label htmlFor={name}>
          {label}
          {mandatory ? "*" : ""}
        </label>
      )}
      <div
        className={`flex items-center rounded border ${
          warned || (checkAllFields && mandatory && value.length === 0)
            ? "border-pink-500"
            : "border-gray-300"
        } ${style === "small" ? "p-0" : ""}`}
      >
        <span className="px-2 border-r border-gray-300">+1</span>{" "}
        {/* Country code is always visible and not part of input */}
        <input
          className="border-none w-full"
          id={name}
          name={name}
          type={"text"}
          value={phoneNumberFormatter(value)}
          onChange={handlePhoneNumberChange}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

export default PhoneNumberInput;
