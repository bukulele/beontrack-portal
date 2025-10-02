import {
  STATUS_CHOICES,
  IMMIGRATION_STATUS,
  CANADIAN_PROVINCES,
  UPDATE_STATUS_CHOICES,
  TERMINAL_CHOICES,
  DRIVERTYPE_CHOICES,
  ROUTES_CHOICES,
} from "@/app/assets/tableData";
import checkDate from "@/app/functions/checkDate_unstable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import formatDate from "@/app/functions/formatDate";
import { Tooltip } from "react-tooltip";
import React from "react";
import formatDateTime from "@/app/functions/formatDateTime";

export const DRIVERS_TABLE_FIELDS_REPORT = [
  {
    field: "driver_id",
    headerName: "Driver ID",
    width: 80,
    defaultSort: true,
  },
  {
    field: "first_name",
    headerName: "First Name",
    accessKey: "id",
    width: 150,
    modalType: "driver",
  },
  {
    field: "last_name",
    headerName: "Last Name",
    accessKey: "id",
    width: 150,
    modalType: "driver",
  },
  {
    field: "status",
    headerName: "Status",
    width: 100,
    valueGetter: (value) => STATUS_CHOICES[value] || value || "N/A",
  },
  {
    field: "status_note",
    headerName: "Status Note",
    width: 200,
    hide: true,
  },
  {
    field: "update_status",
    headerName: "Update Status",
    width: 150,
    hide: true,
    valueGetter: (value) => UPDATE_STATUS_CHOICES[value] || value || "N/A",
  },
  {
    field: "phone_number",
    headerName: "Phone Number",
    width: 150,
    copyable: true,
    hide: true,
  },
  {
    field: "email",
    headerName: "Email",
    width: 200,
    copyable: true,
    hide: true,
  },
  {
    field: "emergency_contact",
    headerName: "Emergency Contact",
    width: 180,
    hide: true,
  },
  {
    field: "emergency_phone",
    headerName: "Emergency Phone",
    width: 180,
    copyable: true,
    hide: true,
  },
  {
    field: "date_of_birth",
    headerName: "Date of Birth",
    width: 110,
  },
  {
    field: "immigration_status",
    headerName: "Immigration Status",
    width: 80,
    valueGetter: (value) => IMMIGRATION_STATUS[value] || value || "N/A",
  },
  {
    field: "routes",
    headerName: "Routes",
    width: 200,
    valueGetter: (value) =>
      value?.map((route) => ROUTES_CHOICES[route] || route).join(", ") || "N/A",
  },
  {
    field: "terminal",
    headerName: "Terminal",
    width: 50,
    valueGetter: (value) => TERMINAL_CHOICES[value] || value || "N/A",
  },
  {
    field: "driver_type",
    headerName: "Driver Type",
    width: 130,
    valueGetter: (value) => DRIVERTYPE_CHOICES[value] || value || "N/A",
  },
  {
    field: "eligible_to_enter_usa",
    headerName: "Current USA driver",
    width: 80,
    type: "boolean",
    hide: true,
  },
  {
    field: "sin_number",
    headerName: "Social Insurance Number",
    width: 150,
    valueGetter: (_, row) => row.sin?.number || "N/A",
    hide: true,
  },
  {
    field: "class1_date",
    headerName: "Class 1 License Issue Date",
    width: 110,
    hide: true,
  },
  {
    field: "miles_driven_total",
    headerName: "Class 1 Miles Driven Total",
    width: 180,
    hide: true,
  },
  {
    field: "date_available",
    headerName: "Date Available To Start",
    width: 110,
    hide: true,
  },
  {
    field: "dl_number",
    headerName: "Driver's License Number",
    width: 180,
    valueGetter: (_, row) => row.licenses?.dl_number || "N/A",
  },
  {
    field: "dl_province",
    headerName: "DL Province",
    width: 150,
    valueGetter: (value) => CANADIAN_PROVINCES[value] || value || "N/A",
    hide: true,
  },
  {
    field: "dl_expiry_date",
    headerName: "DL Expiration Date",
    width: 110,
    valueGetter: (_, row) => row.licenses?.expiry_date || "N/A",
  },
  {
    field: "driver_memos",
    headerName: "Memos",
    width: 80,
    type: "boolean",
    valueGetter: (_, row) => !!row.driver_memos?.file,
  },
  {
    field: "mentor_forms",
    headerName: "Mentor Forms",
    width: 80,
    type: "boolean",
    valueGetter: (_, row) => !!row.mentor_forms?.file,
  },
  {
    field: "abstract_request_forms",
    headerName: "Abstract Request Form",
    width: 80,
    type: "boolean",
    valueGetter: (_, row) => !!row.abstract_request_forms?.file,
  },
  {
    field: "abstracts_issue_date",
    headerName: "Abstract Issue Date",
    width: 110,
    valueGetter: (_, row) => row.abstracts?.issue_date || "N/A",
  },
  {
    field: "criminal_records",
    headerName: "Criminal Records",
    width: 80,
    type: "boolean",
    valueGetter: (_, row) => !!row.criminal_records?.file,
  },
  {
    field: "road_tests_issue_date",
    headerName: "Road Tests Issue Date",
    width: 110,
    valueGetter: (_, row) => row.road_tests?.issue_date || "N/A",
  },
  {
    field: "passports",
    headerName: "Passport",
    width: 80,
    type: "boolean",
    hide: true,
    valueGetter: (_, row) => !!row.passports?.file,
  },
  {
    field: "us_visas",
    headerName: "US Visa",
    width: 80,
    type: "boolean",
    hide: true,
    valueGetter: (_, row) => !!row.us_visas?.file,
  },
  {
    field: "immigration_expiry_date",
    headerName: "Immigration Document Expiry Date",
    width: 110,
    valueGetter: (_, row) => row.immigration_doc?.expiry_date || "N/A",
  },
  {
    field: "log_books",
    headerName: "Log Books from Prev. Employment",
    width: 80,
    type: "boolean",
    hide: true,
    valueGetter: (_, row) => !!row.log_books?.file,
  },
  {
    field: "application_date",
    headerName: "Application Date",
    width: 110,
  },
  {
    field: "hiring_date",
    headerName: "Hiring Date",
    width: 110,
  },
  {
    field: "consents",
    headerName: "Consent to Personal Investigation",
    width: 80,
    type: "boolean",
    hide: true,
    valueGetter: (_, row) => !!row.consents?.file,
  },
  {
    field: "remarks_comments",
    headerName: "Remarks Comments",
    width: 250,
  },
  {
    field: "file_box_number",
    headerName: "File Box Number",
    width: 150,
    hide: true,
  },
  {
    field: "tdg_cards_expiry_date",
    headerName: "TDG Expiry",
    width: 110,
    valueGetter: (_, row) => row.tdg_cards?.expiry_date || "N/A",
  },
  {
    field: "good_to_go_cards_expiry_date",
    headerName: "GTG Expiry",
    width: 110,
    valueGetter: (_, row) => row.good_to_go_cards?.expiry_date || "N/A",
  },
  {
    field: "certificates_of_violations_issue_date",
    headerName: "CoV Issue Date",
    width: 110,
    valueGetter: (_, row) =>
      row.certificates_of_violations?.issue_date || "N/A",
  },
  {
    field: "annual_performance_reviews_issue_date",
    headerName: "Annual Performance Review Date",
    width: 110,
    valueGetter: (_, row) =>
      row.annual_performance_reviews?.issue_date || "N/A",
  },
  {
    field: "winter_courses_issue_date",
    headerName: "Winter Courses Completion Date",
    width: 110,
    valueGetter: (_, row) => row.winter_courses?.issue_date || "N/A",
  },
  {
    field: "reference_checks_company",
    headerName: "Reference Checks Company",
    width: 180,
    hide: true,
    valueGetter: (_, row) => row.reference_checks?.company || "N/A",
  },
  {
    field: "certificates_additional_training",
    headerName: "Additional Training Certificates",
    width: 80,
    type: "boolean",
    hide: true,
    valueGetter: (_, row) => !!row.certificates_additional_training?.file,
  },
  {
    field: "accidents_history",
    headerName: "Accidents History",
    width: 180,
    hide: true,
  },
  {
    field: "traffic_convictions",
    headerName: "Traffic Convictions",
    width: 180,
    hide: true,
  },
  {
    field: "denied_license",
    headerName: "Denied License",
    width: 80,
    type: "boolean",
    hide: true,
  },
  {
    field: "denied_license_reason",
    headerName: "Denied License Reason",
    width: 180,
    hide: true,
  },
  {
    field: "license_suspended_or_revoked",
    headerName: "License Suspended or Revoked",
    width: 80,
    type: "boolean",
    hide: true,
  },
  {
    field: "suspension_or_revocation_reason",
    headerName: "License Suspension or Revocation Reason",
    width: 180,
    hide: true,
  },
  {
    field: "date_of_leaving",
    headerName: "Date of Leaving",
    width: 110,
    hide: true,
  },
  {
    field: "reason_for_leaving",
    headerName: "Reason for Leaving",
    width: 180,
    hide: true,
  },
  {
    field: "lcv_certified",
    headerName: "LCV Certified",
    width: 80,
    hide: true,
    type: "boolean",
  },
  {
    field: "lcv_certificates_issue_date",
    headerName: "LCV Certificate Issue Date",
    width: 110,
    valueGetter: (_, row) => row.lcv_certificates?.issue_date || "N/A",
  },
  {
    field: "lcv_license_expiry_date",
    headerName: "LCV License Expiry Date",
    width: 110,
    valueGetter: (_, row) => row.lcv_licenses?.expiry_date || "N/A",
  },
  {
    field: "pdic_certificate_expiry_date",
    headerName: "PDIC Certificate Expiry Date",
    width: 110,
    cellClassName: (params) => `date-status-${checkDate(params.value)}`,
    valueGetter: (_, row) => row.pdic_certificates?.expiry_date || "N/A",
  },
  {
    field: "cp_driver",
    headerName: "CP Driver",
    width: 80,
    hide: true,
    type: "boolean",
  },
  {
    field: "void_check",
    headerName: "Void Check",
    width: 80,
    type: "boolean",
    hide: true,
    valueGetter: (_, row) => !!row.void_check?.file,
  },
  {
    field: "incorp_docs_number",
    headerName: "Incorporation Docs",
    width: 200,
    hide: true,
    valueGetter: (_, row) => row.incorp_docs?.number || "N/A",
  },
  {
    field: "gst_docs_number",
    headerName: "GST Docs",
    width: 200,
    hide: true,
    valueGetter: (_, row) => row.gst_docs?.number || "N/A",
  },
  {
    field: "driver_prescreenings",
    headerName: "Driver Pre-screenings",
    width: 80,
    type: "boolean",
    hide: true,
    valueGetter: (_, row) => !!row.driver_prescreenings?.file,
  },
  {
    field: "knowledge_tests",
    headerName: "Knowledge Test",
    width: 80,
    type: "boolean",
    hide: true,
    valueGetter: (_, row) => !!row.knowledge_tests?.file,
  },
  {
    field: "prehire_quizes",
    headerName: "Pre-hire quizzes",
    width: 80,
    type: "boolean",
    hide: true,
    valueGetter: (_, row) => !!row.prehire_quizes?.file,
  },
  {
    field: "employment_contracts",
    headerName: "Employment Contract",
    width: 80,
    type: "boolean",
    hide: true,
    valueGetter: (_, row) => !!row.employment_contracts?.file,
  },
  {
    field: "gtg_quizes",
    headerName: "GTG Quizzes",
    width: 80,
    type: "boolean",
    hide: true,
    valueGetter: (_, row) => !!row.gtg_quizes?.file,
  },
  {
    field: "tax_papers_issue_date",
    headerName: "Tax Papers Issue Date",
    width: 110,
    valueGetter: (_, row) => row.tax_papers?.issue_date || "N/A",
  },
  {
    field: "driver_statements_issue_date",
    headerName: "Driver Statements Issue Date",
    width: 110,
    hide: true,
    valueGetter: (_, row) => row.driver_statements?.issue_date || "N/A",
  },
  {
    field: "ctpat_papers",
    headerName: "CTPAT Memo",
    width: 80,
    type: "boolean",
    hide: true,
    valueGetter: (_, row) => !!row.ctpat_papers?.file,
  },
];

export const DRIVERS_TABLE_FIELDS_RECRUITING = [
  {
    field: "status",
    headerName: "Status",
    valueGetter: (value) => STATUS_CHOICES[value] || "",
    width: 150,
  },
  {
    field: "first_name",
    headerName: "First Name",
    accessKey: "id",
    width: 150,
    modalType: "driver",
  },
  {
    field: "last_name",
    headerName: "Last Name",
    accessKey: "id",
    width: 150,
    modalType: "driver",
  },
  {
    field: "phone_number",
    headerName: "Phone Number",
    width: 150,
    copyable: true,
  },
  {
    field: "email",
    headerName: "Email",
    width: 150,
    copyable: true,
  },
  {
    field: "application_date",
    headerName: "Application Date",
    defaultSort: true,
  },
  {
    field: "date_of_birth",
    headerName: "Date of Birth",
  },
  {
    field: "immigration_status",
    headerName: "Immigration Status",
    valueGetter: (value) => IMMIGRATION_STATUS[value] || "",
    width: 100,
  },
  {
    field: "routes",
    headerName: "Routes",
    valueGetter: (value) => {
      const routes = value.map((route) => ROUTES_CHOICES[route]);
      return routes.join(", ");
    },
  },
  {
    field: "date_available",
    headerName: "Date Available To Start",
  },
];

export const DRIVERS_TABLE_FIELDS_SAFETY = [
  {
    field: "driver_id",
    headerName: "Driver ID",
    width: 150,
  },
  {
    field: "first_name",
    headerName: "First Name",
    accessKey: "id",
    width: 150,
    modalType: "driver",
  },
  {
    field: "last_name",
    headerName: "Last Name",
    accessKey: "id",
    width: 150,
    modalType: "driver",
  },
  {
    field: "status",
    headerName: "Status",
    width: 150,
    valueGetter: (value) => STATUS_CHOICES[value] || "",
  },
  {
    field: "status_note",
    headerName: "Status Note",
    width: 200,
  },
  {
    field: "compliant",
    headerName: "Compliant",
    width: 100,
    type: "boolean",
    renderCell: (params) => {
      return (
        <div
          className="flex items-center justify-center"
          data-tooltip-id={`${params.id}_compliant_tooltip`}
          data-tooltip-place="bottom"
        >
          <FontAwesomeIcon
            icon={faCircle}
            color={params.value ? "green" : "red"}
            className="pointer-events-none"
          />
          <Tooltip
            id={`${params.id}_compliant_tooltip`}
            openEvents={{ mouseenter: true, focus: true, click: true }}
            style={{ maxWidth: "90%", zIndex: 20 }}
          >
            {params.row.compliant_tooltip.split("\n").map((line, i) => (
              <React.Fragment key={i}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </Tooltip>
        </div>
      );
    },
  },
  {
    field: "phone_number",
    headerName: "Phone Number",
    width: 150,
    copyable: true,
  },
  {
    field: "email",
    headerName: "Email",
    width: 150,
    copyable: true,
  },
  {
    field: "date_of_birth",
    headerName: "Date of Birth",
    width: 150,
  },
  {
    field: "hiring_date",
    headerName: "Hiring Date",
    width: 150,
    defaultSort: true,
  },
  {
    field: "licenses_dl_number",
    headerName: "Driver's License Number",
    width: 180,
    valueGetter: (_, row) => row.licenses?.dl_number || "N/A",
  },
  {
    field: "licenses_dl_province",
    headerName: "DL Province",
    width: 120,
    valueGetter: (_, row) =>
      row.licenses?.dl_province
        ? CANADIAN_PROVINCES[row.licenses.dl_province] ||
          row.licenses.dl_province
        : "N/A",
  },
  {
    field: "licenses_expiry_date",
    headerName: "DL Expiration Date",
    width: 150,
    valueGetter: (_, row) => row.licenses?.expiry_date || "N/A",
  },
  {
    field: "date_of_leaving",
    headerName: "Leaving Date",
    width: 150,
  },
];

export const DRIVERS_TABLE_DOCUMENTS_EXPIRING = [
  {
    field: "driver_id",
    headerName: "Driver ID",
    width: 75,
  },
  {
    field: "first_name",
    headerName: "First Name",
    accessKey: "id",
    width: 150,
    modalType: "driver",
  },
  {
    field: "last_name",
    headerName: "Last Name",
    accessKey: "id",
    width: 150,
    modalType: "driver",
  },
  {
    field: "status",
    headerName: "Status",
    width: 75,
    valueGetter: (value) => STATUS_CHOICES[value] || value || "",
  },
  {
    field: "status_note",
    headerName: "Status Note",
    width: 200,
  },
  {
    field: "remarks_comments",
    headerName: "Remarks",
    width: 200,
  },
  {
    field: "update_status",
    headerName: "Update Status",
    width: 150,
    valueGetter: (value) => UPDATE_STATUS_CHOICES[value] || value || "",
    hide: true,
  },
  {
    field: "dl_expiry_date",
    headerName: "DL Expiration Date",
    width: 180,
    cellClassName: (params) => checkDate(params.value, 40),
    valueGetter: (_, row) => row.licenses?.expiry_date || "",
  },
  {
    field: "immigration_expiry_date",
    headerName: "Immigration Document Expiry Date",
    width: 180,
    cellClassName: (params) => checkDate(params.value, 40),
    valueGetter: (_, row) => row.immigration_doc?.expiry_date || "",
  },
  {
    field: "tdg_cards_expiry_date",
    headerName: "TDG Cards Expiry Date",
    width: 180,
    cellClassName: (params) => checkDate(params.value, 40),
    valueGetter: (_, row) => row.tdg_cards?.expiry_date || "",
  },
  {
    field: "good_to_go_expiry_date",
    headerName: "Good To Go Cards Expiry Date",
    width: 180,
    cellClassName: (params) => checkDate(params.value, 40),
    valueGetter: (_, row) => row.good_to_go_cards?.expiry_date || "",
  },
  {
    field: "lcv_license_expiry_date",
    headerName: "LCV License Expiry Date",
    width: 180,
    cellClassName: (params) => checkDate(params.value, 40),
    valueGetter: (_, row) => row.lcv_licenses?.expiry_date || "",
  },
  {
    field: "pdic_certificate_expiry_date",
    headerName: "PDIC Certificate Expiry Date",
    width: 180,
    cellClassName: (params) => checkDate(params.value, 40),
    valueGetter: (_, row) => row.pdic_certificates?.expiry_date || "",
  },
];

export const DRIVERS_TABLE_TO_BE_REVIEWED_BY_SAFETY = [
  {
    field: "driver_id",
    headerName: "Driver ID",
    sortable: true,
    width: 150,
  },
  {
    field: "status",
    headerName: "Status",
    sortable: true,
    width: 150,
    valueGetter: (value) => STATUS_CHOICES[value] || value || "N/A",
  },
  {
    field: "update_status",
    headerName: "Update Status",
    sortable: true,
    width: 150,
    valueGetter: (value) => UPDATE_STATUS_CHOICES[value] || value || "N/A",
  },
  {
    field: "first_name",
    headerName: "First Name",
    accessKey: "id",
    sortable: true,
    width: 150,
    modalType: "driver",
  },
  {
    field: "last_name",
    headerName: "Last Name",
    sortable: true,
    width: 150,
    modalType: "driver",
  },
  {
    field: "dl_expiry_date",
    headerName: "DL Expiration Date",
    sortable: true,
    width: 180,
    cellClassName: (params) => `date-status-${checkDate(params.value)}`,
    valueGetter: (_, row) => row.licenses?.expiry_date || "N/A",
  },
  {
    field: "immigration_expiry_date",
    headerName: "Immigration Document Expiry Date",
    sortable: true,
    width: 180,
    cellClassName: (params) => `date-status-${checkDate(params.value)}`,
    valueGetter: (_, row) => row.immigration_doc?.expiry_date || "N/A",
  },
  {
    field: "tdg_cards_expiry_date",
    headerName: "TDG Cards Expiry Date",
    sortable: true,
    width: 180,
    cellClassName: (params) => `date-status-${checkDate(params.value)}`,
    valueGetter: (_, row) => row.tdg_cards?.expiry_date || "N/A",
  },
  {
    field: "good_to_go_expiry_date",
    headerName: "Good To Go Cards Expiry Date",
    sortable: true,
    width: 180,
    cellClassName: (params) => `date-status-${checkDate(params.value)}`,
    valueGetter: (_, row) => row.good_to_go_cards?.expiry_date || "N/A",
  },
  {
    field: "lcv_license_expiry_date",
    headerName: "LCV License Expiry Date",
    sortable: true,
    width: 180,
    cellClassName: (params) => `date-status-${checkDate(params.value)}`,
    valueGetter: (_, row) => row.lcv_licenses?.expiry_date || "N/A",
  },
  {
    field: "pdic_certificate_expiry_date",
    headerName: "PDIC Certificate Expiry Date",
    sortable: true,
    width: 180,
    cellClassName: (params) => `date-status-${checkDate(params.value)}`,
    valueGetter: (_, row) => row.pdic_certificates?.expiry_date || "N/A",
  },
];

export const DRIVER_LOG_COLUMNS = [
  { field: "field_name", headerName: "Field Name", width: 140 },
  { field: "old_value", headerName: "Old Value", width: 120 },
  { field: "new_value", headerName: "New Value", width: 120 },
  { field: "changed_by", headerName: "Changed By", flex: 1, minWidth: 160 },
  {
    field: "timestamp",
    headerName: "Timestamp",
    width: 160,
    valueGetter: (value) => formatDate(value), // keeps your existing helper
  },
];

export const DRIVERS_SEALS_REPORT = [
  {
    field: "seal_number",
    headerName: "Seal Number",
    width: 150,
  },
  {
    field: "driver_id",
    headerName: "Driver ID",
    width: 150,
  },
  {
    field: "first_name",
    headerName: "First Name",
    accessKey: "driver",
    width: 150,
    modalType: "driver",
  },
  {
    field: "last_name",
    headerName: "Last Name",
    accessKey: "driver",
    width: 150,
    modalType: "driver",
  },
  {
    field: "issued_by",
    headerName: "Issued by",
    width: 150,
  },
  {
    field: "is_assigned",
    headerName: "Assigned",
    width: 80,
    type: "boolean",
  },
  {
    field: "location",
    headerName: "Location",
    width: 150,
  },
  {
    field: "date_time",
    headerName: "Date & Time",
    width: 200,
    defaultSort: true,
    valueGetter: (value) => formatDateTime(value),
  },
];
