import { DatePicker } from "@mui/x-date-pickers";
import React from "react";
import dayjs from "dayjs";
import TextInput from "../textInput/TextInput";

function DateInput({
  name,
  label,
  value,
  minDate,
  maxDate,
  placeholder,
  updateState,
  checkAllFields,
  disabled,
  style,
  mandatory,
}) {
  // const handleChangeText = (event) => {
  //   updateState((prev) => {
  //     return typeof prev === "object" && prev !== null
  //       ? { ...prev, [name]: event.target.value }
  //       : event.target.value;
  //   });
  // };

  const handleChangeText = (value) => {
    updateState((prev) => {
      return typeof prev === "object" && prev !== null
        ? { ...prev, [name]: value.format("YYYY-MM-DD") }
        : value.format("YYYY-MM-DD");
    });
  };

  const handleBlur = () => {
    const isValidDate = !isNaN(Date.parse(value));
    let newValue = value;

    if (isValidDate) {
      const inputValueDate = new Date(value);

      if (minDate) {
        const minDateValue = new Date(minDate);
        if (inputValueDate < minDateValue) {
          newValue = ""; // Set to minDate if the selected date is before minDate
        }
      }

      if (maxDate) {
        const maxDateValue = new Date(maxDate);
        if (inputValueDate > maxDateValue) {
          newValue = ""; // Set to maxDate if the selected date is after maxDate
        }
      }
    } else {
      newValue = ""; // Clear the value if the date is invalid
    }

    updateState((prev) => {
      return typeof prev === "object" && prev !== null
        ? { ...prev, [name]: newValue }
        : newValue;
    });
  };

  return (
    <div className="flex flex-col">
      {label && (
        <label>
          {label}
          {mandatory ? "*" : ""}
        </label>
      )}
      <DatePicker
        value={value ? dayjs(value) : null} // Convert value to Dayjs object
        onChange={handleChangeText}
        minDate={minDate ? dayjs(minDate) : null} // Convert minDate to Dayjs
        maxDate={maxDate ? dayjs(maxDate) : null} // Convert maxDate to Dayjs
        disabled={disabled}
        renderInput={(params) => (
          <TextInput {...params} placeholder={placeholder} />
        )}
        slotProps={{
          textField: {
            error: mandatory && checkAllFields && value.length === 0,
            size: "small",
            onBlur: handleBlur,
            sx: {
              "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: "#e34798", // Custom error border color
                },
              "& .MuiFormLabel-root.Mui-error": {
                color: "#e34798", // Custom error label color
              },
            },
          },
        }}
      />
      {/* <input
        className={`rounded ${
          mandatory && checkAllFields && value.length === 0
            ? "border-pink-500"
            : style === "minimalistic"
            ? "border-none p-0"
            : "border-gray-300"
        }`}
        id={name}
        name={name}
        type="date"
        value={value}
        onChange={handleChangeText}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        min={minDate}
        max={maxDate}
      /> */}
    </div>
  );
}

export default DateInput;
