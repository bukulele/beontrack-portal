import React, { useState, useEffect, useContext } from "react";
import Button from "../button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateLeft,
  faCalendarDays,
  faCaretLeft,
  faCaretRight,
  faCheck,
  faEraser,
  faPenToSquare,
  faPlus,
  faTruckFront,
  faXmark,
  faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import DateTimeInput from "../dateInput/DateTimeInput";
import { DriverContext } from "@/app/context/DriverContext";
import { useLoader } from "@/app/context/LoaderContext";
import isValidDate from "@/app/functions/isValidDate";
import calculateWorkingHours from "@/app/functions/calculateWorkingHours";
import parseLocalDate from "@/app/functions/parseLocalDate";
import ModalContainer from "../modalContainer/ModalContainer";
import DriverScheduleComponent from "../driverSchedule/DriverScheduleComponent";
import { TrucksDriversContext } from "@/app/context/TrucksDriversContext";
import moment from "moment-timezone";
import { useInfoCard } from "@/app/context/InfoCardContext";
import { useTruckAttendance } from "@/app/functions/useTruckAttendance";
import defineLatestAssignment from "@/app/functions/defineLatestAssignment";

function DriverTimeCard({ tabData }) {
  const ADJUST_FOR_LUNCH = false;
  const currentDate = tabData?.timeCardDate
    ? parseLocalDate(tabData.timeCardDate)
    : new Date();
  const [currentHalf, setCurrentHalf] = useState(
    currentDate.getDate() <= 15 ? 1 : 2
  );
  const [attendanceData, setAttendanceData] = useState([]);
  const [daysData, setDaysData] = useState([]);
  const [month, setMonth] = useState(currentDate.getMonth());
  const [year, setYear] = useState(currentDate.getFullYear());
  const [editButtonToShow, setEditButtonToShow] = useState(null);
  const [timeInputToChange, setTimeInputToChange] = useState(null);
  const [addNewLine, setAddNewLine] = useState(false);
  const [showDriverSchedule, setShowDriverSchedule] = useState(false);
  const [shiftToShow, setShiftToShow] = useState(null);

  const { userData } = useContext(DriverContext);
  const { activeTrucksList } = useContext(TrucksDriversContext);

  const { startLoading, stopLoading } = useLoader();
  const { handleCardDataSet } = useInfoCard();

  const formatTime = (decimalHours) => {
    if (isNaN(decimalHours)) return "-";
    const hours = Math.floor(decimalHours);
    const minutes = Math.round((decimalHours - hours) * 60);

    if (hours + minutes === 0) return "-";
    return `${hours}h ${minutes.toString().padStart(2, "0")}min`;
  };

  const calculateTotalHours = (adjustForLunch = true) => {
    const total = generateDays().reduce((total, day) => {
      const dayData = daysData.find((d) => d.date === day) || { entries: [] };
      const dailyTotal = dayData.entries.reduce(
        (dayTotal, entry) =>
          dayTotal +
          parseFloat(
            calculateWorkingHours(
              entry.check_in_time,
              entry.check_out_time,
              false
            )
          ),
        0
      );

      return (
        total +
        (adjustForLunch && dailyTotal >= 5 ? dailyTotal - 0.5 : dailyTotal)
      );
    }, 0);

    return formatTime(total);
  };

  const handleSwitchHalf = (direction) => {
    if (direction === "prev") {
      if (currentHalf === 1) {
        setMonth(month === 0 ? 11 : month - 1);
        setYear(month === 0 ? year - 1 : year);
        setCurrentHalf(2);
      } else {
        setCurrentHalf(1);
      }
    } else {
      if (currentHalf === 2) {
        setMonth(month === 11 ? 0 : month + 1);
        setYear(month === 11 ? year + 1 : year);
        setCurrentHalf(1);
      } else {
        setCurrentHalf(2);
      }
    }
  };

  const handleResetToCurrent = () => {
    setMonth(currentDate.getMonth());
    setYear(currentDate.getFullYear());
    setCurrentHalf(currentDate.getDate() <= 15 ? 1 : 2);
  };

  const getHalfLabel = () => {
    return currentHalf === 1
      ? `1 - 15 ${new Date(year, month).toLocaleString("default", {
          month: "long",
        })} ${year}`
      : `16 - ${new Date(year, month + 1, 0).getDate()} ${new Date(
          year,
          month
        ).toLocaleString("default", { month: "long" })} ${year}`;
  };

  const generateDays = () => {
    const start = currentHalf === 1 ? 1 : 16;
    const end = currentHalf === 1 ? 15 : new Date(year, month + 1, 0).getDate();
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const handleCellHover = (entryType, day, entry) => {
    if (entryType === "clean") {
      setEditButtonToShow(null);
      return;
    }

    setEditButtonToShow({
      entryType,
      day,
      ...entry,
      check_in_time: entry.check_in_time?.slice(0, 19) || "",
      check_out_time: entry.check_out_time?.slice(0, 19) || "",
    });
  };

  const handleEditDate = () => {
    setTimeInputToChange(editButtonToShow);
  };

  const handleCancelEdit = () => {
    setTimeInputToChange(null);
  };

  const handleDeleteDate = () => {
    let editButtonData = { ...editButtonToShow };

    if (editButtonToShow.entryType === "in") {
      editButtonData.check_in_time = "";
    } else if (editButtonToShow.entryType === "out") {
      editButtonData.check_out_time = "";
    }

    setTimeInputToChange(editButtonData);
  };

  const formatDateForInput = (
    year,
    month,
    day,
    hours = 0,
    minutes = 0,
    seconds = 0
  ) => {
    const date = new Date(year, month, day, hours, minutes, seconds);
    const offset = date.getTimezoneOffset() * 60000; // Offset in milliseconds
    const localDate = new Date(date - offset).toISOString().slice(0, 19);
    return localDate;
  };

  const loadAttendanceData = () => {
    startLoading();
    fetch(`/api/get-attendance-data-driver/${userData.id}/${year}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setAttendanceData(data || []);
      })
      .catch((error) => {
        console.error("Failed to fetch data:", error);
      })
      .finally(() => stopLoading());
  };

  const { stopTruckShift } = useTruckAttendance({
    onSuccessStop: loadAttendanceData,
  });

  const saveDateTimeInput = (input) => {
    startLoading();
    let apiUrl = "/api/save-attendance-data-driver";
    let method = "POST";
    if (input.id) {
      apiUrl += `/${input.id}`;
      method = "PATCH";
    }

    if (
      input.id &&
      ((!input.check_in_time && !input.check_out_time) ||
        (input.check_in_time === "" && input.check_out_time === ""))
    ) {
      // If both check_in_time and check_out_time are empty, delete the entry
      method = "DELETE";
    }

    const data = new FormData();

    data.append("check_in_time", input.check_in_time || "");
    data.append("check_out_time", input.check_out_time || "");
    data.append("driver", userData.id);

    fetch(apiUrl, {
      method,
      body: data,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          // Handle non-2xx HTTP responses
          return response.json().then((errorDetails) => {
            throw new Error(errorDetails || "An unknown error occurred.");
          });
        }
      })
      .then((data) => {
        // If check_out_time is set (closing shift), also close the latest truck assignment
        if (data.check_out_time && data.check_out_time !== "") {
          const latestAssignment = defineLatestAssignment(
            data?.truck_assignments
          );
          if (latestAssignment) {
            stopTruckShift(latestAssignment.id, data.id, data.check_out_time);
          } else {
            // No ongoing truck assignment found – just refresh attendance
            loadAttendanceData();
          }
        } else {
          // Shift is still open or newly created – just refresh attendance
          loadAttendanceData();
        }

        // Clear edit state regardless
        setTimeInputToChange(null);
      })
      .catch((error) => console.error("Failed to save data:", error))
      .finally(() => stopLoading());
  };

  const handleAddLine = () => {
    setAddNewLine(true);
    let dataToSet = { ...editButtonToShow };
    delete dataToSet.id;
    dataToSet.check_in_time = "";
    dataToSet.check_out_time = "";

    setTimeInputToChange(dataToSet);
  };

  const handleShowTrucksAssignments = (shiftId) => {
    setShiftToShow(attendanceData.find((item) => item.id === shiftId));
  };

  useEffect(() => {
    if (attendanceData.length === 0) {
      setDaysData([]);
      return;
    }

    // Filter entries by year and month
    const currentMonthData = attendanceData.filter((item) => {
      let checkInTime = item.check_in_time || "";
      let checkOutTime = item.check_out_time || "";
      let itemDate;
      // const itemDate = new Date(checkInTime.slice(0, 19));

      if (checkInTime.length > 0) {
        itemDate = new Date(checkInTime.slice(0, 19));
      } else if (checkInTime.length === 0 && checkOutTime.length > 0) {
        itemDate = new Date(checkOutTime.slice(0, 19));
      }

      const itemYear = itemDate.getFullYear();
      const itemMonth = itemDate.getMonth();

      return itemYear === year && itemMonth === month;
    });

    // Group entries by day
    const todayAttendanceData = generateDays().map((day) => {
      const todayEntries = currentMonthData.filter((item) => {
        let checkInTime = item.check_in_time || "";
        let checkOutTime = item.check_out_time || "";
        let itemDate;

        if (checkInTime.length > 0) {
          itemDate = new Date(checkInTime.slice(0, 19));
        } else if (checkInTime.length === 0 && checkOutTime.length > 0) {
          itemDate = new Date(checkOutTime.slice(0, 19));
        }
        const itemDay = itemDate.getDate();
        return itemDay === day;
      });

      return {
        date: day,
        entries: todayEntries,
      };
    });

    setDaysData(todayAttendanceData);
  }, [attendanceData, currentHalf, month, year]);

  useEffect(() => {
    if (!userData) return;

    loadAttendanceData();
  }, [userData, year]);

  if (!activeTrucksList) return;

  return (
    <div className="flex flex-col flex-1 h-3/4 overflow-hidden p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Driver Time Card</h2>
      <div className="flex gap-2 items-center mb-4">
        <Button
          content={<FontAwesomeIcon icon={faCaretLeft} />}
          style={"classicButton-s"}
          fn={() => handleSwitchHalf("prev")}
        />
        <span className="text-lg font-medium w-56 text-center">
          {getHalfLabel()}
        </span>
        <Button
          content={<FontAwesomeIcon icon={faCaretRight} />}
          style={"classicButton-s"}
          fn={() => handleSwitchHalf("next")}
        />
        <Button
          content={"Today"}
          style={"classicButton-s"}
          fn={handleResetToCurrent}
        />
        <Button
          content={<FontAwesomeIcon icon={faArrowRotateLeft} />}
          style={"classicButton-s"}
          fn={loadAttendanceData}
          tooltipId={"reload-time-card-tooltip"}
          tooltipContent={"Reload"}
        />
        <Button
          content={
            <div className="flex gap-1 items-center">
              <FontAwesomeIcon icon={faCalendarDays} />
              <p>Schedule</p>
            </div>
          }
          style={"classicButton-s"}
          fn={() => setShowDriverSchedule(true)}
        />
        <p className="ml-auto text-red-700">
          Time is shown in Winnipeg time zone
        </p>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="sticky z-10 top-0 grid grid-cols-[50px_1fr_1fr_50px_1fr] gap-px text-center bg-gray-200">
          <div className="font-bold p-2">Day</div>
          <div className="font-bold p-2">IN</div>
          <div className="font-bold p-2">OUT</div>
          <div></div>
          <div className="font-bold p-2">Total</div>
        </div>
        <div className="grid grid-cols-[50px_1fr_1fr_50px_1fr] gap-px text-center">
          {generateDays().map((day, index) => {
            const dayData = daysData.find((d) => d.date === day) || {
              entries: [],
            };

            if (dayData.entries.length > 0) {
              dayData.entries.sort((a, b) => {
                let valueA = a.check_in_time;
                let valueB = b.check_in_time;

                // Handle undefined or null values
                if (valueA === undefined || valueA === null) valueA = "";
                if (valueB === undefined || valueB === null) valueB = "";

                // Handle cases where values are dates
                if (isValidDate(valueA) && isValidDate(valueB)) {
                  valueA = new Date(valueA);
                  valueB = new Date(valueB);
                  return valueA - valueB;
                } else if (isValidDate(valueA)) {
                  valueA = new Date(valueA);
                  valueB = new Date("9999-12-31"); // Fallback date
                  return valueA - valueB;
                } else if (isValidDate(valueB)) {
                  valueA = new Date("9999-12-31"); // Fallback date
                  valueB = new Date(valueB);
                  return valueA - valueB;
                }
              });
            }
            const dailyTotal = dayData.entries.reduce((total, entry) => {
              return (
                total +
                parseFloat(
                  calculateWorkingHours(
                    entry.check_in_time,
                    entry.check_out_time,
                    false
                  )
                )
              );
            }, 0);
            const adjustedTotal =
              dailyTotal >= 5 && ADJUST_FOR_LUNCH
                ? dailyTotal - 0.5
                : dailyTotal;
            return (
              <React.Fragment key={index}>
                <div
                  className={`flex items-center justify-center ${
                    index % 2 === 0 ? "bg-blue-50 p-2" : "bg-white p-2"
                  }`}
                >
                  {day}
                </div>
                <div
                  className={`flex flex-col ${
                    index % 2 === 0 ? "bg-blue-50 p-2" : "bg-white p-2"
                  }`}
                >
                  {dayData.entries.length > 0 ? (
                    dayData.entries.map((entry, idx) => (
                      <div
                        key={idx}
                        onMouseEnter={() => handleCellHover("in", day, entry)}
                        onMouseLeave={() => handleCellHover("clean")}
                        className="flex w-full items-center justify-center gap-2 relative"
                      >
                        {timeInputToChange &&
                        timeInputToChange.id === entry.id &&
                        timeInputToChange.entryType === "in" ? (
                          <>
                            <DateTimeInput
                              name={"check_in_time"}
                              value={timeInputToChange.check_in_time}
                              minDate={formatDateForInput(year, month, day - 1)}
                              maxDate={formatDateForInput(
                                year,
                                month,
                                day,
                                23,
                                59,
                                59
                              )}
                              updateState={setTimeInputToChange}
                              style={"minimalistic"}
                            />
                            <Button
                              content={<FontAwesomeIcon icon={faXmark} />}
                              fn={handleCancelEdit}
                              style="iconButton"
                            />
                            <Button
                              content={<FontAwesomeIcon icon={faCheck} />}
                              fn={() => saveDateTimeInput(timeInputToChange)}
                              style="iconButton"
                              highlighted={true}
                            />
                          </>
                        ) : (
                          <>
                            {editButtonToShow &&
                              entry &&
                              editButtonToShow.id === entry.id &&
                              editButtonToShow.entryType === "in" &&
                              idx === dayData.entries.length - 1 && (
                                <div className="absolute left-1">
                                  <Button
                                    content={<FontAwesomeIcon icon={faPlus} />}
                                    fn={handleAddLine}
                                    style={"iconButton"}
                                    highlighted={true}
                                  />
                                </div>
                              )}
                            {isValidDate(entry.check_in_time?.slice(0, 19))
                              ? new Date(
                                  entry.check_in_time.slice(0, 19)
                                ).toLocaleString()
                              : "-"}
                            {editButtonToShow &&
                              editButtonToShow.id === entry.id &&
                              editButtonToShow.entryType === "in" && (
                                <div className="flex gap-1 absolute right-1">
                                  <Button
                                    content={
                                      <FontAwesomeIcon icon={faEraser} />
                                    }
                                    fn={handleDeleteDate}
                                    style={"iconButton"}
                                  />
                                  <Button
                                    content={
                                      <FontAwesomeIcon icon={faPenToSquare} />
                                    }
                                    fn={handleEditDate}
                                    style={"iconButton"}
                                    highlighted={true}
                                  />
                                </div>
                              )}
                          </>
                        )}
                      </div>
                    ))
                  ) : (
                    <div
                      onMouseEnter={() =>
                        handleCellHover("in", day, { check_in_time: "" })
                      }
                      onMouseLeave={() => handleCellHover("clean")}
                      className="flex w-full items-center justify-center gap-2 relative"
                    >
                      {timeInputToChange &&
                      timeInputToChange.id &&
                      timeInputToChange.day === day &&
                      timeInputToChange.entryType === "in" ? (
                        <>
                          <DateTimeInput
                            name={"check_in_time"}
                            value={timeInputToChange.check_in_time}
                            minDate={formatDateForInput(year, month, day - 1)}
                            maxDate={formatDateForInput(
                              year,
                              month,
                              day,
                              23,
                              59,
                              59
                            )}
                            updateState={setTimeInputToChange}
                            style={"minimalistic"}
                          />
                          <Button
                            content={<FontAwesomeIcon icon={faXmark} />}
                            fn={handleCancelEdit}
                            style="iconButton"
                          />
                          <Button
                            content={<FontAwesomeIcon icon={faCheck} />}
                            fn={() => saveDateTimeInput(timeInputToChange)}
                            style="iconButton"
                            highlighted={true}
                          />
                        </>
                      ) : (
                        <>
                          -
                          {editButtonToShow &&
                            editButtonToShow.day === day &&
                            editButtonToShow.entryType === "in" && (
                              <div className="absolute right-1">
                                <Button
                                  content={
                                    <FontAwesomeIcon icon={faPenToSquare} />
                                  }
                                  fn={handleAddLine}
                                  style={"iconButton"}
                                  highlighted={true}
                                />
                              </div>
                            )}
                        </>
                      )}
                    </div>
                  )}
                  {addNewLine &&
                  timeInputToChange &&
                  !timeInputToChange.id &&
                  timeInputToChange.day === day &&
                  timeInputToChange.entryType === "in" ? (
                    <div className="flex w-full items-center justify-center gap-2 relative">
                      <DateTimeInput
                        name={"check_in_time"}
                        value={timeInputToChange.check_in_time}
                        minDate={formatDateForInput(year, month, day - 1)}
                        maxDate={formatDateForInput(
                          year,
                          month,
                          day,
                          23,
                          59,
                          59
                        )}
                        updateState={setTimeInputToChange}
                        style={"minimalistic"}
                      />
                      <Button
                        content={<FontAwesomeIcon icon={faXmark} />}
                        fn={handleCancelEdit}
                        style="iconButton"
                      />
                      <Button
                        content={<FontAwesomeIcon icon={faCheck} />}
                        fn={() => saveDateTimeInput(timeInputToChange)}
                        style="iconButton"
                        highlighted={true}
                      />
                    </div>
                  ) : null}
                </div>
                <div
                  className={
                    index % 2 === 0 ? "bg-blue-50 p-2" : "bg-white p-2"
                  }
                >
                  {dayData.entries.length > 0 ? (
                    dayData.entries.map((entry, idx) => (
                      <div
                        key={idx}
                        onMouseEnter={() => handleCellHover("out", null, entry)}
                        onMouseLeave={() => handleCellHover("clean")}
                        className="flex w-full items-center justify-center gap-2 relative"
                      >
                        {timeInputToChange &&
                        timeInputToChange.id === entry.id &&
                        timeInputToChange.entryType === "out" ? (
                          <>
                            <DateTimeInput
                              name={"check_out_time"}
                              value={timeInputToChange.check_out_time}
                              minDate={formatDateForInput(year, month, day)}
                              maxDate={formatDateForInput(
                                year,
                                month,
                                day + 1,
                                23,
                                59,
                                59
                              )}
                              updateState={setTimeInputToChange}
                              style={"minimalistic"}
                            />
                            <Button
                              content={<FontAwesomeIcon icon={faXmark} />}
                              fn={handleCancelEdit}
                              style="iconButton"
                            />
                            <Button
                              content={<FontAwesomeIcon icon={faCheck} />}
                              fn={() => saveDateTimeInput(timeInputToChange)}
                              style="iconButton"
                              highlighted={true}
                            />
                          </>
                        ) : (
                          <>
                            {isValidDate(entry.check_out_time?.slice(0, 19))
                              ? new Date(
                                  entry.check_out_time.slice(0, 19)
                                ).toLocaleString()
                              : "-"}
                            {editButtonToShow &&
                              editButtonToShow.id === entry.id &&
                              editButtonToShow.entryType === "out" && (
                                <div className="flex gap-1 absolute right-1">
                                  {!isNaN(new Date(entry.check_out_time)) && (
                                    <Button
                                      content={
                                        <FontAwesomeIcon icon={faEraser} />
                                      }
                                      fn={handleDeleteDate}
                                      style={"iconButton"}
                                    />
                                  )}
                                  <Button
                                    content={
                                      <FontAwesomeIcon icon={faPenToSquare} />
                                    }
                                    fn={handleEditDate}
                                    style={"iconButton"}
                                    highlighted={true}
                                  />
                                </div>
                              )}
                          </>
                        )}
                      </div>
                    ))
                  ) : (
                    <div
                      onMouseEnter={() =>
                        handleCellHover("out", day, { check_out_time: "" })
                      }
                      onMouseLeave={() => handleCellHover("clean")}
                      className="flex w-full items-center justify-center gap-2 relative"
                    >
                      {timeInputToChange &&
                      timeInputToChange.day === day &&
                      timeInputToChange.entryType === "out" ? (
                        <>
                          <DateTimeInput
                            name={"check_out_time"}
                            value={timeInputToChange.check_out_time}
                            minDate={formatDateForInput(year, month, day)}
                            maxDate={formatDateForInput(
                              year,
                              month,
                              day + 1,
                              23,
                              59,
                              59
                            )}
                            updateState={setTimeInputToChange}
                            style={"minimalistic"}
                          />
                          <Button
                            content={<FontAwesomeIcon icon={faXmark} />}
                            fn={handleCancelEdit}
                            style="iconButton"
                          />
                          <Button
                            content={<FontAwesomeIcon icon={faCheck} />}
                            fn={() => saveDateTimeInput(timeInputToChange)}
                            style="iconButton"
                            highlighted={true}
                          />
                        </>
                      ) : (
                        <>
                          -
                          {editButtonToShow &&
                            editButtonToShow.day === day &&
                            editButtonToShow.entryType === "out" &&
                            editButtonToShow.check_in_time && (
                              <div className="absolute right-1">
                                <Button
                                  content={
                                    <FontAwesomeIcon icon={faPenToSquare} />
                                  }
                                  fn={handleEditDate}
                                  style={"iconButton"}
                                  highlighted={true}
                                />
                              </div>
                            )}
                        </>
                      )}
                    </div>
                  )}
                </div>
                <div
                  className={`flex flex-col ${
                    index % 2 === 0 ? "bg-blue-50 p-2" : "bg-white p-2"
                  }`}
                >
                  {dayData.entries.length > 0
                    ? dayData.entries.map((entry, idx) => {
                        return (
                          <div
                            key={`truck_button_${idx}`}
                            className="flex w-full h-full justify-center items-center"
                          >
                            {entry.truck_assignments.length > 0 ? (
                              <Button
                                style={"iconButton"}
                                fn={() => handleShowTrucksAssignments(entry.id)}
                                content={
                                  <FontAwesomeIcon
                                    icon={faTruckFront}
                                    className="pointer-events-none"
                                  />
                                }
                                tooltipContent={"Show assigned trucks data"}
                                tooltipId={`truck_button_${idx}_tooltip`}
                              />
                            ) : (
                              "-"
                            )}
                          </div>
                        );
                      })
                    : null}
                </div>
                <div
                  className={`flex items-center justify-center ${
                    index % 2 === 0 ? "bg-blue-50 p-2" : "bg-white p-2"
                  }`}
                >
                  {formatTime(adjustedTotal)}
                  {dailyTotal >= 5 && ADJUST_FOR_LUNCH && " (Lunch -30 min)"}
                </div>
              </React.Fragment>
            );
          })}
          <div className="col-span-4 font-semibold bg-gray-100 p-2">
            Total Hours
          </div>
          <div className="col-span-1 font-semibold bg-gray-100 p-2">
            {calculateTotalHours(ADJUST_FOR_LUNCH)}
          </div>
        </div>
      </div>
      <ModalContainer modalIsOpen={showDriverSchedule}>
        <DriverScheduleComponent
          closeScheduleModal={() => setShowDriverSchedule(false)}
        />
      </ModalContainer>
      <ModalContainer modalIsOpen={shiftToShow}>
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="font-bold">Trucks assigned to shift</p>
          <div className="flex gap-2 items-center">
            <p>
              {isValidDate(shiftToShow?.check_in_time?.slice(0, 19))
                ? new Date(
                    shiftToShow?.check_in_time.slice(0, 19)
                  ).toLocaleString()
                : "-"}
            </p>
            -
            <p>
              {isValidDate(shiftToShow?.check_out_time?.slice(0, 19))
                ? new Date(
                    shiftToShow?.check_out_time.slice(0, 19)
                  ).toLocaleString()
                : "current"}
            </p>
          </div>
          <div className="flex flex-col w-full">
            <p className="font-semibold">Trucks assigned:</p>
            <div className="grid grid-cols-[auto_1fr_20px_1fr_auto] gap-px">
              {shiftToShow?.truck_assignments.map((truck, idx) => {
                return (
                  <React.Fragment key={`truck_${truck.truck}_${idx}`}>
                    <p className="px-2 bg-slate-100">{`${
                      activeTrucksList[truck.truck].unit_number
                    } ${activeTrucksList[truck.truck].make} ${
                      activeTrucksList[truck.truck].model
                    }`}</p>
                    <p className="px-2 bg-slate-100">
                      {isValidDate(truck?.truck_start_time?.slice(0, 19))
                        ? moment(truck?.truck_start_time.slice(0, 19)).format(
                            "hh:mm A"
                          )
                        : "-"}
                    </p>
                    <p className="px-2 text-center bg-slate-100">-</p>
                    <p className="px-2 bg-slate-100">
                      {isValidDate(truck?.truck_end_time?.slice(0, 19))
                        ? moment(truck?.truck_end_time.slice(0, 19)).format(
                            "hh:mm A"
                          )
                        : "current"}
                    </p>
                    <div className="px-1">
                      <Button
                        content={
                          <FontAwesomeIcon
                            icon={faArrowUpRightFromSquare}
                            className="pointer-events-none"
                          />
                        }
                        style={"iconButton"}
                        tooltipContent={"Go To Truck Card"}
                        tooltipId={`go-to-truck-${truck.truck}-card-tooltip`}
                        fn={() => handleCardDataSet(truck.truck, "truck")}
                        highlighted={true}
                      />
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
          <Button
            fn={() => setShiftToShow(null)}
            style={"classicButton"}
            content={"Close"}
          />
        </div>
      </ModalContainer>
    </div>
  );
}

export default DriverTimeCard;
