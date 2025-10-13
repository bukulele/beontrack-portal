import { DRIVER_LOG_COLUMNS } from "@/data/tables/drivers";

/**
 * Driver Card - Log Tab Configuration
 *
 * Change Log Pattern:
 * - Editable fields at top (status_note, remarks_comments, reason_for_leaving, date_of_leaving)
 * - Automatic change history tracking below
 */

export const driverLogConfig = {
  type: 'log',

  // Context configuration
  contextDataKey: 'userData',
  contextLoadFunction: 'loadData',

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
  changeLogTitle: "Driver's change log",
  changeLogColumns: DRIVER_LOG_COLUMNS,

  // API Configuration
  api: {
    getLogEndpoint: '/api/get-driver-log',
    updateEndpoint: '/api/upload-driver-data',
  },
};
