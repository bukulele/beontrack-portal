"use client";

import React, { useState } from "react";
import InfoCardTabs from "../infoCardTabs/InfoCardTabs";
import { INCIDENT_CHECKLIST } from "@/app/assets/tableData";
import { IncidentProvider } from "@/app/context/IncidentContext";
import IncidentCardData from "../incidentCardData/IncidentCardData";
import {
  LOBLAW_CLAIMS_TEMPLATE_SETTINGS,
  MPI_CLAIMS_TEMPLATE_SETTINGS,
  T_P_INFO_TEMPLATE_SETTINGS,
} from "@/app/assets/createObjectTemplate";
import ClaimDetails from "../claimDetails/ClaimDetails";
import { TrucksDriversProvider } from "@/app/context/TrucksDriversContext";
import IncidentLogComponent from "../logComponent/IncidentLogComponent";

function IncidentCard({ incidentId }) {
  const [tabChosen, setTabChosen] = useState("Incident Card");

  return (
    <IncidentProvider incidentId={incidentId}>
      <TrucksDriversProvider>
        <div className="flex flex-col text-slate-700 w-[1024px] h-[98vh] rounded">
          <InfoCardTabs
            tabs={[
              "Incident Card",
              "MPI Claims",
              "Loblaw Claims",
              "T/P info",
              "Log",
            ]}
            tabChosen={tabChosen}
            setTabChosen={setTabChosen}
          />
          {tabChosen === "Incident Card" && <IncidentCardData />}
          {tabChosen === "MPI Claims" && (
            <ClaimDetails
              claimType={"MPI"}
              fieldsTemplate={MPI_CLAIMS_TEMPLATE_SETTINGS}
              filesTemplate={INCIDENT_CHECKLIST}
            />
          )}
          {tabChosen === "Loblaw Claims" && (
            <ClaimDetails
              claimType={"LL"}
              fieldsTemplate={LOBLAW_CLAIMS_TEMPLATE_SETTINGS}
              filesTemplate={INCIDENT_CHECKLIST}
            />
          )}
          {tabChosen === "T/P info" && (
            <ClaimDetails
              claimType={"TP"}
              fieldsTemplate={T_P_INFO_TEMPLATE_SETTINGS}
              filesTemplate={INCIDENT_CHECKLIST}
            />
          )}
          {tabChosen === "Log" && <IncidentLogComponent />}
        </div>
      </TrucksDriversProvider>
    </IncidentProvider>
  );
}

export default IncidentCard;
