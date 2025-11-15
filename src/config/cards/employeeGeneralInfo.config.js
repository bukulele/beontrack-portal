import { EMPLOYEE_EDIT_FORM_CONFIG } from "@/config/forms/employeeEditForm.config";
import { EMPLOYMENT_TYPE_CHOICES } from "@/config/clientData";
import { EMPLOYEE_PRE_HIRING_CHECKLIST_CONFIG } from "@/config/checklists/employeePreHiringChecklist.config";
import { EMPLOYEE_ONBOARDING_CHECKLIST_CONFIG } from "@/config/checklists/employeeOnboardingChecklist.config";
import { generateFileSectionsFromChecklists } from "@/lib/configUtils";

/**
 * Employee General Info Tab Configuration
 *
 * Updated for Prisma schema - PRISMA_MIGRATION_PLAN.md Phase 4
 * Uses standardized OfficeEmployee fields (26 fields)
 * Removed legacy 4Tracks-specific fields (terminal, card_number, immigration_status)
 *
 * Status choices are now dynamically loaded from database via statusSettings context
 */

export const EMPLOYEE_GENERAL_INFO_CONFIG = {
  // Edit form configuration
  editFormConfig: EMPLOYEE_EDIT_FORM_CONFIG,

  // Image configuration (profile photo)
  image: {
    interactive: true, // Enable interactive photo editing
    src: (entityData) => entityData.profilePhoto?.filePath
      ? `/api/v1/files/${entityData.profilePhoto.filePath.replace(/^uploads\//, '')}`
      : null,
    placeholder: {
      icon: "User", // Lucide icon name shown when no photo exists
    },
    // API endpoints for photo upload/update
    uploadEndpoint: (entityId) => `/api/v1/employees/${entityId}/documents`,
    updateEndpoint: (entityId) => `/api/v1/employees/${entityId}`,
    photoFieldName: "profilePhotoId",
    documentType: "profile_photo",
    alt: "Employee Photo",
    width: 200,
    height: 300,
    // Data shown BELOW photo
    additionalInfo: [
      {
        // Employment Type
        value: (entityData) => EMPLOYMENT_TYPE_CHOICES[entityData.employmentType] || "Employment Type not set",
        bold: true,
      },
    ],
  },

  // Status badge configuration (gets choices dynamically from statusSettings)
  statusConfig: {
    editable: true,
  },

  // Field sections - Standardized Prisma OfficeEmployee fields (camelCase)
  sections: [
    {
      // NO title property - flat list
      fields: [
        {
          key: "employeeId",
          label: "Employee ID",
          type: "text",
          editable: false,
          actions: ["copy"],
        },
        {
          key: "name",
          label: "Name",
          type: "computed",
          editable: false,
          formatter: (value, entityData) => `${entityData.firstName} ${entityData.lastName}`,
          actions: ["copy"],
        },
        {
          key: "email",
          label: "Email",
          type: "email",
          editable: false,
          actions: ["email", "copy"],
        },
        {
          key: "phoneNumber",
          label: "Phone",
          type: "phone",
          editable: false,
          formatter: (value) => value ? `+1 ${value.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}` : "N/A",
          actions: ["whatsapp", "call", "copy"],
        },
        {
          key: "emergencyContactName",
          label: "Emergency Contact",
          type: "text",
          editable: false,
          actions: ["copy"],
        },
        {
          key: "emergencyContactPhone",
          label: "Emergency Phone",
          type: "phone",
          editable: false,
          formatter: (value) => value ? `+1 ${value.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}` : "N/A",
          actions: ["call", "copy"],
        },
        {
          key: "address",
          label: "Address",
          type: "computed",
          editable: false,
          formatter: (value, entityData) => {
            const parts = [
              entityData.addressLine1,
              entityData.addressLine2,
              entityData.city,
              entityData.stateProvince,
              entityData.postalCode,
              entityData.country,
            ].filter(Boolean);
            return parts.join(", ") || "N/A";
          },
          actions: ["copy"],
        },
        {
          key: "dateOfBirth",
          label: "Date of Birth",
          type: "date",
          editable: false,
          sideInfo: (entityData) => {
            if (!entityData.dateOfBirth) return null;
            const age = Math.floor((Date.now() - new Date(entityData.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
            return `Age: ${age}`;
          },
        },
        {
          key: "jobTitle",
          label: "Job Title",
          type: "text",
          editable: false,
          sideInfo: (entityData) => entityData.department || null,
        },
        {
          key: "officeLocation",
          label: "Office Location",
          type: "text",
          editable: false,
        },
        {
          key: "hireDate",
          label: "Hire Date",
          type: "date",
          editable: false,
        },
        {
          key: "terminationDate",
          label: "Termination Date",
          type: "date",
          editable: false,
          conditional: (entityData) => {
            return entityData.terminationDate &&
                   (entityData.status === "resigned" || entityData.status === "terminated");
          },
        },
      ],
    },
  ],

  // File sections - READ-ONLY display in General tab
  // Generated dynamically from checklist configs (single source of truth)
  // Checklists define what documents exist, this config defines how to group them for display
  fileSections: generateFileSectionsFromChecklists(
    // Checklist configs - source of truth for document types
    [
      EMPLOYEE_PRE_HIRING_CHECKLIST_CONFIG,
      EMPLOYEE_ONBOARDING_CHECKLIST_CONFIG,
    ],
    // Section groupings - how to organize documents in General Info tab
    {
      "Identity & Work Authorization": [
        "government_id",
        "work_authorization",
        "immigration_documents",
      ],
      "Hiring & Employment": [
        "resume",
        "background_check_consent",
        "employment_contract",
        "company_policies",
        "confidentiality_agreement",
      ],
      "Payroll & Benefits": [
        "sin_ssn",
        "direct_deposit",
        "tax_forms",
        "benefits_enrollment",
      ],
      "Certifications & Training": [
        "professional_certifications",
        "education_verification",
        "safety_training",
      ],
      "Other": [
        "other_documents",
      ],
    }
  ),
};

export default EMPLOYEE_GENERAL_INFO_CONFIG;
