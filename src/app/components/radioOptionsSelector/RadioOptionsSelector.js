import React, { useEffect } from "react";

function RadioOptionsSelector({
  value,
  updateState,
  label,
  name,
  data,
  disabled,
  checkAllFields,
  style,
  setDefault,
  mandatory,
}) {
  const handleChange = (event) => {
    let value = event.target.value;
    updateState((prev) => {
      return typeof prev === "object" && prev !== null
        ? { ...prev, [name]: value }
        : value;
    });
  };

  useEffect(() => {
    if (setDefault) {
      updateState((prev) => {
        let valueToSet = value.length === 0 ? Object.keys(data)[0] : value;
        return typeof prev === "object" && prev !== null
          ? { ...prev, [name]: valueToSet }
          : valueToSet;
      });
    }
  }, [setDefault, value]);

  return (
    <div className={`flex flex-col ${style === "small" ? "custom-radio" : ""}`}>
      {label && (
        <label htmlFor={name} className="font-semibold">
          {label}
          {mandatory ? "*" : ""}
        </label>
      )}
      <div className="flex flex-wrap gap-2 mt-2">
        {Object.entries(data).map(([key, label]) => (
          <label
            key={key}
            className={`flex items-center gap-2 cursor-pointer ${
              checkAllFields && mandatory && value.length === 0
                ? "border-pink-500"
                : "border-gray-300"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <input
              type="radio"
              name={name}
              value={key}
              checked={value === key}
              onChange={handleChange}
              disabled={disabled}
              className="hidden"
            />
            <div
              className={`w-4 h-4 border-2 rounded-full flex items-center justify-center transition-all ${
                value === key
                  ? "bg-blue-500 border-blue-500"
                  : "border-gray-400"
              }`}
            >
              {value === key && (
                <div className="w-2 h-2 bg-white rounded-full" />
              )}
            </div>
            <span className="text-sm">{label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default RadioOptionsSelector;
