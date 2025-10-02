"use client";

import React, { useState } from "react";
import InfoCardTabs from "../infoCardTabs/InfoCardTabs";
import DriverReportCardData from "../driverReportCardData/DriverReportCardData";
import { DriverReportProvider } from "@/app/context/DriverReportContext";
import { TrucksDriversProvider } from "@/app/context/TrucksDriversContext";
import { IncidentsListProvider } from "@/app/context/IncidentsListContext";
import { ViolationsListProvider } from "@/app/context/ViolationsListContext";
import { WCBListProvider } from "@/app/context/WCBListContext";

function DriverReportCard({ driverReportId }) {
  const [tabChosen, setTabChosen] = useState("Driver Report Card");

  return (
    <DriverReportProvider driverReportId={driverReportId}>
      <TrucksDriversProvider>
        <IncidentsListProvider>
          <ViolationsListProvider>
            <WCBListProvider>
              <div className="flex flex-col text-slate-700 w-[1024px] h-[98vh] rounded">
                <InfoCardTabs
                  tabs={["Driver Report Card"]}
                  tabChosen={tabChosen}
                  setTabChosen={setTabChosen}
                />
                {tabChosen === "Driver Report Card" && <DriverReportCardData />}
              </div>
            </WCBListProvider>
          </ViolationsListProvider>
        </IncidentsListProvider>
      </TrucksDriversProvider>
    </DriverReportProvider>
  );
}

export default DriverReportCard;
