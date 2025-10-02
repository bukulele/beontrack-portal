import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Button from "../button/Button";

function TimePeriodSelector({ onFetchData }) {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [half, setHalf] = useState("first"); // 'first' or 'second'

  // Calculate the year, month (0-indexed), and last day of the selected month.
  const year = selectedDate.year();
  const month = selectedDate.month(); // Note: dayjs months are 0-indexed.
  const lastDay = selectedDate.endOf("month").date();

  const handleHalfChange = (e) => {
    setHalf(e.target.value);
  };

  const handleSubmit = () => {
    let startDay, endDay;
    if (half === "first") {
      startDay = 1;
      endDay = 15;
    } else {
      startDay = 16;
      endDay = lastDay;
    }

    // Format the month and day as two-digit strings.
    const formattedMonth = ("0" + (month + 1)).slice(-2); // Convert month to 1-indexed.
    const formattedStartDay = ("0" + startDay).slice(-2);
    const formattedEndDay = ("0" + endDay).slice(-2);

    // Construct the start_date and end_date strings.
    const start_date = `${year}-${formattedMonth}-${formattedStartDay}`;
    const end_date = `${year}-${formattedMonth}-${formattedEndDay}`;

    // Build the query string in the required format.
    const queryString = `start_date=${start_date}&end_date=${end_date}`;

    // Pass the query string to the fetch handler.
    onFetchData(queryString);
  };

  return (
    <div className="flex gap-2 justify-center flex-auto">
      <div className="flex gap-2">
        <DatePicker
          size="small"
          views={["year", "month"]}
          value={selectedDate}
          onChange={(newValue) => {
            if (newValue) {
              setSelectedDate(newValue);
            }
          }}
          renderInput={(params) => <TextField {...params} helperText={null} />}
          slotProps={{
            textField: {
              size: "small",
            },
          }}
        />
        <div className="flex items-center gap-2 border rounded px-2">
          <span className="font-semibold">Dates range:</span>
          <label className="flex gap-1 items-center">
            <input
              type="radio"
              name="half"
              value="first"
              checked={half === "first"}
              onChange={handleHalfChange}
            />
            1 - 15
          </label>
          <label className="flex gap-1 items-center">
            <input
              type="radio"
              name="half"
              value="second"
              checked={half === "second"}
              onChange={handleHalfChange}
            />
            16 - {lastDay}
          </label>
        </div>
      </div>

      <Button fn={handleSubmit} style={"classicButton"} content={"Load Data"} />
    </div>
  );
}

export default TimePeriodSelector;
