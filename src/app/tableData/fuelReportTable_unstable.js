import { CANADIAN_PROVINCES, QUARTERS } from "../assets/tableData";

export const FUEL_REPORT_TABLE = [
  {
    field: "date",
    headerName: "Date",
    width: 150,
  },
  {
    field: "quantity",
    headerName: "Quantity (Liters)",
    width: 150,
  },
  {
    field: "province",
    headerName: "Province",
    width: 150,
    valueGetter: (value) => CANADIAN_PROVINCES[value] || value || "N/A",
  },
  {
    field: "company_name",
    headerName: "Company Name",
    width: 200,
  },
];

export const FUEL_REPORT_TABLE_QUARTERLY = [
  {
    field: "year",
    headerName: "Year",
    width: 120,
  },
  {
    field: "quarter",
    headerName: "Quarter",
    width: 150,
    valueGetter: (value) => QUARTERS[value] || value || "N/A",
  },
  {
    field: "province",
    headerName: "Province",
    width: 180,
    valueGetter: (value) => CANADIAN_PROVINCES[value] || value || "N/A",
  },
  {
    field: "total_quantity",
    headerName: "Total Quantity (Liters)",
    width: 180,
  },
];
