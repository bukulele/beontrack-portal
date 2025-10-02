import { REPORTS_TYPES } from "../assets/tableData";

export const DRIVER_REPORT_TABLE_FIELDS = [
  {
    field: "id",
    headerName: "Report ID",
    accessKey: "id",
    width: 150,
    modalType: "driver_reports",
  },
  {
    field: "driver_id",
    headerName: "Driver ID",
    accessKey: "driver",
    width: 150,
    modalType: "driver",
  },
  {
    field: "date_time",
    headerName: "Date and Time of Report",
    width: 180,
  },
  {
    field: "type_of_report",
    headerName: "Report Type",
    width: 150,
    valueGetter: (value) => REPORTS_TYPES[value] || value || "N/A",
  },
  {
    field: "truck_number",
    headerName: "Truck Number",
    width: 150,
  },
  {
    field: "trailer_number",
    headerName: "Trailer Number",
    width: 150,
  },
  {
    field: "description",
    headerName: "Description",
    width: 250,
  },
  {
    field: "steps_taken",
    headerName: "Steps Taken",
    width: 250,
  },
];
