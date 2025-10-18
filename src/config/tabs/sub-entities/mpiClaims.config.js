import { CLAIM_STATUS_CHOICES, CLAIM_TYPE_MAPPING } from "@/app/assets/tableData";

/**
 * MPI Claims Tab Configuration
 *
 * Configuration for Manitoba Public Insurance claims sub-entities tab.
 */
export const mpiClaimsConfig = {
  type: 'sub-entities',

  // Context keys (UniversalCard provides IncidentContext)
  dataKey: 'incidentData',
  loadFunction: 'loadIncidentData',

  // Child entities
  childrenKey: 'incident_claims',
  filterBy: { field: 'claim_to', value: 'MPI' },

  // Display fields (read-only)
  dataFields: [
    {
      key: 'status',
      label: 'Claim Status',
      valueMap: CLAIM_STATUS_CHOICES
    },
    {
      key: 'claim_number',
      label: 'Claim Number'
    },
    {
      key: 'unit_number',
      label: 'Unit Number',
      hideIf: (item) => item.claim_type === 'CR1' || item.claim_type === 'CR2'
    },
    {
      key: 'reimbursement',
      label: 'Reimbursement'
    },
  ],

  // File field (uses CompactFileRow)
  fileField: {
    key: 'claim_documents',
    label: 'Claim Documents',
    itemType: 'file',
    fileUpload: {
      accept: 'image/*,application/pdf',
      fields: [
        { type: 'comment', label: 'Comment', required: false }
      ]
    },
    actions: {
      checkable: false, // No checkboxes for claim documents
      uploadable: true,
      editable: false,
      deletable: true
    },
    roles: {
      view: ['all'],
      edit: ['safety', 'admin'],
      delete: ['safety', 'admin']
    },
    dataType: 'claim' // For API endpoint
  },

  // Form configuration for add/edit dialog
  form: {
    title: (mode, data) => mode === 'add' ? 'Add MPI Claim' : 'Edit MPI Claim',
    fields: [
      {
        key: 'claim_type',
        label: 'Claim Type',
        type: 'select',
        options: CLAIM_TYPE_MAPPING,
        required: true
      },
      {
        key: 'claim_number',
        label: 'Claim Number',
        type: 'text',
        required: true
      },
      {
        key: 'status',
        label: 'Status',
        type: 'select',
        options: CLAIM_STATUS_CHOICES,
        required: true
      },
      {
        key: 'unit_number',
        label: 'Unit Number',
        type: 'text',
        required: false
      },
      {
        key: 'reimbursement',
        label: 'Reimbursement',
        type: 'text',
        required: false
      }
    ],
    endpoint: '/api/get-claims',
    method: { add: 'POST', edit: 'PATCH' }
  },

  // Delete configuration
  delete: {
    endpoint: '/api/get-claims',
    confirmMessage: 'Are you sure you want to delete this MPI claim?'
  },

  // Group title function
  groupTitle: (item, index) => CLAIM_TYPE_MAPPING[item.claim_type] || `MPI Claim ${index + 1}`,

  // Labels
  labels: {
    addButton: 'ADD MPI CLAIM'
  },

  // CRUD conditions
  crud: {
    addButtonCondition: null // Always show add button
  },

  // Special behavior
  specialBehavior: null
};

export default mpiClaimsConfig;
