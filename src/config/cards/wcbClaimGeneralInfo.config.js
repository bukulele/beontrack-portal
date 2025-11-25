/**
 * WCB Claim General Info Configuration
 *
 * Defines the layout and content for the General Info tab of WCB claim cards
 */

import { WCB_CLAIM_EDIT_FORM_CONFIG } from "@/config/forms/wcbClaimEditForm.config";

export const WCB_CLAIM_GENERAL_INFO_CONFIG = {
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
          name: 'claimNumber',
          label: 'Internal Claim #',
          type: 'text',
          required: true,
        },
        {
          name: 'wcbClaimNumber',
          label: 'WCB Claim #',
          type: 'text',
          placeholder: 'Assigned by WCB',
        },
        {
          name: 'province',
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
          name: 'incidentDate',
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
          name: 'location',
          label: 'Incident Location',
          type: 'text',
          placeholder: 'e.g., Shop Bay 3, Highway 2 North, etc.',
        },
        {
          name: 'incidentDetails',
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
          name: 'injuryType',
          label: 'Injury Type',
          type: 'text',
          placeholder: 'e.g., Back strain, Laceration, Fracture',
        },
        {
          name: 'bodyPartAffected',
          label: 'Body Part Affected',
          type: 'text',
          placeholder: 'e.g., Lower back, Right hand, Left knee',
        },
        {
          name: 'severityLevel',
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
          name: 'doctorName',
          label: 'Physician Name',
          type: 'text',
        },
        {
          name: 'doctorPhone',
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
      ],
    },
    {
      id: 'wcb-contact',
      title: 'WCB Contact Information',
      fields: [
        {
          name: 'wcbContactName',
          label: 'WCB Adjuster Name',
          type: 'text',
        },
        {
          name: 'wcbContactPhone',
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
          name: 'wcbContactEmail',
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
          name: 'actualReturnDate',
          label: 'Return to Work Date',
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
      ],
    },
    {
      id: 'financial',
      title: 'Financial Impact',
      fields: [
        {
          name: 'estimatedCost',
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
          name: 'actualCost',
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
  ],

  // File viewing sections (read-only document display)
  fileSections: [
    {
      id: 'worker-report',
      title: 'Worker Report (Form 6/C060)',
      documentType: 'wcb_worker_report',
      description: "Worker's account of the incident and injury",
      allowMultiple: true,
    },
    {
      id: 'employer-report',
      title: 'Employer Report (Form 7)',
      documentType: 'wcb_employer_report',
      description: "Employer's incident report and investigation",
      allowMultiple: true,
    },
    {
      id: 'medical-report',
      title: 'Healthcare Provider Report (Form 8)',
      documentType: 'wcb_medical_report',
      description: "Medical provider's assessment and treatment plan",
      allowMultiple: true,
    },
  ],

  // Edit form configuration
  editFormConfig: WCB_CLAIM_EDIT_FORM_CONFIG,
};

export default WCB_CLAIM_GENERAL_INFO_CONFIG;
