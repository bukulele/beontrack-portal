/**
 * Violation Card - Log Tab Configuration
 *
 * UPDATES LOG PATTERN (Different from Change Log):
 * - Text input to add manual log entries
 * - Display log entries (timestamp, updated_by, text)
 * - Uses updates_log field from context
 * - API: POST to /api/update-violations-log
 *
 * TODO: This requires a different tab type: 'updates-log'
 * - Create UpdatesLogTab.jsx component
 * - Implement add log record functionality
 * - Configure for Incident and Violation cards
 *
 * DEFERRED TO: Phase 8 (Custom Tabs) or when ViolationCard is being tested
 */

import moment from "moment-timezone";

// Violation updates log columns
export const VIOLATION_UPDATES_LOG_COLUMNS = [
  {
    field: "timestamp",
    headerName: "Timestamp",
    width: 160,
    valueGetter: (value) => moment(value).format("MMM DD YYYY, hh:mm"),
  },
  { field: "updated_by", headerName: "Updated By", width: 200 },
  { field: "text", headerName: "Text", flex: 1, minWidth: 300 },
];

export const violationLogConfig = {
  type: 'updates-log', // Different type!

  // Context configuration
  contextDataKey: 'violationData',
  contextLoadFunction: 'loadViolationData',

  // Updates log configuration
  updatesLogField: 'updates_log', // Field in context data
  updatesLogTitle: "Violation's change log",
  updatesLogColumns: VIOLATION_UPDATES_LOG_COLUMNS,

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
    addLogEndpoint: '/api/update-violations-log', // POST
    entityIdField: 'violation', // Form field name for entity ID
  },
};
