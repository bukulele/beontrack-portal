import React, { useContext } from "react";
import { DriverContext } from "@/app/context/DriverContext";
import CheckListFieldFrame from "../checklistField/CheckListFieldFrame";
import Button from "../button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { useInfoCard } from "@/app/context/InfoCardContext";
import { IncidentsListContext } from "@/app/context/IncidentsListContext";
import moment from "moment-timezone";
import { GiSteeringWheel } from "react-icons/gi";
import { Tooltip } from "react-tooltip";
import { MdAirlineSeatIndividualSuite } from "react-icons/md";

function IncidentsList() {
  const { userData } = useContext(DriverContext);
  const { handleCardDataSet } = useInfoCard();

  const { incidentsList } = useContext(IncidentsListContext);

  const mainDriverIncidents = userData.main_driver_incidents.map((id) => {
    return { id, mainDriver: true };
  });

  const coDriverIncidents = userData.co_driver_incidents.map((id) => {
    return { id, mainDriver: false };
  });

  const allIncidents = [...mainDriverIncidents, ...coDriverIncidents];

  const list = allIncidents
    .sort((a, b) => {
      return b.id - a.id;
    })
    .map((incident, index) => {
      return (
        <CheckListFieldFrame
          optional={!incident.mainDriver}
          key={`${incident.id}_${index}`}
          fieldName={
            <div className="flex gap-1 items-center">
              {incidentsList[incident.id].incident_number} -{" "}
              {moment(incidentsList[incident.id].date_time).format(
                "DD MMM YYYY, hh:mm"
              )}
              {incident.mainDriver ? (
                <div
                  className="flex items-center justify-center"
                  data-tooltip-id={`${incident.id}_${index}_main_driver_tooltip`}
                >
                  <GiSteeringWheel />
                  <Tooltip
                    id={`${incident.id}_${index}_main_driver_tooltip`}
                    openEvents={{ mouseenter: true, focus: true, click: true }}
                    style={{ maxWidth: "90%", zIndex: 20 }}
                  >
                    Main driver
                  </Tooltip>
                </div>
              ) : (
                <div
                  className="flex items-center justify-center"
                  data-tooltip-id={`${incident.id}_${index}_co_driver_tooltip`}
                >
                  <MdAirlineSeatIndividualSuite />
                  <Tooltip
                    id={`${incident.id}_${index}_co_driver_tooltip`}
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
          <p>{`Assigned to: ${incidentsList[incident.id].assigned_to}`}</p>
          <Button
            content={<FontAwesomeIcon icon={faArrowUpRightFromSquare} />}
            style={"iconButton"}
            tooltipContent={"Go To Incident Card"}
            tooltipId={`go-to-truck-${incident.id}-card-tooltip`}
            fn={() => handleCardDataSet(incident.id, "incident")}
            highlighted={true}
          />
        </CheckListFieldFrame>
      );
    });

  return <div className="w-full overflow-y-scroll flex-auto pb-5">{list}</div>;
}

export default IncidentsList;
