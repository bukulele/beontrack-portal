import { WEEK_DAYS } from "../assets/tableData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquareCheck,
  faSquare,
  faSquarePhoneFlip,
} from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "@mui/material";
import callPhoneNumber from "./callPhoneNumber";
import Button from "../components/button/Button";

export const renderCopyableCell = (params) => {
  let displayValue = params.value;

  return (
    <span
      style={{
        cursor: "copy",
        textDecoration: "underline dotted",
      }}
    >
      {displayValue}
    </span>
  );
};

export const renderBooleanCell = (params) => {
  let displayValue;
  displayValue = params.value ? "Yes" : "No";

  return (
    <span
      style={{
        color: !params.value ? "red" : "",
      }}
    >
      {displayValue}
    </span>
  );
};

export const renderInteractiveCell = (params) => {
  let displayValue = params.value;

  return (
    <span
      style={{
        textDecoration: "underline dotted",
        cursor: "pointer",
      }}
    >
      {displayValue}
    </span>
  );
};

export const renderPhoneNumberCell = (params) => {
  let displayValue = params.value;

  const handlePhoneCall = (_, e) => {
    e.stopPropagation();
    callPhoneNumber(displayValue);
  };

  return (
    <div className="flex w-full items-center justify-left gap-2 px-1">
      <span
        style={{
          cursor: "copy",
          textDecoration: "underline dotted",
        }}
      >
        {displayValue}
      </span>
      <Button
        content={
          <FontAwesomeIcon
            icon={faSquarePhoneFlip}
            className="pointer-events-none"
          />
        }
        style={"iconButton"}
        fn={handlePhoneCall}
        tooltipContent={"Call driver"}
        tooltipId={"callDriver_tooltip"}
      />
    </div>
  );
};

export const renderDriverScheduleCell = (params) => {
  return (
    <div className="flex items-center gap-1 w-full h-full justify-center">
      {Object.keys(WEEK_DAYS).map((day, index) => {
        return (
          <Tooltip title={day} key={`${params.row.id}-${day}-${index}`}>
            <FontAwesomeIcon
              icon={params.value[day] ? faSquareCheck : faSquare}
              color={
                params.value === ""
                  ? "#cbd5e1"
                  : params.value[day]
                  ? "#22c55e"
                  : "#f87171"
              }
              className="text-xl"
            />
          </Tooltip>
        );
      })}
    </div>
  );
};
