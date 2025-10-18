/**
 * Incident Updates Log Tab Configuration
 *
 * Configuration for incident freeform text log.
 */
export const incidentLogConfig = {
  type: 'activity-log',

  // Context keys (UniversalCard provides IncidentContext)
  dataKey: 'incidentData',
  loadFunction: 'loadIncidentData',

  // Log data
  logKey: 'updates_log',

  // API configuration
  addEndpoint: '/api/update-incidents-log',
  entityIdField: 'incident', // Field name in POST body

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
    header: "Incident's change log",
    buttonTooltip: 'Add log record'
  }
};

export default incidentLogConfig;
