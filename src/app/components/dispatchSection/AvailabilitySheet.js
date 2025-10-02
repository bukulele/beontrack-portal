"use client";

import { useEffect, useState, useRef, useContext, useMemo } from "react";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { Box } from "@mui/material";
import CustomToolbar from "./CustomToolbarAvailability";
import { useInfoCard } from "@/app/context/InfoCardContext";
import InfoCardModalContainer from "../modalContainer/InfoCardModalContainer";
import CreateObjectModalContainer from "../modalContainer/CreateObjectModalContainer";
import copy from "copy-to-clipboard";
import getGlobalSortComparator from "@/app/functions/getGlobalSortComparator";
import { useSession } from "next-auth/react";
import Cookies from "js-cookie";
import DriverWorkSwitch from "./DriverWorkSwitch";
import { AvailabilityContext } from "@/app/context/AvailabilityContext";
import { DriverAttendanceContext } from "@/app/context/DriverAttendanceContext";
import calculateWorkingHoursWeek from "@/app/functions/calculateWorkingHoursWeek";
import ModalContainer from "../modalContainer/ModalContainer";
import Button from "../button/Button";
import TextInputSearch from "../textInput/TextInputSearch";
import findHighestIdObject from "@/app/functions/findHighestIdObject";
import TruckShiftCell from "./TruckShiftCell";
import { useLoader } from "@/app/context/LoaderContext";
import { useTruckAttendance } from "@/app/functions/useTruckAttendance";
import defineLatestAssignment from "@/app/functions/defineLatestAssignment";

export default function AvailabilitySheet({ columns }) {
  const SPECIAL_RENDERS = {
    switchableCell: {
      component: DriverWorkSwitch,
      getAdditionalProps: (params) => ({
        handleSwitch: startStopDriverShift,
      }),
    },
    truckAssignmentCell: {
      component: TruckShiftCell,
      getAdditionalProps: (params) => ({
        setTruck: handleSetAbsentTruck,
        changeTruck: changeTruck,
        stopTruckShift: handleExplicitlyStopTruckShift,
      }),
    },
  };

  const INITIAL_TRUCK_DRIVER_PARAMS_STATE = {
    driver: {},
    chosen_truck: "",
    shift_id: "",
    check_in_time: "",
    check_out_time: "",
    latest_assignment: {},
  };

  const INITIAL_FILTER_MODEL = {
    items: [],
    quickFilterValues: [], // This will capture the global search values
  };

  const [showCopyDataWindow, setShowCopyDataWindow] = useState(false);
  const [terminalSelected, setTerminalSelected] = useState("");
  const [availabilitySheetDataIsLoading, setAvailabilitySheetDataIsLoading] =
    useState(false);
  const [routeSelected, setRouteSelected] = useState("");
  const [confirmSwitchOffModal, setConfirmSwitchOffModal] = useState(false);
  const [pendingSwitchParams, setPendingSwitchParams] = useState(null);
  const [filterModel, setFilterModel] = useState(INITIAL_FILTER_MODEL);
  const [activeTrucksData, setActiveTrucksData] = useState(null);
  const [availableTrucksData, setAvailableTrucksData] = useState(null);
  const [chooseTruckModalIsOpen, setChooseTruckModalIsOpen] = useState(false);
  const [changeTruckModalIsOpen, setChangeTruckModalIsOpen] = useState(false);
  const [truckDriverParams, setTruckDriverParams] = useState(
    INITIAL_TRUCK_DRIVER_PARAMS_STATE
  );
  const { availabilitySheetData, setAvailabilitySheetData } =
    useContext(AvailabilityContext);
  const { setDriverAttendanceData } = useContext(DriverAttendanceContext);

  const { handleCardDataSet, setInfoCardModalIsOpen } = useInfoCard();

  const { startLoading, stopLoading } = useLoader();

  const timeoutRef = useRef(null);

  const { data: session } = useSession();

  // Define a ref to store the interval ID.
  const intervalRef = useRef(null);

  // Create a ref to hold the latest activeTrucksData
  const activeTrucksDataRef = useRef(activeTrucksData);
  useEffect(() => {
    activeTrucksDataRef.current = activeTrucksData;
  }, [activeTrucksData]);

  const availabilitySheetDataRef = useRef(availabilitySheetData);
  useEffect(() => {
    availabilitySheetDataRef.current = availabilitySheetData;
  }, [availabilitySheetData]);

  const customFilterKeys = ["night_driver", "lcv_certified"];

  const mergeCustomFilters = (newModel, currentModel) => {
    // Start with the items from the new model
    const mergedItems = [...newModel.items];

    // For every custom filter key, ensure there’s an item in mergedItems
    customFilterKeys.forEach((key) => {
      const existsInNew = mergedItems.find((item) => item.field === key);
      const currentCustomFilter = currentModel.items.find(
        (item) => item.field === key
      );
      if (!existsInNew && currentCustomFilter) {
        mergedItems.push(currentCustomFilter);
      }
    });

    // Also, preserve the quick filter values if they are not set in the new model
    return {
      ...newModel,
      items: mergedItems,
      quickFilterValues:
        newModel.quickFilterValues || currentModel.quickFilterValues,
    };
  };

  const handleFilterModelChange = (newModel) => {
    setFilterModel((prev) => mergeCustomFilters(newModel, prev));
  };

  const handleDriverShiftToggle = (type) => {
    setFilterModel((prev) => {
      const items = [...prev.items];

      const isNight = type === "night";
      const targetValue = isNight;
      const oppositeValue = !isNight;

      const hasTarget = items.some(
        (item) => item.field === "night_driver" && item.value === targetValue
      );

      // If the target filter is already active, remove it (toggle off)
      if (hasTarget) {
        const filteredItems = items.filter(
          (item) =>
            !(item.field === "night_driver" && item.value === targetValue)
        );
        return { ...prev, items: filteredItems };
      }

      // Otherwise, remove the opposite and add the target
      const filteredItems = items.filter(
        (item) =>
          !(item.field === "night_driver" && item.value === oppositeValue)
      );

      const newItem = {
        id: Date.now(),
        field: "night_driver",
        operator: "is",
        value: targetValue,
      };

      return { ...prev, items: [...filteredItems, newItem] };
    });
  };

  const handleLCVFilter = () => {
    setFilterModel((prev) => {
      const exists = prev.items.some((item) => item.field === "lcv_certified");
      const newItems = exists
        ? prev.items.filter((item) => item.field !== "lcv_certified")
        : [
            ...prev.items,
            {
              id: Date.now(),
              field: "lcv_certified",
              operator: "is",
              value: true,
            },
          ];
      return { ...prev, items: newItems };
    });
  };

  const updateSingleRowInDataGrid = (rowId, partialUpdate) => {
    setAvailabilitySheetData((prevRows) =>
      prevRows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              ...partialUpdate,
            }
          : row
      )
    );
  };

  const startStopDriverShift = (value, params, confirmed) => {
    // If the user is trying to switch off (value === false),
    // show the confirmation modal instead of immediately updating.
    if (!value && !confirmed) {
      // Show modal, store pending params, and return early.
      setPendingSwitchParams({ value, params });
      setConfirmSwitchOffModal(true);
      return;
    }

    const now = new Date().toISOString();

    // Immediately update the row in the grid.
    updateSingleRowInDataGrid(params.row.id, {
      last_shift: {
        // When switching on, if last_shift is closed (has check_out_time),
        // we do not want to re-use it.
        ...(value || (!value && !params.row.last_shift?.check_out_time)
          ? params.row.last_shift
          : {}),
        check_in_time: value ? now : params.row.last_shift?.check_in_time,
        check_out_time: value ? null : now,
      },
    });

    // Determine the id for the payload:
    // If switching on, and there is a last_shift, only use its id if the shift is open.
    const shiftIsOpen =
      params.row.last_shift &&
      (!params.row.last_shift.check_out_time ||
        params.row.last_shift.check_out_time === "");
    const idForPayload = shiftIsOpen ? params.row.last_shift.id : null;

    // Prepare the data for sending.
    let dataToSend = {
      id: idForPayload,
      check_in_time: params.row.last_shift?.check_in_time || "",
      check_out_time: params.row.last_shift?.check_out_time || "",
      driver: params.row.id,
    };

    if (value) {
      // When starting a new shift, ignore any closed shift.
      dataToSend.check_in_time = now;
      dataToSend.check_out_time = "";
    } else {
      dataToSend.check_out_time = now;
    }

    // Send the data to the server.
    sendDriverAttendanceData(dataToSend);
  };

  const handleConfirmTruckChange = async () => {
    const now = new Date().toISOString();

    await stopTruckShift(
      truckDriverParams.latest_assignment.id,
      truckDriverParams.shift_id,
      now
    )
      .then((response) => {
        if (!response.ok) {
          // Handle non-2xx HTTP responses
          return response.json().then((errorDetails) => {
            throw new Error(errorDetails || "An unknown error occurred.");
          });
        }
        return response.json();
      })
      .then((data) => {
        const newTruckDriverParams = {
          ...truckDriverParams,
          check_in_time: data.truck_end_time,
        };
        assignTruckToDriver(newTruckDriverParams);
      })
      .catch((error) => {
        console.error("Error stopping truck shift:", error);
      });
  };

  const handleSetAbsentTruck = (row) => {
    setTruckDriverParams((prev) => ({
      ...prev,
      shift_id: row.last_shift.id,
      check_in_time: row.last_shift.check_in_time,
      driver: availabilitySheetDataRef.current.find(
        (item) => item.id === row.last_shift.driver
      ),
    }));
    setChooseTruckModalIsOpen(true);
  };

  const changeTruck = (row) => {
    const latestAssignment = defineLatestAssignment(
      row?.last_shift?.truck_assignments
    );

    setTruckDriverParams((prev) => {
      return {
        ...prev,
        shift_id: row.last_shift.id,
        driver: availabilitySheetDataRef.current.find(
          (item) => item.id === row.id
        ),
        latest_assignment: latestAssignment,
      };
    });
    setChangeTruckModalIsOpen(true);
  };

  const handleConfirmSwitchOff = (confirm) => {
    setConfirmSwitchOffModal(false);
    if (confirm && pendingSwitchParams) {
      // User confirmed the switch-off.
      const { value, params } = pendingSwitchParams;
      // Proceed with the switch-off action.
      startStopDriverShift(value, params, confirm);
      setPendingSwitchParams(null);
    } else {
      // User cancelled.
      setPendingSwitchParams(null);
    }
  };

  const modifiedColumns = useMemo(() => {
    return columns.map((col) => {
      let renderCell;

      if (col.specialRender) {
        // Destructure to get the corresponding component and its extra props function
        const { component: Component, getAdditionalProps } =
          SPECIAL_RENDERS[col.specialRender];

        renderCell = (params) => {
          // Create the base props that every component will receive.
          const baseProps = {
            params,
            value: params.row.last_shift?.check_out_time === null,
          };

          // Retrieve extra props using the function from configuration.
          const extraProps = getAdditionalProps
            ? getAdditionalProps(params)
            : {};

          // Render the Component with both baseProps and extraProps.
          return <Component {...baseProps} {...extraProps} />;
        };
      } else if (col.renderCell) {
        renderCell = col.renderCell;
      }

      return {
        ...col,
        // getSortComparator: getGlobalSortComparator,
        sortComparator: col.sortComparator ?? getGlobalSortComparator,
        ...(renderCell && { renderCell }),
      };
    });
  }, [columns]);

  const handleCopyCellData = (data) => {
    clearTimeout(timeoutRef.current);
    setShowCopyDataWindow(true);
    copy(data);
    timeoutRef.current = setTimeout(() => {
      setShowCopyDataWindow(false);
    }, 3000);
  };

  const handleCellClick = (params) => {
    const { row, colDef } = params;
    const modalType = colDef.modalType;
    const accessKey = colDef.accessKey;
    const isCopyable = colDef.copyable;
    const tabToOpen = colDef.tabToOpen;

    if (isCopyable) {
      handleCopyCellData(params.value);
      return;
    }

    if (modalType && row[accessKey] && row[accessKey].toString().length > 0) {
      handleCardDataSet(row[accessKey], modalType, tabToOpen);
      setInfoCardModalIsOpen(true);
    }
  };

  const handlePreFilter = (route) => {
    // If clicking the same filter again, clear it
    let newRoute;

    if (routeSelected === route) {
      newRoute = "";
    } else {
      newRoute = route;
    }
    setRouteSelected(newRoute);
  };

  const handleTruckModalClose = () => {
    setTruckDriverParams(INITIAL_TRUCK_DRIVER_PARAMS_STATE);
    setChooseTruckModalIsOpen(false);
  };

  const handleChangeTruckModalClose = () => {
    setTruckDriverParams(INITIAL_TRUCK_DRIVER_PARAMS_STATE);
    setChangeTruckModalIsOpen(false);
  };

  const fetchDriverScheduleData = async () => {
    const response = await fetch("/api/get-driver-schedule", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    return data;
  };

  const fetchAvailableTrucksData = async () => {
    const response = await fetch("/api/get-available-trucks", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();

    let preparedData = {};

    for (let item of data) {
      let newItem = { ...item };
      newItem.plate_number =
        findHighestIdObject(item.truck_license_plates).plate_number || "";
      preparedData[item.id] = { ...newItem };
    }

    return preparedData;
  };

  const fetchActiveTrucksData = async () => {
    const response = await fetch("/api/get-active-trucks", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();

    let preparedData = {};

    for (let item of data) {
      let newItem = { ...item };
      newItem.plate_number =
        findHighestIdObject(item.truck_license_plates).plate_number || "";
      preparedData[item.id] = { ...newItem };
    }

    return preparedData;
  };

  // const defineLatestAssignment = (assignments) => {
  //   if (!assignments || assignments.length === 0) {
  //     console.error("No truck assignments found");
  //     return;
  //   }

  //   // Only consider assignments where truck_end_time is null
  //   const ongoingAssignments = assignments.filter(
  //     (assignment) => assignment.truck_end_time === null
  //   );
  //   if (ongoingAssignments.length === 0) {
  //     console.error("No ongoing truck assignments found");
  //     return;
  //   }
  //   // Find the latest ongoing assignment based on truck_start_time
  //   const latestAssignment = ongoingAssignments.reduce((prev, curr) =>
  //     new Date(curr.truck_start_time) > new Date(prev.truck_start_time)
  //       ? curr
  //       : prev
  //   );

  //   return latestAssignment;
  // };

  const defineAssignedTruck = (lastShift) => {
    const assignments = lastShift?.truck_assignments;
    if (!assignments || assignments.length === 0) {
      return "";
    }

    // Only consider assignments where truck_end_time is null
    const ongoingAssignments = assignments.filter(
      (assignment) => assignment.truck_end_time === null
    );
    if (ongoingAssignments.length === 0) {
      return "";
    }
    // Find the latest ongoing assignment based on truck_start_time
    const latestAssignment = ongoingAssignments.reduce((prev, curr) =>
      new Date(curr.truck_start_time) > new Date(prev.truck_start_time)
        ? curr
        : prev
    );
    return latestAssignment.truck;
  };

  const aggregateData = (
    availableDrivers,
    schedule,
    driverAttendanceData,
    activeTrucksData
  ) => {
    // Create a lookup map where each driver's attendance data is stored by driver id.
    const attendanceMap = {};
    const scheduleMap = {};
    const totalWorkingHoursMap = {};
    const lastShiftMap = {};

    driverAttendanceData.forEach((att) => {
      if (!attendanceMap.hasOwnProperty(att.driver)) {
        attendanceMap[att.driver] = [att];
      } else {
        attendanceMap[att.driver].push(att);
      }
    });

    schedule.forEach((att) => {
      scheduleMap[att.driver] = att;
    });

    availableDrivers.forEach((driver) => {
      const schedule =
        scheduleMap[driver.id] && scheduleMap[driver.id] !== ""
          ? scheduleMap[driver.id]
          : null;

      const lastShift = attendanceMap.hasOwnProperty(driver.id)
        ? attendanceMap[driver.id].reduce((latest, record) => {
            return new Date(record.check_in_time) >
              new Date(latest.check_in_time)
              ? record
              : latest;
          }, attendanceMap[driver.id][0])
        : "";

      lastShiftMap[driver.id] = lastShift;

      let totalWorkingHours = calculateWorkingHoursWeek(
        driverAttendanceData,
        driver.id,
        lastShift,
        schedule
      );

      // ADD CALCULATION OF WORKING HOURS FROM lastShift
      if (
        lastShift &&
        (!lastShift.check_out_time || lastShift.check_out_time === "")
      ) {
        const checkIn = new Date(lastShift.check_in_time);
        const checkOut = new Date();
        totalWorkingHours += (checkOut - checkIn) / (1000 * 60 * 60);
      }
      totalWorkingHoursMap[driver.id] = totalWorkingHours;
    });

    // For each available driver, attach the corresponding attendance record (if available)
    return availableDrivers.map((driver) => ({
      ...driver,
      last_shift: lastShiftMap[driver.id],
      schedule: scheduleMap[driver.id] || "",
      working_hours: totalWorkingHoursMap[driver.id] || 0,
      current_truck_assignment: defineAssignedTruck(lastShiftMap[driver.id]),
      truck_assignments: `${
        activeTrucksData?.[defineAssignedTruck(lastShiftMap[driver.id])]
          ?.unit_number || ""
      } ${
        activeTrucksData?.[defineAssignedTruck(lastShiftMap[driver.id])]
          ?.make || ""
      } ${
        activeTrucksData?.[defineAssignedTruck(lastShiftMap[driver.id])]
          ?.model || ""
      }`,
    }));
  };

  const loadAllDriverAttendanceData = async (startDate, endDate) => {
    let queryString = "null";

    if (startDate && endDate) {
      // Helper function to format a Date object as "YYYY-MM-DD"
      const formatDate = (date) => date.toISOString().slice(0, 10);

      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);
      queryString = `start_date=${formattedStartDate}&end_date=${formattedEndDate}`;
    }

    const response = await fetch(`/api/get-driver-attendance/${queryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data;
  };

  // Refactored function to load and aggregate available drivers data.
  const loadAvailabilitySheetData = async () => {
    const today = new Date();
    const eightDaysAgo = new Date(today);
    eightDaysAgo.setDate(today.getDate() - 8);

    setAvailabilitySheetDataIsLoading(true);

    let route = routeSelected.length > 0 ? routeSelected : "null";
    let terminal = terminalSelected.length > 0 ? terminalSelected : "null";

    try {
      // Fetch available drivers
      const availableResponse = await fetch(
        `/api/get-available-drivers/${route}/${terminal}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const availableData = await availableResponse.json();

      // Reuse the common function to get attendance data
      // const latestAttendanceData = await fetchLastDriverAttendanceData();

      const scheduleData = await fetchDriverScheduleData();

      const allAttendanceData = await loadAllDriverAttendanceData(
        eightDaysAgo,
        today
      );

      const activeTrucks = await fetchActiveTrucksData();
      setActiveTrucksData(activeTrucks);

      const availableTrucks = await fetchAvailableTrucksData();
      setAvailableTrucksData(availableTrucks);

      setDriverAttendanceData(allAttendanceData);

      // Merge both datasets
      const aggregatedData = aggregateData(
        availableData,
        scheduleData,
        allAttendanceData,
        activeTrucks
      );
      setAvailabilitySheetData(aggregatedData);
    } catch (error) {
      console.error("Failed to load available drivers data:", error);
    } finally {
      setAvailabilitySheetDataIsLoading(false);
    }
  };

  const updateAttendanceData = async () => {
    const today = new Date();
    const eightDaysAgo = new Date(today);
    eightDaysAgo.setDate(today.getDate() - 8);

    try {
      const availableTrucks = await fetchAvailableTrucksData();
      setAvailableTrucksData(availableTrucks);

      // Fetch latest attendance data
      // const attendanceData = await fetchLastDriverAttendanceData();
      const attendanceData = await loadAllDriverAttendanceData(
        eightDaysAgo,
        today
      );
      const attendanceMap = {};

      attendanceData.forEach((att) => {
        if (!attendanceMap.hasOwnProperty(att.driver)) {
          attendanceMap[att.driver] = [att];
        } else {
          attendanceMap[att.driver].push(att);
        }
      });

      // Update the DataGrid data by mapping over the previous state and merging new attendance info.
      setAvailabilitySheetData((prevData) =>
        prevData.map((driver) => {
          const lastShift = attendanceMap.hasOwnProperty(driver.id)
            ? attendanceMap[driver.id].reduce((latest, record) => {
                return new Date(record.check_in_time) >
                  new Date(latest.check_in_time)
                  ? record
                  : latest;
              }, attendanceMap[driver.id][0])
            : "";
          let totalWorkingHours = calculateWorkingHoursWeek(
            attendanceData,
            driver.id,
            lastShift,
            driver.schedule
          );

          if (
            lastShift &&
            (!lastShift.check_out_time || lastShift.check_out_time === "")
          ) {
            const checkIn = new Date(lastShift.check_in_time);
            const checkOut = new Date();
            totalWorkingHours += (checkOut - checkIn) / (1000 * 60 * 60);
          }

          // Use the ref to access the latest activeTrucksData
          return {
            ...driver,
            last_shift: lastShift,
            working_hours: totalWorkingHours,
            current_truck_assignment: defineAssignedTruck(lastShift),
            truck_assignments: `${
              activeTrucksDataRef.current?.[defineAssignedTruck(lastShift)]
                ?.unit_number || ""
            } ${
              activeTrucksDataRef.current?.[defineAssignedTruck(lastShift)]
                ?.make || ""
            } ${
              activeTrucksDataRef.current?.[defineAssignedTruck(lastShift)]
                ?.model || ""
            }`,
          };
        })
      );
    } catch (error) {
      console.error("Failed to load last attendance data:", error);
    }
  };

  // Helper to start the interval.
  const startInterval = () => {
    // Clear any existing interval.
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    // Start a new interval.
    intervalRef.current = setInterval(updateAttendanceData, 30000);
  };

  useEffect(() => {
    // Start the interval when the component mounts.
    startInterval();
    return () => clearInterval(intervalRef.current);
  }, []);

  // This function can be called when the user manually triggers an update.
  const handleUpdateAttendanceData = async () => {
    await updateAttendanceData();
    // Restart the interval so that it resets from zero.
    startInterval();
  };

  const deleteDriverAttendanceData = () => {
    startLoading();
    const apiUrl = `/api/save-attendance-data-driver/${truckDriverParams.shift_id}`;
    const method = "DELETE";

    fetch(apiUrl, {
      method,
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
        handleUpdateAttendanceData();
        handleTruckModalClose();
      })
      .finally(() => stopLoading())
      .catch((error) => console.error("Failed to save data:", error));
  };

  const cancelTruckAssignment = () => {
    deleteDriverAttendanceData();
  };

  const { assignTruckToDriver, stopTruckShift } = useTruckAttendance({
    onSuccessAssign: () => {
      handleUpdateAttendanceData();
      handleTruckModalClose();
      handleChangeTruckModalClose();
    },
    onSuccessStop: handleUpdateAttendanceData,
  });

  const handleExplicitlyStopTruckShift = (paramsRow) => {
    const latestAssignment = defineLatestAssignment(
      paramsRow?.last_shift?.truck_assignments
    );

    stopTruckShift(
      latestAssignment?.id,
      paramsRow.last_shift.id,
      paramsRow.last_shift.check_out_time
    );
  };

  const sendDriverAttendanceData = (input) => {
    let apiUrl = "/api/save-attendance-data-driver";
    let method = "POST";
    if (input.id) {
      apiUrl += `/${input.id}`;
      method = "PATCH";
    }

    const data = new FormData();

    data.append("check_in_time", input.check_in_time);
    data.append("check_out_time", input.check_out_time);
    data.append("driver", input.driver);

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
        if (data.check_out_time === null) {
          setTruckDriverParams((prev) => ({
            ...prev,
            shift_id: data.id,
            check_in_time: data.check_in_time,
            driver: availabilitySheetDataRef.current.find(
              (item) => item.id === data.driver
            ),
          }));
          setChooseTruckModalIsOpen(true);
        } else {
          const latestAssignment = defineLatestAssignment(
            data?.truck_assignments
          );

          stopTruckShift(latestAssignment?.id, data.id, data.check_out_time);
        }
        handleUpdateAttendanceData();
      })
      .catch((error) => console.error("Failed to save data:", error));
  };

  useEffect(() => {
    if (!session || !session.user) return;

    const cookieData = Cookies.get(session.user.email);
    const savedData = cookieData ? JSON.parse(cookieData) : null;

    // Update the filter model for night_driver if saved data exists.
    if (savedData?.nightDriverFilter) {
      setFilterModel((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.field === "night_driver"
            ? { ...item, value: savedData.nightDriverFilter }
            : item
        ),
      }));
    }

    if (!savedData?.terminalSelected || !savedData?.routeSelected) return;

    setTerminalSelected(savedData.terminalSelected);
    setRouteSelected(savedData.routeSelected);
  }, [session]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (terminalSelected.length === 0) return;

    loadAvailabilitySheetData();
  }, [terminalSelected, routeSelected]);

  useEffect(() => {
    if (!session || !session.user || terminalSelected.length === 0) return;

    // Extract the night_driver filter value from your filterModel.
    // (Assuming filterModel is an object with an "items" array.)
    const nightDriverFilter = filterModel.items.find(
      (item) => item.field === "night_driver"
    ) || { value: false };

    const dataToSave = {
      terminalSelected,
      routeSelected,
      nightDriverFilter: nightDriverFilter.value, // Save the boolean status
    };

    Cookies.set(session.user.email, JSON.stringify(dataToSave));
  }, [terminalSelected, routeSelected, filterModel, session]);

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
      }}
    >
      <DataGridPro
        disableRowSelectionOnClick
        rowHeight={30}
        loading={availabilitySheetDataIsLoading}
        rows={availabilitySheetData}
        columns={modifiedColumns}
        onCellClick={handleCellClick}
        headerFilters
        sortingOrder={["asc", "desc"]}
        filterModel={filterModel}
        onFilterModelChange={handleFilterModelChange}
        getRowClassName={(params) => {
          if (
            params.row.last_shift?.check_out_time === null ||
            params.row.last_shift?.check_out_time === ""
          ) {
            // calculate working hours from check_in_time
            const checkInTime = new Date(params.row.last_shift?.check_in_time);
            const now = new Date();
            const diffInMs = now - checkInTime;
            const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
            if (diffInHours >= 12 && diffInHours < 14) {
              return "yellow-row";
            }
            if (diffInHours >= 14) {
              return "red-row";
            }
          }
          if (params.row.working_hours >= 68 && params.row.working_hours < 70) {
            return "yellow-row";
          }
          if (params.row.working_hours >= 70) {
            return "red-row";
          }
        }}
        initialState={{
          sorting: {
            sortModel: [
              {
                field:
                  columns.find((col) => col.defaultSort)?.field ||
                  columns[0].field,
                sort: columns.find((col) => col.defaultSort)?.sort || "asc",
              },
            ],
          },
          columns: {
            columnVisibilityModel: columns.reduce((acc, col) => {
              acc[col.field] = !col.hide;
              return acc;
            }, {}),
          },
        }}
        slots={{
          toolbar: CustomToolbar,
        }}
        slotProps={{
          loadingOverlay: {
            variant: !availabilitySheetData.length
              ? "skeleton"
              : "linear-progress",
            noRowsVariant: "skeleton",
          },
          toolbar: {
            preFilteredValues: routeSelected,
            handlePreFilter,
            filterModel: filterModel.items,
            handleLCVFilter,
            handleDriverShiftToggle,
            availabilitySheetDataIsLoading,
            terminalSelected,
            selectTerminal: setTerminalSelected,
            onRefresh: loadAvailabilitySheetData,
            showQuickFilter: true,
            csvOptions: {
              fileName: "table_data",
              utf8WithBom: true,
            },
          },
        }}
        sx={{
          "& .MuiDataGrid-scrollbar": {
            zIndex: "auto !important",
          },
          border: "none",
          ".MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold !important",
          },
          "& .MuiDataGrid-cell": {
            borderRight: "1px dotted #a0a8ae",
          },
          "& .MuiDataGrid-cell:last-of-type": {
            borderRight: "none",
          },
        }}
      />
      <InfoCardModalContainer />
      <CreateObjectModalContainer />
      {showCopyDataWindow && (
        <div
          style={{
            position: "absolute",
            top: "5px",
            right: "5px",
            backgroundColor: "#f0f0f0",
            padding: "10px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
            borderRadius: "4px",
          }}
        >
          Data copied to clipboard
        </div>
      )}
      <ModalContainer modalIsOpen={confirmSwitchOffModal}>
        <p className="font-bold text-red-600">
          {`Do you want to end the shift of driver ${pendingSwitchParams?.params?.row?.driver_id} ${pendingSwitchParams?.params?.row?.first_name}?`}
        </p>
        <p className="font-bold text-red-600">
          He will be available for planning again in 10 hours, or in 36 hours if
          he has a day off tomorrow.
        </p>
        <div className="flex justify-between items-center">
          <Button
            content={"Cancel"}
            style={"classicButton"}
            fn={() => handleConfirmSwitchOff(false)}
          />
          <Button
            content={"Confirm"}
            style={"classicButton"}
            highlighted={true}
            fn={() => handleConfirmSwitchOff(true)}
          />
        </div>
      </ModalContainer>
      <ModalContainer modalIsOpen={chooseTruckModalIsOpen}>
        <div className="min-h-96 display flex flex-col gap-2">
          <p className="font-bold text-red-600">
            {`Please choose a truck for ${truckDriverParams.driver.driver_id} ${truckDriverParams.driver.first_name}`}
          </p>
          <TextInputSearch
            name={"chosen_truck"}
            value={activeTrucksData?.[truckDriverParams.chosen_truck] || ""}
            updateState={setTruckDriverParams}
            searchableData={availableTrucksData}
            searchableFields={["unit_number", "plate_number", "make", "model"]}
          />
          <div className="flex justify-between items-center">
            <Button
              content={"Cancel"}
              style={"classicButton"}
              fn={cancelTruckAssignment}
            />
            <Button
              content={"Confirm"}
              style={"classicButton"}
              highlighted={truckDriverParams.chosen_truck.length > 0}
              fn={() => assignTruckToDriver(truckDriverParams)}
              disabled={truckDriverParams.chosen_truck.length === 0}
              tooltipContent={
                truckDriverParams.chosen_truck.length === 0 &&
                "Please choose a truck from the list"
              }
              tooltipId={
                truckDriverParams.chosen_truck.length === 0 &&
                "change-choose-truck-tooltip"
              }
            />
          </div>
        </div>
      </ModalContainer>
      <ModalContainer modalIsOpen={changeTruckModalIsOpen}>
        <div className="min-h-96 display flex flex-col gap-2">
          <p className="font-bold text-red-600">
            {`If you sure to change truck ${
              activeTrucksData?.[truckDriverParams.latest_assignment.truck]
                ?.unit_number
            }`}
          </p>
          <p className="font-bold text-red-600">
            {`Please choose a truck for ${truckDriverParams.driver.driver_id} ${truckDriverParams.driver.first_name}`}
          </p>
          <TextInputSearch
            name={"chosen_truck"}
            value={activeTrucksData?.[truckDriverParams.chosen_truck] || ""}
            updateState={setTruckDriverParams}
            searchableData={availableTrucksData}
            searchableFields={["unit_number", "plate_number", "make", "model"]}
          />
          <div className="flex justify-between items-center">
            <Button
              content={"Cancel"}
              style={"classicButton"}
              fn={handleChangeTruckModalClose}
            />
            <Button
              content={"Confirm"}
              style={"classicButton"}
              highlighted={truckDriverParams.chosen_truck.length > 0}
              fn={handleConfirmTruckChange}
              disabled={truckDriverParams.chosen_truck.length === 0}
              tooltipContent={
                truckDriverParams.chosen_truck.length === 0 &&
                "Please choose a truck from the list"
              }
              tooltipId={
                truckDriverParams.chosen_truck.length === 0 &&
                "change-choose-truck-tooltip"
              }
            />
          </div>
        </div>
      </ModalContainer>
    </Box>
  );
}
