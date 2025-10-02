import {
  AXLE_CHOICES,
  EQUIPMENT_TYPE_CHOICES,
  OWNEDBY_CHOICES_TRUCKS,
  OWNEDBY_CHOICES_EQUIPMENT,
  TERMINAL_CHOICES,
  VEHICLE_TYPE_CHOICES,
  TRUE_FALSE_CHOICES,
  INCIDENT_STATUS_CHOICES,
  CLAIM_STATUS_CHOICES,
  CLAIM_TYPE_MAPPING,
  VIOLATION_STATUS_CHOICES,
  VIOLATION_RESULT_CHOICES,
  INSPECTION_RESULT_CHOICES,
  TICKET_GIVEN_TO_CHOICES,
  CANADIAN_PROVINCES,
  COUNTRIES,
  USA_STATES,
  DEPARTMENT_CHOICES,
  WCB_STATUS_CHOICES,
  DRIVER_EMPLOYEE_CHOICES,
} from "./tableData";

export const CREATE_DRIVER_TEMPLATE_FIELDS = {
  email: "",
  first_name: "",
  last_name: "",
  phone_number: "",
  emergency_contact: "",
  emergency_phone: "",
  date_of_birth: "",
  date_available: "",
  street_number: "",
  street: "",
  unit_or_suite: "",
  city: "",
  province: "",
  postal_code: "",
};

export const CREATE_DRIVER_TEMPLATE_SETTINGS = {
  email: {
    key: "email",
    name: "Email",
    type: "email",
    mandatory: true,
    adminOnly: true,
  },
  first_name: {
    key: "first_name",
    name: "First Name",
    type: "text",
    mandatory: true,
  },
  last_name: {
    key: "last_name",
    name: "Last Name",
    type: "text",
    mandatory: true,
  },
  phone_number: {
    key: "phone_number",
    name: "Phone Number",
    type: "phone",
    mandatory: true,
  },
  emergency_contact: {
    key: "emergency_contact",
    name: "Emergency Contact",
    type: "text",
    mandatory: true,
    lettersOnly: true,
  },
  emergency_phone: {
    key: "emergency_phone",
    name: "Emergency Phone",
    type: "phone",
    mandatory: true,
  },
  date_of_birth: {
    key: "date_of_birth",
    name: "Date of Birth",
    type: "date",
    mandatory: true,
  },
  date_available: {
    key: "date_available",
    name: "Date Available",
    type: "date",
    mandatory: false,
  },
  street_number: {
    key: "street_number",
    name: "Street Number",
    type: "number",
    mandatory: true,
  },
  street: {
    key: "street",
    name: "Street",
    type: "text",
    mandatory: true,
  },
  unit_or_suite: {
    key: "unit_or_suite",
    name: "Unit or Suite",
    type: "text",
    mandatory: false,
  },
  city: {
    key: "city",
    name: "City",
    type: "text",
    mandatory: true,
  },
  province: {
    key: "province",
    name: "Province",
    type: "selector",
    mandatory: true,
    data: { "": "", ...CANADIAN_PROVINCES },
    setDefault: true,
  },
  postal_code: {
    key: "postal_code",
    name: "Postal Code",
    type: "postal_code",
    mandatory: true,
  },
};

export const CREATE_EMPLOYEE_TEMPLATE_FIELDS = {
  employee_id: "",
  card_number: "",
  email: "",
  first_name: "",
  last_name: "",
  phone_number: "",
  emergency_contact: "",
  emergency_phone: "",
  date_of_birth: "",
  date_available: "",
  street_number: "",
  street: "",
  unit_or_suite: "",
  city: "",
  province: "",
  postal_code: "",
  title: "",
  department: "",
};

export const CREATE_EMPLOYEE_TEMPLATE_SETTINGS = {
  employee_id: {
    key: "employee_id",
    name: "Employee ID",
    type: "text",
    mandatory: true,
  },
  card_number: {
    key: "card_number",
    name: "Card Number",
    type: "text",
    mandatory: false,
  },
  email: {
    key: "email",
    name: "Email",
    type: "email",
    mandatory: true,
    adminOnly: true,
  },
  first_name: {
    key: "first_name",
    name: "First Name",
    type: "text",
    mandatory: true,
  },
  last_name: {
    key: "last_name",
    name: "Last Name",
    type: "text",
    mandatory: true,
  },
  phone_number: {
    key: "phone_number",
    name: "Phone Number",
    type: "phone",
    mandatory: true,
  },
  emergency_contact: {
    key: "emergency_contact",
    name: "Emergency Contact",
    type: "text",
    mandatory: false,
    lettersOnly: true,
  },
  emergency_phone: {
    key: "emergency_phone",
    name: "Emergency Phone",
    type: "phone",
    mandatory: false,
  },
  date_of_birth: {
    key: "date_of_birth",
    name: "Date of Birth",
    type: "date",
    mandatory: true,
  },
  date_available: {
    key: "date_available",
    name: "Date Available",
    type: "date",
    mandatory: false,
  },
  street_number: {
    key: "street_number",
    name: "Street Number",
    type: "number",
    mandatory: true,
  },
  street: {
    key: "street",
    name: "Street",
    type: "text",
    mandatory: true,
  },
  unit_or_suite: {
    key: "unit_or_suite",
    name: "Unit or Suite",
    type: "text",
    mandatory: false,
  },
  city: {
    key: "city",
    name: "City",
    type: "text",
    mandatory: true,
  },
  province: {
    key: "province",
    name: "Province",
    type: "selector",
    mandatory: true,
    data: { "": "", ...CANADIAN_PROVINCES },
    setDefault: true,
  },
  postal_code: {
    key: "postal_code",
    name: "Postal Code",
    type: "postal_code",
    mandatory: true,
  },
  title: {
    key: "title",
    name: "Position Title",
    type: "text",
    mandatory: true,
  },
  department: {
    key: "department",
    name: "Department",
    type: "selector",
    mandatory: true,
    data: DEPARTMENT_CHOICES,
    setDefault: true,
  },
};

export const CREATE_TRUCK_TEMPLATE_SETTINGS = {
  unit_number: {
    key: "unit_number",
    name: "Unit Number",
    type: "number",
    mandatory: true,
  },
  make: {
    key: "make",
    name: "Make",
    type: "text",
    mandatory: true,
  },
  model: {
    key: "model",
    name: "Model",
    type: "text",
    mandatory: true,
  },
  vin: {
    key: "vin",
    name: "VIN",
    type: "text",
    mandatory: true,
  },
  year: {
    key: "year",
    name: "Year",
    type: "number",
    mandatory: true,
  },
  terminal: {
    key: "terminal",
    name: "Terminal",
    type: "selector",
    data: TERMINAL_CHOICES,
    setDefault: true,
    mandatory: true,
  },
  value_in_cad: {
    key: "value_in_cad",
    name: "Value In CAD",
    type: "number",
    mandatory: false,
  },
  vehicle_type: {
    key: "vehicle_type",
    name: "Vehicle Type",
    type: "selector",
    data: VEHICLE_TYPE_CHOICES,
    setDefault: true,
    mandatory: true,
  },
  owned_by: {
    key: "owned_by",
    name: "Owned By",
    type: "selector",
    data: OWNEDBY_CHOICES_TRUCKS,
    setDefault: true,
    mandatory: true,
  },
  remarks: {
    key: "remarks",
    name: "Remarks",
    type: "textarea",
    mandatory: false,
  },
};

export const EDIT_TRUCK_TEMPLATE_SETTINGS = {
  unit_number: {
    key: "unit_number",
    name: "Unit Number",
    type: "number",
    mandatory: true,
  },
  make: {
    key: "make",
    name: "Make",
    type: "text",
    mandatory: true,
  },
  model: {
    key: "model",
    name: "Model",
    type: "text",
    mandatory: true,
  },
  vin: {
    key: "vin",
    name: "VIN",
    type: "text",
    mandatory: true,
  },
  year: {
    key: "year",
    name: "Year",
    type: "number",
    mandatory: true,
  },
  terminal: {
    key: "terminal",
    name: "Terminal",
    type: "selector",
    data: TERMINAL_CHOICES,
    setDefault: true,
    mandatory: true,
  },
  value_in_cad: {
    key: "value_in_cad",
    name: "Value In CAD",
    type: "number",
    mandatory: true,
  },
  vehicle_type: {
    key: "vehicle_type",
    name: "Vehicle Type",
    type: "selector",
    data: VEHICLE_TYPE_CHOICES,
    setDefault: true,
    mandatory: true,
  },
  owned_by: {
    key: "owned_by",
    name: "Owned By",
    type: "selector",
    data: OWNEDBY_CHOICES_TRUCKS,
    setDefault: true,
    mandatory: true,
  },
  remarks: {
    key: "remarks",
    name: "Remarks",
    type: "textarea",
    mandatory: false,
  },
};

export const CREATE_TRUCK_TEMPLATE_FIELDS = {
  unit_number: "",
  make: "",
  model: "",
  vin: "",
  year: "",
  terminal: "",
  value_in_cad: "",
  vehicle_type: "",
  owned_by: "",
  remarks: "",
};

export const CREATE_EQUIPMENT_TEMPLATE_FIELDS = {
  unit_number: "",
  make: "",
  model: "",
  vin: "",
  year: "",
  terminal: "",
  value_in_cad: "",
  equipment_type: "",
  axles: "",
  owned_by: "",
  remarks: "",
};

export const CREATE_EQUIPMENT_TEMPLATE_SETTINGS = {
  unit_number: {
    key: "unit_number",
    name: "Unit Number",
    type: "number",
    mandatory: true,
  },
  make: {
    key: "make",
    name: "Make",
    type: "text",
    mandatory: true,
  },
  model: {
    key: "model",
    name: "Model",
    type: "text",
    mandatory: true,
  },
  vin: {
    key: "vin",
    name: "VIN",
    type: "text",
    mandatory: true,
  },
  year: {
    key: "year",
    name: "Year",
    type: "number",
    mandatory: true,
  },
  terminal: {
    key: "terminal",
    name: "Terminal",
    type: "selector",
    data: TERMINAL_CHOICES,
    setDefault: true,
    mandatory: true,
  },
  value_in_cad: {
    key: "value_in_cad",
    name: "Value In CAD",
    type: "number",
    mandatory: false,
  },
  equipment_type: {
    key: "equipment_type",
    name: "Equipment Type",
    type: "selector",
    data: EQUIPMENT_TYPE_CHOICES,
    setDefault: true,
    mandatory: true,
  },
  axles: {
    key: "axles",
    name: "Axles",
    type: "selector",
    data: AXLE_CHOICES,
    setDefault: true,
    mandatory: true,
  },
  owned_by: {
    key: "owned_by",
    name: "Owned By",
    type: "selector",
    data: OWNEDBY_CHOICES_EQUIPMENT,
    setDefault: true,
    mandatory: true,
  },
  remarks: {
    key: "remarks",
    name: "Remarks",
    type: "textarea",
    mandatory: false,
  },
};

export const EDIT_EQUIPMENT_TEMPLATE_SETTINGS = {
  unit_number: {
    key: "unit_number",
    name: "Unit Number",
    type: "number",
    mandatory: true,
  },
  make: {
    key: "make",
    name: "Make",
    type: "text",
    mandatory: true,
  },
  model: {
    key: "model",
    name: "Model",
    type: "text",
    mandatory: true,
  },
  vin: {
    key: "vin",
    name: "VIN",
    type: "text",
    mandatory: true,
  },
  year: {
    key: "year",
    name: "Year",
    type: "number",
    mandatory: true,
  },
  terminal: {
    key: "terminal",
    name: "Terminal",
    type: "selector",
    data: TERMINAL_CHOICES,
    setDefault: true,
    mandatory: true,
  },
  value_in_cad: {
    key: "value_in_cad",
    name: "Value In CAD",
    type: "number",
    mandatory: true,
  },
  vehicle_type: {
    key: "equipment_type",
    name: "Equipment Type",
    type: "selector",
    data: EQUIPMENT_TYPE_CHOICES,
    setDefault: true,
    mandatory: true,
  },
  owned_by: {
    key: "owned_by",
    name: "Owned By",
    type: "selector",
    data: OWNEDBY_CHOICES_EQUIPMENT,
    setDefault: true,
    mandatory: true,
  },
  remarks: {
    key: "remarks",
    name: "Remarks",
    type: "textarea",
    mandatory: false,
  },
};

export const CREATE_INCIDENT_TEMPLATE_SETTINGS = {
  incident_number: {
    key: "incident_number",
    name: "Incident #",
    type: "text",
    mandatory: true,
  },
  assigned_to: {
    key: "assigned_to",
    name: "Assigned to",
    type: "text",
    mandatory: true,
  },
  report: {
    key: "report",
    name: "Driver Report #",
    type: "selector-context",
    contextValues: "driverReportsList",
    mandatory: false,
  },
  status: {
    key: "status",
    name: "Status",
    type: "selector",
    data: INCIDENT_STATUS_CHOICES,
    setDefault: true,
    mandatory: true,
  },
  date_time: {
    key: "date_time",
    name: "Date & time",
    type: "date-time",
    mandatory: true,
  },
  location: {
    key: "location",
    name: "Location",
    type: "text",
    mandatory: true,
  },
  gps_coordinates: {
    key: "gps_coordinates",
    name: "GPS Coordinates",
    type: "gps",
    mandatory: false,
    disabled: true,
  },
  incident_details: {
    key: "incident_details",
    name: "Incident Details",
    type: "textarea",
    mandatory: true,
  },
  main_driver_id: {
    key: "main_driver_id",
    name: "Main Driver",
    type: "selector-context",
    contextValues: "driver",
    mandatory: false,
  },
  main_driver_injury: {
    key: "main_driver_injury",
    name: "Main Driver Injured",
    type: "selector",
    data: TRUE_FALSE_CHOICES,
    setDefault: true,
    mandatory: false,
  },
  co_driver_id: {
    key: "co_driver_id",
    name: "Co-Driver",
    type: "selector-context",
    contextValues: "driver",
    mandatory: false,
  },
  co_driver_injury: {
    key: "co_driver_injury",
    name: "Co-Driver Injured",
    type: "selector",
    data: TRUE_FALSE_CHOICES,
    setDefault: true,
    mandatory: false,
  },
  truck: {
    key: "truck",
    name: "Truck",
    type: "selector-context",
    contextValues: "truck",
    mandatory: false,
  },
  trailer_1_unit_number: {
    key: "trailer_1_unit_number",
    name: "Trailer 1 Unit Number",
    type: "text",
    mandatory: false,
  },
  trailer_1_license_plate: {
    key: "trailer_1_license_plate",
    name: "Trailer 1 License Plate",
    type: "text",
    mandatory: false,
  },
  trailer_1_damage: {
    key: "trailer_1_damage",
    name: "Trailer 1 Damage",
    type: "text",
    mandatory: false,
  },
  trailer_2_unit_number: {
    key: "trailer_2_unit_number",
    name: "Trailer 2 Unit Number",
    type: "text",
    mandatory: false,
  },
  trailer_2_license_plate: {
    key: "trailer_2_license_plate",
    name: "Trailer 2 License Plate",
    type: "text",
    mandatory: false,
  },
  trailer_2_damage: {
    key: "trailer_2_damage",
    name: "Trailer 2 Damage",
    type: "text",
    mandatory: false,
  },
  cargo_1_bol_po_number: {
    key: "cargo_1_bol_po_number",
    name: "Cargo 1 BOL/PO Number",
    type: "text",
    mandatory: false,
  },
  cargo_1_commodity: {
    key: "cargo_1_commodity",
    name: "Cargo 1 Commodity",
    type: "text",
    mandatory: false,
  },
  cargo_1_damage: {
    key: "cargo_1_damage",
    name: "Cargo 1 Damage",
    type: "text",
    mandatory: false,
  },
  cargo_2_bol_po_number: {
    key: "cargo_2_bol_po_number",
    name: "Cargo 2 BOL/PO Number",
    type: "text",
    mandatory: false,
  },
  cargo_2_commodity: {
    key: "cargo_2_commodity",
    name: "Cargo 2 Commodity",
    type: "text",
    mandatory: false,
  },
  cargo_2_damage: {
    key: "cargo_2_damage",
    name: "Cargo 2 Damage",
    type: "text",
    mandatory: false,
  },
  converter_unit_number: {
    key: "converter_unit_number",
    name: "Converter Unit Number",
    type: "text",
    mandatory: false,
  },
  converter_damage: {
    key: "converter_damage",
    name: "Converter Damage",
    type: "text",
    mandatory: false,
  },
  additional_info: {
    key: "additional_info",
    name: "Additional Info",
    type: "text",
    mandatory: false,
  },
  towing_info: {
    key: "towing_info",
    name: "Towing Info",
    type: "text",
    mandatory: false,
  },
  police_involved: {
    key: "police_involved",
    name: "Police Involved",
    type: "selector",
    data: TRUE_FALSE_CHOICES,
    setDefault: true,
    mandatory: false,
  },
  police_report_number: {
    key: "police_report_number",
    name: "police_report_number",
    type: "text",
    mandatory: false,
  },
  officer_and_department: {
    key: "officer_and_department",
    name: "Officer/Department",
    type: "text",
    mandatory: false,
  },
};

export const CREATE_INCIDENT_TEMPLATE_FIELDS = {
  incident_number: "",
  assigned_to: "",
  report: "",
  status: "",
  date_time: "",
  location: "",
  gps_coordinates: "",
  incident_details: "",
  main_driver_id: "",
  main_driver_injury: "",
  co_driver_id: "",
  co_driver_injury: "",
  truck: "",
  trailer_1_unit_number: "",
  trailer_1_license_plate: "",
  trailer_1_damage: "",
  trailer_2_unit_number: "",
  trailer_2_license_plate: "",
  trailer_2_damage: "",
  cargo_1_bol_po_number: "",
  cargo_1_commodity: "",
  cargo_1_damage: "",
  cargo_2_bol_po_number: "",
  cargo_2_commodity: "",
  cargo_2_damage: "",
  converter_unit_number: "",
  converter_damage: "",
  additional_info: "",
  towing_info: "",
  police_involved: "",
  police_report_number: "",
  officer_and_department: "",
};

export const CREATE_VIOLATION_TEMPLATE_SETTINGS = {
  violation_number: {
    key: "violation_number",
    name: "Violation #",
    type: "text",
    mandatory: true,
  },
  assigned_to: {
    key: "assigned_to",
    name: "Assigned to",
    type: "text",
    mandatory: true,
  },
  report: {
    key: "report",
    name: "Driver Report #",
    type: "selector-context",
    contextValues: "driverReportsList",
    mandatory: false,
  },
  status: {
    key: "status",
    name: "Status",
    type: "selector",
    data: VIOLATION_STATUS_CHOICES,
    setDefault: true,
    mandatory: true,
  },
  date_time: {
    key: "date_time",
    name: "Date & time",
    type: "date-time",
    mandatory: true,
  },
  city: {
    key: "city",
    name: "City",
    type: "text",
    mandatory: false,
  },
  country: {
    key: "country",
    name: "Country",
    type: "selector",
    data: COUNTRIES,
    mandatory: false,
    setDefault: true,
  },
  province: {
    key: "province",
    name: "Province / State",
    type: "selector",
    data: { "": "", ...CANADIAN_PROVINCES },
    data_opt: { "": "", ...USA_STATES },
    mandatory: false,
    setDefault: true,
  },
  // location: {
  //   key: "location",
  //   name: "Location",
  //   type: "text",
  //   mandatory: false,
  // },
  gps_coordinates: {
    key: "gps_coordinates",
    name: "GPS Coordinates",
    type: "gps",
    mandatory: false,
    disabled: true,
  },
  violation_details: {
    key: "violation_details",
    name: "Violation Details",
    type: "textarea",
    mandatory: true,
  },
  main_driver_id: {
    key: "main_driver_id",
    name: "Main Driver",
    type: "selector-context",
    contextValues: "driver",
    mandatory: false,
  },
  main_driver_injury: {
    key: "main_driver_injury",
    name: "Main Driver Injured",
    type: "selector",
    data: TRUE_FALSE_CHOICES,
    setDefault: true,
    mandatory: false,
  },
  truck: {
    key: "truck",
    name: "Truck",
    type: "selector-context",
    contextValues: "truck",
    mandatory: false,
  },
  truck_violation: {
    key: "truck_violation",
    name: "Truck Violation",
    type: "text",
    mandatory: false,
  },
  trailer_1_unit_number: {
    key: "trailer_1_unit_number",
    name: "Trailer 1 Unit Number",
    type: "text",
    mandatory: false,
  },
  trailer_1_license_plate: {
    key: "trailer_1_license_plate",
    name: "Trailer 1 License Plate",
    type: "text",
    mandatory: false,
  },
  trailer_1_violation: {
    key: "trailer_1_violation",
    name: "Trailer 1 Violation",
    type: "text",
    mandatory: false,
  },
  trailer_2_unit_number: {
    key: "trailer_2_unit_number",
    name: "Trailer 2 Unit Number",
    type: "text",
    mandatory: false,
  },
  trailer_2_license_plate: {
    key: "trailer_2_license_plate",
    name: "Trailer 2 License Plate",
    type: "text",
    mandatory: false,
  },
  trailer_2_violation: {
    key: "trailer_2_violation",
    name: "Trailer 2 Violation",
    type: "text",
    mandatory: false,
  },
  converter_unit_number: {
    key: "converter_unit_number",
    name: "Converter Unit Number",
    type: "text",
    mandatory: false,
  },
  converter_violation: {
    key: "converter_violation",
    name: "Converter Violation",
    type: "text",
    mandatory: false,
  },
  additional_info: {
    key: "additional_info",
    name: "Additional Info",
    type: "text",
    mandatory: false,
  },
  police_involved: {
    key: "police_involved",
    name: "Police Involved",
    type: "selector",
    data: TRUE_FALSE_CHOICES,
    setDefault: true,
    mandatory: false,
  },
  police_report_number: {
    key: "police_report_number",
    name: "police_report_number",
    type: "text",
    mandatory: false,
  },
  officer_and_department: {
    key: "officer_and_department",
    name: "Officer/Department",
    type: "text",
    mandatory: false,
  },
  lawyer_company: {
    key: "lawyer_company",
    name: "Lawyer Company",
    type: "text",
    mandatory: false,
  },
  lawyer_email: {
    key: "lawyer_email",
    name: "Lawyer Email",
    type: "email",
    mandatory: false,
  },
  lawyer_phone: {
    key: "lawyer_phone",
    name: "Lawyer Phone",
    type: "phone",
    mandatory: false,
  },
  lawyer_other_info: {
    key: "lawyer_other_info",
    name: "Lawyer Other Info",
    type: "text",
    mandatory: false,
  },
  lawyer_result: {
    key: "lawyer_result",
    name: "Lawyer Result",
    type: "selector",
    mandatory: false,
    data: VIOLATION_RESULT_CHOICES,
    setDefault: true,
  },
};

export const CREATE_LAWYER_DATA_TEMPLATE_SETTINGS = {
  lawyer_company: {
    key: "lawyer_company",
    name: "Lawyer Company",
    type: "text",
    mandatory: false,
  },
  lawyer_email: {
    key: "lawyer_email",
    name: "Lawyer Email",
    type: "email",
    mandatory: false,
  },
  lawyer_phone: {
    key: "lawyer_phone",
    name: "Lawyer Phone",
    type: "phone",
    mandatory: false,
  },
  lawyer_other_info: {
    key: "lawyer_other_info",
    name: "Lawyer Other Info",
    type: "text",
    mandatory: false,
  },
  lawyer_result: {
    key: "lawyer_result",
    name: "Lawyer Result",
    type: "selector",
    mandatory: false,
    data: VIOLATION_RESULT_CHOICES,
    setDefault: true,
  },
};

export const CREATE_VIOLATION_TEMPLATE_FIELDS = {
  violation_number: "",
  assigned_to: "",
  report: "",
  status: "",
  date_time: "",
  city: "",
  country: "",
  province: "",
  // location: "",
  gps_coordinates: "",
  violation_details: "",
  main_driver_id: "",
  main_driver_injury: "",
  truck: "",
  truck_violation: "",
  trailer_1_unit_number: "",
  trailer_1_license_plate: "",
  trailer_1_violation: "",
  trailer_2_unit_number: "",
  trailer_2_license_plate: "",
  trailer_2_violation: "",
  converter_unit_number: "",
  converter_violation: "",
  additional_info: "",
  police_involved: "",
  police_report_number: "",
  officer_and_department: "",
  lawyer_company: "",
  lawyer_phone: "",
  lawyer_email: "",
  lawyer_other_info: "",
  lawyer_result: "",
};

export const CREATE_LAWYER_DATA_TEMPLATE_FIELDS = {
  lawyer_company: "",
  lawyer_email: "",
  lawyer_phone: "",
  lawyer_other_info: "",
  lawyer_result: "",
};

export const MPI_CLAIMS_TEMPLATE_SETTINGS = {
  status: {
    key: "status",
    name: "Claim Status",
    type: "text",
  },
  claim_number: {
    key: "claim_number",
    name: "Claim Number",
    type: "text",
  },
  unit_number: {
    key: "unit_number",
    name: "Unit Number",
    type: "text",
  },
  reimbursement: {
    key: "reimbursement",
    name: "Reimbursement",
    type: "text",
  },
};

export const LOBLAW_CLAIMS_TEMPLATE_SETTINGS = {
  status: {
    key: "status",
    name: "Claim Status",
    type: "text",
  },
  claim_number: {
    key: "claim_number",
    name: "Claim Number",
    type: "text",
  },
  unit_number: {
    key: "unit_number",
    name: "Unit Number",
    type: "text",
  },
  reimbursement: {
    key: "reimbursement",
    name: "Reimbursement",
    type: "text",
  },
};

export const T_P_INFO_TEMPLATE_SETTINGS = {
  third_party_contacts: {
    key: "third_party_contacts",
    name: "Third Party Contacts",
    type: "text",
  },
  third_party_vehicle: {
    key: "third_party_vehicle",
    name: "Third Party Vehicle",
    type: "text",
  },
  other_info: {
    key: "third_party_trailer",
    name: "Third Party Trailer",
    type: "text",
  },
  damage: {
    key: "third_party_cargo",
    name: "Third Party Cargo",
    type: "text",
  },
};

export const CREATE_CLAIM_MPI_TEMPLATE_FIELDS = {
  status: "",
  claim_to: "MPI",
  claim_type: "",
  claim_number: "",
  unit_number: "",
  reimbursement: "",
};

export const CREATE_CLAIM_MPI_TEMPLATE_SETTINGS = {
  status: {
    key: "status",
    name: "Claim Status",
    type: "selector",
    setDefault: true,
    data: CLAIM_STATUS_CHOICES,
    mandatory: false,
  },
  claim_type: {
    key: "claim_type",
    name: "Claim Type",
    type: "selector",
    setDefault: true,
    data: CLAIM_TYPE_MAPPING,
    mandatory: false,
  },
  claim_number: {
    key: "claim_number",
    name: "Claim Number",
    type: "text",
    mandatory: true,
  },
  unit_number: {
    key: "unit_number",
    name: "Unit Number",
    type: "text",
    mandatory: false,
    disabled: true,
  },
  reimbursement: {
    key: "reimbursement",
    name: "Reimbursement",
    type: "text",
    mandatory: false,
  },
};

export const EDIT_CLAIM_MPI_TEMPLATE_SETTINGS = {
  status: {
    key: "status",
    name: "Claim Status",
    type: "selector",
    setDefault: true,
    data: CLAIM_STATUS_CHOICES,
    mandatory: false,
  },
  claim_type: {
    key: "claim_type",
    name: "Claim Type",
    type: "selector",
    setDefault: true,
    data: CLAIM_TYPE_MAPPING,
    mandatory: false,
    disabled: true,
  },
  claim_number: {
    key: "claim_number",
    name: "Claim Number",
    type: "text",
    mandatory: true,
  },
  unit_number: {
    key: "unit_number",
    name: "Unit Number",
    type: "text",
    mandatory: false,
    disabled: true,
  },
  reimbursement: {
    key: "reimbursement",
    name: "Reimbursement",
    type: "text",
    mandatory: false,
  },
};

export const CREATE_CLAIM_LL_TEMPLATE_FIELDS = {
  status: "",
  claim_to: "LL",
  claim_type: "",
  claim_number: "",
  unit_number: "",
  reimbursement: "",
};
export const CREATE_CLAIM_LL_TEMPLATE_SETTINGS = {
  status: {
    key: "status",
    name: "Claim Status",
    type: "selector",
    setDefault: true,
    data: CLAIM_STATUS_CHOICES,
    mandatory: false,
  },
  claim_type: {
    key: "claim_type",
    name: "Claim Type",
    type: "selector",
    setDefault: true,
    data: CLAIM_TYPE_MAPPING,
    mandatory: false,
  },
  claim_number: {
    key: "claim_number",
    name: "Claim Number",
    type: "text",
    mandatory: true,
  },
  unit_number: {
    key: "unit_number",
    name: "Unit Number",
    type: "text",
    mandatory: false,
    disabled: true,
  },
  reimbursement: {
    key: "reimbursement",
    name: "Reimbursement",
    type: "text",
    mandatory: false,
  },
};

export const EDIT_CLAIM_LL_TEMPLATE_SETTINGS = {
  status: {
    key: "status",
    name: "Claim Status",
    type: "selector",
    setDefault: true,
    data: CLAIM_STATUS_CHOICES,
    mandatory: false,
  },
  claim_type: {
    key: "claim_type",
    name: "Claim Type",
    type: "selector",
    setDefault: true,
    data: CLAIM_TYPE_MAPPING,
    mandatory: false,
    disabled: true,
  },
  claim_number: {
    key: "claim_number",
    name: "Claim Number",
    type: "text",
    mandatory: true,
  },
  unit_number: {
    key: "unit_number",
    name: "Unit Number",
    type: "text",
    mandatory: false,
    disabled: true,
  },
  reimbursement: {
    key: "reimbursement",
    name: "Reimbursement",
    type: "text",
    mandatory: false,
  },
};

export const CREATE_CLAIM_TP_TEMPLATE_FIELDS = {
  claim_to: "TP",
  claim_type: "THP",
  third_party_contacts: "",
  third_party_vehicle: "",
  other_info: "",
  damage: "",
};

export const CREATE_CLAIM_TP_TEMPLATE_SETTINGS = {
  third_party_contacts: {
    key: "third_party_contacts",
    name: "Third Party Contacts",
    type: "text",
    mandatory: false,
  },
  third_party_vehicle: {
    key: "third_party_vehicle",
    name: "Third Party Vehicle",
    type: "text",
    mandatory: false,
  },
  other_info: {
    key: "other_info",
    name: "Other Info",
    type: "textarea",
    mandatory: false,
  },
  damage: {
    key: "damage",
    name: "Damage",
    type: "textarea",
    mandatory: false,
  },
};

export const EDIT_CLAIM_TP_TEMPLATE_SETTINGS = {
  third_party_contacts: {
    key: "third_party_contacts",
    name: "Third Party Contacts",
    type: "text",
    mandatory: false,
  },
  third_party_vehicle: {
    key: "third_party_vehicle",
    name: "Third Party Vehicle",
    type: "text",
    mandatory: false,
  },
  other_info: {
    key: "other_info",
    name: "Other Info",
    type: "textarea",
    mandatory: false,
  },
  damage: {
    key: "damage",
    name: "Damage",
    type: "textarea",
    mandatory: false,
  },
};

export const CREATE_INSPECTION_DATA_TEMPLATE_FIELDS = {
  inspection_number: "",
  officer_info: "",
  inspection_result: "",
  additional_info: "",
};

export const CREATE_INSPECTION_TEMPLATE_SETTINGS = {
  inspection_number: {
    key: "inspection_number",
    name: "Inspection Number",
    type: "text",
    mandatory: true,
  },
  officer_info: {
    key: "officer_info",
    name: "Officer Info",
    type: "text",
  },
  inspection_result: {
    key: "inspection_result",
    name: "Inspection Result",
    type: "selector",
    setDefault: true,
    data: INSPECTION_RESULT_CHOICES,
  },
  additional_info: {
    key: "additional_info",
    name: "Additional Info",
    type: "text",
  },
};

export const CREATE_TICKET_DATA_TEMPLATE_FIELDS = {
  ticket_number: "",
  given_to: "",
  officer_info: "",
  violation_type: "",
  additional_info: "",
};

export const CREATE_TICKET_TEMPLATE_SETTINGS = {
  ticket_number: {
    key: "ticket_number",
    name: "Ticket Number",
    type: "text",
    mandatory: true,
  },
  given_to: {
    key: "given_to",
    name: "Given to",
    type: "selector",
    setDefault: true,
    data: TICKET_GIVEN_TO_CHOICES,
  },
  officer_info: {
    key: "officer_info",
    name: "Officer Info",
    type: "text",
  },
  violation_type: {
    key: "violation_type",
    name: "Violation Type",
    type: "text",
  },
  additional_info: {
    key: "additional_info",
    name: "Additional Info",
    type: "text",
  },
};

export const INSPECTION_TEMPLATE_SETTINGS = {
  inspection_number: {
    key: "inspection_number",
    name: "Inspection Number",
    type: "text",
  },
  officer_info: {
    key: "officer_info",
    name: "Officer Info",
    type: "text",
  },
  inspection_result: {
    key: "inspection_result",
    name: "Inspection Result",
    type: "text",
  },
  additional_info: {
    key: "additional_info",
    name: "Additional Info",
    type: "text",
  },
};

export const TICKET_TEMPLATE_SETTINGS = {
  ticket_number: {
    key: "ticket_number",
    name: "Ticket Number",
    type: "text",
  },
  given_to: {
    key: "given_to",
    name: "Given to",
    type: "text",
  },
  officer_info: {
    key: "officer_info",
    name: "Officer Info",
    type: "text",
  },
  violation_type: {
    key: "violation_type",
    name: "Violation Type",
    type: "text",
  },
  additional_info: {
    key: "additional_info",
    name: "Additional Info",
    type: "text",
  },
};

export const INDICATE_VIOLATIONS_TEMPLATE_FIELDS = {
  truck_violation: "",
  trailer_1_violation: "",
  trailer_2_violation: "",
  converter_violation: "",
};

export const INDICATE_VIOLATIONS_TEMPLATE_SETTINGS = {
  truck_violation: {
    key: "truck_violation",
    name: "Truck Violation",
    type: "text",
  },
  trailer_1_violation: {
    key: "trailer_1_violation",
    name: "Trailer 1 Violation",
    type: "text",
  },
  trailer_2_violation: {
    key: "trailer_2_violation",
    name: "trailer 2 Violation",
    type: "text",
  },
  converter_violation: {
    key: "converter_violation",
    name: "Converter Violation",
    type: "text",
  },
};

export const ROAD_TESTS_OBJECT_TEMPLATE_FIELDS = {
  issue_date: "",
  endpointIdentifier: "",
  last_changed_by: "",
  last_reviewed_by: "",
  was_reviewed: "",
};
export const LOG_BOOKS_OBJECT_TEMPLATE_FIELDS = {
  comment: "",
  endpointIdentifier: "",
  last_changed_by: "",
  last_reviewed_by: "",
  was_reviewed: "",
};
export const SIN_OBJECT_TEMPLATE_FIELDS = {
  number: "",
  endpointIdentifier: "",
  last_changed_by: "",
  last_reviewed_by: "",
  was_reviewed: "",
};
export const IMMIGRATION_DOCS_OBJECT_TEMPLATE_FIELDS = {
  expiry_date: "",
  endpointIdentifier: "",
  last_changed_by: "",
  last_reviewed_by: "",
  was_reviewed: "",
};
export const INCORP_DOCS_OBJECT_TEMPLATE_FIELDS = {
  number: "",
  endpointIdentifier: "",
  last_changed_by: "",
  last_reviewed_by: "",
  was_reviewed: "",
};
export const GST_DOCS_OBJECT_TEMPLATE_FIELDS = {
  number: "",
  endpointIdentifier: "",
  last_changed_by: "",
  last_reviewed_by: "",
  was_reviewed: "",
};
export const PDIC_CERT_OBJECT_TEMPLATE_FIELDS = {
  expiry_date: "",
  endpointIdentifier: "",
  last_changed_by: "",
  last_reviewed_by: "",
  was_reviewed: "",
};
export const TAX_PAPERS_OBJECT_TEMPLATE_FIELDS = {
  issue_date: "",
  comment: "",
  endpointIdentifier: "",
  last_changed_by: "",
  last_reviewed_by: "",
  was_reviewed: "",
};
export const DRIVER_STATEMENTS_OBJECT_TEMPLATE_FIELDS = {
  issue_date: "",
  comment: "",
  endpointIdentifier: "",
  last_changed_by: "",
  last_reviewed_by: "",
  was_reviewed: "",
};
export const OTHER_DOCUMENTS_OBJECT_TEMPLATE_FIELDS = {
  comment: "",
  endpointIdentifier: "",
  last_changed_by: "",
  last_reviewed_by: "",
  was_reviewed: "",
};
export const LICENSES_OBJECT_TEMPLATE_FIELDS = {
  issue_date: "",
  expiry_date: "",
  dl_number: "",
  dl_province: "",
  endpointIdentifier: "",
  last_changed_by: "",
  last_reviewed_by: "",
  was_reviewed: "",
};
export const ABSTRACTS_OBJECT_TEMPLATE_FIELDS = {
  issue_date: "",
  endpointIdentifier: "",
  last_changed_by: "",
  last_reviewed_by: "",
  was_reviewed: "",
};
export const TDG_CARDS_OBJECT_TEMPLATE_FIELDS = {
  expiry_date: "",
  endpointIdentifier: "",
  last_changed_by: "",
  last_reviewed_by: "",
  was_reviewed: "",
};
export const GTG_CARDS_OBJECT_TEMPLATE_FIELDS = {
  issue_date: "",
  expiry_date: "",
  endpointIdentifier: "",
  last_changed_by: "",
  last_reviewed_by: "",
  was_reviewed: "",
};
export const LCV_CERT_OBJECT_TEMPLATE_FIELDS = {
  expiry_date: "",
  endpointIdentifier: "",
  last_changed_by: "",
  last_reviewed_by: "",
  was_reviewed: "",
};
export const LCV_LICENSES_OBJECT_TEMPLATE_FIELDS = {
  expiry_date: "",
  endpointIdentifier: "",
  last_changed_by: "",
  last_reviewed_by: "",
  was_reviewed: "",
};
export const VIOLATIONS_CERT_OBJECT_TEMPLATE_FIELDS = {
  issue_date: "",
  comment: "",
  endpointIdentifier: "",
  last_changed_by: "",
  last_reviewed_by: "",
  was_reviewed: "",
};
export const ANNUAL_PERFORMANCE_REVIEW_OBJECT_TEMPLATE_FIELDS = {
  date_of_review: "",
  endpointIdentifier: "",
  last_changed_by: "",
  last_reviewed_by: "",
  was_reviewed: "",
};
export const WINTER_COURSES_OBJECT_TEMPLATE_FIELDS = {
  date_of_completion: "",
  endpointIdentifier: "",
  last_changed_by: "",
  last_reviewed_by: "",
  was_reviewed: "",
};
export const REFERENCE_CHECKS_OBJECT_TEMPLATE_FIELDS = {
  company: "",
  endpointIdentifier: "",
  last_changed_by: "",
  last_reviewed_by: "",
  was_reviewed: "",
};
export const WCB_OBJECT_TEMPLATE_FIELDS = {
  claim_number: "",
  wcb_claim_number: "",
  province: "",
  assigned_to: "",
  status: "",
  date_time: "",
  location: "",
  gps_coordinates: "",
  incident_details: "",
  reported_to_doctor: "",
  first_contact_after_injury: "",
  wcbcontact_name: "",
  wcbcontact_email: "",
  wcbcontact_phone: "",
  select_driver_employee: "",
  main_driver_id: "",
  main_employee_id: "",
  report: "",
  remarks: "",
};

export const ADD_NEW_EMPLOYEE_ADJUSTMENT_FIELDS = {
  first_pay_day: "",
  username: "",
  hours: "",
  comment: "",
  employee: "",
};

export const WCB_CONTACT_OBJECT_TEMPLATE_FIELDS = {
  wcbcontact_name: "",
  wcbcontact_phone: "",
  wcbcontact_email: "",
  last_changed_by: "",
  last_reviewed_by: "",
  was_reviewed: "",
};

export const ROAD_TESTS_OBJECT_TEMPLATE_SETTINGS = {
  issue_date: {
    key: "issue_date",
    name: "Issue Date",
    type: "date",
    // maxDate: 0,
  },
};
export const LOG_BOOKS_OBJECT_TEMPLATE_SETTINGS = {
  comment: {
    key: "comment",
    name: "Comment",
    type: "text",
  },
};
export const SIN_OBJECT_TEMPLATE_SETTINGS = {
  number: {
    key: "number",
    name: "Document Number",
    type: "number",
    formatted: true,
    max: 9,
  },
};
export const IMMIGRATION_DOCS_OBJECT_TEMPLATE_SETTINGS = {
  expiry_date: {
    key: "expiry_date",
    name: "Expiry Date",
    type: "date",
    // minDate: -5,
  },
};
export const INCORP_DOCS_OBJECT_TEMPLATE_SETTINGS = {
  number: {
    key: "number",
    name: "Document Number",
    type: "text",
  },
};
export const GST_DOCS_OBJECT_TEMPLATE_SETTINGS = {
  number: {
    key: "number",
    name: "Document Number",
    type: "text",
  },
};
export const PDIC_CERT_OBJECT_TEMPLATE_SETTINGS = {
  expiry_date: {
    key: "expiry_date",
    name: "Expiry Date",
    type: "date",
    // minDate: -5,
  },
};
export const TAX_PAPERS_OBJECT_TEMPLATE_SETTINGS = {
  issue_date: {
    key: "issue_date",
    name: "Issue Date",
    type: "date",
    // maxDate: 0,
  },
  comment: {
    key: "comment",
    name: "Comment",
    type: "text",
  },
};
export const DRIVER_STATEMENTS_OBJECT_TEMPLATE_SETTINGS = {
  issue_date: {
    key: "issue_date",
    name: "Issue Date",
    type: "date",
    // maxDate: 0,
  },
  comment: {
    key: "comment",
    name: "Comment",
    type: "text",
  },
};
export const OTHER_DOCUMENTS_OBJECT_TEMPLATE_SETTINGS = {
  comment: {
    key: "comment",
    name: "Comment",
    type: "text",
  },
};
export const LICENSES_OBJECT_TEMPLATE_SETTINGS = {
  issue_date: {
    key: "issue_date",
    name: "Issue Date",
    type: "date",
    // maxDate: 0,
  },
  expiry_date: {
    key: "expiry_date",
    name: "Expiry Date",
    type: "date",
    // minDate: -5,
  },
  dl_number: {
    key: "dl_number",
    name: "DL Number",
    type: "text",
  },
  dl_province: {
    key: "dl_province",
    name: "DL Province",
    type: "selector",
    data: CANADIAN_PROVINCES,
  },
};
export const ABSTRACTS_OBJECT_TEMPLATE_SETTINGS = {
  issue_date: {
    key: "issue_date",
    name: "Issue Date",
    type: "date",
    // maxDate: 0,
  },
};
export const TDG_CARDS_OBJECT_TEMPLATE_SETTINGS = {
  expiry_date: {
    key: "expiry_date",
    name: "Expiry Date",
    type: "date",
    // minDate: -5,
  },
};
export const GTG_CARDS_OBJECT_TEMPLATE_SETTINGS = {
  issue_date: {
    key: "issue_date",
    name: "Issue Date",
    type: "date",
    // maxDate: 0,
  },
  expiry_date: {
    key: "expiry_date",
    name: "Expiry Date",
    type: "date",
    // minDate: -5,
  },
};
export const LCV_CERT_OBJECT_TEMPLATE_SETTINGS = {
  expiry_date: {
    key: "expiry_date",
    name: "Expiry Date",
    type: "date",
    // minDate: -5,
  },
};
export const LCV_LICENSES_OBJECT_TEMPLATE_SETTINGS = {
  expiry_date: {
    key: "expiry_date",
    name: "Expiry Date",
    type: "date",
    // minDate: -5,
  },
};
export const VIOLATIONS_CERT_OBJECT_TEMPLATE_SETTINGS = {
  issue_date: {
    key: "issue_date",
    name: "Issue Date",
    type: "date",
    // maxDate: 0,
  },
  comment: {
    key: "comment",
    name: "Comment",
    type: "text",
  },
};
export const ANNUAL_PERFORMANCE_REVIEW_OBJECT_TEMPLATE_SETTINGS = {
  date_of_review: {
    key: "date_of_review",
    name: "Date of Review",
    type: "date",
  },
};
export const WINTER_COURSES_OBJECT_TEMPLATE_SETTINGS = {
  date_of_completion: {
    key: "date_of_completion",
    name: "Date of Completion",
    type: "date",
  },
};
export const REFERENCE_CHECKS_OBJECT_TEMPLATE_SETTINGS = {
  company: {
    key: "company",
    name: "Company",
    type: "text",
  },
};
export const WCB_CONTACT_OBJECT_TEMPLATE_SETTINGS = {
  wcbcontact_name: {
    key: "wcbcontact_name",
    name: "WCB Contact Name",
    type: "text",
  },
  wcbcontact_phone: {
    key: "wcbcontact_phone",
    name: "WCB Contact Phone",
    type: "phone",
  },
  wcbcontact_email: {
    key: "wcbcontact_email",
    name: "WCB Contact Email",
    type: "email",
  },
};

export const ADD_NEW_EMPLOYEE_ADJUSTMENT_SETTINGS = {
  hours: {
    key: "hours",
    name: "Hours",
    type: "text",
    mandatory: true,
  },
  comment: {
    key: "comment",
    name: "Comment",
    type: "text",
    mandatory: true,
  },
};

export const WCB_OBJECT_TEMPLATE_SETTINGS = {
  claim_number: {
    key: "claim_number",
    name: "4Tracks Claim Number",
    type: "text",
    mandatory: true,
  },
  wcb_claim_number: {
    key: "wcb_claim_number",
    name: "WCB Claim Number",
    type: "text",
    mandatory: false,
  },
  assigned_to: {
    key: "assigned_to",
    name: "Assigned to",
    type: "text",
    mandatory: true,
  },
  status: {
    key: "status",
    name: "Status",
    type: "selector",
    setDefault: "true",
    data: WCB_STATUS_CHOICES,
    mandatory: true,
  },
  date_time: {
    key: "date_time",
    name: "Date and Time",
    type: "date-time",
    mandatory: true,
  },
  location: {
    key: "location",
    name: "Location",
    type: "text",
    mandatory: true,
  },
  province: {
    key: "province",
    name: "Province",
    type: "selector",
    setDefault: "true",
    data: TERMINAL_CHOICES,
    mandatory: false,
  },
  gps_coordinates: {
    key: "gps_coordinates",
    name: "GPS Coordinates",
    type: "gps",
    mandatory: false,
    disabled: true,
  },
  incident_details: {
    key: "incident_details",
    name: "Incident Details",
    type: "text",
    mandatory: true,
  },
  reported_to_doctor: {
    key: "reported_to_doctor",
    name: "Reported to Doctor",
    type: "selector",
    data: TRUE_FALSE_CHOICES,
    setDefault: true,
    mandatory: true,
  },
  first_contact_after_injury: {
    key: "first_contact_after_injury",
    name: "First Contact After Injury",
    type: "text",
    mandatory: true,
  },
  wcbcontact_name: {
    key: "wcbcontact_name",
    name: "WCB Contact Name",
    type: "text",
    mandatory: false,
  },
  wcbcontact_email: {
    key: "wcbcontact_email",
    name: "WCB Contact Email",
    type: "email",
    mandatory: false,
  },
  wcbcontact_phone: {
    key: "wcbcontact_phone",
    name: "WCB Contact Phone",
    type: "phone",
    mandatory: false,
  },
  select_driver_employee: {
    key: "select_driver_employee",
    name: "Choose Driver/Employee",
    type: "radio",
    data: DRIVER_EMPLOYEE_CHOICES,
    setDefault: true,
  },
  main_driver_id: {
    key: "main_driver_id",
    name: "Driver",
    type: "selector-context",
    contextValues: "driver",
    mandatory: true,
  },
  main_employee_id: {
    key: "main_employee_id",
    name: "Employee",
    type: "selector-context",
    contextValues: "employee",
    mandatory: true,
  },
  report: {
    key: "report",
    name: "Driver Report #",
    type: "selector-context",
    contextValues: "driverReportsList",
    mandatory: false,
  },
  remarks: {
    key: "remarks",
    name: "Remarks",
    type: "textarea",
    mandatory: false,
  },
};

export const CREATE_OBJECT_API_ENDPOINT_MAPPING = {
  driver: "/api/get-drivers",
  truck: "/api/get-trucks",
  equipment: "/api/get-equipment",
  incident: "/api/get-incidents",
  claim_mpi: "/api/get-claims",
  claim_ll: "/api/get-claims",
  claim_tp: "/api/get-claims",
  claim_mpi_e: "/api/get-claims",
  claim_ll_e: "/api/get-claims",
  claim_tp_e: "/api/get-claims",
  violation: "/api/get-violations",
  lawyer: "/api/get-violations",
  indicate_violations: "/api/get-violations",
  inspection: "/api/get-inspections",
  ticket: "/api/get-tickets",
  road_tests: "/api/update-file",
  log_books: "/api/update-file",
  sin: "/api/update-file",
  immigration_doc: "/api/update-file",
  incorp_docs: "/api/update-file",
  gst_docs: "/api/update-file",
  pdic_certificates: "/api/update-file",
  tax_papers: "/api/update-file",
  driver_statements: "/api/update-file",
  other_documents: "/api/update-file",
  licenses: "/api/update-file",
  abstracts: "/api/update-file",
  tdg_cards: "/api/update-file",
  good_to_go_cards: "/api/update-file",
  lcv_certificates: "/api/update-file",
  lcv_licenses: "/api/update-file",
  certificates_of_violations: "/api/update-file",
  annual_performance_reviews: "/api/update-file",
  winter_courses: "/api/update-file",
  reference_checks: "/api/update-file",
  employee: "/api/update-employee",
  employee_employee_photo: "/api/update-file-employee",
  employee_licenses: "/api/update-file-employee",
  employee_immigration_doc: "/api/update-file-employee",
  employee_sin: "/api/update-file-employee",
  employee_void_check: "/api/update-file-employee",
  employee_passports: "/api/update-file-employee",
  employee_us_visas: "/api/update-file-employee",
  employee_consents: "/api/update-file-employee",
  employee_employment_contracts: "/api/update-file-employee",
  employee_abstract_request_forms: "/api/update-file-employee",
  employee_employee_memos: "/api/update-file-employee",
  employee_tax_papers: "/api/update-file-employee",
  employee_other_documents: "/api/update-file-employee",
  employee_id_documents: "/api/update-file-employee",
  employee_activity_history: "/api/update-file-employee",
  employee_employee_resumes: "/api/update-file-employee",
  wcb_contact: "/api/get-wcb-claims",
  wcb: "/api/get-wcb-claims",
  employee_adjustment: "/api/get-adjustments-data",
};

export const CREATE_OBJECT_TEMPLATE_MAPPING = {
  driver: CREATE_DRIVER_TEMPLATE_FIELDS,
  truck: CREATE_TRUCK_TEMPLATE_FIELDS,
  equipment: CREATE_EQUIPMENT_TEMPLATE_FIELDS,
  incident: CREATE_INCIDENT_TEMPLATE_FIELDS,
  claim_mpi: CREATE_CLAIM_MPI_TEMPLATE_FIELDS,
  claim_ll: CREATE_CLAIM_LL_TEMPLATE_FIELDS,
  claim_tp: CREATE_CLAIM_TP_TEMPLATE_FIELDS,
  claim_mpi_e: CREATE_CLAIM_MPI_TEMPLATE_FIELDS,
  claim_ll_e: CREATE_CLAIM_LL_TEMPLATE_FIELDS,
  claim_tp_e: CREATE_CLAIM_TP_TEMPLATE_FIELDS,
  violation: CREATE_VIOLATION_TEMPLATE_FIELDS,
  lawyer: CREATE_LAWYER_DATA_TEMPLATE_FIELDS,
  inspection: CREATE_INSPECTION_DATA_TEMPLATE_FIELDS,
  ticket: CREATE_TICKET_DATA_TEMPLATE_FIELDS,
  indicate_violations: INDICATE_VIOLATIONS_TEMPLATE_FIELDS,
  road_tests: ROAD_TESTS_OBJECT_TEMPLATE_FIELDS,
  log_books: LOG_BOOKS_OBJECT_TEMPLATE_FIELDS,
  sin: SIN_OBJECT_TEMPLATE_FIELDS,
  immigration_doc: IMMIGRATION_DOCS_OBJECT_TEMPLATE_FIELDS,
  incorp_docs: INCORP_DOCS_OBJECT_TEMPLATE_FIELDS,
  gst_docs: GST_DOCS_OBJECT_TEMPLATE_FIELDS,
  pdic_certificates: PDIC_CERT_OBJECT_TEMPLATE_FIELDS,
  tax_papers: TAX_PAPERS_OBJECT_TEMPLATE_FIELDS,
  driver_statements: DRIVER_STATEMENTS_OBJECT_TEMPLATE_FIELDS,
  other_documents: OTHER_DOCUMENTS_OBJECT_TEMPLATE_FIELDS,
  licenses: LICENSES_OBJECT_TEMPLATE_FIELDS,
  abstracts: ABSTRACTS_OBJECT_TEMPLATE_FIELDS,
  tdg_cards: TDG_CARDS_OBJECT_TEMPLATE_FIELDS,
  good_to_go_cards: GTG_CARDS_OBJECT_TEMPLATE_FIELDS,
  lcv_certificates: LCV_CERT_OBJECT_TEMPLATE_FIELDS,
  lcv_licenses: LCV_LICENSES_OBJECT_TEMPLATE_FIELDS,
  certificates_of_violations: VIOLATIONS_CERT_OBJECT_TEMPLATE_FIELDS,
  annual_performance_reviews: ANNUAL_PERFORMANCE_REVIEW_OBJECT_TEMPLATE_FIELDS,
  winter_courses: WINTER_COURSES_OBJECT_TEMPLATE_FIELDS,
  reference_checks: REFERENCE_CHECKS_OBJECT_TEMPLATE_FIELDS,
  employee: CREATE_EMPLOYEE_TEMPLATE_FIELDS,
  employee_sin: SIN_OBJECT_TEMPLATE_FIELDS,
  employee_immigration_doc: IMMIGRATION_DOCS_OBJECT_TEMPLATE_FIELDS,
  employee_tax_papers: TAX_PAPERS_OBJECT_TEMPLATE_FIELDS,
  employee_other_documents: OTHER_DOCUMENTS_OBJECT_TEMPLATE_FIELDS,
  employee_licenses: LICENSES_OBJECT_TEMPLATE_FIELDS,
  wcb_contact: WCB_CONTACT_OBJECT_TEMPLATE_FIELDS,
  wcb: WCB_OBJECT_TEMPLATE_FIELDS,
  employee_adjustment: ADD_NEW_EMPLOYEE_ADJUSTMENT_FIELDS,
};

export const OBJECT_TEMPLATE_SETTINGS_MAPPING = {
  driver: CREATE_DRIVER_TEMPLATE_SETTINGS,
  truck: CREATE_TRUCK_TEMPLATE_SETTINGS,
  equipment: CREATE_EQUIPMENT_TEMPLATE_SETTINGS,
  incident: CREATE_INCIDENT_TEMPLATE_SETTINGS,
  claim_mpi: CREATE_CLAIM_MPI_TEMPLATE_SETTINGS,
  claim_ll: CREATE_CLAIM_LL_TEMPLATE_SETTINGS,
  claim_tp: CREATE_CLAIM_TP_TEMPLATE_SETTINGS,
  claim_mpi_e: EDIT_CLAIM_MPI_TEMPLATE_SETTINGS,
  claim_ll_e: EDIT_CLAIM_LL_TEMPLATE_SETTINGS,
  claim_tp_e: EDIT_CLAIM_TP_TEMPLATE_SETTINGS,
  violation: CREATE_VIOLATION_TEMPLATE_SETTINGS,
  lawyer: CREATE_LAWYER_DATA_TEMPLATE_SETTINGS,
  inspection: CREATE_INSPECTION_TEMPLATE_SETTINGS,
  ticket: CREATE_TICKET_TEMPLATE_SETTINGS,
  indicate_violations: INDICATE_VIOLATIONS_TEMPLATE_SETTINGS,
  road_tests: ROAD_TESTS_OBJECT_TEMPLATE_SETTINGS,
  log_books: LOG_BOOKS_OBJECT_TEMPLATE_SETTINGS,
  sin: SIN_OBJECT_TEMPLATE_SETTINGS,
  immigration_doc: IMMIGRATION_DOCS_OBJECT_TEMPLATE_SETTINGS,
  incorp_docs: INCORP_DOCS_OBJECT_TEMPLATE_SETTINGS,
  gst_docs: GST_DOCS_OBJECT_TEMPLATE_SETTINGS,
  pdic_certificates: PDIC_CERT_OBJECT_TEMPLATE_SETTINGS,
  tax_papers: TAX_PAPERS_OBJECT_TEMPLATE_SETTINGS,
  driver_statements: DRIVER_STATEMENTS_OBJECT_TEMPLATE_SETTINGS,
  other_documents: OTHER_DOCUMENTS_OBJECT_TEMPLATE_SETTINGS,
  licenses: LICENSES_OBJECT_TEMPLATE_SETTINGS,
  abstracts: ABSTRACTS_OBJECT_TEMPLATE_SETTINGS,
  tdg_cards: TDG_CARDS_OBJECT_TEMPLATE_SETTINGS,
  good_to_go_cards: GTG_CARDS_OBJECT_TEMPLATE_SETTINGS,
  lcv_certificates: LCV_CERT_OBJECT_TEMPLATE_SETTINGS,
  lcv_licenses: LCV_LICENSES_OBJECT_TEMPLATE_SETTINGS,
  certificates_of_violations: VIOLATIONS_CERT_OBJECT_TEMPLATE_SETTINGS,
  annual_performance_reviews:
    ANNUAL_PERFORMANCE_REVIEW_OBJECT_TEMPLATE_SETTINGS,
  winter_courses: WINTER_COURSES_OBJECT_TEMPLATE_SETTINGS,
  reference_checks: REFERENCE_CHECKS_OBJECT_TEMPLATE_SETTINGS,
  employee: CREATE_EMPLOYEE_TEMPLATE_SETTINGS,
  employee_sin: SIN_OBJECT_TEMPLATE_SETTINGS,
  employee_immigration_doc: IMMIGRATION_DOCS_OBJECT_TEMPLATE_SETTINGS,
  employee_tax_papers: TAX_PAPERS_OBJECT_TEMPLATE_SETTINGS,
  employee_other_documents: OTHER_DOCUMENTS_OBJECT_TEMPLATE_SETTINGS,
  employee_licenses: LICENSES_OBJECT_TEMPLATE_SETTINGS,
  wcb_contact: WCB_CONTACT_OBJECT_TEMPLATE_SETTINGS,
  wcb: WCB_OBJECT_TEMPLATE_SETTINGS,
  employee_adjustment: ADD_NEW_EMPLOYEE_ADJUSTMENT_SETTINGS,
};
