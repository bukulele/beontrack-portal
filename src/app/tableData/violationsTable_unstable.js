import { VIOLATION_STATUS_CHOICES } from "../assets/tableData";
import { renderBooleanCell } from "../functions/renderCell";

export const VIOLATIONS_TABLE = [
  {
    field: "id",
    headerName: "Violation ID",
    width: 150,
    hide: true, // Show false → Equivalent to hidden column in MUI DataGrid
  },
  {
    field: "violation_number",
    headerName: "Violation Number",
    accessKey: "id",
    width: 150,
    modalType: "violation",
    defaultSort: true,
  },
  {
    field: "driver_id",
    headerName: "Driver ID",
    accessKey: "main_driver_id",
    width: 150,
    modalType: "driver",
  },
  {
    field: "truck_id",
    headerName: "Truck Unit Number",
    accessKey: "truck",
    width: 150,
    modalType: "truck",
  },
  {
    field: "date_time",
    headerName: "Date and Time of Violation",
    width: 180,
  },
  {
    field: "status",
    headerName: "Status",
    width: 150,
    valueGetter: (value) => VIOLATION_STATUS_CHOICES[value] || value || "N/A",
  },
  {
    field: "has_ticket",
    headerName: "Ticket",
    width: 80,
    type: "boolean",
  },
  {
    field: "has_inspection",
    headerName: "Inspection",
    width: 80,
    type: "boolean",
  },
  {
    field: "assigned_to",
    headerName: "Assigned To",
    width: 150,
  },
  {
    field: "violation_details",
    headerName: "Violation Details",
    width: 250,
  },
];
