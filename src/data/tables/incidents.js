import { INCIDENT_STATUS_CHOICES } from "@/app/assets/tableData";
import moment from "moment-timezone";

export const INCIDENTS_TABLE = [
  {
    field: "id",
    headerName: "Incident ID",
    width: 150,
    hide: true, // Show false → Equivalent to hidden column in MUI DataGrid
  },
  {
    field: "incident_number",
    headerName: "Incident Number",
    accessKey: "id",
    width: 150,
    modalType: "incident",
    defaultSort: true,
  },
  {
    field: "date_time",
    headerName: "Date of Incident",
    width: 150,
    valueGetter: (value) => moment(value).format("YYYY-MM-DD"),
  },
  {
    field: "mpi_claim_number",
    headerName: "MPI Claim Number",
    width: 180,
    valueGetter: (_, row) => row.incident_claims?.claim_number || "N/A",
  },
  {
    field: "status",
    headerName: "Status",
    width: 150,
    valueGetter: (value) => INCIDENT_STATUS_CHOICES[value] || value || "N/A",
  },
  {
    field: "driver_id",
    headerName: "Main Driver ID",
    accessKey: "main_driver_id",
    width: 150,
    modalType: "driver",
  },
  {
    field: "driver_first_name",
    headerName: "First Name",
    accessKey: "main_driver_id",
    width: 150,
    modalType: "driver",
  },
  {
    field: "driver_last_name",
    headerName: "Last Name",
    accessKey: "main_driver_id",
    width: 150,
    modalType: "driver",
  },
  {
    field: "incident_details",
    headerName: "Incident Details",
    width: 250,
  },
  {
    field: "location",
    headerName: "Location",
    width: 180,
  },
  {
    field: "truck_id",
    headerName: "Truck Unit Number",
    accessKey: "truck",
    width: 150,
    modalType: "truck",
  },
  {
    field: "assigned_to",
    headerName: "Assigned To",
    width: 150,
  },
  {
    field: "analysis",
    headerName: "Analysis",
    width: 250,
  },
];
