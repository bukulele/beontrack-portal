/**
 * Violation Updates Log Tab Configuration
 *
 * Configuration for violation freeform text log.
 */
export const violationLogConfig = {
  type: 'activity-log',

  // Context keys (UniversalCard provides ViolationContext)
  dataKey: 'violationData',
  loadFunction: 'loadViolationData',

  // Log data
  logKey: 'updates_log',

  // API configuration
  addEndpoint: '/api/update-violations-log',
  entityIdField: 'violation', // Field name in POST body

  // Display configuration
  columns: [
    {
      key: 'timestamp',
      label: 'Timestamp',
      width: '16.67%',
      format: 'datetime'
    },
    {
      key: 'updated_by',
      label: 'Updated By',
      width: '25%'
    },
    {
      key: 'text',
      label: 'Text',
      width: '58.33%'
    }
  ],

  // Labels
  labels: {
    inputLabel: 'Add log record',
    header: "Violation's change log",
    buttonTooltip: 'Add log record'
  }
};

export default violationLogConfig;
