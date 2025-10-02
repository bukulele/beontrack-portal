"use client";

import React, { useState } from "react";
import InfoCardTabs from "../infoCardTabs/InfoCardTabs";
import { EquipmentProvider } from "@/app/context/EquipmentContext";
import EquipmentCardData from "../equipmentCardData/EquipmentCardData";
import EquipmentChecklist from "../checklist/EquipmentChecklist";
import { EQUIPMENT_CHECKLIST } from "@/app/assets/tableData";
import { EDIT_EQUIPMENT_TEMPLATE_SETTINGS } from "@/app/assets/createObjectTemplate";

function EquipmentCard({ equipmentId }) {
  const [tabChosen, setTabChosen] = useState("Equipment Card");

  return (
    <EquipmentProvider equipmentId={equipmentId}>
      <div className="flex flex-col text-slate-700 w-[1024px] h-[98vh] rounded">
        <InfoCardTabs
          tabs={["Equipment Card", "Equipment Checklist"]}
          tabChosen={tabChosen}
          setTabChosen={setTabChosen}
        />
        {tabChosen === "Equipment Card" && <EquipmentCardData />}
        {tabChosen === "Equipment Checklist" && (
          <EquipmentChecklist
            fieldsTemplateSettings={EDIT_EQUIPMENT_TEMPLATE_SETTINGS}
            filesTemplate={EQUIPMENT_CHECKLIST}
            apiEndpoint={"/api/upload-equipment-data"}
          />
        )}
      </div>
    </EquipmentProvider>
  );
}

export default EquipmentCard;
