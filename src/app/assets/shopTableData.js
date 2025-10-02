export const BAYS_WORKS_STATUS_COLOR_SCHEME = {
  IN_PROGRESS: "text-yellow-500",
  COMPLETED: "text-green-500",
  PENDING: "text-red-500",
  CANCELLED: "text-gray-500",
};

export const BAYS_WORKS_COLUMNS = [
  {
    header: "S/O",
    accessor: "service_order_number",
    type: "text",
  },
  {
    header: "Unit",
    accessor: "unit",
    type: "text",
  },
  {
    header: "Job Description",
    accessor: "job_description",
    type: "text",
  },
  {
    header: "Status",
    accessor: "status",
    type: "status",
    scheme: BAYS_WORKS_STATUS_COLOR_SCHEME,
  },
  {
    header: "Bay",
    accessor: "bay",
    type: "text",
  },
  {
    header: "Tech",
    accessor: "mechanic",
    type: "enum",
  },
  {
    header: "Time In",
    accessor: "time_in",
    type: "time-date",
  },
  {
    header: "Time Out",
    accessor: "time_out",
    type: "time-date",
  },
  {
    header: "ETA",
    accessor: "eta",
    type: "time-date",
  },
];
