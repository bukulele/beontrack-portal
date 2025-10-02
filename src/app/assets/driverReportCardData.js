import { REPORTS_TYPES } from "./tableData";

export const DRIVER_REPORT_CARD_FIELDS = {
  id: {
    key: "id",
    name: "Report Id",
  },
  driver: {
    key: "driver_id",
    name: "Driver Id",
  },
  date_time: {
    key: "date_time",
    name: "Date and Time",
    type: "date_time",
  },
  location: {
    key: "location",
    name: "Location",
  },
  type_of_report: {
    key: "type_of_report",
    name: "Report Type",
    type: "enum",
    values: REPORTS_TYPES,
  },
  truck_number: {
    key: "truck_number",
    name: "Truck Number",
  },
  trailer_number: {
    key: "trailer_number",
    name: "Trailer Number",
  },
  description: {
    key: "description",
    name: "Description",
  },
  steps_taken: {
    key: "steps_taken",
    name: "Steps Taken",
  },
};

export const INJURY_DRIVER_REPORT_CARD_FIELDS = {
  id: {
    key: "id",
    name: "Report Id",
  },
  driver: {
    key: "driver_id",
    name: "Driver Id",
  },
  date_time: {
    key: "date_time",
    name: "Date and Time",
    type: "date_time",
  },
  location: {
    key: "location",
    name: "Location",
  },
  type_of_report: {
    key: "type_of_report",
    name: "Report Type",
    type: "enum",
    values: REPORTS_TYPES,
  },
  description: {
    key: "description",
    name: "Description",
  },
  steps_taken: {
    key: "steps_taken",
    name: "Steps Taken",
  },
  first_contact_after_injury: {
    key: "first_contact_after_injury",
    name: "First Contact",
  },
  reported_to_doctor: {
    key: "reported_to_doctor",
    name: "Reported to Doctor",
  },
};
