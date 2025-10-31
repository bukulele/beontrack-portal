import {
  DEPARTMENT_CHOICES,
  STATUS_CHOICES,
} from "@/app/assets/tableData";

// Employee Status Enum mapping (from Prisma schema)
const EMPLOYEE_STATUS_CHOICES = {
  new: "New",
  application_received: "Application Received",
  under_review: "Under Review",
  application_on_hold: "On Hold",
  rejected: "Rejected",
  trainee: "Trainee",
  active: "Active",
  resigned: "Resigned",
  vacation: "Vacation",
  on_leave: "On Leave",
  wcb: "WCB",
  terminated: "Terminated",
  suspended: "Suspended",
};

// Employment Type Enum mapping
const EMPLOYMENT_TYPE_CHOICES = {
  full_time: "Full Time",
  part_time: "Part Time",
  contract: "Contract",
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
    valueGetter: (value) => EMPLOYEE_STATUS_CHOICES[value] || value || "N/A",
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
    valueGetter: (value) => EMPLOYMENT_TYPE_CHOICES[value] || value || "N/A",
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
