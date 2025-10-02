import moment from "moment-timezone";
import Button from "../components/button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export const SEALS_COLUMNS_FIELDS = [
  {
    field: "seal_number",
    headerName: "Seal Number",
    flex: 1,
    sortable: false,
  },
  {
    field: "date_time",
    headerName: "Date & Time",
    flex: 1.5,
    valueFormatter: (value) => moment(value).format("YYYY-MM-DD HH:mm"),
    sortable: false,
  },
  {
    field: "issued_by",
    headerName: "Issued By",
    flex: 1,
    sortable: false,
  },
  {
    field: "actions",
    headerName: "Delete",
    sortable: false,
    width: 50,
    onCellClick: "delete",
    disableExport: true,
    renderCell: () => (
      <div className="flex w-full h-full items-center justify-center">
        <Button
          content={<FontAwesomeIcon icon={faXmark} size="sm" />}
          style="iconButton"
          fn={null}
        />
      </div>
    ),
  },
];
