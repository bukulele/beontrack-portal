"use client";

import React, { useState } from "react";
import InfoCardTabs from "../infoCardTabs/InfoCardTabs";
import { TrucksDriversProvider } from "@/app/context/TrucksDriversContext";
import WCBCardData from "../wcbCardData/WCBCardData";
import { WCBProvider } from "@/app/context/WCBContext";
import { HiredEmployeesProvider } from "@/app/context/HiredEmployeesContext";

function WCBCard({ wcbId }) {
  const [tabChosen, setTabChosen] = useState("WCB Card");

  return (
    <WCBProvider wcbId={wcbId}>
      <HiredEmployeesProvider>
        <TrucksDriversProvider>
          <div className="flex flex-col text-slate-700 w-[1024px] h-[98vh] rounded">
            <InfoCardTabs
              tabs={["WCB Card"]}
              tabChosen={tabChosen}
              setTabChosen={setTabChosen}
            />
            {tabChosen === "WCB Card" && <WCBCardData />}
          </div>
        </TrucksDriversProvider>
      </HiredEmployeesProvider>
    </WCBProvider>
  );
}

export default WCBCard;
