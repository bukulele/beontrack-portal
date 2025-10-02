import React, { useState, useEffect, useContext, useMemo } from "react";
import Button from "../button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateLeft,
  faCaretLeft,
  faCaretRight,
  faCheck,
  faEraser,
  faPenToSquare,
  faPlus,
  faXmark,
  faSuitcaseMedical,
  faGlobe,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import DateTimeInput from "../dateInput/DateTimeInput";
import { EmployeeContext } from "@/app/context/EmployeeContext";
import { useLoader } from "@/app/context/LoaderContext";
import isValidDate from "@/app/functions/isValidDate";
import calculateWorkingHours from "@/app/functions/calculateWorkingHours";
import parseLocalDate from "@/app/functions/parseLocalDate";
import safeToIsoWithOffset from "@/app/functions/safeToIsoWithOffset";
import getFriendlyZoneName from "@/app/functions/getFriendlyZoneName";
import ModalContainer from "../modalContainer/ModalContainer";
import { useCreateObject } from "@/app/context/CreateObjectContext";
import { useSession } from "next-auth/react";
import useUserRoles from "@/app/functions/useUserRoles";
import MapModalContainer from "../modalContainer/MapModalContainer";
import dynamic from "next/dynamic";
import { faSquareCheck, faSquare } from "@fortawesome/free-solid-svg-icons";
import InfoMessageModalContainer from "../modalContainer/InfoMessageModalContainer";
import { Tooltip } from "react-tooltip";

const MapComponent = dynamic(() => import("../mapComponent/MapComponent"), {
  ssr: false,
});

function EmployeeTimeCard({ tabData }) {
  const MEDICAL_DAYS_TOTAL = 10;
  const currentDate = tabData?.timeCardDate
    ? parseLocalDate(tabData.timeCardDate)
    : new Date();
  const [currentHalf, setCurrentHalf] = useState(
    currentDate.getDate() <= 15 ? 1 : 2
  );
  const [attendanceData, setAttendanceData] = useState([]);
  const [availableMedicalDays, setAvailableMedicalDays] = useState(0);
  const [daysData, setDaysData] = useState([]);
  const [month, setMonth] = useState(currentDate.getMonth());
  const [year, setYear] = useState(currentDate.getFullYear());
  const [editButtonToShow, setEditButtonToShow] = useState(null);
  const [timeInputToChange, setTimeInputToChange] = useState(null);
  const [addNewLine, setAddNewLine] = useState(false);
  const [showMedicalModal, setShowMedicalModal] = useState(false);
  const [pendingMedical, setPendingMedical] = useState(null);
  const [hoursAdjustments, setHoursAdjustments] = useState([]);
  const [showDeleteAdjModal, setShowDeleteAdjModal] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [initialCoordinates, setInitialCoordinates] = useState("");
  const [showInfoModal, setShowInfoModal] = useState({
    show: false,
    message: "",
  });

  const { userData, loadEmployeeData } = useContext(EmployeeContext);
  const { startLoading, stopLoading } = useLoader();
  const { data: session } = useSession();
  const userRoles = useUserRoles();

  const {
    setCreateObjectModalIsOpen,
    setObjectType,
    setAfterCreateCallback,
    handleCreateObjectModalClose,
    setServerData,
  } = useCreateObject();

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const city = getFriendlyZoneName(timeZone);

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
            calculateWorkingHours(entry.check_in_time, entry.check_out_time)
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

  const getPayDayString = (y, m, half) => {
    const day = half === 1 ? "01" : "16"; // 1-15 → 01, 16-EOMonth → 16
    const month = String(m + 1).padStart(2, "0"); // JS month is 0-based
    return `${y}-${month}-${day}`; // e.g. 2025-06-01
  };

  const periodStartDay = currentHalf === 1 ? 1 : 16;

  const formatDateForInput = (
    year,
    month,
    day,
    hours = 0,
    minutes = 0,
    seconds = 0
  ) => {
    const date = new Date(year, month, day, hours, minutes, seconds);
    return date.toISOString();
    // const offset = date.getTimezoneOffset() * 60000; // Offset in milliseconds
    // const localDate = new Date(date - offset).toISOString().slice(0, 19);
    // return localDate;
  };

  const medTimes = (y, m, d) => ({
    check_in_time: formatDateForInput(y, m, d, 8, 0, 0),
    check_out_time: formatDateForInput(y, m, d, 16, 30, 0),
  });

  const handleCellHover = (entryType, day, entry) => {
    if (
      !userRoles.includes(
        process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PAYROLL_MANAGER
      ) &&
      !userRoles.includes(process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_ADMIN)
    )
      return;
    if (entryType === "clean") {
      setEditButtonToShow(null);
      return;
    }

    if (entryType === "med") {
      const base = medTimes(year, month, day);
      setEditButtonToShow({ entryType: "med", day, ...base });
      return;
    }

    setEditButtonToShow({
      entryType,
      day,
      ...entry,
      check_in_time: entry.check_in_time || "",
      check_out_time: entry.check_out_time || "",
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

  const loadMedicalLeaveData = () => {
    startLoading();
    fetch(`/api/get-medical-leave-data/${userData.id}/${year}`, {
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
        setAvailableMedicalDays(MEDICAL_DAYS_TOTAL - data.medical_shifts);
      })
      .catch((error) => {
        console.error("Failed to fetch data:", error);
      })
      .finally(() => stopLoading());
  };

  const loadAdjustmentsData = () => {
    const payDay = getPayDayString(year, month, currentHalf);
    startLoading();
    fetch(`/api/get-adjustments-data/${userData.id}/${payDay}`, {
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
        setHoursAdjustments(data);
      })
      .catch((error) => {
        console.error("Failed to fetch data:", error);
      })
      .finally(() => stopLoading());
  };

  const loadAttendanceData = () => {
    startLoading();
    fetch(`/api/get-attendance-data/${userData.id}/${year}`, {
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
      .then(() => loadMedicalLeaveData())
      // .then(() => loadAdjustmentsData())
      .catch((error) => {
        console.error("Failed to fetch data:", error);
      })
      .finally(() => stopLoading());
  };

  const saveDateTimeInput = (input) => {
    startLoading();
    let apiUrl = "/api/save-attendance-data";
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

    if ("medical" in input) {
      data.append("medical", input.medical);
    }

    data.append(
      "check_in_time",
      input?.check_in_time?.length > 0
        ? safeToIsoWithOffset(input.check_in_time)
        : ""
    );
    data.append(
      "check_out_time",
      input?.check_out_time?.length > 0
        ? safeToIsoWithOffset(input.check_out_time)
        : ""
    );
    data.append("employee", userData.id);

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
      .then(() => {
        loadAttendanceData();
        setTimeInputToChange(null);
      })
      .catch((error) => console.error("Failed to save data:", error))
      .finally(() => stopLoading());
  };

  const confirmMedicalLeave = async () => {
    if (!pendingMedical) return; // safety guard
    const { day } = pendingMedical;
    const base = medTimes(year, month, day);

    // 1) delete everything on that day
    const entries = daysData.find((d) => d.date === day)?.entries || [];
    await Promise.all(
      entries.map((e) =>
        fetch(`/api/save-attendance-data/${e.id}`, { method: "DELETE" })
      )
    );

    // 2) POST the medical-leave row
    saveDateTimeInput({ ...base, medical: true });

    setPendingMedical(null);
    setShowMedicalModal(false); // close dialog
  };

  const handleAddLine = () => {
    setAddNewLine(true);
    let dataToSet = { ...editButtonToShow };
    delete dataToSet.id;
    dataToSet.check_in_time = "";
    dataToSet.check_out_time = "";

    setTimeInputToChange(dataToSet);
  };

  const deleteAdjustment = async (id) => {
    startLoading();
    try {
      await fetch(`/api/get-adjustments-data/delete/${id}`, {
        method: "DELETE",
      });
      setHoursAdjustments((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Failed to delete adjustment:", err);
    } finally {
      stopLoading();
    }
  };

  const afterObjectCreateCallback = () => {
    handleCreateObjectModalClose();
    loadAdjustmentsData();
    loadAttendanceData();
  };

  const handleOpenAddAdjustmentModal = () => {
    // build "2025-06-01" or "2025-06-16" for the visible half-month
    const firstPayDay = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      periodStartDay
    ).padStart(2, "0")}`;

    const dataToSet = {
      first_pay_day: firstPayDay,
      employee: userData.id,
      username: session?.user?.name,
    };

    setAfterCreateCallback(() => afterObjectCreateCallback);
    setObjectType("employee_adjustment");
    setServerData(dataToSet);
    setCreateObjectModalIsOpen(true);
  };

  const confirmDeleteAdjustment = () => {
    if (!pendingDeleteId) return;
    deleteAdjustment(pendingDeleteId);
    setPendingDeleteId(null);
    setShowDeleteAdjModal(false);
  };

  const openMap = (coords) => {
    setInitialCoordinates(coords);
    setShowMapModal(true);
  };

  const closeMap = () => {
    setInitialCoordinates("");
    setShowMapModal(false);
  };

  // Parse comma-separated user IDs and filter out current user
  const parseUserIds = (userIdString, currentUserId) => {
    if (!userIdString) return [];

    return userIdString
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id && id !== currentUserId);
  };

  // Check if exclamation mark should be shown
  const shouldShowExclamationMark = (entry, currentUserId) => {
    // Check if user has permission to see this info
    if (
      !userRoles.includes(
        process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PAYROLL_MANAGER
      )
    ) {
      return false;
    }

    const thirdPartyInIds = parseUserIds(entry.user_id_in, currentUserId);
    const thirdPartyOutIds = parseUserIds(entry.user_id_out, currentUserId);

    return thirdPartyInIds.length > 0 || thirdPartyOutIds.length > 0;
  };

  // Get all unique third-party user IDs for a day's entries
  const getAllThirdPartyUserIds = (entries, currentUserId) => {
    // Check if user has permission to see this info
    if (
      !userRoles.includes(
        process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PAYROLL_MANAGER
      )
    ) {
      return null;
    }

    const allThirdPartyIds = [];

    entries.forEach((entry) => {
      const thirdPartyInIds = parseUserIds(entry.user_id_in, currentUserId);
      const thirdPartyOutIds = parseUserIds(entry.user_id_out, currentUserId);

      allThirdPartyIds.push(...thirdPartyInIds, ...thirdPartyOutIds);
    });

    const uniqueIds = [...new Set(allThirdPartyIds)];

    if (uniqueIds.length === 0) return null;

    return (
      <div>
        <div className="font-bold mb-2">User has been logged in under IDs:</div>
        <ul className="list-disc list-inside ml-2">
          {uniqueIds.map((id) => (
            <li key={id} className="text-left">
              {id}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const handleRemoteCheckinChange = (value) => {
    startLoading();

    fetch("/api/update-employee", {
      method: "PATCH",
      body: JSON.stringify({
        id: userData.id,
        can_checkin_remotely: value,
        changed_by: session.user.name,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        response.json();
      })
      .then(() => {
        loadEmployeeData();
      })
      .catch((error) => {
        console.error("Error:", error);
        setShowInfoModal({
          show: true,
          message: "Something went wrong. Please try to save changes again.",
        });
      })
      .finally(() => stopLoading());
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

      if (checkInTime.length > 0) {
        itemDate = new Date(checkInTime);
      } else if (checkInTime.length === 0 && checkOutTime.length > 0) {
        itemDate = new Date(checkOutTime);
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
          itemDate = new Date(checkInTime);
        } else if (checkInTime.length === 0 && checkOutTime.length > 0) {
          itemDate = new Date(checkOutTime);
        }
        const itemDay = itemDate.getDate();
        return itemDay === day;
      });
      // .map((item) => {
      //   console.log(item);
      //   return {
      //     ...item,
      //     check_in_time: item.check_in_time?.slice(0, 19) || "",
      //     check_out_time: item.check_out_time?.slice(0, 19) || "",
      //   };
      // });

      return {
        date: day,
        entries: todayEntries,
      };
    });

    setDaysData(todayAttendanceData);
  }, [attendanceData, currentHalf, month, year]);

  useEffect(() => {
    if (!userData) return;
    loadAdjustmentsData();
  }, [userData, year, month, currentHalf]);

  useEffect(() => {
    if (!userData) return;

    loadAttendanceData();
  }, [userData, year]);

  return (
    <div className="flex flex-col flex-1 h-3/4 overflow-hidden p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Employee Time Card
      </h2>
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
        {userRoles.includes(
          process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PAYROLL_MANAGER
        ) && (
          <Button
            content={
              <div className="flex gap-1 items-center">
                <FontAwesomeIcon icon={faPlus} />
                <p>Add Adjustment</p>
              </div>
            }
            style={"classicButton-s"}
            fn={handleOpenAddAdjustmentModal}
          />
        )}
        <p className="ml-auto text-red-700">
          You are working in {city} time zone.
        </p>
      </div>
      <div className="w-full flex justify-between mb-2">
        <div className="flex gap-1 items-center">
          <p>Allow mobile check-in</p>
          <Button
            content={
              <FontAwesomeIcon
                icon={userData.can_checkin_remotely ? faSquareCheck : faSquare}
                className="text-xl"
              />
            }
            style="iconButton"
            fn={() => handleRemoteCheckinChange(!userData.can_checkin_remotely)}
            disabled={
              !userRoles.includes(
                process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PAYROLL_MANAGER
              )
            }
          />
        </div>
        <p className="ml-auto text-right">
          Medical leave days left in {year}: {availableMedicalDays} from{" "}
          {MEDICAL_DAYS_TOTAL}
        </p>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="sticky z-10 top-0 grid grid-cols-[50px_4fr_4fr_3fr] gap-px text-center bg-gray-200">
          <div className="font-bold p-2">Day</div>
          <div className="font-bold p-2">IN</div>
          <div className="font-bold p-2">OUT</div>
          <div className="font-bold p-2">Total</div>
        </div>
        <div className="grid grid-cols-[50px_4fr_4fr_3fr] gap-px text-center">
          {generateDays().map((day, index) => {
            const dayData = daysData.find((d) => d.date === day) || {
              entries: [],
            };
            const dailyTotal = dayData.entries.reduce((total, entry) => {
              return (
                total +
                parseFloat(
                  calculateWorkingHours(
                    entry.check_in_time,
                    entry.check_out_time
                  )
                )
              );
            }, 0);
            const adjustedTotal =
              dailyTotal >= 5 ? dailyTotal - 0.5 : dailyTotal;
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
                  className={`flex flex-col p-2 gap-1 ${
                    index % 2 === 0 ? "bg-blue-50" : "bg-white"
                  }`}
                  data-tooltip-id={
                    getAllThirdPartyUserIds(
                      dayData.entries,
                      userData.employee_id
                    )
                      ? `cell-tooltip-in-${day}`
                      : undefined
                  }
                >
                  {dayData.entries.length > 0 ? (
                    dayData.entries
                      .sort((a, b) => {
                        let valueA = a.check_in_time;
                        let valueB = b.check_in_time;

                        // Handle undefined or null values
                        if (valueA === undefined || valueA === null)
                          valueA = "";
                        if (valueB === undefined || valueB === null)
                          valueB = "";

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
                      })
                      .map((entry, idx) => (
                        <div
                          key={idx}
                          onMouseEnter={() => handleCellHover("in", day, entry)}
                          onMouseLeave={() => handleCellHover("clean")}
                          className="flex w-full items-center justify-center gap-1 relative"
                        >
                          {timeInputToChange &&
                          timeInputToChange.id === entry.id &&
                          timeInputToChange.entryType === "in" ? (
                            <>
                              <DateTimeInput
                                name={"check_in_time"}
                                value={timeInputToChange.check_in_time}
                                minDate={formatDateForInput(
                                  year,
                                  month,
                                  day - 1
                                )}
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
                              {(shouldShowExclamationMark(
                                entry,
                                userData.employee_id
                              ) ||
                                (editButtonToShow &&
                                  entry &&
                                  editButtonToShow.id === entry.id &&
                                  editButtonToShow.entryType === "in" &&
                                  idx === dayData.entries.length - 1)) && (
                                <div className="absolute left-1 flex gap-1 items-center">
                                  {shouldShowExclamationMark(
                                    entry,
                                    userData.employee_id
                                  ) && (
                                    <div className="text-yellow-500">
                                      <FontAwesomeIcon
                                        icon={faTriangleExclamation}
                                        className="text-xl"
                                      />
                                    </div>
                                  )}
                                  {editButtonToShow &&
                                    entry &&
                                    editButtonToShow.id === entry.id &&
                                    editButtonToShow.entryType === "in" &&
                                    idx === dayData.entries.length - 1 && (
                                      <Button
                                        content={
                                          <FontAwesomeIcon icon={faPlus} />
                                        }
                                        fn={handleAddLine}
                                        style={"iconButton"}
                                        highlighted={true}
                                      />
                                    )}
                                </div>
                              )}
                              {entry.check_in_time &&
                              isValidDate(entry.check_in_time)
                                ? new Date(entry.check_in_time).toLocaleString()
                                : "-"}
                              {entry.in_coordinates && (
                                <Button
                                  content={
                                    <FontAwesomeIcon
                                      className="pointer-events-none"
                                      icon={faGlobe}
                                    />
                                  }
                                  style={"iconButton"}
                                  highlighted={true}
                                  tooltipContent={"View on map"}
                                  tooltipId={"view_on_map_icon"}
                                  fn={() => openMap(entry.in_coordinates)}
                                />
                              )}
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

                  {/* Cell-level tooltip for IN column */}
                  {getAllThirdPartyUserIds(
                    dayData.entries,
                    userData.employee_id
                  ) && (
                    <Tooltip
                      id={`cell-tooltip-in-${day}`}
                      place="top-start"
                      offset={10}
                      style={{
                        maxWidth: "300px",
                        zIndex: 20,
                      }}
                    >
                      {getAllThirdPartyUserIds(
                        dayData.entries,
                        userData.employee_id
                      )}
                    </Tooltip>
                  )}
                </div>
                <div
                  className={`flex flex-col p-2 gap-1 ${
                    index % 2 === 0 ? "bg-blue-50" : "bg-white"
                  }`}
                  data-tooltip-id={
                    getAllThirdPartyUserIds(
                      dayData.entries,
                      userData.employee_id
                    )
                      ? `cell-tooltip-out-${day}`
                      : undefined
                  }
                >
                  {dayData.entries.length > 0 ? (
                    dayData.entries.map((entry, idx) => (
                      <div
                        key={idx}
                        onMouseEnter={() => handleCellHover("out", null, entry)}
                        onMouseLeave={() => handleCellHover("clean")}
                        className="flex w-full items-center justify-center gap-1 relative"
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
                            {shouldShowExclamationMark(
                              entry,
                              userData.employee_id
                            ) && (
                              <div className="absolute left-1">
                                <div className="text-yellow-500">
                                  <FontAwesomeIcon
                                    icon={faTriangleExclamation}
                                    className="text-xl"
                                  />
                                </div>
                              </div>
                            )}
                            {entry.check_out_time &&
                            isValidDate(entry.check_out_time)
                              ? new Date(entry.check_out_time).toLocaleString()
                              : "-"}
                            {entry.out_coordinates && (
                              <Button
                                content={
                                  <FontAwesomeIcon
                                    className="pointer-events-none"
                                    icon={faGlobe}
                                  />
                                }
                                style={"iconButton"}
                                highlighted={true}
                                tooltipContent={"View on map"}
                                tooltipId={"view_on_map_icon"}
                                fn={() => openMap(entry.in_coordinates)}
                              />
                            )}
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

                  {/* Cell-level tooltip for OUT column */}
                  {getAllThirdPartyUserIds(
                    dayData.entries,
                    userData.employee_id
                  ) && (
                    <Tooltip
                      id={`cell-tooltip-out-${day}`}
                      place="top-start"
                      offset={10}
                      style={{
                        maxWidth: "300px",
                        zIndex: 20,
                      }}
                    >
                      {getAllThirdPartyUserIds(
                        dayData.entries,
                        userData.employee_id
                      )}
                    </Tooltip>
                  )}
                </div>
                <div
                  className={`flex items-center justify-center relative ${
                    index % 2 === 0 ? "bg-blue-50 p-2" : "bg-white p-2"
                  }`}
                  onMouseEnter={() =>
                    availableMedicalDays > 0 && handleCellHover("med", day)
                  }
                  onMouseLeave={() => handleCellHover("clean")}
                >
                  {formatTime(adjustedTotal)}
                  {dailyTotal >= 5 && " (Lunch -30 min)"}
                  {availableMedicalDays > 0 &&
                    editButtonToShow?.entryType === "med" &&
                    editButtonToShow?.day === day &&
                    !dayData.entries[0]?.medical &&
                    userRoles.includes(
                      process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PAYROLL_MANAGER
                    ) && (
                      <div className="flex gap-1 absolute right-1">
                        <Button
                          content={
                            <FontAwesomeIcon
                              className="pointer-events-none"
                              icon={faSuitcaseMedical}
                            />
                          }
                          fn={() => {
                            setPendingMedical(editButtonToShow);
                            setShowMedicalModal(true);
                          }}
                          style={"iconButton"}
                          highlighted={true}
                        />
                      </div>
                    )}
                  {dayData.entries[0]?.medical && (
                    <div className="flex gap-1 absolute right-1">
                      <FontAwesomeIcon
                        className="pointer-events-none"
                        icon={faSuitcaseMedical}
                      />
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
          })}
          <div className="col-span-3 font-semibold bg-gray-100 p-2">
            Total Hours
          </div>
          <div className="col-span-1 font-semibold bg-gray-100 p-2">
            {calculateTotalHours()}
          </div>
        </div>
        {/* ADJUSTMENTS TABLE */}
        {hoursAdjustments.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Adjustments</h3>

            {/* header row */}
            <div className="grid grid-cols-[80px_1fr_160px_40px] gap-px bg-gray-200 text-center">
              <div className="font-bold p-2">Hours</div>
              <div className="font-bold p-2">Comment</div>
              <div className="font-bold p-2">User</div>
              <div className="font-bold p-2"></div>
            </div>

            {/* data rows */}
            {hoursAdjustments.map((adj, idx) => (
              <div
                key={adj.id}
                className={`grid grid-cols-[80px_1fr_160px_40px] gap-px ${
                  idx % 2 === 0 ? "bg-blue-50" : "bg-white"
                }`}
              >
                <div className="p-2 text-center">{adj.hours}</div>
                <div className="p-2 text-left">{adj.comment}</div>
                <div className="p-2 text-center">{adj.username}</div>
                <div className="p-2 flex justify-center">
                  {userRoles.includes(
                    process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PAYROLL_MANAGER
                  ) && (
                    <Button
                      content={<FontAwesomeIcon icon={faEraser} />}
                      style="iconButton"
                      fn={() => {
                        setPendingDeleteId(adj.id);
                        setShowDeleteAdjModal(true);
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ModalContainer
        modalIsOpen={showMedicalModal}
        /* your modal wrapper */ setModalClose={() =>
          setShowMedicalModal(false)
        }
      >
        <p className="text-red-500 text-center">
          Mark the entire day as medical leave? Existing in/out punches for that
          day will be deleted.
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            content="Cancel"
            style="classicButton"
            fn={() => setShowMedicalModal(false)}
          />
          <Button
            content="Confirm"
            style="classicButton"
            highlighted
            fn={confirmMedicalLeave}
          />
        </div>
      </ModalContainer>
      <ModalContainer
        modalIsOpen={showDeleteAdjModal}
        setModalClose={() => setShowDeleteAdjModal(false)}
      >
        <p className="text-center text-red-600">
          Delete this adjustment permanently?
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            content="Cancel"
            style="classicButton"
            fn={() => setShowDeleteAdjModal(false)}
          />
          <Button
            content="Delete"
            style="classicButton"
            highlighted
            fn={confirmDeleteAdjustment}
          />
        </div>
      </ModalContainer>
      <MapModalContainer modalIsOpen={showMapModal} setModalClose={closeMap}>
        <MapComponent
          location={initialCoordinates}
          initialCoordinates={initialCoordinates}
        />
      </MapModalContainer>
      <InfoMessageModalContainer modalIsOpen={showInfoModal.show}>
        <p className="font-bold text-red-600">{showInfoModal.message}</p>
        <Button
          content={"Cancel"}
          style={"classicButton"}
          fn={() => setShowInfoModal({ show: false, message: "" })}
        />
      </InfoMessageModalContainer>
    </div>
  );
}

export default EmployeeTimeCard;
