import formatDate from "@/app/functions/formatDate";

/**
 * Employee Card - Log Tab Configuration
 *
 * Change Log Pattern:
 * - Editable fields at top (status_note, remarks_comments, reason_for_leaving, date_of_leaving)
 * - Automatic change history tracking below
 */

// Employee log columns (same structure as driver log)
export const EMPLOYEE_LOG_COLUMNS = [
  { field: "field_name", headerName: "Field Name", width: 140 },
  { field: "old_value", headerName: "Old Value", width: 120 },
  { field: "new_value", headerName: "New Value", width: 120 },
  { field: "changed_by", headerName: "Changed By", flex: 1, minWidth: 160 },
  {
    field: "timestamp",
    headerName: "Timestamp",
    width: 160,
    valueGetter: (value) => formatDate(value),
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
      key: 'status_note',
      label: 'Status Note',
      type: 'textarea',
    },
    {
      key: 'remarks_comments',
      label: 'Remarks',
      type: 'textarea',
    },
    {
      key: 'reason_for_leaving',
      label: 'Reason For Leaving',
      type: 'textarea',
    },
    {
      key: 'date_of_leaving',
      label: 'Leaving Date',
      type: 'date',
    },
  ],

  // Change Log Section
  changeLogTitle: "Employee's change log",
  changeLogColumns: EMPLOYEE_LOG_COLUMNS,

  // API Configuration
  api: {
    getLogEndpoint: '/api/get-employee-log',
    updateEndpoint: '/api/upload-employee-data',
  },
};
