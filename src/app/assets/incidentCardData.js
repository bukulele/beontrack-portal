export const INCIDENT_CARD_FIELDS = {
  incident_number: {
    key: "incident_number",
    name: "Incident Number",
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
  truck: {
    key: "truck",
    name: "Truck",
  },
  location: {
    key: "location",
    name: "Location",
  },
  incident_details: {
    key: "incident_details",
    name: "Incident Details",
  },
  towing_info: {
    key: "towing_info",
    name: "Towing Info",
  },
  additional_info: {
    key: "additional_info",
    name: "Additional Info",
  },
};

export const DRIVER_1_INCIDENT_BLOCK = {
  main_driver_injury: {
    key: "main_driver_injury",
    name: "Injured",
    type: "boolean",
  },
};

export const DRIVER_2_INCIDENT_BLOCK = {
  co_driver_injury: {
    key: "co_driver_injury",
    name: "Injured",
    type: "boolean",
  },
};

export const TRAILER_1_INCIDENT_BLOCK = {
  trailer_1_unit_number: {
    key: "trailer_1_unit_number",
    name: "Unit Number",
  },
  trailer_1_license_plate: {
    key: "trailer_1_license_plate",
    name: "License Plate",
  },
  trailer_1_damage: {
    key: "trailer_1_damage",
    name: "Damage",
  },
};

export const TRAILER_2_INCIDENT_BLOCK = {
  trailer_2_unit_number: {
    key: "trailer_2_unit_number",
    name: "Unit Number",
  },
  trailer_2_license_plate: {
    key: "trailer_2_license_plate",
    name: "License Plate",
  },
  trailer_2_damage: {
    key: "trailer_2_damage",
    name: "Damage",
  },
};

export const CARGO_1_INCIDENT_BLOCK = {
  cargo_1_bol_po_number: {
    key: "cargo_1_bol_po_number",
    name: "BOL/PO #",
  },
  cargo_1_commodity: {
    key: "cargo_1_commodity",
    name: "Commodity",
  },
  cargo_1_damage: {
    key: "cargo_1_damage",
    name: "Damage",
  },
};

export const CARGO_2_INCIDENT_BLOCK = {
  cargo_2_bol_po_number: {
    key: "cargo_2_bol_po_number",
    name: "BOL/PO #",
  },
  cargo_2_commodity: {
    key: "cargo_2_commodity",
    name: "Commodity",
  },
  cargo_2_damage: {
    key: "cargo_2_damage",
    name: "Damage",
  },
};

export const CONVERTER_INCIDENT_BLOCK = {
  converter_unit_number: {
    key: "converter_unit_number",
    name: "Unit Number",
  },
  converter_damage: {
    key: "converter_damage",
    name: "Damage",
  },
};

export const POLICE_INCIDENT_BLOCK = {
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
