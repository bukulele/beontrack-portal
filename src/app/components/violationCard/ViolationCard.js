"use client";

import React, { useState } from "react";
import InfoCardTabs from "../infoCardTabs/InfoCardTabs";
import { ViolationProvider } from "@/app/context/ViolationContext";
import { TrucksDriversProvider } from "@/app/context/TrucksDriversContext";
import ViolationCardData from "../violationCardData/ViolationCardData";
import ViolationLogComponent from "../logComponent/ViolationLogComponent";
import ViolationDetails from "../violationDetails/ViolationDetails";
import { VIOLATIONS_CHECKLIST } from "@/app/assets/tableData";
import {
  INSPECTION_TEMPLATE_SETTINGS,
  TICKET_TEMPLATE_SETTINGS,
} from "@/app/assets/createObjectTemplate";

function ViolationCard({ violationId }) {
  const [tabChosen, setTabChosen] = useState("Violation Card");

  return (
    <ViolationProvider violationId={violationId}>
      <TrucksDriversProvider>
        <div className="flex flex-col text-slate-700 w-[1024px] h-[98vh] rounded">
          <InfoCardTabs
            tabs={["Violation Card", "Inspection", "Tickets", "Log"]}
            tabChosen={tabChosen}
            setTabChosen={setTabChosen}
          />
          {tabChosen === "Violation Card" && <ViolationCardData />}
          {tabChosen === "Inspection" && (
            <ViolationDetails
              deleteApi={"/api/get-inspections"}
              detailsType={"inspection"}
              detailsName={"violation_inspections"}
              fieldsTemplate={INSPECTION_TEMPLATE_SETTINGS}
              filesTemplate={VIOLATIONS_CHECKLIST}
            />
          )}
          {tabChosen === "Tickets" && (
            <ViolationDetails
              deleteApi={"/api/get-tickets"}
              detailsType={"ticket"}
              detailsName={"violation_tickets"}
              fieldsTemplate={TICKET_TEMPLATE_SETTINGS}
              filesTemplate={VIOLATIONS_CHECKLIST}
            />
          )}
          {tabChosen === "Log" && <ViolationLogComponent />}
        </div>
      </TrucksDriversProvider>
    </ViolationProvider>
  );
}

export default ViolationCard;
