import formatDate from "@/app/functions/formatDate";

/**
 * WCB Claim Card - Log Tab Configuration
 *
 * Change Log Pattern:
 * - Automatic change history tracking for all field modifications
 * - No editable fields (all claim data managed through other tabs)
 */

// WCB claim log columns (matches Prisma ActivityLog model fields)
export const WCB_CLAIM_LOG_COLUMNS = [
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

export const wcbClaimLogConfig = {
  type: 'log',

  // Context configuration
  contextDataKey: 'wcbClaimData',
  contextLoadFunction: 'loadWcbClaimData',

  // No editable fields for WCB claims (data managed in other tabs)
  editableFieldsTitle: null,
  editableFields: [],

  // Change Log Section
  changeLogTitle: "Claim Change Log",
  changeLogColumns: WCB_CLAIM_LOG_COLUMNS,

  // API Configuration
  api: {
    getLogEndpoint: '/api/v1/wcb_claims', // Will append /{id}/activity in LogTab
    updateEndpoint: '/api/v1/wcb_claims',
  },
};

export default wcbClaimLogConfig;
