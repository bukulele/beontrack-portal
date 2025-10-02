import {
  faArrowRightArrowLeft,
  faTrashCan,
  faTruckFront,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function TruckShiftCell({ params, setTruck, changeTruck, stopTruckShift }) {
  const displayValue = params.value;

  const handleSetTruck = (_, e) => {
    e.stopPropagation();
    setTruck(params.row);
  };

  const handleChangeTruck = (_, e) => {
    e.stopPropagation();
    changeTruck(params.row);
  };

  const handleStopTruckShift = (_, e) => {
    e.stopPropagation();
    stopTruckShift(params.row);
  };

  return (
    <div className="flex items-center justify-between w-full h-full gap-1">
      <span
        className="truncate"
        style={{
          textDecoration: "underline dotted",
          cursor: "pointer",
        }}
      >
        {displayValue}
      </span>
      {params.row.current_truck_assignment.toString().length === 0 &&
        (params.row.last_shift.check_out_time === null ||
          params.row.last_shift.check_out_time === "") && (
          <Button
            content={
              <FontAwesomeIcon
                icon={faTruckFront}
                className="pointer-events-none"
              />
            }
            style={"classicButton-s"}
            fn={handleSetTruck}
            tooltipContent={"Assign Truck"}
            tooltipId={`${params.row.id}-set-truck`}
            highlighted={true}
          />
        )}
      {params.row.current_truck_assignment.toString().length > 0 &&
        (params.row.last_shift.check_out_time === null ||
          params.row.last_shift.check_out_time === "") && (
          <Button
            content={
              <FontAwesomeIcon
                icon={faArrowRightArrowLeft}
                className="pointer-events-none"
              />
            }
            style={"classicButton-s"}
            fn={handleChangeTruck}
            tooltipContent={"Change Truck"}
            tooltipId={`${params.row.id}-change-truck`}
            highlighted={true}
          />
        )}
      {params.row.current_truck_assignment.toString().length > 0 &&
        params.row.last_shift.check_out_time !== null &&
        params.row.last_shift.check_out_time !== "" && (
          <Button
            content={
              <FontAwesomeIcon
                icon={faTrashCan}
                className="pointer-events-none"
              />
            }
            style={"classicButton-s"}
            fn={handleStopTruckShift}
            tooltipContent={"Clear truck"}
            tooltipId={`${params.row.id}-clear-truck`}
            highlighted={true}
          />
        )}
    </div>
  );
}

export default TruckShiftCell;
