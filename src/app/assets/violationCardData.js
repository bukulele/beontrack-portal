import { VIOLATION_RESULT_CHOICES } from "./tableData";

export const VIOLATION_CARD_FIELDS = {
  violation_number: {
    key: "violation_number",
    name: "Violation Number",
  },
  violation_settings: {
    key: "violation_settings",
    name: "Settings",
  },
  date_time: {
    key: "date_time",
    name: "Date and Time",
    type: "date_time",
  },
  assigned_to: {
    key: "assigned_to",
    name: "Assigned To",
  },
  main_driver_id: {
    key: "main_driver_id",
    name: "Driver",
  },
  location: {
    key: "location",
    name: "Location",
  },
  incident_details: {
    key: "violation_details",
    name: "Violation Details",
  },
  additional_info: {
    key: "additional_info",
    name: "Additional Info",
  },
};

export const DRIVER_1_VIOLATION_BLOCK = {
  main_driver_injury: {
    key: "main_driver_injury",
    name: "Injured",
    type: "boolean",
  },
};

export const TRUCK_VIOLATION_BLOCK = {
  truck_unit_number: {
    key: "truck_unit_number",
    name: "Unit Number",
  },
  truck_license_plate: {
    key: "truck_license_plate",
    name: "License Plate",
  },
  truck_make_model: {
    key: "truck_make_model",
    name: "Make/Model",
  },
  truck_violation: {
    key: "truck_violation",
    name: "Violation",
  },
};

export const TRAILER_1_VIOLATION_BLOCK = {
  trailer_1_unit_number: {
    key: "trailer_1_unit_number",
    name: "Unit Number",
  },
  trailer_1_license_plate: {
    key: "trailer_1_license_plate",
    name: "License Plate",
  },
  trailer_1_violation: {
    key: "trailer_1_violation",
    name: "Violation",
  },
};

export const TRAILER_2_VIOLATION_BLOCK = {
  trailer_2_unit_number: {
    key: "trailer_2_unit_number",
    name: "Unit Number",
  },
  trailer_2_license_plate: {
    key: "trailer_2_license_plate",
    name: "License Plate",
  },
  trailer_2_violation: {
    key: "trailer_2_violation",
    name: "Violation",
  },
};

export const CONVERTER_VIOLATION_BLOCK = {
  converter_unit_number: {
    key: "converter_unit_number",
    name: "Unit Number",
  },
  converter_violation: {
    key: "converter_violation",
    name: "Violation",
  },
};

export const POLICE_VIOLATION_BLOCK = {
  police_involved: {
    key: "police_involved",
    name: "Police Involved",
    type: "boolean",
  },
  police_report_number: {
    key: "police_report_number",
    name: "Report Number",
  },
  officer_and_department: {
    key: "officer_and_department",
    name: "Officer/Department",
  },
};

export const LAWYER_VIOLATION_BLOCK = {
  lawyer_company: {
    key: "lawyer_company",
    name: "Lawyer Company",
  },
  lawyer_email: {
    key: "lawyer_email",
    name: "Lawyer email",
  },
  lawyer_phone: {
    key: "lawyer_phone",
    name: "Lawyer phone",
  },
  lawyer_other_info: {
    key: "lawyer_other_info",
    name: "Other Info",
  },
  lawyer_result: {
    key: "lawyer_result",
    name: "Result",
    type: "selector",
    data: VIOLATION_RESULT_CHOICES,
  },
};
