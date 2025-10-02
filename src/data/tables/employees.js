import {
  DEPARTMENT_CHOICES,
  STATUS_CHOICES,
  TERMINAL_CHOICES,
  IMMIGRATION_STATUS,
} from "@/app/assets/tableData";

export const OFFICE_TABLE_FIELDS_SAFETY = [
  {
    field: "employee_id",
    headerName: "Employee ID",
    width: 150,
    defaultSort: true,
  },
  {
    field: "first_name",
    headerName: "First Name",
    accessKey: "id",
    width: 150,
    modalType: "employee",
  },
  {
    field: "last_name",
    headerName: "Last Name",
    accessKey: "id",
    width: 150,
    modalType: "employee",
  },
  {
    field: "status",
    headerName: "Status",
    width: 150,
    valueGetter: (value) => STATUS_CHOICES[value] || value || "N/A",
  },
  {
    field: "status_note",
    headerName: "Status Note",
    width: 200,
  },
  {
    field: "phone_number",
    headerName: "Phone Number",
    width: 150,
    copyable: true,
  },
  {
    field: "email",
    headerName: "Email",
    width: 200,
    copyable: true,
  },
  {
    field: "date_of_birth",
    headerName: "Date of Birth",
    width: 150,
  },
  {
    field: "hiring_date",
    headerName: "Hiring Date",
    width: 150,
  },
  {
    field: "application_date",
    headerName: "Application Date",
    width: 150,
  },
  {
    field: "immigration_status",
    headerName: "Immigration Status",
    width: 80,
    valueGetter: (value) => IMMIGRATION_STATUS[value] || value || "N/A",
  },
  {
    field: "immigration_doc_expiry_date",
    headerName: "Immigrtion Doc Expiration Date",
    width: 150,
    valueGetter: (_, row) => row.immigration_doc?.expiry_date || "N/A",
  },
  {
    field: "terminal",
    headerName: "Terminal",
    width: 100,
    valueGetter: (value) => TERMINAL_CHOICES[value] || value || "N/A",
  },
  {
    field: "department",
    headerName: "Department",
    width: 150,
    valueGetter: (value) => DEPARTMENT_CHOICES[value] || value || "N/A",
  },
  {
    field: "title",
    headerName: "Title",
    width: 150,
  },
];

export const PAYROLL_REPORT_TABLE_FIELDS = [
  {
    field: "employee_id",
    headerName: "Employee",
    width: 100,
  },
  {
    field: "first_name",
    headerName: "First Name",
    accessKey: "id",
    width: 150,
    modalType: "employee",
    tabToOpen: "Time Card",
  },
  {
    field: "last_name",
    headerName: "Last Name",
    accessKey: "id",
    width: 150,
    modalType: "employee",
    tabToOpen: "Time Card",
  },
  {
    field: "immigration_status",
    headerName: "Immigration Status",
    valueGetter: (value) => IMMIGRATION_STATUS[value] || "",
    width: 100,
  },
  {
    field: "department",
    headerName: "Department",
    width: 150,
    valueGetter: (value) => DEPARTMENT_CHOICES[value] || value || "N/A",
  },
  {
    field: "total_hours",
    headerName: "Total Hours",
    width: 150,
    accessKey: "id",
    modalType: "employee",
    tabToOpen: "Time Card",
  },
  {
    field: "regular_hours",
    headerName: "Regular Hours",
    width: 150,
  },
  {
    field: "adjustments",
    headerName: "Adjustments",
    width: 150,
  },
  {
    field: "holidays",
    headerName: "Holidays Hours",
    width: 150,
  },
  {
    field: "medical_hours",
    headerName: "Medical Hours",
    width: 150,
  },
  {
    field: "extra_hours",
    headerName: "Extra Hours",
    width: 150,
  },
  {
    field: "rate",
    headerName: "Rate",
    width: 100,
  },
  {
    field: "extra_pay",
    headerName: "Extra Pay",
    width: 150,
    valueGetter: (value) => Number(value).toFixed(2),
  },
];
