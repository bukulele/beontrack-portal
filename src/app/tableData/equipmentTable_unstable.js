import {
  EQUIPMENT_STATUS_CHOICES,
  EQUIPMENT_TYPE_CHOICES,
  TERMINAL_CHOICES,
} from "../assets/tableData";

export const EQUIPMENT_TABLE_FIELDS = [
  {
    field: "unit_number",
    headerName: "Unit Number",
    accessKey: "id",
    width: 150,
    modalType: "equipment",
  },
  {
    field: "plate_number",
    headerName: "Plate Number",
    accessKey: "id",
    width: 150,
    modalType: "equipment",
    valueGetter: (_, row) =>
      row.equipment_license_plates?.plate_number || "N/A",
  },
  {
    field: "status",
    headerName: "Status",
    width: 150,
    valueGetter: (value) => EQUIPMENT_STATUS_CHOICES[value] || value || "N/A",
  },
  {
    field: "vin",
    headerName: "VIN",
    width: 180,
  },
  {
    field: "equipment_type",
    headerName: "Equipment Type",
    width: 150,
    valueGetter: (value) => EQUIPMENT_TYPE_CHOICES[value] || value || "N/A",
  },
  {
    field: "safety_expiry_date",
    headerName: "Safety Expiry Date",
    width: 150,
    valueGetter: (_, row) => row.equipment_safety_docs?.expiry_date || "N/A",
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
    field: "equipment_registration_docs",
    headerName: "Registration Expiry Date",
    width: 150,
    valueGetter: (_, row) =>
      row.equipment_registration_docs?.expiry_date || "N/A",
  },
];
