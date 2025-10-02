import React, { useContext } from "react";
import { DriverContext } from "@/app/context/DriverContext";
import CheckListFieldFrame from "../checklistField/CheckListFieldFrame";
import findHighestIdObject from "@/app/functions/findHighestIdObject";
import Button from "../button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { useInfoCard } from "@/app/context/InfoCardContext";

function TrucksList() {
  const { userData } = useContext(DriverContext);
  const { handleCardDataSet } = useInfoCard();

  const list = userData.trucks
    .sort((truckA, truckB) =>
      truckA.unit_number.localeCompare(truckB.unit_number, undefined, {
        numeric: true,
      })
    )
    .map((truck, index) => {
      return (
        <CheckListFieldFrame
          key={`${truck.id}_${index}`}
          fieldName={`${truck.unit_number} ${
            truck.truck_license_plates.length
              ? findHighestIdObject(truck.truck_license_plates).plate_number
              : "No Plate Number"
          }`}
        >
          <div className="flex items-center gap-2">
            <p>{`${truck.make} ${truck.model}`}</p>
            <Button
              content={<FontAwesomeIcon icon={faArrowUpRightFromSquare} />}
              style={"iconButton"}
              tooltipContent={"Go To Truck Card"}
              tooltipId={`go-to-truck-${truck.id}-card-tooltip`}
              fn={() => handleCardDataSet(truck.id, "truck")}
              highlighted={true}
            />
          </div>
        </CheckListFieldFrame>
      );
    });

  return <div className="w-full overflow-y-scroll flex-auto pb-5">{list}</div>;
}

export default TrucksList;
