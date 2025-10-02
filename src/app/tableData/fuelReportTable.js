import { CANADIAN_PROVINCES, QUARTERS } from "../assets/tableData";

export const FUEL_REPORT_TABLE = [
  {
    dataName: "Date",
    dataKey: "date",
    sort: true,
    show: true,
    date: true,
  },
  {
    dataName: "Quantity (Liters)",
    dataKey: "quantity",
    sort: true,
    show: true,
    date: false,
  },
  {
    dataName: "Province",
    dataKey: "province",
    sort: true,
    show: true,
    date: false,
    type: "enum",
    values: CANADIAN_PROVINCES,
  },
  {
    dataName: "Company Name",
    dataKey: "company_name",
    sort: true,
    show: true,
    date: false,
  },
];

export const FUEL_REPORT_TABLE_QUARTERLY = [
  {
    dataName: "Year",
    dataKey: "year",
    sort: true,
    show: true,
  },
  {
    dataName: "Quarter",
    dataKey: "quarter",
    sort: true,
    show: true,
    date: false,
    type: "enum",
    values: QUARTERS,
  },
  {
    dataName: "Province",
    dataKey: "province",
    sort: true,
    show: true,
    date: false,
    type: "enum",
    values: CANADIAN_PROVINCES,
  },
  {
    dataName: "Total Quantity (Liters)",
    dataKey: "total_quantity",
    sort: true,
    show: true,
    date: false,
  },
];
