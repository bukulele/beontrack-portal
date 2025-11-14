import {
  DEPARTMENT_CHOICES,
  STATUS_CHOICES,
} from "@/app/assets/tableData";

/**
 * Format status code to readable label
 * Capitalizes words and replaces underscores with spaces
 */
const formatStatusLabel = (statusCode) => {
  if (!statusCode) return "N/A";
  return statusCode
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Format employment type code to readable label
 */
const formatEmploymentType = (typeCode) => {
  if (!typeCode) return "N/A";
  return typeCode
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const OFFICE_TABLE_FIELDS_SAFETY = [
  {
    field: "employeeId",
    headerName: "Employee ID",
    width: 150,
    defaultSort: true,
  },
  {
    field: "firstName",
    headerName: "First Name",
    accessKey: "id",
    width: 150,
    modalType: "employee",
  },
  {
    field: "lastName",
    headerName: "Last Name",
    accessKey: "id",
    width: 150,
    modalType: "employee",
  },
  {
    field: "status",
    headerName: "Status",
    width: 150,
    valueGetter: (value) => formatStatusLabel(value),
  },
  {
    field: "phoneNumber",
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
    field: "dateOfBirth",
    headerName: "Date of Birth",
    width: 150,
  },
  {
    field: "hireDate",
    headerName: "Hire Date",
    width: 150,
  },
  {
    field: "department",
    headerName: "Department",
    width: 150,
  },
  {
    field: "jobTitle",
    headerName: "Job Title",
    width: 150,
  },
  {
    field: "employmentType",
    headerName: "Employment Type",
    width: 150,
    valueGetter: (value) => formatEmploymentType(value),
  },
  {
    field: "officeLocation",
    headerName: "Office Location",
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
