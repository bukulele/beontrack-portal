/**
 * Employee WCB Claims Tab Configuration (ListTab)
 *
 * Displays all WCB claims linked to an employee in a simple list format.
 * Uses pre-loaded wcbClaims data from employee API response.
 */

export const EMPLOYEE_WCB_CLAIMS_TAB_CONFIG = {
  // Parent context configuration
  parentDataKey: 'userData', // Key in EmployeeContext for employee data

  // Data source: wcbClaims array is pre-loaded in employee API response
  dataSource: {
    type: 'direct', // Data is directly in parent entity
    field: 'wcbClaims', // Field name in employee data
  },

  // Row renderer for ListRow component
  rowRenderer: {
    // Primary text: Claim number or "New Claim"
    primary: (claim) => {
      const claimNum = claim.claimNumber || 'N/A';
      const wcbNum = claim.wcbClaimNumber ? ` (WCB: ${claim.wcbClaimNumber})` : '';
      return `Claim ${claimNum}${wcbNum}`;
    },

    // Secondary text: Injury details
    secondary: (claim) => {
      const injury = claim.injuryType || 'Unknown injury';
      const bodyPart = claim.bodyPartAffected ? ` - ${claim.bodyPartAffected}` : '';
      const severity = claim.severityLevel ? ` [${claim.severityLevel}]` : '';
      return `${injury}${bodyPart}${severity}`;
    },

    // Metadata: Incident date and province
    metadata: (claim) => {
      const date = claim.incidentDate
        ? new Date(claim.incidentDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
        : 'Unknown date';
      const province = claim.province || 'Unknown location';
      return `${date} • ${province}`;
    },

    // Badge: Status code (ListRow will get color from SettingsContext)
    badge: (claim) => claim.status,
  },

  // Click handler configuration
  onRowClick: {
    type: 'openCard',
    entityType: 'wcb_claims',
    getEntityId: (claim) => claim.id,
  },

  // Sort function: Most recent incident first
  sortFn: (a, b) => {
    const dateA = a.incidentDate ? new Date(a.incidentDate) : new Date(0);
    const dateB = b.incidentDate ? new Date(b.incidentDate) : new Date(0);
    return dateB - dateA; // Descending order
  },

  // Empty state message
  emptyMessage: 'No WCB claims found for this employee',

  // Related entity type (for navigation)
  relatedEntityType: 'wcb_claims',
};

export default EMPLOYEE_WCB_CLAIMS_TAB_CONFIG;
