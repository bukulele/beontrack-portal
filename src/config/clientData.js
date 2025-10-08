/**
 * Client-Specific Data Configurations
 *
 * This file contains all client-specific data like option lists, validation rules, etc.
 * This data is used across the entire application, not just in file uploaders.
 * This is the ONLY file that should be modified for different clients.
 *
 * Imported from: /src/app/assets/tableData.js
 */

/**
 * Common validation rules specific to this client
 */
export const VALIDATION_RULES = {
  // SIN (Social Insurance Number) - 9 digits
  SIN: {
    pattern: /^\d{9}$/,
    minLength: 9,
    maxLength: 9,
    errorMessage: 'SIN must be exactly 9 digits',
  },

  // Canadian Postal Code
  POSTAL_CODE_CA: {
    pattern: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
    errorMessage: 'Invalid Canadian postal code',
  },

  // US Zip Code
  ZIP_CODE_US: {
    pattern: /^\d{5}(-\d{4})?$/,
    errorMessage: 'Invalid US zip code',
  },

  // License Plate
  LICENSE_PLATE: {
    pattern: /^[A-Z0-9\-\s]{1,10}$/i,
    minLength: 1,
    maxLength: 10,
    errorMessage: 'Invalid license plate',
  },

  // Alphanumeric only
  ALPHANUMERIC: {
    pattern: /^[A-Za-z0-9\s]+$/,
    errorMessage: 'Only letters and numbers allowed',
  },
};

/**
 * Option lists for select/dropdown fields
 */
export const OPTION_LISTS = {
  // Geographic options
  CANADIAN_PROVINCES: [
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

  USA_STATES: [
    { value: 'AL', label: 'Alabama' },
    { value: 'AK', label: 'Alaska' },
    { value: 'AZ', label: 'Arizona' },
    { value: 'AR', label: 'Arkansas' },
    { value: 'CA', label: 'California' },
    { value: 'CO', label: 'Colorado' },
    { value: 'CT', label: 'Connecticut' },
    { value: 'DE', label: 'Delaware' },
    { value: 'FL', label: 'Florida' },
    { value: 'GA', label: 'Georgia' },
    { value: 'HI', label: 'Hawaii' },
    { value: 'ID', label: 'Idaho' },
    { value: 'IL', label: 'Illinois' },
    { value: 'IN', label: 'Indiana' },
    { value: 'IA', label: 'Iowa' },
    { value: 'KS', label: 'Kansas' },
    { value: 'KY', label: 'Kentucky' },
    { value: 'LA', label: 'Louisiana' },
    { value: 'ME', label: 'Maine' },
    { value: 'MD', label: 'Maryland' },
    { value: 'MA', label: 'Massachusetts' },
    { value: 'MI', label: 'Michigan' },
    { value: 'MN', label: 'Minnesota' },
    { value: 'MS', label: 'Mississippi' },
    { value: 'MO', label: 'Missouri' },
    { value: 'MT', label: 'Montana' },
    { value: 'NE', label: 'Nebraska' },
    { value: 'NV', label: 'Nevada' },
    { value: 'NH', label: 'New Hampshire' },
    { value: 'NJ', label: 'New Jersey' },
    { value: 'NM', label: 'New Mexico' },
    { value: 'NY', label: 'New York' },
    { value: 'NC', label: 'North Carolina' },
    { value: 'ND', label: 'North Dakota' },
    { value: 'OH', label: 'Ohio' },
    { value: 'OK', label: 'Oklahoma' },
    { value: 'OR', label: 'Oregon' },
    { value: 'PA', label: 'Pennsylvania' },
    { value: 'RI', label: 'Rhode Island' },
    { value: 'SC', label: 'South Carolina' },
    { value: 'SD', label: 'South Dakota' },
    { value: 'TN', label: 'Tennessee' },
    { value: 'TX', label: 'Texas' },
    { value: 'UT', label: 'Utah' },
    { value: 'VT', label: 'Vermont' },
    { value: 'VA', label: 'Virginia' },
    { value: 'WA', label: 'Washington' },
    { value: 'WV', label: 'West Virginia' },
    { value: 'WI', label: 'Wisconsin' },
    { value: 'WY', label: 'Wyoming' },
  ],

  COUNTRIES: [
    { value: 'CANADA', label: 'Canada' },
    { value: 'USA', label: 'USA' },
  ],

  // Employment & Status
  ACTIVITY_CHOICES: [
    { value: 'EMPLOYED', label: 'Employed' },
    { value: 'UNEMPLOYED', label: 'Unemployed' },
    { value: 'SCHOOLING', label: 'Schooling' },
    { value: 'MILITARY', label: 'Military Service' },
  ],

  IMMIGRATION_STATUS: [
    { value: '', label: '' },
    { value: 'LMIA', label: 'LMIA' },
    { value: 'OWP', label: 'Open WP' },
    { value: 'PR', label: 'Permanent Resident' },
    { value: 'CIT', label: 'Citizen' },
    { value: 'CWP', label: 'Closed WP' },
    { value: 'SINP', label: 'SINP' },
    { value: 'AWP', label: 'Applied for WP' },
  ],

  STATUS_CHOICES: [
    { value: 'NW', label: 'New' },
    { value: 'AR', label: 'Application Received' },
    { value: 'RO', label: 'Ready for Orientation' },
    { value: 'TR', label: 'Trainee' },
    { value: 'AC', label: 'Active' },
    { value: 'VA', label: 'Vacation' },
    { value: 'WCB', label: 'WCB' },
    { value: 'OL', label: 'On Leave' },
    { value: 'SP', label: 'Suspended' },
    { value: 'TE', label: 'Terminated' },
    { value: 'RE', label: 'Resigned' },
    { value: 'OH', label: 'Application on Hold' },
    { value: 'UR', label: 'Under Review' },
    { value: 'RJ', label: 'Rejected' },
  ],

  // Vehicle & Equipment
  TERMINAL_CHOICES: [
    { value: 'NA', label: 'N/A' },
    { value: 'SK', label: 'SK' },
    { value: 'MB', label: 'MB' },
    { value: 'ON', label: 'ON' },
    { value: 'AB', label: 'AB' },
  ],

  DRIVERTYPE_CHOICES: [
    { value: 'CP', label: 'Company Driver' },
    { value: 'OO', label: 'Owner Operator' },
    { value: 'OD', label: 'O/O Driver' },
  ],

  VEHICLE_TYPE_CHOICES: [
    { value: 'CI', label: 'CITY' },
    { value: 'HW', label: 'HWY' },
    { value: 'PU', label: 'PICKUP' },
    { value: 'ST', label: 'SERVICE TRUCK' },
    { value: 'SH', label: 'SHUNT' },
    { value: 'C5', label: 'CITY 5Ton' },
    { value: 'SV', label: 'SERVICE VAN' },
  ],

  TRUCK_STATUS_CHOICES: [
    { value: 'NW', label: 'New' },
    { value: 'AC', label: 'Active' },
    { value: 'SL', label: 'Sold' },
    { value: 'TL', label: 'Total Loss' },
    { value: 'OS', label: 'Out of Service' },
    { value: 'LE', label: 'Left 4Tracks' },
  ],

  EQUIPMENT_TYPE_CHOICES: [
    { value: 'DV', label: '53ft Dry Van' },
    { value: 'RE', label: '53ft Reefer' },
    { value: 'CH', label: '53ft Chassis/Container' },
    { value: 'CV', label: 'Convereter' },
  ],

  AXLE_CHOICES: [
    { value: 'TR', label: 'Triaxle' },
    { value: 'TD', label: 'Tandem' },
  ],

  OWNEDBY_CHOICES_TRUCKS: [
    { value: 'CT', label: 'Company' },
    { value: 'OO', label: 'Owner Operator' },
  ],

  OWNEDBY_CHOICES_EQUIPMENT: [
    { value: 'CT', label: 'Company' },
    { value: 'LB', label: 'Loblaw' },
    { value: 'RN', label: 'Rental' },
  ],

  // Claims & Violations
  INCIDENT_STATUS_CHOICES: [
    { value: 'OP', label: 'Open' },
    { value: 'CL', label: 'Closed' },
  ],

  VIOLATION_STATUS_CHOICES: [
    { value: 'OP', label: 'Open' },
    { value: 'CL', label: 'Closed' },
  ],

  WCB_STATUS_CHOICES: [
    { value: 'OP', label: 'Open' },
    { value: 'CL', label: 'Closed' },
  ],

  CLAIM_STATUS_CHOICES: [
    { value: 'OP', label: 'Open' },
    { value: 'AP', label: 'Approved' },
    { value: 'RJ', label: 'Rejected' },
  ],

  CLAIM_TO_CHOICES: [
    { value: 'MPI', label: 'MPI' },
    { value: 'LL', label: 'Loblaw' },
    { value: 'TP', label: 'Third Party' },
  ],

  VIOLATION_RESULT_CHOICES: [
    { value: 'NR', label: 'No Result Yet' },
    { value: 'DS', label: 'Dismissed - Ticket dropped' },
    { value: 'RD', label: 'Penalty reduced' },
    { value: 'CV', label: 'Convicted - Found guilty' },
    { value: 'AC', label: 'Acquitted - Found not guilty' },
    { value: 'DF', label: 'Deferred - Judgment postponed' },
  ],

  INSPECTION_RESULT_CHOICES: [
    { value: 'PASS', label: 'Passed' },
    { value: 'FAIL', label: 'Failed' },
    { value: 'OOS', label: 'Out of Service' },
  ],

  TICKET_GIVEN_TO_CHOICES: [
    { value: 'DR', label: 'Driver' },
    { value: 'CO', label: 'Company' },
  ],

  CLAIM_TYPE_MAPPING: [
    { value: 'TRK', label: 'Truck' },
    { value: 'TR1', label: 'Trailer 1' },
    { value: 'TR2', label: 'Trailer 2' },
    { value: 'CR1', label: 'Cargo 1' },
    { value: 'CR2', label: 'Cargo 2' },
    { value: 'CVR', label: 'Converter' },
  ],

  // Other
  REPORTS_TYPES: [
    { value: 'GB', label: 'Garbage' },
    { value: 'DM', label: 'Damage' },
    { value: 'OT', label: 'Accident' },
    { value: 'SA', label: 'Safety' },
    { value: 'TK', label: 'Ticket' },
    { value: 'IS', label: 'Issue' },
    { value: 'IJ', label: 'Injury' },
  ],

  DEPARTMENT_CHOICES: [
    { value: 'NA', label: 'N/A' },
    { value: 'POD', label: 'POD' },
    { value: 'DIS', label: 'Dispatch' },
    { value: 'SAF', label: 'Safety' },
    { value: 'REC', label: 'Recruiting' },
    { value: 'PAY', label: 'Payroll' },
    { value: 'AR', label: 'Accounts Receivable' },
    { value: 'AP', label: 'Accounts Payable' },
    { value: 'MGT', label: 'Management' },
    { value: 'LOG', label: 'Logistics' },
    { value: 'SHP', label: 'Shop' },
    { value: 'WAR', label: 'Warehouse' },
    { value: 'IT', label: 'IT Dept' },
  ],

  ROUTES_CHOICES: [
    { value: 1, label: 'CA HWY' },
    { value: 2, label: 'USA' },
    { value: 3, label: 'City' },
    { value: 4, label: 'Regional' },
  ],

  DRIVER_EMPLOYEE_CHOICES: [
    { value: 'DR', label: 'Driver' },
    { value: 'EM', label: 'Employee' },
  ],

  QUARTERS: [
    { value: 1, label: 'Q1' },
    { value: 2, label: 'Q2' },
    { value: 3, label: 'Q3' },
    { value: 4, label: 'Q4' },
  ],

  FUEL_REPORT_TYPES: [
    { value: '', label: 'Choose fuel report type' },
    { value: 'Petro-Canada', label: 'Petro-Canada' },
    { value: 'BVD', label: 'BVD' },
    { value: 'FlyingJ', label: 'FlyingJ' },
    { value: 'Yard', label: 'Yard' },
  ],

  // Boolean options
  TRUE_FALSE_CHOICES: [
    { value: false, label: 'No' },
    { value: true, label: 'Yes' },
  ],

  YES_NO: [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
  ],
};

/**
 * Gets a validation rule by name
 */
export function getValidationRule(ruleName) {
  return VALIDATION_RULES[ruleName] || null;
}

/**
 * Gets an option list by name
 */
export function getOptionList(listName) {
  return OPTION_LISTS[listName] || null;
}

/**
 * Lists all available option lists
 */
export function listOptionLists() {
  return Object.keys(OPTION_LISTS);
}

/**
 * Lists all available validation rules
 */
export function listValidationRules() {
  return Object.keys(VALIDATION_RULES);
}

/**
 * Converts array-based option list to object format for legacy compatibility
 * Array format: [{ value: 'KEY', label: 'Label' }]
 * Object format: { KEY: 'Label' }
 */
export function arrayToObjectFormat(arrayList) {
  return arrayList.reduce((obj, item) => {
    obj[item.value] = item.label;
    return obj;
  }, {});
}

/**
 * Legacy format exports for backward compatibility with tableData.js
 * These are used throughout the existing codebase
 */
export const TERMINAL_CHOICES = arrayToObjectFormat(OPTION_LISTS.TERMINAL_CHOICES);
export const VEHICLE_TYPE_CHOICES = arrayToObjectFormat(OPTION_LISTS.VEHICLE_TYPE_CHOICES);
export const OWNEDBY_CHOICES_TRUCKS = arrayToObjectFormat(OPTION_LISTS.OWNEDBY_CHOICES_TRUCKS);
export const TRUCK_STATUS_CHOICES = arrayToObjectFormat(OPTION_LISTS.TRUCK_STATUS_CHOICES);
export const OWNEDBY_CHOICES_EQUIPMENT = arrayToObjectFormat(OPTION_LISTS.OWNEDBY_CHOICES_EQUIPMENT);
export const STATUS_CHOICES = arrayToObjectFormat(OPTION_LISTS.STATUS_CHOICES);
export const CANADIAN_PROVINCES = arrayToObjectFormat(OPTION_LISTS.CANADIAN_PROVINCES);
