/**
 * Third Party Info Tab Configuration
 *
 * Configuration for third party information sub-entities tab.
 */
export const tpInfoConfig = {
  type: 'sub-entities',

  // Context keys
  dataKey: 'incidentData',
  loadFunction: 'loadIncidentData',

  // Child entities
  childrenKey: 'incident_claims',
  filterBy: { field: 'claim_to', value: 'TP' },

  // Display fields (read-only)
  dataFields: [
    {
      key: 'third_party_contacts',
      label: 'Third Party Contacts'
    },
    {
      key: 'third_party_insurance_info',
      label: 'Insurance Info'
    },
  ],

  // File field
  fileField: {
    key: 'claim_documents',
    label: 'Third Party Documents',
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
    title: (mode, data) => mode === 'add' ? 'Add Third Party Info' : 'Edit Third Party Info',
    fields: [
      {
        key: 'third_party_contacts',
        label: 'Third Party Contacts',
        type: 'textarea',
        required: true
      },
      {
        key: 'third_party_insurance_info',
        label: 'Insurance Information',
        type: 'textarea',
        required: false
      }
    ],
    endpoint: '/api/get-claims',
    method: { add: 'POST', edit: 'PATCH' }
  },

  // Delete configuration
  delete: {
    endpoint: '/api/get-claims',
    confirmMessage: 'Are you sure you want to delete this third party information?'
  },

  // Group title
  groupTitle: (item, index) => `Third Party Info ${index + 1}`,

  // Labels
  labels: {
    addButton: 'ADD THIRD PARTY INFO'
  }
};

export default tpInfoConfig;
