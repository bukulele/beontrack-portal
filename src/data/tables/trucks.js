import {
  TERMINAL_CHOICES,
  TRUCK_STATUS_CHOICES,
  VEHICLE_TYPE_CHOICES,
} from "@/app/assets/tableData";

export const TRUCKS_TABLE_FIELDS = [
  {
    field: "unit_number",
    headerName: "Unit Number",
    accessKey: "id",
    width: 150,
    modalType: "truck",
  },
  {
    field: "plate_number",
    headerName: "Plate Number",
    accessKey: "id",
    width: 150,
    modalType: "truck",
    valueGetter: (_, row) => row.truck_license_plates?.plate_number || "N/A",
  },
  {
    field: "status",
    headerName: "Status",
    width: 150,
    valueGetter: (value) => TRUCK_STATUS_CHOICES[value] || value || "N/A",
  },
  {
    field: "vin",
    headerName: "VIN",
    width: 180,
  },
  {
    field: "vehicle_type",
    headerName: "Vehicle Type",
    width: 150,
    valueGetter: (value) => VEHICLE_TYPE_CHOICES[value] || value || "N/A",
  },
  {
    field: "safety_expiry_date",
    headerName: "Safety Expiry Date",
    width: 150,
    valueGetter: (_, row) => row.truck_safety_docs?.expiry_date || "N/A",
  },
  {
    field: "terminal",
    headerName: "Terminal",
    width: 150,
    valueGetter: (value) => TERMINAL_CHOICES[value] || value || "N/A",
  },
  {
    field: "remarks",
    headerName: "Remarks",
    width: 200,
  },
  {
    field: "truck_registration_docs",
    headerName: "Registration Expiry Date",
    width: 150,
    valueGetter: (_, row) => row.truck_registration_docs?.expiry_date || "N/A",
  },
];
