import isValidDate from "../functions/isValidDate";

const sortFunctions = {
  driver_id: (array) =>
    array.sort((a, b) => {
      const valueA = a.driver_id ?? "";
      const valueB = b.driver_id ?? "";
      return valueA.localeCompare(valueB, undefined, { numeric: true });
    }),
  email: (array) =>
    array.sort((a, b) => {
      const valueA = a.email ?? "";
      const valueB = b.email ?? "";
      return valueA.localeCompare(valueB);
    }),
  status: (array) =>
    array.sort((a, b) => {
      const valueA = a.status ?? "";
      const valueB = b.status ?? "";
      return valueA.localeCompare(valueB);
    }),
  status_note: (array) =>
    array.sort((a, b) => {
      const valueA = a.status_note ?? "";
      const valueB = b.status_note ?? "";
      return valueA.localeCompare(valueB);
    }),
  first_name: (array) =>
    array.sort((a, b) => {
      const valueA = a.first_name ?? "";
      const valueB = b.first_name ?? "";
      return valueA.localeCompare(valueB);
    }),
  last_name: (array) =>
    array.sort((a, b) => {
      const valueA = a.last_name ?? "";
      const valueB = b.last_name ?? "";
      return valueA.localeCompare(valueB);
    }),
  phone_number: (array) =>
    array.sort((a, b) => {
      const valueA = a.phone_number ?? "";
      const valueB = b.phone_number ?? "";
      return valueA.localeCompare(valueB);
    }),
  date_of_birth: (array) =>
    array.sort((a, b) => {
      let dateA = isValidDate(a.date_of_birth)
        ? new Date(a.date_of_birth)
        : new Date("9999-12-31");
      let dateB = isValidDate(b.date_of_birth)
        ? new Date(b.date_of_birth)
        : new Date("9999-12-31");
      return Number(dateA) - Number(dateB);
    }),
  immigration_status: (array) =>
    array.sort((a, b) => {
      const valueA = a.immigration_status ?? "";
      const valueB = b.immigration_status ?? "";
      return valueA.localeCompare(valueB);
    }),
  class1_date: (array) =>
    array.sort((a, b) => {
      let dateA = isValidDate(a.class1_date)
        ? new Date(a.class1_date)
        : new Date("9999-12-31");
      let dateB = isValidDate(b.class1_date)
        ? new Date(b.class1_date)
        : new Date("9999-12-31");
      return Number(dateA) - Number(dateB);
    }),
  miles_driven_total: (array) =>
    array.sort((a, b) => {
      const valueA = a.miles_driven_total ?? "";
      const valueB = b.miles_driven_total ?? "";
      return valueA.localeCompare(valueB);
    }),
  date_available: (array) =>
    array.sort((a, b) => {
      let dateA = isValidDate(a.date_available)
        ? new Date(a.date_available)
        : new Date("9999-12-31");
      let dateB = isValidDate(b.date_available)
        ? new Date(b.date_available)
        : new Date("9999-12-31");
      return Number(dateA) - Number(dateB);
    }),
  hiring_date: (array) =>
    array.sort((a, b) => {
      let dateA = isValidDate(a.hiring_date)
        ? new Date(a.hiring_date)
        : new Date("9999-12-31");
      let dateB = isValidDate(b.hiring_date)
        ? new Date(b.hiring_date)
        : new Date("9999-12-31");
      return Number(dateA) - Number(dateB);
    }),
  date_of_leaving: (array) =>
    array.sort((a, b) => {
      let dateA = isValidDate(a.date_of_leaving)
        ? new Date(a.date_of_leaving)
        : new Date("9999-12-31");
      let dateB = isValidDate(b.date_of_leaving)
        ? new Date(b.date_of_leaving)
        : new Date("9999-12-31");
      return Number(dateA) - Number(dateB);
    }),
  reason_for_leaving: (array) =>
    array.sort((a, b) => {
      const valueA = a.reason_for_leaving ?? "";
      const valueB = b.reason_for_leaving ?? "";
      return valueA.localeCompare(valueB);
    }),
  "licenses.dl_number": (array) =>
    array.sort((a, b) => {
      const valueA = a.licenses?.dl_number ?? "";
      const valueB = b.licenses?.dl_number ?? "";
      return valueA.localeCompare(valueB);
    }),
  "licenses.dl_province": (array) =>
    array.sort((a, b) => {
      const valueA = a.licenses?.dl_province ?? "";
      const valueB = b.licenses?.dl_province ?? "";
      return valueA.localeCompare(valueB);
    }),
  "licenses.expiry_date": (array) =>
    array.sort((a, b) => {
      let dateA = isValidDate(a.licenses?.expiry_date)
        ? new Date(a.licenses?.expiry_date)
        : new Date("9999-12-31");
      let dateB = isValidDate(b.licenses?.expiry_date)
        ? new Date(b.licenses?.expiry_date)
        : new Date("9999-12-31");
      return Number(dateA) - Number(dateB);
    }),
  abstracts: (array) =>
    array.sort((a, b) => {
      // console.log(a.abstracts);
      let dateA = isValidDate(a.abstracts?.issue_date)
        ? new Date(a.abstracts?.issue_date)
        : new Date("9999-12-31");
      let dateB = isValidDate(b.abstracts?.issue_date)
        ? new Date(b.abstracts?.issue_date)
        : new Date("9999-12-31");
      return Number(dateA) - Number(dateB);
    }),
  criminal_records: (array) =>
    array.sort((a, b) => {
      let dateA = isValidDate(a.criminal_records)
        ? new Date(a.criminal_records)
        : new Date("9999-12-31");
      let dateB = isValidDate(b.criminal_records)
        ? new Date(b.criminal_records)
        : new Date("9999-12-31");
      return Number(dateA) - Number(dateB);
    }),
  tdg_cards: (array) =>
    array.sort((a, b) => {
      let dateA = isValidDate(a.tdg_cards)
        ? new Date(a.tdg_cards)
        : new Date("9999-12-31");
      let dateB = isValidDate(b.tdg_cards)
        ? new Date(b.tdg_cards)
        : new Date("9999-12-31");
      return Number(dateA) - Number(dateB);
    }),
  good_to_go_cards: (array) =>
    array.sort((a, b) => {
      let dateA = isValidDate(a.good_to_go_cards)
        ? new Date(a.good_to_go_cards)
        : new Date("9999-12-31");
      let dateB = isValidDate(b.good_to_go_cards)
        ? new Date(b.good_to_go_cards)
        : new Date("9999-12-31");
      return Number(dateA) - Number(dateB);
    }),
  application_date: (array) =>
    array.sort((a, b) => {
      let dateA = isValidDate(a.application_date)
        ? new Date(a.application_date)
        : new Date("9999-12-31");
      let dateB = isValidDate(b.application_date)
        ? new Date(b.application_date)
        : new Date("9999-12-31");
      return Number(dateA) - Number(dateB);
    }),
  log_books: (array) =>
    array.sort((a, b) => {
      let dateA = isValidDate(a.log_books)
        ? new Date(a.log_books)
        : new Date("9999-12-31");
      let dateB = isValidDate(b.log_books)
        ? new Date(b.log_books)
        : new Date("9999-12-31");
      return Number(dateA) - Number(dateB);
    }),
  winter_courses: (array) =>
    array.sort((a, b) => {
      let dateA = isValidDate(a.winter_courses)
        ? new Date(a.winter_courses)
        : new Date("9999-12-31");
      let dateB = isValidDate(b.winter_courses)
        ? new Date(b.winter_courses)
        : new Date("9999-12-31");
      return Number(dateA) - Number(dateB);
    }),
  file_box_number: (array) =>
    array.sort((a, b) => {
      const valueA = a.file_box_number ?? "";
      const valueB = b.file_box_number ?? "";
      return valueA.localeCompare(valueB);
    }),
};

export default sortFunctions;
