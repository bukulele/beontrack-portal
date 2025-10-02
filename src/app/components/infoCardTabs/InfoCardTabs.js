import Button from "../button/Button";
import useUserRoles from "@/app/functions/useUserRoles";
import { useInfoCard } from "@/app/context/InfoCardContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCaretLeft,
  faCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import { DriverContext } from "@/app/context/DriverContext";
import { DriverReportContext } from "@/app/context/DriverReportContext";
import { EmployeeContext } from "@/app/context/EmployeeContext";
import { ViolationContext } from "@/app/context/ViolationContext";
import { EquipmentContext } from "@/app/context/EquipmentContext";
import { IncidentContext } from "@/app/context/IncidentContext";
import { TruckContext } from "@/app/context/TruckContext";
import { WCBContext } from "@/app/context/WCBContext";
import React, { useContext, useEffect, useRef } from "react";

function InfoCardTabs({ tabs, tabChosen, setTabChosen }) {
  const driverContext = useContext(DriverContext);
  const driverReportContext = useContext(DriverReportContext);
  const employeeContext = useContext(EmployeeContext);
  const equipmentContext = useContext(EquipmentContext);
  const incidentContext = useContext(IncidentContext);
  const truckContext = useContext(TruckContext);
  const violationContext = useContext(ViolationContext);
  const wcbContext = useContext(WCBContext);
  const CONTEXT_MAPPING = {
    driver: driverContext?.userData,
    truck: truckContext?.truckData,
    equipment: equipmentContext?.equipmentData,
    driver_reports: driverReportContext?.driverReportData,
    incident: incidentContext?.incidentData,
    violation: violationContext?.violationData,
    employee: employeeContext?.userData,
    wcb: wcbContext?.wcbData,
  };

  const tabsContainerRef = useRef(null);

  const {
    prevIdForInfoCard,
    prevInfoCardType,
    handleCardDataSet,
    infoCardType,
  } = useInfoCard();

  const userData = CONTEXT_MAPPING[infoCardType];

  const userRoles = useUserRoles();

  const tabsToShow = tabs.map((tab, index) => {
    if (!userData) return null;

    if (
      index !== 0 &&
      (userRoles.includes(process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_DISPATCH) ||
        userRoles.includes(process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_SHOP))
    ) {
      return null;
    }

    if (
      index !== 0 &&
      tab !== "Trucks" &&
      tab !== "Truck Checklist" &&
      tab !== "Time Card" &&
      tab !== "Seals" &&
      userRoles.includes(process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PLANNER)
    ) {
      return null;
    }

    if (
      tab === "Time Card" &&
      userRoles.includes(process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_HR)
    ) {
      return null;
    }

    if (
      tab === "Trucks" &&
      (!userData ||
        !userData.trucks ||
        userData.trucks.length === 0 ||
        (!userRoles.includes(
          process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_SAFETY
        ) &&
          !userRoles.includes(
            process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_ADMIN
          ) &&
          !userRoles.includes(
            process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PLANNER
          )))
    ) {
      return null;
    }

    if (
      tab === "O/O Drivers" &&
      (!userData ||
        !userData.child_drivers ||
        userData.child_drivers.length === 0)
    ) {
      return null;
    }

    if (
      tab === "Inspection" &&
      (!userData ||
        !userData.has_inspection ||
        (!userRoles.includes(
          process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_SAFETY
        ) &&
          !userRoles.includes(process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_ADMIN)))
    ) {
      return null;
    }

    if (
      tab === "Tickets" &&
      (!userData ||
        !userData.has_ticket ||
        (!userRoles.includes(
          process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_SAFETY
        ) &&
          !userRoles.includes(process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_ADMIN)))
    ) {
      return null;
    }

    if (
      tab === "Incidents" &&
      (!userData ||
        (userData?.main_driver_incidents.length === 0 &&
          userData?.co_driver_incidents.length === 0) ||
        (!userRoles.includes(
          process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_SAFETY
        ) &&
          !userRoles.includes(process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_ADMIN)))
    ) {
      return null;
    }

    if (
      tab === "Violations" &&
      (!userData ||
        (userData?.main_driver_violations.length === 0 &&
          userData?.co_driver_violations.length === 0) ||
        (!userRoles.includes(
          process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_SAFETY
        ) &&
          !userRoles.includes(process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_ADMIN)))
    ) {
      return null;
    }

    if (
      tab === "Seals" &&
      (!userData ||
        (!userRoles.includes(
          process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_SAFETY
        ) &&
          !userRoles.includes(
            process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_ADMIN
          ) &&
          !userRoles.includes(
            process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PLANNER
          )))
    ) {
      return null;
    }

    return (
      <Button
        key={`tab_${tab}`}
        fn={() => setTabChosen(tab)}
        content={tab}
        style={"tabButton"}
        highlighted={tabChosen === tab}
      />
    );
  });

  useEffect(() => {
    if (!userData) return;

    const indexOfOpenedTab = tabs.indexOf(tabChosen);

    if (!tabsToShow[indexOfOpenedTab]) {
      setTabChosen(tabs[0]);
    }
  }, [tabsToShow, userData]);

  // return (
  //   userRoles.length > 0 && (
  //     <div className="flex gap-2 px-5 pt-5 pb-3 bg-white z-10">
  //       {prevIdForInfoCard.toString().length > 0 &&
  //         prevInfoCardType.toString().length > 0 && (
  //           <Button
  //             style={"tabButton"}
  //             fn={() => handleCardDataSet(prevIdForInfoCard, prevInfoCardType)}
  //             content={<FontAwesomeIcon icon={faArrowLeft} />}
  //           />
  //         )}
  //       <div className="flex flex-nowrap overflow-x-auto gap-2 px-5 pt-5 pb-3 bg-white z-10 scrollbar-thin scrollbar-thumb-gray-300">
  //         {tabsToShow}
  //       </div>
  //     </div>
  //   )
  // );

  return (
    <div className="flex items-center gap-2 bg-white px-5 pt-5 pb-3">
      {/* 1) Back button */}
      {prevIdForInfoCard && prevInfoCardType && (
        <Button
          fn={() => handleCardDataSet(prevIdForInfoCard, prevInfoCardType)}
          content={<FontAwesomeIcon icon={faArrowLeft} />}
          style="tabButton"
        />
      )}

      {/* 2) Left scroll arrow */}
      <Button
        fn={() =>
          tabsContainerRef.current?.scrollBy({ left: -200, behavior: "smooth" })
        }
        content={<FontAwesomeIcon icon={faCaretLeft} />}
        style="tabButton"
      />

      {/* 3) Scrollable tabs */}
      <div
        ref={tabsContainerRef}
        className="flex-1 flex gap-2 overflow-x-auto scrollbar-hide whitespace-nowrap"
      >
        {tabsToShow}
      </div>

      {/* 4) Right scroll arrow */}
      <Button
        fn={() =>
          tabsContainerRef.current?.scrollBy({ left: 200, behavior: "smooth" })
        }
        content={<FontAwesomeIcon icon={faCaretRight} />}
        style="tabButton"
      />
    </div>
  );
}

export default InfoCardTabs;
