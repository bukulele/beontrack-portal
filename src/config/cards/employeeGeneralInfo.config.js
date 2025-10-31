import { EMPLOYEE_EDIT_FORM_CONFIG } from "@/config/forms/employeeEditForm.config";

/**
 * Employee General Info Tab Configuration
 *
 * Updated for Prisma schema - PRISMA_MIGRATION_PLAN.md Phase 4
 * Uses standardized OfficeEmployee fields (26 fields)
 * Removed legacy 4Tracks-specific fields (terminal, card_number, immigration_status)
 */

// Prisma EmployeeStatus enum (13 values)
const EMPLOYEE_STATUS_CHOICES = {
  new: "New Application",
  application_received: "Application Received",
  under_review: "Under Review",
  application_on_hold: "On Hold",
  rejected: "Rejected",
  trainee: "Trainee",
  active: "Active",
  resigned: "Resigned",
  vacation: "On Vacation",
  on_leave: "On Leave",
  wcb: "WCB",
  terminated: "Terminated",
  suspended: "Suspended",
};

// Prisma EmploymentType enum (3 values)
const EMPLOYMENT_TYPE_CHOICES = {
  full_time: "Full Time",
  part_time: "Part Time",
  contract: "Contract",
};

export const EMPLOYEE_GENERAL_INFO_CONFIG = {
  // Edit form configuration
  editFormConfig: EMPLOYEE_EDIT_FORM_CONFIG,

  // Image configuration (profile photo)
  image: {
    src: (entityData) => entityData.profilePhoto?.filePath
      ? `/api/v1/files/${entityData.profilePhoto.filePath}`
      : "/no_photo_driver.png",
    alt: "Employee Photo",
    width: 200,
    height: 300,
    // Data shown BELOW photo
    additionalInfo: [
      {
        // Employment Type
        value: (entityData) => EMPLOYMENT_TYPE_CHOICES[entityData.employmentType] || "N/A",
        bold: true,
      },
    ],
  },

  // Status badge configuration
  statusConfig: {
    statusChoices: EMPLOYEE_STATUS_CHOICES,
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
  // Uses Prisma DocumentType enum values (18 types available)
  // Organized into logical groups for employee onboarding
  fileSections: [
    {
      title: "Identity & Work Authorization",
      defaultOpen: true,
      items: [
        {
          key: "government_id",
          label: "Government ID",
          optional: false,
          itemType: "file",
        },
        {
          key: "work_authorization",
          label: "Work Authorization",
          optional: true,
          itemType: "file",
        },
        {
          key: "immigration_documents",
          label: "Immigration Documents",
          optional: true,
          itemType: "file",
        },
      ],
    },
    {
      title: "Hiring & Employment",
      defaultOpen: false,
      items: [
        {
          key: "employment_application",
          label: "Employment Application",
          optional: false,
          itemType: "file",
        },
        {
          key: "resume",
          label: "Resume/CV",
          optional: false,
          itemType: "file",
        },
        {
          key: "background_check_consent",
          label: "Background Check Consent",
          optional: false,
          itemType: "file",
        },
        {
          key: "employment_contract",
          label: "Employment Contract",
          optional: false,
          itemType: "file",
        },
        {
          key: "company_policies",
          label: "Company Policies Acknowledgement",
          optional: true,
          itemType: "file",
        },
        {
          key: "confidentiality_agreement",
          label: "Confidentiality Agreement",
          optional: true,
          itemType: "file",
        },
        {
          key: "emergency_contact",
          label: "Emergency Contact Form",
          optional: false,
          itemType: "file",
        },
      ],
    },
    {
      title: "Payroll & Benefits",
      defaultOpen: false,
      items: [
        {
          key: "sin_ssn",
          label: "SIN/SSN",
          optional: false,
          itemType: "file",
        },
        {
          key: "direct_deposit",
          label: "Direct Deposit (Void Cheque)",
          optional: false,
          itemType: "file",
        },
        {
          key: "tax_forms",
          label: "Tax Forms",
          optional: false,
          itemType: "file",
        },
        {
          key: "benefits_enrollment",
          label: "Benefits Enrollment",
          optional: true,
          itemType: "file",
        },
      ],
    },
    {
      title: "Certifications & Training",
      defaultOpen: false,
      items: [
        {
          key: "professional_certifications",
          label: "Professional Certifications",
          optional: true,
          itemType: "file",
        },
        {
          key: "education_verification",
          label: "Education Verification",
          optional: true,
          itemType: "file",
        },
        {
          key: "safety_training",
          label: "Safety Training Certificates",
          optional: true,
          itemType: "file",
        },
      ],
    },
    {
      title: "Other",
      defaultOpen: false,
      items: [
        {
          key: "other_documents",
          label: "Other Documents",
          optional: true,
          itemType: "file",
        },
      ],
    },
  ],
};

export default EMPLOYEE_GENERAL_INFO_CONFIG;
