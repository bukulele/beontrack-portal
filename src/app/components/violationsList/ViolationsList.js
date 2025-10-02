import React, { useContext } from "react";
import { DriverContext } from "@/app/context/DriverContext";
import CheckListFieldFrame from "../checklistField/CheckListFieldFrame";
import Button from "../button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { useInfoCard } from "@/app/context/InfoCardContext";
import { ViolationsListContext } from "@/app/context/ViolationsListContext";
import moment from "moment-timezone";
import { GiSteeringWheel } from "react-icons/gi";
import { Tooltip } from "react-tooltip";
import { MdAirlineSeatIndividualSuite } from "react-icons/md";

function ViolationsList() {
  const { userData } = useContext(DriverContext);
  const { handleCardDataSet } = useInfoCard();

  const { violationsList } = useContext(ViolationsListContext);

  const mainDriverViolations = userData.main_driver_violations.map((id) => {
    return { id, mainDriver: true };
  });

  const coDriverViolations = userData.co_driver_violations.map((id) => {
    return { id, mainDriver: false };
  });

  const allViolations = [...mainDriverViolations, ...coDriverViolations];

  const list = allViolations
    .sort((a, b) => {
      return b.id - a.id;
    })
    .map((violation, index) => {
      return (
        <CheckListFieldFrame
          optional={!violation.mainDriver}
          key={`${violation.id}_${index}`}
          fieldName={
            <div className="flex gap-1 items-center">
              {violationsList[violation.id].violation_number} -{" "}
              {moment(violationsList[violation.id].date_time).format(
                "DD MMM YYYY, hh:mm"
              )}
              {violation.mainDriver ? (
                <div
                  className="flex items-center justify-center"
                  data-tooltip-id={`${violation.id}_${index}_main_driver_tooltip`}
                >
                  <GiSteeringWheel />
                  <Tooltip
                    id={`${violation.id}_${index}_main_driver_tooltip`}
                    openEvents={{ mouseenter: true, focus: true, click: true }}
                    style={{ maxWidth: "90%", zIndex: 20 }}
                  >
                    Main driver
                  </Tooltip>
                </div>
              ) : (
                <div
                  className="flex items-center justify-center"
                  data-tooltip-id={`${violation.id}_${index}_co_driver_tooltip`}
                >
                  <MdAirlineSeatIndividualSuite />
                  <Tooltip
                    id={`${violation.id}_${index}_co_driver_tooltip`}
                    openEvents={{ mouseenter: true, focus: true, click: true }}
                    style={{ maxWidth: "90%", zIndex: 20 }}
                  >
                    Co-driver
                  </Tooltip>
                </div>
              )}
            </div>
          }
        >
          <p>{`Assigned to: ${violationsList[violation.id].assigned_to}`}</p>
          <Button
            content={<FontAwesomeIcon icon={faArrowUpRightFromSquare} />}
            style={"iconButton"}
            tooltipContent={"Go To Violation Card"}
            tooltipId={`go-to-truck-${violation.id}-card-tooltip`}
            fn={() => handleCardDataSet(violation.id, "violation")}
            highlighted={true}
          />
        </CheckListFieldFrame>
      );
    });

  return <div className="w-full overflow-y-scroll flex-auto pb-5">{list}</div>;
}

export default ViolationsList;
