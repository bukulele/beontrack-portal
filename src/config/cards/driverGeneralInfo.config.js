import {
  STATUS_CHOICES,
  CANADIAN_PROVINCES,
  DRIVERTYPE_CHOICES,
  IMMIGRATION_STATUS,
  UPDATE_STATUS_CHOICES,
  TERMINAL_CHOICES,
} from "@/config/clientData";
import { DRIVER_EDIT_FORM_CONFIG } from "@/config/forms/driverEditForm.config";

/**
 * Driver General Info Tab Configuration
 *
 * Matches OLD DriverCardInfo.js structure (lines 417-722)
 * Follows TRUCK CARD architectural pattern - self-contained with inline item definitions
 */

export const DRIVER_GENERAL_INFO_CONFIG = {
  // Edit form configuration
  editFormConfig: DRIVER_EDIT_FORM_CONFIG,

  // Image configuration (driver photo)
  image: {
    src: (entityData) => entityData.driver_photo?.file || "/no_photo_driver.png",
    alt: "Driver Photo",
    width: 200,
    height: 300,
    // Data shown BELOW photo (from OLD card lines 417-432)
    additionalInfo: [
      {
        // Driver Type (Company Driver, Owner Operator, etc.)
        value: (entityData) => DRIVERTYPE_CHOICES[entityData.driver_type] || "N/A",
        bold: true,
      },
      {
        // LCV driver: ✓ (conditional - only show if certified)
        label: "LCV driver",
        value: (entityData) => entityData.lcv_certified,
        type: "checkbox",
        showOnlyIfTrue: true,
      },
      {
        // CP driver: ✓ (conditional - only show if certified)
        label: "CP driver",
        value: (entityData) => entityData.cp_driver,
        type: "checkbox",
        showOnlyIfTrue: true,
      },
      {
        // Immigration Status
        value: (entityData) => IMMIGRATION_STATUS[entityData.immigration_status] || "N/A",
        bold: true,
      },
    ],
  },

  // Status badge configuration
  statusConfig: {
    statusChoices: STATUS_CHOICES,
    editable: true,
    // Driver has TWO status dropdowns: update_status + status
    updateStatus: UPDATE_STATUS_CHOICES,
  },

  // Field sections - ONE SECTION, NO TITLE (flat list)
  // Field order from OLD DriverCardInfo.js lines 435-722
  sections: [
    {
      // NO title property!
      fields: [
        {
          key: "driver_id",
          label: "Driver ID",
          type: "text",
          editable: false,
        },
        {
          key: "name",
          label: "Name",
          type: "computed",
          editable: false,
          formatter: (value, entityData) => `${entityData.first_name} ${entityData.last_name}`,
          actions: ["copy"],
        },
        {
          key: "phone_number",
          label: "Phone",
          type: "phone",
          editable: false,
          formatter: (value) => value ? `+1 ${value.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}` : "N/A",
          actions: ["telegram", "call", "copy"],
        },
        {
          key: "emergency_contact",
          label: "Emergency contact",
          type: "text",
          editable: false,
          actions: ["copy"],
        },
        {
          key: "emergency_phone",
          label: "Emergency phone",
          type: "phone",
          editable: false,
          formatter: (value) => value ? `+1 ${value.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}` : "N/A",
          actions: ["call", "copy"],
        },
        {
          key: "email",
          label: "Email",
          type: "email",
          editable: false,
          actions: ["email", "copy"],
        },
        {
          key: "address",
          label: "Address",
          type: "computed",
          editable: false,
          formatter: (value, entityData) => {
            const parts = [
              entityData.unit_or_suite,
              entityData.street_number,
              entityData.street,
              entityData.city,
              entityData.province,
              entityData.postal_code,
            ].filter(Boolean);
            return parts.join(", ") || "N/A";
          },
          actions: ["copy"],
        },
        {
          key: "date_of_birth",
          label: "Date of Birth",
          type: "date",
          editable: false,
          sideInfo: (entityData) => {
            if (!entityData.date_of_birth) return null;
            const age = Math.floor((Date.now() - new Date(entityData.date_of_birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
            return `Age: ${age}`;
          },
        },
        {
          key: "terminal",
          label: "Terminal",
          type: "select",
          editable: false,
          selectOptions: TERMINAL_CHOICES,
          sideInfo: (entityData) => {
            // Routes display - need to implement defineRoutes formatter
            return entityData.routes ? `Routes: ${entityData.routes}` : null;
          },
        },
        {
          key: "hiring_date",
          label: "Hiring Date",
          type: "date",
          editable: false,
          formatter: (value, entityData) => {
            // TODO: Add time passed calculation like OLD card
            return value;
          },
        },
        {
          key: "application_date",
          label: "Application Date",
          type: "date",
          editable: false,
        },
        {
          key: "date_of_leaving",
          label: "Leaving Date",
          type: "date",
          editable: false,
          conditional: (entityData) => {
            return entityData.date_of_leaving &&
                   (entityData.status === "RE" || entityData.status === "TE");
          },
          formatter: (value, entityData) => {
            // TODO: Add time passed calculation
            return value;
          },
        },
        {
          key: "work_for_driver",
          label: "Owner Operator",
          type: "text",
          editable: false,
          conditional: (entityData) => entityData.driver_type === "OD",
          formatter: (value, entityData, contexts) => {
            if (!value || !contexts.driverList || !contexts.driverList[value]) return "N/A";
            const driver = contexts.driverList[value];
            return `${driver.first_name || ""} ${driver.last_name || ""} ${driver.driver_id || ""}`.trim();
          },
          linkTo: {
            type: "driver",
            idField: "work_for_driver",
          },
        },
      ],
    },
  ],

  // File sections - ALL driver documents defined inline (following truck pattern)
  // NO external dependencies - complete self-contained configuration
  fileSections: [
    {
      title: "Docs & Dates",
      defaultOpen: true,
      items: [
        // licenses - from recruiting checklist
        {
          key: "licenses",
          label: "Driver Licenses",
          optional: false,
          itemType: "file",
          fileUpload: {
            accept: "image/*,application/pdf",
            fields: [
              { type: "text", name: "number", label: "License Number", required: false },
              { type: "date", name: "expiry_date", label: "Expiry Date", required: false },
            ],
          },
          actions: { checkable: true, uploadable: true, editable: true, deletable: true },
          roles: { view: ["all"], edit: ["recruiting", "admin"], delete: ["admin"] },
        },
        // immigration_doc - from recruiting checklist
        {
          key: "immigration_doc",
          label: "Immigration Docs",
          optional: false,
          itemType: "file",
          fileUpload: {
            accept: "image/*,application/pdf",
            fields: [{ type: "date", name: "expiry_date", label: "Expiry Date", required: false }],
          },
          actions: { checkable: true, uploadable: true, editable: true, deletable: true },
          roles: { view: ["all"], edit: ["recruiting", "admin"], delete: ["admin"] },
        },
        // abstracts - from recruiting checklist
        {
          key: "abstracts",
          label: "Abstracts",
          optional: false,
          itemType: "file",
          fileUpload: {
            accept: "image/*,application/pdf",
            fields: [{ type: "date", name: "issue_date", label: "Issue Date", required: false }],
          },
          actions: { checkable: true, uploadable: true, editable: true, deletable: true },
          roles: { view: ["all"], edit: ["recruiting", "admin"], delete: ["admin"] },
        },
        // tdg_cards - from safety checklist
        {
          key: "tdg_cards",
          label: "TDG Card",
          optional: false,
          itemType: "file",
          fileUpload: {
            accept: "image/*,application/pdf",
            fields: [{ type: "date", name: "expiry_date", label: "Expiry Date", required: false }],
          },
          actions: { checkable: true, uploadable: true, editable: true, deletable: true },
          roles: { view: ["all"], edit: ["safety", "admin"], delete: ["admin"] },
        },
        // good_to_go_cards - from safety checklist
        {
          key: "good_to_go_cards",
          label: "GTG Cards",
          optional: false,
          itemType: "file",
          fileUpload: {
            accept: "image/*,application/pdf",
            fields: [{ type: "date", name: "expiry_date", label: "Expiry Date", required: false }],
          },
          actions: { checkable: true, uploadable: true, editable: true, deletable: true },
          roles: { view: ["all"], edit: ["safety", "admin"], delete: ["admin"] },
        },
        // lcv_certificates - from safety checklist
        {
          key: "lcv_certificates",
          label: "LCV Certificate",
          optional: false,
          itemType: "file",
          fileUpload: {
            accept: "image/*,application/pdf",
            fields: [{ type: "date", name: "expiry_date", label: "Expiry Date", required: false }],
          },
          actions: { checkable: true, uploadable: true, editable: true, deletable: true },
          roles: { view: ["all"], edit: ["safety", "admin"], delete: ["admin"] },
        },
        // lcv_licenses - from safety checklist
        {
          key: "lcv_licenses",
          label: "LCV License",
          optional: false,
          itemType: "file",
          fileUpload: {
            accept: "image/*,application/pdf",
            fields: [{ type: "date", name: "expiry_date", label: "Expiry Date", required: false }],
          },
          actions: { checkable: true, uploadable: true, editable: true, deletable: true },
          roles: { view: ["all"], edit: ["safety", "admin"], delete: ["admin"] },
        },
        // winter_courses - from safety checklist
        {
          key: "winter_courses",
          label: "Winter Courses",
          optional: true,
          itemType: "file",
          fileUpload: {
            accept: "image/*,application/pdf",
            fields: [{ type: "textarea", name: "comment", label: "Comment", required: false }],
          },
          actions: { checkable: true, uploadable: true, editable: true, deletable: true },
          roles: { view: ["all"], edit: ["safety", "admin"], delete: ["admin"] },
        },
        // pdic_certificates - from safety checklist
        {
          key: "pdic_certificates",
          label: "PDIC Certificate",
          optional: true,
          itemType: "file",
          fileUpload: {
            accept: "image/*,application/pdf",
            fields: [{ type: "text", name: "number", label: "Certificate Number", required: false }],
          },
          actions: { checkable: true, uploadable: true, editable: true, deletable: true },
          roles: { view: ["all"], edit: ["safety", "admin"], delete: ["admin"] },
        },
        // abstract_request_forms - from safety checklist
        {
          key: "abstract_request_forms",
          label: "Abstract Request Form",
          optional: false,
          itemType: "file",
          fileUpload: {
            accept: "image/*,application/pdf",
            fields: [{ type: "textarea", name: "comment", label: "Comment", required: false }],
          },
          actions: { checkable: true, uploadable: true, editable: true, deletable: true },
          roles: { view: ["all"], edit: ["safety", "admin"], delete: ["admin"] },
        },
        // annual_performance_reviews - from safety checklist
        {
          key: "annual_performance_reviews",
          label: "Annual Performance Review",
          optional: true,
          itemType: "file",
          fileUpload: {
            accept: "image/*,application/pdf",
            fields: [{ type: "textarea", name: "comment", label: "Comment", required: false }],
          },
          actions: { checkable: true, uploadable: true, editable: true, deletable: true },
          roles: { view: ["all"], edit: ["safety", "admin"], delete: ["admin"] },
        },
        // certificates_of_violations - from safety checklist
        {
          key: "certificates_of_violations",
          label: "Certificates of Violations",
          optional: true,
          itemType: "file",
          fileUpload: {
            accept: "image/*,application/pdf",
            fields: [{ type: "textarea", name: "comment", label: "Comment", required: false }],
          },
          actions: { checkable: true, uploadable: true, editable: true, deletable: true },
          roles: { view: ["all"], edit: ["safety", "admin"], delete: ["admin"] },
        },
      ],
    },
    {
      title: "HR & Recruiting",
      defaultOpen: false,
      items: [
        // criminal_records - from recruiting checklist
        {
          key: "criminal_records",
          label: "Criminal Records",
          optional: false,
          itemType: "file",
          fileUpload: {
            accept: "image/*,application/pdf",
            fields: [{ type: "textarea", name: "comment", label: "Comment", required: false }],
          },
          actions: { checkable: true, uploadable: true, editable: true, deletable: true },
          roles: { view: ["all"], edit: ["recruiting", "admin"], delete: ["admin"] },
        },
        // log_books - from recruiting checklist
        {
          key: "log_books",
          label: "Log Books from Previous Employment",
          optional: false,
          itemType: "file",
          fileUpload: {
            accept: "image/*,application/pdf",
            fields: [{ type: "textarea", name: "comment", label: "Comment", required: false }],
          },
          actions: { checkable: true, uploadable: true, editable: true, deletable: true },
          roles: { view: ["all"], edit: ["recruiting", "admin"], delete: ["admin"] },
        },
        // driver_memos - from safety checklist
        {
          key: "driver_memos",
          label: "Driver Memos",
          optional: false,
          itemType: "file",
          fileUpload: {
            accept: "image/*,application/pdf",
            fields: [{ type: "textarea", name: "comment", label: "Comment", required: false }],
          },
          actions: { checkable: true, uploadable: true, editable: true, deletable: true },
          roles: { view: ["all"], edit: ["safety", "admin"], delete: ["admin"] },
        },
        // driver_statements - from safety checklist
        {
          key: "driver_statements",
          label: "Driver Statements",
          optional: true,
          itemType: "file",
          fileUpload: {
            accept: "image/*,application/pdf",
            fields: [{ type: "textarea", name: "comment", label: "Comment", required: false }],
          },
          actions: { checkable: true, uploadable: true, editable: true, deletable: true },
          roles: { view: ["all"], edit: ["safety", "admin"], delete: ["admin"] },
        },
        // passports - from recruiting checklist
        {
          key: "passports",
          label: "Passports",
          optional: false,
          itemType: "file",
          fileUpload: {
            accept: "image/*,application/pdf",
            fields: [{ type: "textarea", name: "comment", label: "Comment", required: false }],
          },
          actions: { checkable: true, uploadable: true, editable: true, deletable: true },
          roles: { view: ["all"], edit: ["recruiting", "admin"], delete: ["admin"] },
        },
        // us_visas - from recruiting checklist
        {
          key: "us_visas",
          label: "US Visas",
          optional: false,
          itemType: "file",
          fileUpload: {
            accept: "image/*,application/pdf",
            fields: [{ type: "textarea", name: "comment", label: "Comment", required: false }],
          },
          actions: { checkable: true, uploadable: true, editable: true, deletable: true },
          roles: { view: ["all"], edit: ["recruiting", "admin"], delete: ["admin"] },
        },
        // activity_history - from recruiting checklist (data only, no file)
        {
          key: "activity_history",
          label: "Activity History",
          optional: false,
          itemType: "data",
          actions: { checkable: false, uploadable: false, editable: false, deletable: false },
          roles: { view: ["all"] },
        },
        // consents - from recruiting checklist
        {
          key: "consents",
          label: "Consent to Personal Investigation",
          optional: false,
          itemType: "file",
          fileUpload: {
            accept: "image/*,application/pdf",
            fields: [{ type: "textarea", name: "comment", label: "Comment", required: false }],
          },
          actions: { checkable: true, uploadable: true, editable: true, deletable: true },
          roles: { view: ["all"], edit: ["recruiting", "admin"], delete: ["admin"] },
        },
        // reference_checks - from recruiting checklist
        {
          key: "reference_checks",
          label: "Reference Checks",
          optional: false,
          itemType: "file",
          fileUpload: {
            accept: "image/*,application/pdf",
            fields: [{ type: "textarea", name: "comment", label: "Comment", required: false }],
          },
          actions: { checkable: true, uploadable: true, editable: true, deletable: true },
          roles: { view: ["all"], edit: ["recruiting", "admin"], delete: ["admin"] },
        },
        // mentor_forms - from safety checklist
        {
          key: "mentor_forms",
          label: "Mentor Form",
          optional: false,
          itemType: "file",
          fileUpload: {
            accept: "image/*,application/pdf",
            fields: [{ type: "textarea", name: "comment", label: "Comment", required: false }],
          },
          actions: { checkable: true, uploadable: true, editable: true, deletable: true },
          roles: { view: ["all"], edit: ["safety", "admin"], delete: ["admin"] },
        },
        // employment_contracts - from recruiting checklist
        {
          key: "employment_contracts",
          label: "Employment Contract",
          optional: false,
          itemType: "file",
          fileUpload: {
            accept: "image/*,application/pdf",
            fields: [{ type: "textarea", name: "comment", label: "Comment", required: false }],
          },
          actions: { checkable: true, uploadable: true, editable: true, deletable: true },
          roles: { view: ["all"], edit: ["recruiting", "admin"], delete: ["admin"] },
        },
        // driver_prescreenings - from recruiting checklist
        {
          key: "driver_prescreenings",
          label: "Driver Pre-screenings",
          optional: false,
          itemType: "file",
          fileUpload: {
            accept: "image/*,application/pdf",
            fields: [{ type: "textarea", name: "comment", label: "Comment", required: false }],
          },
          actions: { checkable: true, uploadable: true, editable: true, deletable: true },
          roles: { view: ["all"], edit: ["recruiting", "admin"], delete: ["admin"] },
        },
        // gtg_quizes - from safety checklist
        {
          key: "gtg_quizes",
          label: "GTG Quiz",
          optional: false,
          itemType: "file",
          fileUpload: {
            accept: "image/*,application/pdf",
            fields: [{ type: "textarea", name: "comment", label: "Comment", required: false }],
          },
          actions: { checkable: true, uploadable: true, editable: true, deletable: true },
          roles: { view: ["all"], edit: ["safety", "admin"], delete: ["admin"] },
        },
        // knowledge_tests - from recruiting checklist
        {
          key: "knowledge_tests",
          label: "Knowledge Test",
          optional: false,
          itemType: "file",
          fileUpload: {
            accept: "image/*,application/pdf",
            fields: [{ type: "textarea", name: "comment", label: "Comment", required: false }],
          },
          actions: { checkable: true, uploadable: true, editable: true, deletable: true },
          roles: { view: ["all"], edit: ["recruiting", "admin"], delete: ["admin"] },
        },
        // road_tests - from recruiting checklist
        {
          key: "road_tests",
          label: "Road Test",
          optional: false,
          itemType: "file",
          fileUpload: {
            accept: "image/*,application/pdf",
            fields: [{ type: "date", name: "issue_date", label: "Test Date", required: false }],
          },
          actions: { checkable: true, uploadable: true, editable: true, deletable: true },
          roles: { view: ["all"], edit: ["recruiting", "admin"], delete: ["admin"] },
        },
        // other_documents - from safety checklist
        {
          key: "other_documents",
          label: "Other Documents",
          optional: true,
          itemType: "file",
          fileUpload: {
            accept: "image/*,application/pdf",
            fields: [{ type: "textarea", name: "comment", label: "Comment", required: false }],
          },
          actions: { checkable: true, uploadable: true, editable: true, deletable: true },
          roles: { view: ["all"], edit: ["safety", "admin"], delete: ["admin"] },
        },
      ],
    },
    {
      title: "Payroll",
      defaultOpen: false,
      items: [
        // rates_ca_single - from old driver card (not in checklist yet)
        {
          key: "rates_ca_single",
          label: "Rates CA Single",
          optional: false,
          itemType: "file",
          fileUpload: {
            accept: "image/*,application/pdf",
            fields: [{ type: "textarea", name: "comment", label: "Comment", required: false }],
          },
          actions: { checkable: true, uploadable: true, editable: true, deletable: true },
          roles: { view: ["all"], edit: ["payroll", "payrollManager", "admin"], delete: ["admin"] },
        },
        // rates_ca_team - from old driver card
        {
          key: "rates_ca_team",
          label: "Rates CA Team",
          optional: false,
          itemType: "file",
          fileUpload: {
            accept: "image/*,application/pdf",
            fields: [{ type: "textarea", name: "comment", label: "Comment", required: false }],
          },
          actions: { checkable: true, uploadable: true, editable: true, deletable: true },
          roles: { view: ["all"], edit: ["payroll", "payrollManager", "admin"], delete: ["admin"] },
        },
        // rates_city - from old driver card
        {
          key: "rates_city",
          label: "Rates City",
          optional: false,
          itemType: "file",
          fileUpload: {
            accept: "image/*,application/pdf",
            fields: [{ type: "textarea", name: "comment", label: "Comment", required: false }],
          },
          actions: { checkable: true, uploadable: true, editable: true, deletable: true },
          roles: { view: ["all"], edit: ["payroll", "payrollManager", "admin"], delete: ["admin"] },
        },
        // rates_lcv_single - from old driver card
        {
          key: "rates_lcv_single",
          label: "Rates LCV Single",
          optional: false,
          itemType: "file",
          fileUpload: {
            accept: "image/*,application/pdf",
            fields: [{ type: "textarea", name: "comment", label: "Comment", required: false }],
          },
          actions: { checkable: true, uploadable: true, editable: true, deletable: true },
          roles: { view: ["all"], edit: ["payroll", "payrollManager", "admin"], delete: ["admin"] },
        },
        // rates_lcv_team - from old driver card
        {
          key: "rates_lcv_team",
          label: "Rates LCV Team",
          optional: false,
          itemType: "file",
          fileUpload: {
            accept: "image/*,application/pdf",
            fields: [{ type: "textarea", name: "comment", label: "Comment", required: false }],
          },
          actions: { checkable: true, uploadable: true, editable: true, deletable: true },
          roles: { view: ["all"], edit: ["payroll", "payrollManager", "admin"], delete: ["admin"] },
        },
        // rates_us_team - from old driver card
        {
          key: "rates_us_team",
          label: "Rates US Team",
          optional: false,
          itemType: "file",
          fileUpload: {
            accept: "image/*,application/pdf",
            fields: [{ type: "textarea", name: "comment", label: "Comment", required: false }],
          },
          actions: { checkable: true, uploadable: true, editable: true, deletable: true },
          roles: { view: ["all"], edit: ["payroll", "payrollManager", "admin"], delete: ["admin"] },
        },
        // sin - from recruiting checklist
        {
          key: "sin",
          label: "SIN",
          optional: false,
          itemType: "file",
          fileUpload: {
            accept: "image/*,application/pdf",
            fields: [{ type: "number", name: "number", label: "Document Number", required: false, max: 9 }],
          },
          actions: { checkable: true, uploadable: true, editable: true, deletable: true },
          roles: { view: ["all"], edit: ["payroll", "payrollManager", "admin"], delete: ["admin"] },
        },
        // void_check - from recruiting checklist
        {
          key: "void_check",
          label: "Void Check",
          optional: false,
          itemType: "file",
          fileUpload: {
            accept: "image/*,application/pdf",
            fields: [{ type: "textarea", name: "comment", label: "Comment", required: false }],
          },
          actions: { checkable: true, uploadable: true, editable: true, deletable: true },
          roles: { view: ["all"], edit: ["payroll", "payrollManager", "admin"], delete: ["admin"] },
        },
        // tax_papers - from safety checklist
        {
          key: "tax_papers",
          label: "Tax Papers",
          optional: false,
          itemType: "file",
          fileUpload: {
            accept: "image/*,application/pdf",
            fields: [{ type: "text", name: "number", label: "Document Number", required: false }],
          },
          actions: { checkable: true, uploadable: true, editable: true, deletable: true },
          roles: { view: ["all"], edit: ["payroll", "payrollManager", "admin"], delete: ["admin"] },
        },
        // incorp_docs - from recruiting checklist
        {
          key: "incorp_docs",
          label: "Incorp Docs",
          optional: false,
          itemType: "file",
          fileUpload: {
            accept: "image/*,application/pdf",
            fields: [{ type: "text", name: "number", label: "Document Number", required: false }],
          },
          actions: { checkable: true, uploadable: true, editable: true, deletable: true },
          roles: { view: ["all"], edit: ["recruiting", "admin"], delete: ["admin"] },
        },
        // gst_docs - from recruiting checklist
        {
          key: "gst_docs",
          label: "GST Docs",
          optional: false,
          itemType: "file",
          fileUpload: {
            accept: "image/*,application/pdf",
            fields: [{ type: "text", name: "number", label: "GST Number", required: false }],
          },
          actions: { checkable: true, uploadable: true, editable: true, deletable: true },
          roles: { view: ["all"], edit: ["recruiting", "admin"], delete: ["admin"] },
        },
      ],
    },
  ],
};

export default DRIVER_GENERAL_INFO_CONFIG;
