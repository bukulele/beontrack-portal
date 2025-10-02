"use client";

import React, { useState } from "react";
import InfoCardTabs from "../infoCardTabs/InfoCardTabs";
import { TruckProvider } from "@/app/context/TruckContext";
import TruckCardData from "../truckCardData/TruckCardData";
import TruckChecklist from "../checklist/TruckChecklist";
import { TRUCK_CHECKLIST } from "@/app/assets/tableData";
import { EDIT_TRUCK_TEMPLATE_SETTINGS } from "@/app/assets/createObjectTemplate";

function TruckCard({ truckId }) {
  const [tabChosen, setTabChosen] = useState("Truck Card");

  return (
    <TruckProvider truckId={truckId}>
      <div className="flex flex-col text-slate-700 w-[1024px] h-[98vh] rounded">
        <InfoCardTabs
          tabs={["Truck Card", "Truck Checklist"]}
          tabChosen={tabChosen}
          setTabChosen={setTabChosen}
        />
        {tabChosen === "Truck Card" && <TruckCardData />}
        {tabChosen === "Truck Checklist" && (
          <TruckChecklist
            fieldsTemplateSettings={EDIT_TRUCK_TEMPLATE_SETTINGS}
            filesTemplate={TRUCK_CHECKLIST}
            apiEndpoint={"/api/upload-truck-data"}
          />
        )}
      </div>
    </TruckProvider>
  );
}

export default TruckCard;
