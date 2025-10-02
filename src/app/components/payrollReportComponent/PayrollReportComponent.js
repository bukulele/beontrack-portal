import { useState } from "react";
import { useLoader } from "@/app/context/LoaderContext";
import { DataGridPro } from "@mui/x-data-grid-pro";
import CustomToolbarPayrollReport from "../tableContainer/CustomToolbarPayrollReport";
import { PAYROLL_REPORT_TABLE_FIELDS } from "@/app/tableData/officeEmployeesTable_unstable";
import { useInfoCard } from "@/app/context/InfoCardContext";
import calculateWorkingHours from "@/app/functions/calculateWorkingHours";
import InfoCardModalContainer from "../modalContainer/InfoCardModalContainer";
import { Box, IconButton, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import calculateWorkingDaysFromQueryString from "@/app/functions/calculateWorkingDaysFromQueryString";
import getGlobalSortComparator from "@/app/functions/getGlobalSortComparator";

function PayrollReportComponent({ onClose }) {
  const [payrollReportData, setPayrollReportData] = useState([]);
  const [periodWorkingHours, setPeriodWorkingHours] = useState(0);

  const { startLoading, stopLoading } = useLoader();
  const { handleCardDataSet, setInfoCardModalIsOpen } = useInfoCard();

  const modifiedColumns = PAYROLL_REPORT_TABLE_FIELDS.map((col) => ({
    ...col,
    sortComparator: col.sortComparator ?? getGlobalSortComparator,
    renderCell: (params) => {
      const isCopyable = col.copyable;
      const isInteractive = col.modalType || isCopyable;
      const isBoolean = typeof params.value === "boolean";
      let displayValue = params.value;

      // Ensure boolean values are displayed
      if (isBoolean) {
        displayValue = params.value ? "Yes" : "No";
      }

      return (
        <span
          style={{
            cursor: isCopyable ? "copy" : "default",
            textDecoration: isInteractive ? "underline dotted" : "none",
            color: isBoolean && !params.value ? "red" : "",
          }}
        >
          {displayValue}
        </span>
      );
    },
    cellClassName: (params) => {
      return (params.field === "regular_hours" &&
        params.value < periodWorkingHours) ||
        (params.field === "adjustments" && Number(params.value) > 0) ||
        (params.field === "medical_hours" && Number(params.value) > 0)
        ? "daysWarn_yellow"
        : "";
    },
  }));

  const makeAdjustmentMap = (adjustments) =>
    adjustments.reduce((acc, a) => {
      acc[a.employee] = (acc[a.employee] || 0) + Number(a.hours);
      return acc;
    }, {});

  const aggregateEmployeeHours = (
    shifts,
    workingDays,
    holidays,
    startDateStr,
    adjustmentMap = {}
  ) => {
    // Using an object to group shifts by employee.
    const aggregated = {};

    shifts.forEach((shift) => {
      // Only calculate hours if there's a check-out time.
      const shiftHours =
        shift.check_in_time && shift.check_out_time
          ? parseFloat(
              calculateWorkingHours(shift.check_in_time, shift.check_out_time)
            )
          : 0;

      // Use the employee field as key (or employee_id if more appropriate)
      const key = shift.employee;

      let shiftHoursLunchCorrected =
        shiftHours >= 5 ? shiftHours - 0.5 : shiftHours;

      // If we've already added shifts for this employee, accumulate the hours.
      if (aggregated[key]) {
        aggregated[key].total_hours =
          Number(aggregated[key].total_hours) +
          Number(shiftHoursLunchCorrected);

        if (shift.medical) {
          aggregated[key].medical_hours =
            Number(aggregated[key].medical_hours) +
            Number(shiftHoursLunchCorrected);
        }
      } else {
        // Create a new object with the employee details from this shift,
        // and initialize the total_hours.
        aggregated[key] = {
          id: shift.employee,
          period_start_date: startDateStr,
          employee_id: shift.employee_id,
          first_name: shift.first_name,
          last_name: shift.last_name,
          immigration_status: shift.immigration_status,
          department: shift.department,
          title: shift.title,
          rate: shift.rate,
          adjustments: adjustmentMap[key] ?? 0,
          medical_hours: shift.medical ? shiftHoursLunchCorrected : 0,
          total_hours: shiftHoursLunchCorrected,
        };
      }
    });
    // Convert the grouped employees object to an array,
    // adjusting hours based on workingDays.
    return Object.values(aggregated).map((employee) => {
      employee.total_hours += employee.adjustments;
      // Cap the total hours to the period limit
      const cappedHours = Math.min(employee.total_hours, workingDays * 8);
      // Any hours beyond the period limit are considered extra
      const extraHours = Math.max(employee.total_hours - workingDays * 8, 0);
      return {
        ...employee,
        regular_hours: cappedHours,
        holidays: holidays * 8,
        extra_hours: extraHours,
        extra_pay: extraHours * employee.rate,
      };
    });
  };

  const loadAdjustmentsData = (payDay) => {
    startLoading();
    return fetch(`/api/get-adjustments-data-all/${payDay}`, {
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
        return data;
      })
      .catch((error) => {
        console.error("Failed to fetch data:", error);
      })
      .finally(() => stopLoading());
  };

  const loadPayrollReportData = (queryString) => {
    startLoading();

    fetch(`/api/get-payroll-report/${queryString}`, {
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
      .then((payrollData) => {
        const params = new URLSearchParams(queryString);
        const startDateStr = params.get("start_date");

        const requestedYear = startDateStr.split("-")[0];
        Promise.all([
          loadAdjustmentsData(startDateStr),
          fetch(
            `https://canada-holidays.ca/api/v1/provinces/MB?year=${requestedYear}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          ).then((r) => r.json()),
        ])
          .finally(() => stopLoading())
          .then(([adjArr, holidayJson]) => {
            const [workingDays, holidays] = calculateWorkingDaysFromQueryString(
              queryString,
              holidayJson.province.holidays
            );
            setPeriodWorkingHours(workingDays * 8);
            setPayrollReportData(
              aggregateEmployeeHours(
                payrollData,
                workingDays,
                holidays,
                startDateStr,
                makeAdjustmentMap(adjArr)
              )
            );
          })
          .catch((error) => {
            console.error("Payroll report build failed:", error);
          });
      })
      .catch((error) => {
        console.error("Failed to fetch data:", error);
      });
  };

  const handleCellClick = (params) => {
    const { row, colDef } = params;
    const modalType = colDef.modalType;
    const accessKey = colDef.accessKey;
    const tabToOpen = colDef.tabToOpen;

    if (modalType) {
      handleCardDataSet(row[accessKey], modalType, tabToOpen, {
        timeCardDate: row.period_start_date,
      });
      setInfoCardModalIsOpen(true);
    }
  };

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="flex flex-col items-center relative">
        <p className="font-bold text-lg mb-2">Semi-Monthly Payroll Report</p>
        <Tooltip sx={{ position: "absolute", right: 1 }} title="Close report">
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </div>
      <DataGridPro
        disableRowSelectionOnClick
        rowHeight={30}
        rows={payrollReportData}
        columns={modifiedColumns}
        onCellClick={handleCellClick}
        headerFilters
        sortingOrder={["asc", "desc"]} // Sorting options
        initialState={{
          sorting: {
            sortModel: [
              {
                field:
                  PAYROLL_REPORT_TABLE_FIELDS.find((col) => col.defaultSort)
                    ?.field || PAYROLL_REPORT_TABLE_FIELDS[0].field,
                sort:
                  PAYROLL_REPORT_TABLE_FIELDS.find((col) => col.defaultSort)
                    ?.sort || "asc",
              },
            ],
          },
        }}
        slots={{
          toolbar: CustomToolbarPayrollReport, // Enable the built-in toolbar
        }}
        slotProps={{
          toolbar: {
            onFetchData: loadPayrollReportData,
            showQuickFilter: true, // Enable the quick filter input
            csvOptions: {
              fileName: "payroll_report", // Set the name for the exported CSV file
              utf8WithBom: true, // Include UTF-8 BOM for better CSV compatibility
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
            borderRight: "1px dotted #a0a8ae", // Adjust color and thickness as needed
          },
          "& .MuiDataGrid-cell:last-of-type": {
            borderRight: "none", // Removes border on the last column
          },
        }}
      />
      <InfoCardModalContainer />
    </Box>
  );
}

export default PayrollReportComponent;
