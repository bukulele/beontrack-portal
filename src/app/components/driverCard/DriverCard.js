"use client";

import React, { useState } from "react";
import { DriverProvider } from "@/app/context/DriverContext";
import InfoCardTabs from "../infoCardTabs/InfoCardTabs";
import DriverCardData from "../driverCardData/DriverCardData";
import DriverChecklist from "../checklist/DriverChecklist";
import { SAFETY_CHECKLIST, RECRUITING_CHECKLIST } from "@/app/assets/tableData";
import DriverLogComponent from "../logComponent/DriverLogComponent";
import TrucksList from "../trucksList/TrucksList";
import DriversList from "../driversLis/DriversList";
import { IncidentsListProvider } from "@/app/context/IncidentsListContext";
import { ViolationsListProvider } from "@/app/context/ViolationsListContext";
import { TrucksDriversProvider } from "@/app/context/TrucksDriversContext";
import IncidentsList from "../incidentsList/IncidentsList";
import ViolationsList from "../violationsList/ViolationsList";
import DriverTimeCard from "../drvierTimeCard/DriverTimeCard";
import SealsComponent from "../seals/SealsComponent";

function DriverCard({ userId, tabToOpen }) {
  const [tabChosen, setTabChosen] = useState(
    tabToOpen.length > 0 ? tabToOpen : "Driver Card"
  );

  return (
    <DriverProvider userId={userId}>
      <IncidentsListProvider>
        <ViolationsListProvider>
          <TrucksDriversProvider>
            <div className="flex flex-col text-slate-700 w-[1024px] h-full rounded">
              <InfoCardTabs
                tabs={[
                  "Driver Card",
                  "Pre-hiring Checklist",
                  "Post-hiring Checklist",
                  "Notes",
                  "Trucks",
                  "O/O Drivers",
                  "Incidents",
                  "Violations",
                  "Time Card",
                  "Seals",
                ]}
                tabChosen={tabChosen}
                setTabChosen={setTabChosen}
              />
              {tabChosen === "Driver Card" && <DriverCardData />}
              {tabChosen === "Pre-hiring Checklist" && (
                <DriverChecklist
                  template={RECRUITING_CHECKLIST}
                  checklistType={1}
                />
              )}
              {tabChosen === "Post-hiring Checklist" && (
                <DriverChecklist
                  template={SAFETY_CHECKLIST}
                  checklistType={2}
                />
              )}
              {tabChosen === "Notes" && <DriverLogComponent />}
              {tabChosen === "Trucks" && <TrucksList />}
              {tabChosen === "O/O Drivers" && <DriversList />}
              {tabChosen === "Incidents" && <IncidentsList />}
              {tabChosen === "Violations" && <ViolationsList />}
              {tabChosen === "Time Card" && <DriverTimeCard />}
              {tabChosen === "Seals" && <SealsComponent userId={userId} />}
            </div>
          </TrucksDriversProvider>
        </ViolationsListProvider>
      </IncidentsListProvider>
    </DriverProvider>
  );
}

export default DriverCard;
