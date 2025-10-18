import { INSPECTION_RESULT_CHOICES } from "@/app/assets/tableData";

/**
 * Inspection Tab Configuration
 *
 * Configuration for violation inspection sub-entities tab.
 * Special behavior: Auto-opens "indicate violations" modal if inspection FAIL and no violations indicated.
 */
export const inspectionConfig = {
  type: 'sub-entities',

  // Context keys (UniversalCard provides ViolationContext)
  dataKey: 'violationData',
  loadFunction: 'loadViolationData',

  // Child entities
  childrenKey: 'violation_inspections',
  filterBy: null, // No filtering

  // Display fields (read-only)
  dataFields: [
    {
      key: 'inspection_number',
      label: 'Inspection Number'
    },
    {
      key: 'inspection_result',
      label: 'Result',
      valueMap: INSPECTION_RESULT_CHOICES
    },
    {
      key: 'officer_name',
      label: 'Officer Name'
    },
    {
      key: 'officer_info',
      label: 'Officer Info'
    },
    {
      key: 'additional_info',
      label: 'Additional Info'
    },
  ],

  // File field
  fileField: {
    key: 'inspection_documents',
    label: 'Inspection Documents',
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
    dataType: 'inspection'
  },

  // Form configuration
  form: {
    title: (mode, data) => mode === 'add' ? 'Add Inspection' : 'Edit Inspection',
    fields: [
      {
        key: 'inspection_number',
        label: 'Inspection Number',
        type: 'text',
        required: true
      },
      {
        key: 'inspection_result',
        label: 'Inspection Result',
        type: 'select',
        options: INSPECTION_RESULT_CHOICES,
        required: true
      },
      {
        key: 'officer_name',
        label: 'Officer Name',
        type: 'text',
        required: false
      },
      {
        key: 'officer_info',
        label: 'Officer Info',
        type: 'textarea',
        required: false
      },
      {
        key: 'additional_info',
        label: 'Additional Info',
        type: 'textarea',
        required: false
      }
    ],
    endpoint: '/api/get-inspections',
    method: { add: 'POST', edit: 'PATCH' }
  },

  // Delete configuration
  delete: {
    endpoint: '/api/get-inspections',
    confirmMessage: 'Are you sure you want to delete this inspection?'
  },

  // Group title
  groupTitle: (item, index) => 'Inspection',

  // Labels
  labels: {
    addButton: 'ADD INSPECTION'
  },

  // CRUD conditions
  crud: {
    // Only allow adding inspection if none exist
    addButtonCondition: (entities, contextData) => entities.length === 0
  },

  // Special behavior: Check for FAIL result and auto-open violations modal
  specialBehavior: ({ contextData, entities, setFormDialogOpen, setFormMode, setSelectedEntity }) => {
    if (!contextData) return;

    // Check if there's an inspection with FAIL result
    const hasFailedInspection = entities.some(
      (inspection) => inspection.inspection_result === 'FAIL'
    );

    // Check if violations have been indicated
    const hasViolations =
      contextData.truck_violation?.length > 0 ||
      contextData.trailer_1_violation?.length > 0 ||
      contextData.trailer_2_violation?.length > 0 ||
      contextData.converter_violation?.length > 0;

    // If FAIL and no violations, we should trigger the indicate violations modal
    // This would require integration with CreateObject modal system
    // For now, we'll just log a warning - implementation depends on how you want to handle this
    if (hasFailedInspection && !hasViolations) {
      console.warn('Inspection FAIL detected but no violations indicated. Please indicate violations.');
      // TODO: Integrate with CreateObject modal or create custom modal
      // setObjectType('indicate_violations');
      // setCreateObjectModalIsOpen(true);
    }
  }
};

export default inspectionConfig;
