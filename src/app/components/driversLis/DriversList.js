import React, { useContext } from "react";
import { DriverContext } from "@/app/context/DriverContext";
import CheckListFieldFrame from "../checklistField/CheckListFieldFrame";
import Button from "../button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { useInfoCard } from "@/app/context/InfoCardContext";

function DriversList() {
  const { userData } = useContext(DriverContext);
  const { handleCardDataSet } = useInfoCard();

  const list = userData.child_drivers.map((driver, index) => {
    return (
      <CheckListFieldFrame
        key={`${driver.id}_${index}`}
        fieldName={`${driver.first_name} ${driver.last_name} ${driver.driver_id}`}
      >
        <div className="flex items-center gap-2">
          <Button
            content={<FontAwesomeIcon icon={faArrowUpRightFromSquare} />}
            style={"iconButton"}
            tooltipContent={"Go To Driver Card"}
            tooltipId={`go-to-driver-${driver.id}-card-tooltip`}
            fn={() => handleCardDataSet(driver.id, "driver")}
            highlighted={true}
          />
        </div>
      </CheckListFieldFrame>
    );
  });

  return <div className="w-full overflow-y-scroll flex-auto pb-5">{list}</div>;
}

export default DriversList;
