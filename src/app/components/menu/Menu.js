import React from "react";
import Button from "../button/Button";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import useUserRoles from "@/app/functions/useUserRoles";
import { RotatingLines } from "react-loader-spinner";
import {
  faArrowLeft,
  faArrowRight,
  faCalendarXmark,
  faCarBurst,
  faCircle,
  faClipboardList,
  faFileCircleExclamation,
  faFlag,
  faGasPump,
  faIdCard,
  faMicroscope,
  faPaperclip,
  faRightFromBracket,
  faTag,
  faTruckFront,
  faTruckRampBox,
  faUsers,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Menu({
  menuClick,
  menuPointChosen,
  reportIsLoading,
  reportDataSet,
  menuCollapsed,
}) {
  const userRoles = useUserRoles();

  const { data: session } = useSession();

  return (
    <div className="h-full flex flex-col">
      {!menuCollapsed && (
        <div className="w-full flex items-center justify-center border-b border-gray-300">
          <Button
            content={
              <Image src="/logo.png" alt="Logo" width={280} height={65} />
            }
            style={"imageButton"}
            fn={() => menuClick("dashboard")}
          />
        </div>
      )}
      <div className="border-b w-full flex items-center justify-between border-gray-300 py-3 px-2 text-slate-500 text-xs text-center gap-1">
        {!menuCollapsed && (
          <div className="flex-auto flex justify-center">
            {session?.user?.name}
          </div>
        )}
        <Button
          content={
            <div className="flex items-center gap-1">
              <FontAwesomeIcon icon={faRightFromBracket} />
            </div>
          }
          fn={() => signOut({ redirect: false })}
          style={"classicButton"}
          tooltipContent={"Sign Out"}
          tooltipId={"signOutButton-tooltip"}
        />
      </div>
      <Button
        content={
          <div className="flex items-center gap-2 pointer-events-none">
            <FontAwesomeIcon
              icon={menuCollapsed ? faArrowRight : faArrowLeft}
            />
            {!menuCollapsed && <p>Hide Menu</p>}
          </div>
        }
        style={"menuPoint"}
        fn={() => menuClick("toggle_menu")}
        tooltipContent={menuCollapsed ? "Show menu" : null}
        tooltipId={menuCollapsed ? "menu-point-show" : null}
      />
      {(userRoles.includes(process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PAYROLL) ||
        userRoles.includes(
          process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_RECRUITING
        ) ||
        userRoles.includes(process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_SAFETY) ||
        userRoles.includes(process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_HR)) && (
        <Button
          highlighted={menuPointChosen === "recruiting"}
          content={
            <div className="flex items-center gap-2 pointer-events-none">
              <FontAwesomeIcon icon={faPaperclip} />
              {!menuCollapsed && <p>Recruiting</p>}
            </div>
          }
          style={"menuPoint"}
          fn={() => menuClick("recruiting")}
          tooltipContent={menuCollapsed ? "Recruiting" : null}
          tooltipId={menuCollapsed ? "menu-point-recruiting" : null}
        />
      )}
      {(userRoles.includes(
        process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_DISPATCH
      ) ||
        userRoles.includes(process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PLANNER) ||
        userRoles.includes(process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PAYROLL) ||
        userRoles.includes(
          process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_RECRUITING
        ) ||
        userRoles.includes(process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_SAFETY) ||
        userRoles.includes(process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_SHOP) ||
        userRoles.includes(process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_HR)) && (
        <Button
          highlighted={menuPointChosen === "active_drivers"}
          content={
            <div className="flex items-center gap-2 pointer-events-none">
              <FontAwesomeIcon icon={faIdCard} />
              {!menuCollapsed && <p>Drivers</p>}
            </div>
          }
          style={"menuPoint"}
          fn={() => menuClick("active_drivers")}
          tooltipContent={menuCollapsed ? "Drivers" : null}
          tooltipId={menuCollapsed ? "menu-point-drivers" : null}
        />
      )}
      {(userRoles.includes(process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_SAFETY) ||
        userRoles.includes(process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_SHOP) ||
        userRoles.includes(
          process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PLANNER
        )) && (
        <Button
          highlighted={menuPointChosen === "trucks"}
          content={
            <div className="flex items-center gap-2 pointer-events-none">
              <FontAwesomeIcon icon={faTruckFront} />
              {!menuCollapsed && <p>Trucks</p>}
            </div>
          }
          style={"menuPoint"}
          fn={() => menuClick("trucks")}
          tooltipContent={menuCollapsed ? "Trucks" : null}
          tooltipId={menuCollapsed ? "menu-point-trucks" : null}
        />
      )}
      {(userRoles.includes(process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_SAFETY) ||
        userRoles.includes(process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_SHOP)) && (
        <Button
          highlighted={menuPointChosen === "equipment"}
          content={
            <div className="flex items-center gap-2 pointer-events-none">
              <FontAwesomeIcon icon={faTruckRampBox} />
              {!menuCollapsed && <p>Equipment</p>}
            </div>
          }
          style={"menuPoint"}
          fn={() => menuClick("equipment")}
          tooltipContent={menuCollapsed ? "Equipment" : null}
          tooltipId={menuCollapsed ? "menu-point-equipment" : null}
        />
      )}
      {(userRoles.includes(process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_SAFETY) ||
        userRoles.includes(process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_SHOP)) && (
        <Button
          highlighted={menuPointChosen === "driver_reports"}
          content={
            <div className="flex items-center gap-2 pointer-events-none">
              <FontAwesomeIcon icon={faFlag} />
              {!menuCollapsed && <p>Driver Reports</p>}
            </div>
          }
          style={"menuPoint"}
          fn={() => menuClick("driver_reports")}
          tooltipContent={menuCollapsed ? "Driver Reports" : null}
          tooltipId={menuCollapsed ? "menu-point-driver-reports" : null}
        />
      )}
      {userRoles.includes(process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_SAFETY) && (
        <Button
          highlighted={menuPointChosen === "incidents"}
          content={
            <div className="flex items-center gap-2 pointer-events-none">
              <FontAwesomeIcon icon={faCarBurst} />
              {!menuCollapsed && <p>Accidents</p>}
            </div>
          }
          style={"menuPoint"}
          fn={() => menuClick("incidents")}
          tooltipContent={menuCollapsed ? "Accidents" : null}
          tooltipId={menuCollapsed ? "menu-point-accidents" : null}
        />
      )}
      {userRoles.includes(process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_SAFETY) && (
        <Button
          highlighted={menuPointChosen === "violations"}
          content={
            <div className="flex items-center gap-2 pointer-events-none">
              <FontAwesomeIcon icon={faClipboardList} />
              {!menuCollapsed && <p>Tickets/Inspections</p>}
            </div>
          }
          style={"menuPoint"}
          fn={() => menuClick("violations")}
          tooltipContent={menuCollapsed ? "Tickets/Inspections" : null}
          tooltipId={menuCollapsed ? "menu-point-tickets-inspections" : null}
        />
      )}
      {userRoles.includes(process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_SAFETY) && (
        <Button
          highlighted={menuPointChosen === "wcb_claims"}
          content={
            <div className="flex items-center gap-2 pointer-events-none">
              <FontAwesomeIcon icon={faFileCircleExclamation} />
              {!menuCollapsed && <p>WCB Claims</p>}
            </div>
          }
          style={"menuPoint"}
          fn={() => menuClick("wcb_claims")}
          tooltipContent={menuCollapsed ? "WCB Claims" : null}
          tooltipId={menuCollapsed ? "menu-point-wcb-claims" : null}
        />
      )}
      {(userRoles.includes(process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PAYROLL) ||
        userRoles.includes(
          process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_RECRUITING
        ) ||
        userRoles.includes(process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_SAFETY) ||
        userRoles.includes(process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_HR)) && (
        <Button
          highlighted={menuPointChosen === "all_drivers_data"}
          content={
            <div className="flex items-center w-full relative gap-2 pointer-events-none">
              <FontAwesomeIcon icon={faMicroscope} />
              {!menuCollapsed && <p>Drivers Analysis</p>}
              {reportDataSet && !reportIsLoading && (
                <FontAwesomeIcon
                  icon={faCircle}
                  className="text-lime-400 text-xs"
                />
              )}
              <div className="absolute right-3">
                {reportIsLoading && !menuCollapsed && (
                  <RotatingLines
                    visible={true}
                    height="20"
                    width="20"
                    strokeColor="orange"
                    strokeWidth="5"
                    animationDuration="0.75"
                    ariaLabel="rotating-lines-loading"
                  />
                )}
              </div>
            </div>
          }
          style={"menuPoint"}
          fn={() => menuClick("all_drivers_data")}
          tooltipContent={menuCollapsed ? "Drivers Analysis" : null}
          tooltipId={menuCollapsed ? "menu-point-analysis" : null}
        />
      )}
      {(userRoles.includes(process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_ADMIN) ||
        userRoles.includes(process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PLANNER) ||
        userRoles.includes(
          process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_SAFETY
        )) && (
        <Button
          highlighted={menuPointChosen === "seals_report"}
          content={
            <div className="flex items-center gap-2 pointer-events-none">
              <FontAwesomeIcon icon={faTag} />
              {!menuCollapsed && <p>Seals Report</p>}
            </div>
          }
          style={"menuPoint"}
          fn={() => menuClick("seals_report")}
          tooltipContent={menuCollapsed ? "Seals Report" : null}
          tooltipId={menuCollapsed ? "menu-point-seals-report" : null}
        />
      )}
      {userRoles.includes(process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_SAFETY) && (
        <Button
          highlighted={menuPointChosen === "expiring-driver-docs"}
          content={
            <div className="flex items-center gap-2 pointer-events-none">
              <FontAwesomeIcon icon={faCalendarXmark} />
              {!menuCollapsed && <p>Expiring Driver Docs</p>}
            </div>
          }
          style={"menuPoint"}
          fn={() => menuClick("expiring-driver-docs")}
          tooltipContent={menuCollapsed ? "Expiring Driver Docs" : null}
          tooltipId={menuCollapsed ? "menu-point-expiring-driver-docs" : null}
        />
      )}
      {userRoles.includes(process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_SAFETY) && (
        <Button
          highlighted={
            menuPointChosen === "fuel-report" ||
            menuPointChosen === "fuel-report-quarterly"
          }
          content={
            <div className="flex items-center gap-2 pointer-events-none">
              <FontAwesomeIcon icon={faGasPump} />
              {!menuCollapsed && <p>Fuel Reports</p>}
            </div>
          }
          style={"menuPoint"}
          fn={() => menuClick("fuel-report")}
          tooltipContent={menuCollapsed ? "Fuel Reports" : null}
          tooltipId={menuCollapsed ? "menu-point-fuel-report" : null}
        />
      )}
      {(userRoles.includes(process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PAYROLL) ||
        userRoles.includes(
          process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PAYROLL_MANAGER
        ) ||
        userRoles.includes(process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_ADMIN) ||
        userRoles.includes(process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_HR)) && (
        <Button
          highlighted={menuPointChosen === "office_employees"}
          content={
            <div className="flex items-center gap-2 pointer-events-none">
              <FontAwesomeIcon icon={faUserTie} />
              {!menuCollapsed && <p>Office Employees</p>}
            </div>
          }
          style={"menuPoint"}
          fn={() => menuClick("office_employees")}
          tooltipContent={menuCollapsed ? "Office Employees" : null}
          tooltipId={menuCollapsed ? "menu-point-office-employees" : null}
        />
      )}
      {(userRoles.includes(process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_ADMIN) ||
        userRoles.includes(process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PLANNER) ||
        userRoles.includes(
          process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_SAFETY
        )) && (
        <Button
          highlighted={menuPointChosen === "dispatch_availability"}
          content={
            <div className="flex items-center gap-2 pointer-events-none">
              <FontAwesomeIcon icon={faUsers} />
              {!menuCollapsed && <p>Availability Sheet</p>}
            </div>
          }
          style={"menuPoint"}
          fn={() => menuClick("dispatch_availability")}
          tooltipContent={menuCollapsed ? "Availability Sheet" : null}
          tooltipId={menuCollapsed ? "menu-point-dispatch-availability" : null}
        />
      )}
    </div>
  );
}

export default Menu;
