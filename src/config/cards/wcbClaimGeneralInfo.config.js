/**
 * WCB Claim General Info Configuration
 *
 * Defines the layout and content for the General Info tab of WCB claim cards
 */

import { WCB_CLAIM_EDIT_FORM_CONFIG } from "@/config/forms/wcbClaimEditForm.config";
import { WCB_CLAIM_MEDICAL_CHECKLIST_CONFIG } from "@/config/checklists/wcbClaimMedicalChecklist.config";
import { WCB_CLAIM_DOCUMENTS_CHECKLIST_CONFIG } from "@/config/checklists/wcbClaimDocumentsChecklist.config";
import { generateFileSectionsFromChecklists } from "@/lib/configUtils";

export const WCB_CLAIM_GENERAL_INFO_CONFIG = {
  // Edit form configuration
  editFormConfig: WCB_CLAIM_EDIT_FORM_CONFIG,

  // Checklist configurations for status validation
  checklistConfigs: [
    WCB_CLAIM_MEDICAL_CHECKLIST_CONFIG,
    WCB_CLAIM_DOCUMENTS_CHECKLIST_CONFIG,
  ],
  // Linked entity configuration - shows which employee/driver this claim is for
  linkedEntity: {
    enabled: true,
    entityTypeField: 'entityType',
    entityIdField: 'entityId',
    labelFormatter: (entityType) => {
      const labels = {
        employees: 'Related Employee',
        drivers: 'Related Driver',
      };
      return labels[entityType] || 'Related Entity';
    },
    // Route pattern for navigation back to the linked entity
    routePattern: (entityType, entityId) => `/table?entity=${entityType}&id=${entityId}`,
  },

  // Status configuration - editable dropdown
  statusConfig: {
    editable: true,
  },

  // No image configuration for WCB claims
  image: {
    enabled: false,
  },

  // Field sections - organized into logical groups
  sections: [
    {
      id: 'claim-info',
      title: 'Claim Information',
      fields: [
        {
          key: 'claimNumber',
          label: 'Internal Claim #',
          type: 'text',
          required: true,
        },
        {
          key: 'linkedEntity',
          label: 'Employee',
          type: 'text',
          readOnly: true,
          formatter: (value) => {
            if (!value) return 'Not set';
            return `${value.firstName} ${value.lastName} (${value.employeeId})`;
          },
        },
        {
          key: 'wcbClaimNumber',
          label: 'WCB Claim #',
          type: 'text',
          placeholder: 'Assigned by WCB',
        },
        {
          key: 'province',
          label: 'Province',
          type: 'select',
          options: [
            { value: 'AB', label: 'Alberta' },
            { value: 'BC', label: 'British Columbia' },
            { value: 'MB', label: 'Manitoba' },
            { value: 'NB', label: 'New Brunswick' },
            { value: 'NL', label: 'Newfoundland and Labrador' },
            { value: 'NS', label: 'Nova Scotia' },
            { value: 'NT', label: 'Northwest Territories' },
            { value: 'NU', label: 'Nunavut' },
            { value: 'ON', label: 'Ontario' },
            { value: 'PE', label: 'Prince Edward Island' },
            { value: 'QC', label: 'Quebec' },
            { value: 'SK', label: 'Saskatchewan' },
            { value: 'YT', label: 'Yukon' },
          ],
          required: true,
        },
      ],
    },
    {
      id: 'incident-info',
      title: 'Incident Information',
      fields: [
        {
          key: 'incidentDate',
          label: 'Incident Date',
          type: 'datetime',
          required: true,
          formatter: (value) => {
            if (!value) return 'Not set';
            return new Date(value).toLocaleString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });
          },
        },
        {
          key: 'location',
          label: 'Incident Location',
          type: 'text',
          placeholder: 'e.g., Shop Bay 3, Highway 2 North, etc.',
        },
        {
          key: 'incidentDetails',
          label: 'Incident Description',
          type: 'textarea',
          required: true,
          rows: 4,
        },
      ],
    },
    {
      id: 'injury-details',
      title: 'Injury Details',
      fields: [
        {
          key: 'injuryType',
          label: 'Injury Type',
          type: 'text',
          placeholder: 'e.g., Back strain, Laceration, Fracture',
        },
        {
          key: 'bodyPartAffected',
          label: 'Body Part Affected',
          type: 'text',
          placeholder: 'e.g., Lower back, Right hand, Left knee',
        },
        {
          key: 'severityLevel',
          label: 'Injury Severity',
          type: 'select',
          options: [
            { value: 'minor', label: 'Minor' },
            { value: 'moderate', label: 'Moderate' },
            { value: 'serious', label: 'Serious' },
            { value: 'critical', label: 'Critical' },
          ],
        },
      ],
    },
    {
      id: 'medical-info',
      title: 'Medical Information',
      fields: [
        {
          key: 'reportedToDoctor',
          label: 'Reported to Doctor',
          type: 'boolean',
          formatter: (value) => (value ? 'Yes' : 'No'),
        },
        {
          key: 'firstContactDate',
          label: 'First Medical Contact Date',
          type: 'date',
          formatter: (value) => {
            if (!value) return 'Not set';
            return new Date(value).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });
          },
        },
        {
          key: 'doctorName',
          label: 'Physician Name',
          type: 'text',
        },
        {
          key: 'doctorPhone',
          label: 'Physician Phone',
          type: 'tel',
          formatter: (value) => {
            if (!value) return '';
            // Format phone number: (XXX) XXX-XXXX
            const cleaned = value.replace(/\D/g, '');
            const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
            if (match) {
              return `(${match[1]}) ${match[2]}-${match[3]}`;
            }
            return value;
          },
        },
        {
          key: 'medicalFacility',
          label: 'Medical Facility',
          type: 'text',
        },
      ],
    },
    {
      id: 'wcb-contact',
      title: 'WCB Contact Information',
      fields: [
        {
          key: 'wcbContactName',
          label: 'WCB Adjuster Name',
          type: 'text',
        },
        {
          key: 'wcbContactPhone',
          label: 'WCB Adjuster Phone',
          type: 'tel',
          formatter: (value) => {
            if (!value) return '';
            const cleaned = value.replace(/\D/g, '');
            const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
            if (match) {
              return `(${match[1]}) ${match[2]}-${match[3]}`;
            }
            return value;
          },
        },
        {
          key: 'wcbContactEmail',
          label: 'WCB Adjuster Email',
          type: 'email',
        },
      ],
    },
    {
      id: 'return-to-work',
      title: 'Return to Work',
      fields: [
        {
          key: 'expectedReturnDate',
          label: 'Expected Return Date',
          type: 'date',
          formatter: (value) => {
            if (!value) return 'Not set';
            return new Date(value).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });
          },
        },
        {
          key: 'actualReturnDate',
          label: 'Actual Return Date',
          type: 'date',
          formatter: (value) => {
            if (!value) return 'Not applicable';
            return new Date(value).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });
          },
        },
        {
          key: 'lostTimeDays',
          label: 'Lost Time Days',
          type: 'number',
          formatter: (value) => {
            if (value === null || value === undefined) return '0';
            return value.toString();
          },
        },
      ],
    },
    {
      id: 'financial',
      title: 'Financial Impact',
      fields: [
        {
          key: 'estimatedCost',
          label: 'Estimated Cost',
          type: 'currency',
          formatter: (value) => {
            if (!value && value !== 0) return 'Not set';
            return new Intl.NumberFormat('en-CA', {
              style: 'currency',
              currency: 'CAD',
            }).format(value);
          },
        },
        {
          key: 'actualCost',
          label: 'Total Cost',
          type: 'currency',
          formatter: (value) => {
            if (!value && value !== 0) return 'Not finalized';
            return new Intl.NumberFormat('en-CA', {
              style: 'currency',
              currency: 'CAD',
            }).format(value);
          },
        },
      ],
    },
    {
      id: 'notes',
      title: 'Notes',
      fields: [
        {
          key: 'statusNote',
          label: 'Status Note',
          type: 'textarea',
        },
        {
          key: 'remarksComments',
          label: 'Remarks / Comments',
          type: 'textarea',
        },
      ],
    },
  ],

  // File viewing sections - generated from checklists (single source of truth)
  fileSections: generateFileSectionsFromChecklists(
    [WCB_CLAIM_MEDICAL_CHECKLIST_CONFIG, WCB_CLAIM_DOCUMENTS_CHECKLIST_CONFIG],
    {
      "WCB Required Forms": [
        'wcb_worker_report',
        'wcb_employer_report',
        'wcb_medical_report',
      ],
    }
  ),
};

export default WCB_CLAIM_GENERAL_INFO_CONFIG;
