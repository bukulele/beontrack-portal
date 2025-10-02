import { TERMINAL_CHOICES, WCB_STATUS_CHOICES } from "../assets/tableData";

export const WCB_TABLE = [
  {
    field: "id",
    headerName: "WCB ID",
    width: 150,
    hide: true, // Equivalent to show: false in MUI DataGrid
  },
  {
    field: "claim_number",
    headerName: "4Tracks Claim #",
    accessKey: "id",
    width: 180,
    modalType: "wcb",
  },
  {
    field: "wcb_claim_number",
    headerName: "WCB Claim #",
    accessKey: "id",
    width: 180,
    modalType: "wcb",
  },
  {
    field: "status",
    headerName: "Status",
    width: 150,
    valueGetter: (value) => WCB_STATUS_CHOICES[value] || value || "N/A",
  },
  {
    field: "driver_id",
    headerName: "Driver ID",
    accessKey: "main_driver_id",
    width: 150,
    modalType: "driver",
  },
  {
    field: "employee_id",
    headerName: "Employee ID",
    accessKey: "main_employee_id",
    width: 150,
    modalType: "employee",
  },
  {
    field: "incident_details",
    headerName: "Incident Details",
    width: 250,
  },
  {
    field: "remarks",
    headerName: "Remarks",
    width: 250,
  },
  {
    field: "province",
    headerName: "Province",
    width: 150,
    valueGetter: (value) => TERMINAL_CHOICES[value] || value || "N/A",
  },
  {
    field: "date_time",
    headerName: "Date and Time of Incident",
    width: 180,
  },
  {
    field: "assigned_to",
    headerName: "Assigned To",
    width: 150,
  },
];
