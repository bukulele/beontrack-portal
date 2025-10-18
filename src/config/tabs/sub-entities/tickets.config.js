import { TICKET_GIVEN_TO_CHOICES } from "@/app/assets/tableData";

/**
 * Tickets Tab Configuration
 *
 * Configuration for violation tickets sub-entities tab.
 */
export const ticketsConfig = {
  type: 'sub-entities',

  // Context keys (UniversalCard provides ViolationContext)
  dataKey: 'violationData',
  loadFunction: 'loadViolationData',

  // Child entities
  childrenKey: 'violation_tickets',
  filterBy: null, // No filtering

  // Display fields (read-only)
  dataFields: [
    {
      key: 'ticket_number',
      label: 'Ticket Number'
    },
    {
      key: 'given_to',
      label: 'Given To',
      valueMap: TICKET_GIVEN_TO_CHOICES
    },
    {
      key: 'officer_name',
      label: 'Officer Name'
    },
    {
      key: 'violation_type',
      label: 'Violation Type'
    },
    {
      key: 'additional_info',
      label: 'Additional Info'
    },
  ],

  // File field
  fileField: {
    key: 'ticket_documents',
    label: 'Ticket Documents',
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
    dataType: 'ticket'
  },

  // Form configuration
  form: {
    title: (mode, data) => mode === 'add' ? 'Add Ticket' : 'Edit Ticket',
    fields: [
      {
        key: 'ticket_number',
        label: 'Ticket Number',
        type: 'text',
        required: true
      },
      {
        key: 'given_to',
        label: 'Given To',
        type: 'select',
        options: TICKET_GIVEN_TO_CHOICES,
        required: true
      },
      {
        key: 'officer_name',
        label: 'Officer Name',
        type: 'text',
        required: false
      },
      {
        key: 'violation_type',
        label: 'Violation Type',
        type: 'text',
        required: false
      },
      {
        key: 'additional_info',
        label: 'Additional Info',
        type: 'textarea',
        required: false
      }
    ],
    endpoint: '/api/get-tickets',
    method: { add: 'POST', edit: 'PATCH' }
  },

  // Delete configuration
  delete: {
    endpoint: '/api/get-tickets',
    confirmMessage: 'Are you sure you want to delete this ticket?'
  },

  // Group title
  groupTitle: (item, index) => 'Ticket',

  // Labels
  labels: {
    addButton: 'ADD TICKET'
  },

  // CRUD conditions
  crud: {
    addButtonCondition: null // Always show add button (multiple tickets allowed)
  },

  // Special behavior
  specialBehavior: null
};

export default ticketsConfig;
