"use client";

import React, { useState } from "react";
import { EmployeeProvider } from "@/app/context/EmployeeContext";
import InfoCardTabs from "../infoCardTabs/InfoCardTabs";
import { EMPLOYEE_COMMON_CHECKLIST } from "@/app/assets/tableData";
import EmployeeCardData from "../employeeCardData/EmployeeCardData";
import EmployeeChecklist from "../checklist/EmployeeChecklist";
import EmployeeLogComponent from "../logComponent/EmployeeLogComponent";
import EmployeeTimeCard from "../employeeTimeCard/EmployeeTimeCard";

function EmployeeCard({ userId, tabToOpen, tabData }) {
  const [tabChosen, setTabChosen] = useState(
    tabToOpen.length > 0 ? tabToOpen : "Employee Card"
  );

  return (
    <EmployeeProvider userId={userId}>
      <div className="flex flex-col text-slate-700 w-[1024px] h-full rounded">
        <InfoCardTabs
          tabs={["Employee Card", "Checklist", "Notes", "Time Card"]}
          tabChosen={tabChosen}
          setTabChosen={setTabChosen}
        />
        {tabChosen === "Employee Card" && <EmployeeCardData />}
        {tabChosen === "Checklist" && (
          <EmployeeChecklist
            template={EMPLOYEE_COMMON_CHECKLIST}
            checklistType={1}
          />
        )}
        {tabChosen === "Notes" && <EmployeeLogComponent />}
        {tabChosen === "Time Card" && <EmployeeTimeCard tabData={tabData} />}
      </div>
    </EmployeeProvider>
  );
}

export default EmployeeCard;
