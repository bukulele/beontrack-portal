/**
 * Incident Card - Log Tab Configuration
 *
 * UPDATES LOG PATTERN (Different from Change Log):
 * - Text input to add manual log entries
 * - Display log entries (timestamp, updated_by, text)
 * - Uses updates_log field from context
 * - API: POST to /api/update-incidents-log
 *
 * TODO: This requires a different tab type: 'updates-log'
 * - Create UpdatesLogTab.jsx component
 * - Implement add log record functionality
 * - Configure for Incident and Violation cards
 *
 * DEFERRED TO: Phase 8 (Custom Tabs) or when IncidentCard is being tested
 */

import moment from "moment-timezone";

// Incident updates log columns
export const INCIDENT_UPDATES_LOG_COLUMNS = [
  {
    field: "timestamp",
    headerName: "Timestamp",
    width: 160,
    valueGetter: (value) => moment(value).format("MMM DD YYYY, hh:mm"),
  },
  { field: "updated_by", headerName: "Updated By", width: 200 },
  { field: "text", headerName: "Text", flex: 1, minWidth: 300 },
];

export const incidentLogConfig = {
  type: 'updates-log', // Different type!

  // Context configuration
  contextDataKey: 'incidentData',
  contextLoadFunction: 'loadIncidentData',

  // Updates log configuration
  updatesLogField: 'updates_log', // Field in context data
  updatesLogTitle: "Incident's change log",
  updatesLogColumns: INCIDENT_UPDATES_LOG_COLUMNS,

  // Add log record configuration
  addLogRecord: {
    enabled: true,
    label: 'Add log record',
    placeholder: 'Enter log text...',
    buttonIcon: 'faPlus',
    buttonTooltip: 'Add log record',
  },

  // API Configuration
  api: {
    addLogEndpoint: '/api/update-incidents-log', // POST
    entityIdField: 'incident', // Form field name for entity ID
  },
};
