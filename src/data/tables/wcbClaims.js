/**
 * WCB Claims Table Configuration
 *
 * Modern table columns for wcb_claims entity (Prisma schema)
 * Used by unified table page: /table?entity=wcb_claims
 */

export const WCB_CLAIMS_TABLE_FIELDS = [
  {
    field: "id",
    headerName: "ID",
    width: 100,
    hide: true,
  },
  {
    field: "claimNumber",
    headerName: "Claim #",
    width: 150,
    sortable: true,
  },
  {
    field: "wcbClaimNumber",
    headerName: "WCB #",
    width: 140,
    sortable: true,
  },
  {
    field: "status",
    headerName: "Status",
    width: 140,
    sortable: true,
    // Status badge will be rendered by the table component
  },
  {
    field: "incidentDate",
    headerName: "Incident Date",
    width: 130,
    sortable: true,
    valueFormatter: (value) => {
      if (!value) return '';
      return new Date(value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    },
  },
  {
    field: "injuryType",
    headerName: "Injury Type",
    width: 180,
    sortable: true,
  },
  {
    field: "bodyPartAffected",
    headerName: "Body Part",
    width: 150,
    sortable: true,
  },
  {
    field: "injurySeverity",
    headerName: "Severity",
    width: 120,
    sortable: true,
    valueFormatter: (value) => {
      if (!value) return '';
      // Capitalize first letter
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
  },
  {
    field: "province",
    headerName: "Province",
    width: 100,
    sortable: true,
  },
  {
    field: "location",
    headerName: "Location",
    width: 180,
    sortable: true,
  },
  {
    field: "createdAt",
    headerName: "Created",
    width: 130,
    sortable: true,
    valueFormatter: (value) => {
      if (!value) return '';
      return new Date(value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    },
  },
];
