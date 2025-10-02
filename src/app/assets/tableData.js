export const ACTIVITY_CHOICES = {
  EMPLOYED: "Employed",
  UNEMPLOYED: "Unemployed",
  SCHOOLING: "Schooling",
  MILITARY: "Military Service",
};

export const CANADIAN_PROVINCES = {
  AB: "Alberta",
  BC: "British Columbia",
  MB: "Manitoba",
  NB: "New Brunswick",
  NL: "Newfoundland and Labrador",
  NT: "Northwest Territories",
  NS: "Nova Scotia",
  NU: "Nunavut",
  ON: "Ontario",
  PE: "Prince Edward Island",
  QC: "Quebec",
  SK: "Saskatchewan",
  YT: "Yukon",
};

export const USA_STATES = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
};

export const COUNTRIES = {
  CANADA: "CANADA",
  USA: "USA",
};

export const IMMIGRATION_STATUS = {
  "": "",
  LMIA: "LMIA",
  OWP: "Open WP",
  PR: "Permanent Resident",
  CIT: "Citizen",
  CWP: "Closed WP",
  SINP: "SINP",
  AWP: "Applied for WP",
};

export const STATUS_CHOICES = {
  NW: "New",
  AR: "Application Received",
  RO: "Ready for Orientation",
  TR: "Trainee",
  AC: "Active",
  VA: "Vacation",
  WCB: "WCB",
  OL: "On Leave",
  SP: "Suspended",
  TE: "Terminated",
  RE: "Resigned",
  OH: "Application on Hold",
  UR: "Under Review",
  RJ: "Rejected",
};

export const UPDATE_STATUS_CHOICES = {
  UR: "Update Required from Driver",
  TR: "To be Reviewed by Safety",
  OK: "No pending changes",
};

export const UPDATE_STATUS_CHOICES_EMPLOYEE = {
  UR: "Update Required from Employee",
  TR: "To be Reviewed by Payroll",
  OK: "No pending changes",
};

export const ROWS_PER_PAGE = {
  10: "10",
  30: "30",
  50: "50",
  100: "100",
};

export const TERMINAL_CHOICES = {
  NA: "N/A",
  SK: "SK",
  MB: "MB",
  ON: "ON",
  AB: "AB",
};

export const TERMINAL_CHOICES_DISPATCH = {
  MB: "MB",
  SK: "SK",
  ON: "ON",
  AB: "AB",
};

export const DRIVERTYPE_CHOICES = {
  CP: "Company Driver",
  OO: "Owner Operator",
  OD: "O/O Driver",
};

export const DRIVER_RATES = {
  ca_single: "",
  ca_team: "",
  us_team: "",
  city: "",
  lcv_single: "",
  lcv_team: "",
};

export const REPORTS_TYPES = {
  GB: "Garbage",
  DM: "Damage",
  OT: "Accident",
  SA: "Safety",
  TK: "Ticket",
  IS: "Issue",
  IJ: "Injury",
};

export const VEHICLE_TYPE_CHOICES = {
  CI: "CITY",
  HW: "HWY",
  PU: "PICKUP",
  ST: "SERVICE TRUCK",
  SH: "SHUNT",
  C5: "CITY 5Ton",
  SV: "SERVICE VAN",
};

export const OWNEDBY_CHOICES_TRUCKS = {
  CT: "Company",
  OO: "Owner Operator",
};

export const OWNEDBY_CHOICES_EQUIPMENT = {
  CT: "Company",
  LB: "Loblaw",
  RN: "Rental",
};

export const TRUCK_STATUS_CHOICES = {
  NW: "New",
  AC: "Active",
  SL: "Sold",
  TL: "Total Loss",
  OS: "Out of Service",
  LE: "Left 4Tracks",
};

export const EQUIPMENT_STATUS_CHOICES = {
  NW: "New",
  AC: "Active",
  SL: "Sold",
  TL: "Total Loss",
  OS: "Out of Service",
  LE: "Left 4Tracks",
};

export const EQUIPMENT_TYPE_CHOICES = {
  DV: "53ft Dry Van",
  RE: "53ft Reefer",
  CH: "53ft Chassis/Container",
  CV: "Convereter",
};

export const AXLE_CHOICES = {
  TR: "Triaxle",
  TD: "Tandem",
};

export const INCIDENT_STATUS_CHOICES = {
  OP: "Open",
  CL: "Closed",
};

export const VIOLATION_STATUS_CHOICES = {
  OP: "Open",
  CL: "Closed",
};

export const WCB_STATUS_CHOICES = {
  OP: "Open",
  CL: "Closed",
};

export const CLAIM_STATUS_CHOICES = {
  OP: "Open",
  AP: "Approved",
  RJ: "Rejected",
};

export const CLAIM_TO_CHOICES = {
  MPI: "MPI",
  LL: "Loblaw",
  TP: "Third Party",
};

export const TRUE_FALSE_CHOICES = {
  false: "No",
  true: "Yes",
};

export const QUARTERS = {
  1: "Q1",
  2: "Q2",
  3: "Q3",
  4: "Q4",
};

export const VIOLATION_RESULT_CHOICES = {
  NR: "No Result Yet",
  DS: "Dismissed - Ticket dropped",
  RD: "Penalty reduced",
  CV: "Convicted - Found guilty",
  AC: "Acquitted - Found not guilty",
  DF: "Deferred - Judgment postponed",
};

export const INSPECTION_RESULT_CHOICES = {
  PASS: "Passed",
  FAIL: "Failed",
  OOS: "Out of Service",
};

export const TICKET_GIVEN_TO_CHOICES = {
  DR: "Driver",
  CO: "Company",
};

export const ROUTES_CHOICES = {
  1: "CA HWY",
  2: "USA",
  3: "City",
  4: "Regional",
};

export const DRIVER_EMPLOYEE_CHOICES = {
  DR: "Driver",
  EM: "Employee",
};

export const OBJECT_TYPES = {
  driver: "Driver",
  truck: "Truck",
  equipment: "Equipment",
  incident: "Incident",
  claim_mpi: "MPI Claim",
  claim_ll: "Loblaw Claim",
  claim_tp: "Third Party Info",
  claim_mpi_e: "MPI Claim",
  claim_ll_e: "Loblaw Claim",
  claim_tp_e: "Third Party Info",
  violation: "Violation",
  lawyer: "Lawyer Data",
  inspection: "Inspection Data",
  ticket: "Ticket",
  road_tests: "Road Tests",
  log_books: "Log Books",
  sin: "SIN",
  immigration_doc: "Immigration Docs",
  incorp_docs: "Incorporation Docs",
  gst_docs: "GST Docs",
  pdic_certificates: "PDIC Certificates",
  tax_papers: "Tax Papers",
  driver_statements: "Driver Statements",
  other_documents: "Other Documents",
  licenses: "Licenses",
  abstracts: "Abstracts",
  tdg_cards: "TDG Cards",
  good_to_go_cards: "Good to go Cards",
  lcv_certificates: "LCV Certificates",
  lcv_licenses: "LCV Licenses",
  certificates_of_violations: "Certificates of Violations",
  annual_performance_reviews: "Annual Performance Reviews",
  winter_courses: "Winter Courses",
  reference_checks: "Reference Checks",
  employee: "Employee",
  employee_sin: "SIN",
  employee_immigration_doc: "Immigration Docs",
  employee_tax_papers: "Tax Papers",
  employee_other_documents: "Other Documents",
  employee_licenses: "Licenses",
  wcb: "WCB Claim",
  wcb_contact: "WCB Contact Info",
  employee_adjustment: "Adjustment",
};

export const DEPARTMENT_CHOICES = {
  NA: "N/A",
  POD: "POD",
  DIS: "Dispatch",
  SAF: "Safety",
  REC: "Recruiting",
  PAY: "Payroll",
  AR: "Accounts Receivable",
  AP: "Accounts Payable",
  MGT: "Management",
  LOG: "Logistics",
  SHP: "Shop",
  WAR: "Warehouse",
  IT: "IT Dept",
};

export const RECRUITING_CHECKLIST = {
  licenses: {
    file: true,
    name: "Driver Licenses",
    key: "licenses",
    optional: false,
  },
  abstracts: {
    file: true,
    name: "Abstracts",
    key: "abstracts",
    optional: false,
  },
  immigration_doc: {
    file: true,
    name: "Immigration Docs",
    key: "immigration_doc",
    optional: false,
  },
  criminal_records: {
    file: true,
    name: "Criminal Records",
    key: "criminal_records",
    optional: false,
  },
  log_books: {
    file: true,
    name: "Log Books from Previous Employment",
    key: "log_books",
    optional: false,
  },
  activity_history: {
    file: false,
    name: "Activity History",
    key: "activity_history",
    optional: false,
  },
  driver_background: {
    file: false,
    name: "Driver Background",
    key: "driver_background",
    optional: false,
  },
  sin: {
    file: true,
    name: "SIN",
    key: "sin",
    optional: false,
  },
  void_check: {
    file: true,
    name: "Void Check",
    key: "void_check",
    optional: false,
  },
  passports: {
    file: true,
    name: "Passports",
    key: "passports",
    optional: false,
  },
  us_visas: {
    file: true,
    name: "US Visas",
    key: "us_visas",
    optional: false,
  },
  incorp_docs: {
    file: true,
    name: "Incorp Docs",
    key: "incorp_docs",
    optional: false,
  },
  gst_docs: {
    file: true,
    name: "GST Docs",
    key: "gst_docs",
    optional: false,
  },
  consents: {
    file: true,
    name: "Consent to Personal Investigation",
    key: "consents",
    optional: false,
  },
  reference_checks: {
    file: true,
    name: "Reference Checks",
    key: "reference_checks",
    optional: false,
  },
  driver_prescreenings: {
    file: true,
    name: "Driver Pre-screenings",
    key: "driver_prescreenings",
    optional: false,
  },
  driver_rates: {
    file: false,
    name: "Driver Rates",
    key: "driver_rates",
    optional: false,
  },
  knowledge_tests: {
    file: true,
    name: "Knowledge Test",
    key: "knowledge_tests",
    optional: false,
  },
  road_tests: {
    file: true,
    name: "Road Test",
    key: "road_tests",
    optional: false,
  },
  prehire_quizes: {
    file: true,
    name: "Pre-hire quizzes",
    key: "prehire_quizes",
    optional: false,
  },
  employment_contracts: {
    file: true,
    name: "Employment Contract",
    key: "employment_contracts",
    optional: false,
  },
};

export const SAFETY_CHECKLIST = {
  tdg_cards: {
    file: true,
    name: "TDG Card",
    key: "tdg_cards",
    optional: false,
  },
  good_to_go_cards: {
    file: true,
    name: "GTG Cards",
    key: "good_to_go_cards",
    optional: false,
  },
  lcv_certificates: {
    file: true,
    name: "LCV certificate",
    key: "lcv_certificates",
    optional: false,
  },
  lcv_licenses: {
    file: true,
    name: "LCV license",
    key: "lcv_licenses",
    optional: false,
  },
  abstract_request_forms: {
    file: true,
    name: "Abstract Request Form",
    key: "abstract_request_forms",
    optional: false,
  },
  driver_memos: {
    file: true,
    name: "Driver Memos",
    key: "driver_memos",
    optional: false,
  },
  gtg_quizes: {
    file: true,
    name: "GTG Quiz",
    key: "gtg_quizes",
    optional: false,
  },
  tax_papers: {
    file: true,
    name: "Tax Papers",
    key: "tax_papers",
    optional: false,
  },
  mentor_forms: {
    //MANDATORY FOR ACTIVE, OPTIONAL FOR TRAINEE
    file: true,
    name: "Mentor Form",
    key: "mentor_forms",
    optional: false,
  },
  // OPTIONAL PARAMETERS FOR TRAINEE/ACTIVE BUTTONS
  ctpat_papers: {
    file: true,
    name: "CTPAT Memo",
    key: "ctpat_papers",
    optional: true,
  },
  ctpat_quiz: {
    file: true,
    name: "CTPAT Quiz",
    key: "ctpat_quiz",
    optional: true,
  },
  winter_courses: {
    file: true,
    name: "Winter Courses",
    key: "winter_courses",
    optional: true,
  },
  annual_performance_reviews: {
    file: true,
    name: "Annual Performance Review",
    key: "annual_performance_reviews",
    optional: true,
  },
  certificates_of_violations: {
    file: true,
    name: "Certificates of Violations",
    key: "certificates_of_violations",
    optional: true,
  },
  pdic_certificates: {
    file: true,
    name: "PDIC Certificate",
    key: "pdic_certificates",
    optional: true,
  },
  driver_statements: {
    file: true,
    name: "Driver Statements",
    key: "driver_statements",
    optional: true,
  },
  other_documents: {
    file: true,
    name: "Other Documents",
    key: "other_documents",
    optional: true,
  },
};

export const EMPLOYEE_COMMON_CHECKLIST = {
  id_documents: {
    file: true,
    name: "ID Documents",
    key: "id_documents",
    optional: false,
  },
  immigration_doc: {
    file: true,
    name: "Immigration Docs",
    key: "immigration_doc",
    optional: false,
  },
  activity_history: {
    file: false,
    name: "Activity History",
    key: "activity_history",
    optional: false,
  },
  sin: {
    file: true,
    name: "SIN",
    key: "sin",
    optional: false,
  },
  void_check: {
    file: true,
    name: "Void Check",
    key: "void_check",
    optional: false,
  },
  employee_memos: {
    file: true,
    name: "Employee Memos",
    key: "employee_memos",
    optional: false,
  },
  tax_papers: {
    file: true,
    name: "Tax Papers",
    key: "tax_papers",
    optional: false,
  },
  employee_ctpat_papers: {
    file: true,
    name: "CTPAT Papers",
    key: "employee_ctpat_papers",
    optional: true,
  },
  consents: {
    file: true,
    name: "Consent to Personal Investigation",
    key: "consents",
    optional: true,
  },
  employment_contracts: {
    file: true,
    name: "Employment Contract",
    key: "employment_contracts",
    optional: true,
  },
  passports: {
    file: true,
    name: "Passports",
    key: "passports",
    optional: true,
  },
  us_visas: {
    file: true,
    name: "US Visas",
    key: "us_visas",
    optional: true,
  },
  employee_resumes: {
    file: true,
    name: "Resumes",
    key: "employee_resumes",
    optional: true,
  },
  other_documents: {
    file: true,
    name: "Other Documents",
    key: "other_documents",
    optional: true,
  },
};

export const DRIVER_CARD_INFO_FIELDS_FOR_CHANGE = {
  status: "",
  update_status: "",
  update_status_message: "",
  date_of_leaving: "",
  reason_for_leaving: "",
  status_note: "",
  work_for_driver: "",
};

export const TRUCK_CARD_INFO_FIELDS_FOR_CHANGE = {
  status: "",
  update_status: "",
  driver: "",
};

export const EQUIPMENT_CARD_INFO_FIELDS_FOR_CHANGE = {
  status: "",
  update_status: "",
};

export const INCIDENT_CARD_INFO_FIELDS_FOR_CHANGE = {
  status: "",
  analysis: "",
};

export const VIOLATION_CARD_INFO_FIELDS_FOR_CHANGE = {
  status: "",
  has_ticket: "",
  has_inspection: "",
  has_lawyer: "",
};

export const WCB_CARD_INFO_FIELDS_FOR_CHANGE = {
  status: "",
  remarks: "",
};

export const EMPLOYEE_CARD_INFO_FIELDS_FOR_CHANGE = {
  status: "",
  update_status: "",
  update_status_message: "",
  date_of_leaving: "",
  reason_for_leaving: "",
  status_note: "",
};

export const TABLE_STATUS_FILTERS = {
  recruiting: ["NW", "AR", "RO", "UR", "OH", "RJ"],
  active_drivers: ["TR", "AC", "VA", "WCB", "OL", "SP", "TE", "RE"],
  driver_reports: ["GB", "DM", "OT", "SA", "TK", "IS", "IJ"],
  trucks: ["NW", "AC", "SL", "TL", "OS", "LE"],
  equipment: ["NW", "AC", "SL", "TL", "OS", "LE"],
  office_employees: [
    "NW",
    "AR",
    "RO",
    "UR",
    "OH",
    "RJ",
    "TR",
    "AC",
    "VA",
    "WCB",
    "OL",
    "SP",
    "TE",
    "RE",
  ],
};

export const TRUCK_CHECKLIST = {
  truck_license_plates: {
    file: false,
    name: "License Plate",
    key: "truck_license_plates",
    optional: false,
  },
  truck_safety_docs: {
    file: true,
    name: "Safety",
    key: "truck_safety_docs",
    optional: false,
  },
  truck_registration_docs: {
    file: true,
    name: "Registration",
    key: "truck_registration_docs",
    optional: false,
  },
  truck_bill_of_sales: {
    file: true,
    name: "Bill Of Sales",
    key: "truck_bill_of_sales",
    optional: false,
  },
  truck_other_documents: {
    file: true,
    name: "Other Docs",
    key: "truck_other_documents",
    optional: true,
  },
};

export const EQUIPMENT_CHECKLIST = {
  equipment_license_plates: {
    file: false,
    name: "License Plate",
    key: "equipment_license_plates",
    optional: false,
  },
  equipment_safety_docs: {
    file: true,
    name: "Safety",
    key: "equipment_safety_docs",
    optional: false,
  },
  equipment_registration_docs: {
    file: true,
    name: "Registration",
    key: "equipment_registration_docs",
    optional: false,
  },
  equipment_bill_of_sales: {
    file: true,
    name: "Bill Of Sales",
    key: "equipment_bill_of_sales",
    optional: false,
  },
  equipment_other_documents: {
    file: true,
    name: "Other Docs",
    key: "equipment_other_documents",
    optional: true,
  },
};

export const CLAIM_TYPE_MAPPING = {
  TRK: "Truck",
  TR1: "Trailer 1",
  TR2: "Trailer 2",
  CR1: "Cargo 1",
  CR2: "Cargo 2",
  CVR: "Converter",
};

export const INCIDENT_CHECKLIST = {
  incident_documents: {
    file: true,
    name: "Documents",
    key: "incident_documents",
    optional: false,
  },
  claim_documents: {
    file: true,
    name: "Claim Documents",
    key: "claim_documents",
    optional: false,
  },
};

export const FUEL_REPORT_TYPES = {
  "": "Choose fuel report type",
  "Petro-Canada": "Petro-Canada",
  BVD: "BVD",
  FlyingJ: "FlyingJ",
  Yard: "Yard",
};

export const GO_TO_TABLE_LINKS_FUEL_REPORT = [
  { type: "fuel-report-quarterly", name: "Quarterly Summary" },
];

export const GO_TO_TABLE_LINKS_FUEL_REPORT_QUARTERLY = [
  { type: "fuel-report", name: "Fuel Report" },
];

export const VIOLATIONS_CHECKLIST = {
  violation_documents: {
    file: true,
    name: "Documents",
    key: "violation_documents",
    optional: false,
  },
  inspection_documents: {
    file: true,
    name: "Documents",
    key: "inspection_documents",
    optional: false,
  },
  ticket_documents: {
    file: true,
    name: "Documents",
    key: "ticket_documents",
    optional: false,
  },
};

export const VIOLATION_TYPE_MAPPING = {
  inspection: "Inspection",
  ticket: "Ticket",
};

export const WCB_CHECKLIST = {
  wcbclaim_documents: {
    file: true,
    name: "Documents",
    key: "wcbclaim_documents",
    optional: false,
  },
};

export const TABLES_PRE_FILTERS = {
  default_filters: { items: [] },
  recruiting: {
    items: [
      { id: 1, field: "status", operator: "doesNotEqual", value: "Rejected" },
      {
        id: 2,
        field: "status",
        operator: "doesNotEqual",
        value: "Application on Hold",
      },
    ],
  },
  active_drivers: {
    items: [
      { id: 1, field: "status", operator: "doesNotEqual", value: "Terminated" },
      { id: 2, field: "status", operator: "doesNotEqual", value: "Resigned" },
    ],
  },
  trucks: {
    items: [
      {
        id: 1,
        field: "status",
        operator: "doesNotEqual",
        value: "Left 4Tracks",
      },
    ],
  },
  equipment: {
    items: [
      {
        id: 1,
        field: "status",
        operator: "doesNotEqual",
        value: "Left 4Tracks",
      },
    ],
  },
  office_employees: {
    items: [
      { id: 1, field: "status", operator: "doesNotEqual", value: "Terminated" },
      { id: 2, field: "status", operator: "doesNotEqual", value: "Resigned" },
      { id: 3, field: "status", operator: "doesNotEqual", value: "Rejected" },
      {
        id: 4,
        field: "status",
        operator: "doesNotEqual",
        value: "Application on Hold",
      },
    ],
  },
};

export const WEEK_DAYS = {
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
  sun: 0,
};
