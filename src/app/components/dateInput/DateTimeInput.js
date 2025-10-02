import React from "react";
import dayjs from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers";
import TextInput from "../textInput/TextInput";

function DateTimeInput({
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
  const handleChangeText = (value) => {
    updateState((prev) => {
      return typeof prev === "object" && prev !== null
        ? { ...prev, [name]: value.format("YYYY-MM-DDTHH:mm") }
        : value.format("YYYY-MM-DDTHH:mm");
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
          newValue = ""; // Set to empty if the selected date is before minDate
        }
      }

      if (maxDate) {
        const maxDateValue = new Date(maxDate);
        if (inputValueDate > maxDateValue) {
          newValue = ""; // Set to empty if the selected date is after maxDate
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
          {checkAllFields !== undefined ? "*" : ""}
        </label>
      )}
      <DateTimePicker
        value={value ? dayjs(value) : null} // Convert value to Dayjs object
        onChange={handleChangeText}
        minDateTime={minDate ? dayjs(minDate) : null} // Convert minDate to Dayjs
        maxDateTime={maxDate ? dayjs(maxDate) : null} // Convert maxDate to Dayjs
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
    </div>
  );
}

export default DateTimeInput;
