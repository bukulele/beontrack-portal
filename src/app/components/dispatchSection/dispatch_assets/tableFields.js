import {
  STATUS_CHOICES,
  ROUTES_CHOICES,
  TERMINAL_CHOICES,
} from "@/app/assets/tableData";
import {
  renderInteractiveCell,
  renderBooleanCell,
  renderDriverScheduleCell,
  renderPhoneNumberCell,
} from "@/app/functions/renderCell";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import formatHours from "@/app/functions/formatHours";
import { shiftTimerMs } from "@/app/functions/shiftTimerMs";
import { Tooltip } from "react-tooltip";
import React from "react";

export const DRIVERS_AVAILABILITY_SHEET = [
  {
    field: "driver_id",
    headerName: "Driver ID",
    width: 100,
  },
  {
    field: "first_name",
    headerName: "First Name",
    accessKey: "id",
    width: 150,
    modalType: "driver",
    renderCell: renderInteractiveCell,
  },
  {
    field: "last_name",
    headerName: "Last Name",
    accessKey: "id",
    width: 150,
    modalType: "driver",
    renderCell: renderInteractiveCell,
  },
  {
    field: "last_shift",
    headerName: "In Work",
    width: 130,
    specialRender: "switchableCell",
    type: "boolean",
    valueGetter: (value) => value?.check_out_time === null,
    sortComparator: (_1, _2, p1, p2) => {
      const row1 = p1.row || p1.api.getRow(p1.id);
      const row2 = p2.row || p2.api.getRow(p2.id);

      const t1 = shiftTimerMs(row1);
      const t2 = shiftTimerMs(row2);

      return t1 - t2; // ascending base order
    },
  },
  {
    field: "truck_assignments",
    headerName: "Truck",
    width: 150,
    accessKey: "current_truck_assignment",
    modalType: "truck",
    specialRender: "truckAssignmentCell",
    // renderCell: renderInteractiveCell,
  },

  {
    field: "working_hours",
    headerName: "Weekly Hours",
    width: 150,
    type: "number",
    accessKey: "id",
    modalType: "driver",
    tabToOpen: "Time Card",
    valueGetter: (value) => {
      return formatHours(value);
    },
    renderCell: renderInteractiveCell,
  },
  {
    field: "night_driver",
    headerName: "Night Driver",
    type: "boolean",
    width: 80,
    hide: true,
  },
  {
    field: "schedule",
    headerName: "Schedule",
    width: 200,
    renderCell: renderDriverScheduleCell,
  },
  {
    field: "compliant",
    headerName: "Compliant",
    width: 100,
    type: "boolean",
    renderCell: (params) => {
      return (
        <div
          className="flex items-center justify-center"
          data-tooltip-id={`${params.id}_compliant_tooltip`}
          data-tooltip-place="bottom"
        >
          <FontAwesomeIcon
            icon={faCircle}
            color={params.value ? "green" : "red"}
            className="pointer-events-none"
          />
          <Tooltip
            id={`${params.id}_compliant_tooltip`}
            openEvents={{ mouseenter: true, focus: true, click: true }}
            style={{ maxWidth: "90%", zIndex: 20 }}
          >
            {params.row.compliant_tooltip.split("\n").map((line, i) => (
              <React.Fragment key={i}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </Tooltip>
        </div>
      );
    },
  },
  {
    field: "status",
    headerName: "Status",
    width: 150,
    valueGetter: (value) => STATUS_CHOICES[value] || "",
  },
  {
    field: "phone_number",
    headerName: "Phone Number",
    width: 150,
    copyable: true,
    sortable: false,
    renderCell: renderPhoneNumberCell,
  },
  {
    field: "routes",
    headerName: "Routes",
    width: 200,
    valueGetter: (value) =>
      value?.map((route) => ROUTES_CHOICES[route] || route).join(", ") || "N/A",
  },
  {
    field: "lcv_certified",
    headerName: "LCV Certified",
    width: 80,
    type: "boolean",
  },
  {
    field: "eligible_to_enter_usa",
    headerName: "Current USA driver",
    width: 100,
    type: "boolean",
    renderCell: renderBooleanCell,
    hide: true,
  },
  {
    field: "terminal",
    headerName: "Terminal",
    width: 100,
    valueGetter: (value) => TERMINAL_CHOICES[value] || value || "N/A",
    sortable: false,
  },
];
