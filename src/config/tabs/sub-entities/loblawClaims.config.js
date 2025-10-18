import { CLAIM_STATUS_CHOICES, CLAIM_TYPE_MAPPING } from "@/app/assets/tableData";

/**
 * Loblaw Claims Tab Configuration
 *
 * Configuration for Loblaw claims sub-entities tab.
 */
export const loblawClaimsConfig = {
  type: 'sub-entities',

  // Context keys
  dataKey: 'incidentData',
  loadFunction: 'loadIncidentData',

  // Child entities
  childrenKey: 'incident_claims',
  filterBy: { field: 'claim_to', value: 'LL' },

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

  // File field
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
      checkable: false,
      uploadable: true,
      editable: false,
      deletable: true
    },
    roles: {
      view: ['all'],
      edit: ['safety', 'admin'],
      delete: ['safety', 'admin']
    },
    dataType: 'claim'
  },

  // Form configuration
  form: {
    title: (mode, data) => mode === 'add' ? 'Add Loblaw Claim' : 'Edit Loblaw Claim',
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
    confirmMessage: 'Are you sure you want to delete this Loblaw claim?'
  },

  // Group title
  groupTitle: (item, index) => CLAIM_TYPE_MAPPING[item.claim_type] || `Loblaw Claim ${index + 1}`,

  // Labels
  labels: {
    addButton: 'ADD LOBLAW CLAIM'
  }
};

export default loblawClaimsConfig;
