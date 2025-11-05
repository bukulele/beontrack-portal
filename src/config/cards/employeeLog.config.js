import formatDate from "@/app/functions/formatDate";

/**
 * Employee Card - Log Tab Configuration
 *
 * Change Log Pattern:
 * - Editable fields at top (status_note, remarks_comments, reason_for_leaving, date_of_leaving)
 * - Automatic change history tracking below
 */

// Employee log columns (matches Prisma ActivityLog model fields)
export const EMPLOYEE_LOG_COLUMNS = [
  { field: "fieldName", headerName: "Field Name", width: 140 },
  { field: "oldValue", headerName: "Old Value", width: 120 },
  { field: "newValue", headerName: "New Value", width: 120 },
  {
    field: "performedBy",
    headerName: "Changed By",
    flex: 1,
    minWidth: 160,
    valueGetter: (value, row) => {
      const user = row?.performedBy;
      if (!user) return "Unknown";
      return `${user.firstName} ${user.lastName}`.trim() || user.username || user.email;
    },
  },
  {
    field: "createdAt",
    headerName: "Timestamp",
    width: 160,
    valueGetter: (value, row) => formatDate(row?.createdAt),
  },
];

export const employeeLogConfig = {
  type: 'log',

  // Context configuration
  contextDataKey: 'userData',
  contextLoadFunction: 'loadEmployeeData',

  // Editable Fields Section
  editableFieldsTitle: 'Notes',
  editableFields: [
    {
      key: 'statusNote',
      label: 'Status Note',
      type: 'textarea',
    },
    {
      key: 'remarksComments',
      label: 'Remarks',
      type: 'textarea',
    },
    {
      key: 'reasonForLeaving',
      label: 'Reason For Leaving',
      type: 'textarea',
    },
    {
      key: 'dateOfLeaving',
      label: 'Leaving Date',
      type: 'date',
    },
  ],

  // Change Log Section
  changeLogTitle: "Employee's change log",
  changeLogColumns: EMPLOYEE_LOG_COLUMNS,

  // API Configuration
  api: {
    getLogEndpoint: '/api/v1/employees', // Will append /{id}/activity in LogTab
    updateEndpoint: '/api/v1/employees',
  },
};
