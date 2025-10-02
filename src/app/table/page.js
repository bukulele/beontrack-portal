"use client";

import Menu from "../components/menu/Menu";
import { useState, useEffect } from "react";
import ThreeDotsLoader from "../components/loader/ThreeDotsLoader";
import { OFFICE_TABLE_FIELDS_SAFETY } from "../tableData/officeEmployeesTable_unstable";
import { TRUCKS_TABLE_FIELDS } from "../tableData/trucksTable_unstable";
import { DRIVER_REPORT_TABLE_FIELDS } from "../tableData/driverReportsTable_unstable";
import { MAIN_DASHBOARD_TEMPLATE } from "../assets/dashboardData";
import { useLoader } from "../context/LoaderContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import useUserRoles from "../functions/useUserRoles";
import Button from "../components/button/Button";
import { SettingsProvider } from "../context/SettingsContext";
import DashboardContainer from "../components/dashboardContainer/DashboardContainer";
import Cookies from "js-cookie";
import { RotatingLines } from "react-loader-spinner";
import { EQUIPMENT_TABLE_FIELDS } from "../tableData/equipmentTable_unstable";
import { InfoCardProvider } from "../context/InfoCardContext";
import { INCIDENTS_TABLE } from "../tableData/incidentsTable_unstable";
import { CreateObjectProvider } from "../context/CreateObjectContext";
import {
  GO_TO_TABLE_LINKS_FUEL_REPORT,
  GO_TO_TABLE_LINKS_FUEL_REPORT_QUARTERLY,
} from "../assets/tableData";
import {
  FUEL_REPORT_TABLE,
  FUEL_REPORT_TABLE_QUARTERLY,
} from "../tableData/fuelReportTable_unstable";
import { VIOLATIONS_TABLE } from "../tableData/violationsTable_unstable";
import { WCB_TABLE } from "../tableData/wcbTable_unstable";
import TableView from "../components/tableContainer/TableView_unstable";
import {
  DRIVERS_TABLE_FIELDS_REPORT,
  DRIVERS_TABLE_FIELDS_RECRUITING,
  DRIVERS_TABLE_FIELDS_SAFETY,
  DRIVERS_TABLE_DOCUMENTS_EXPIRING,
  DRIVERS_TABLE_TO_BE_REVIEWED_BY_SAFETY,
  DRIVERS_SEALS_REPORT,
} from "../tableData/driversTable_unstable";
import AvailabilitySheet from "../components/dispatchSection/AvailabilitySheet";
import { DRIVERS_AVAILABILITY_SHEET } from "../components/dispatchSection/dispatch_assets/tableFields";
import { AvailabilityProvider } from "../context/AvailabilityContext";
import { DriverAttendanceProvider } from "../context/DriverAttendanceContext";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Box } from "@mui/material";
import { TrucksDriversProvider } from "../context/TrucksDriversContext";
import SealsReport from "../components/sealsReport/SealsReport";

const TablePage = (props) => {
  const SPECIAL_MENU_POINTS = [
    "all_drivers_data",
    "dispatch_availability",
    "seals_report",
  ];
  const getDefaultMenuPointChosen = () => {
    const searchParams = props.searchParams;
    const targetMenuPoint = searchParams.report;

    if (targetMenuPoint) {
      return targetMenuPoint;
    }

    const savedData = Cookies.get("4tracks_menuClickData");
    return savedData ? savedData : "dashboard";
  };

  const [menuPointChosen, setMenuPointChosen] = useState(
    getDefaultMenuPointChosen
  );
  const [reportIsLoading, setReportIsLoading] = useState(false);
  const [serverData, setServerData] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [tableTemplate, setTableTemplate] = useState(null);
  const [tableType, setTableType] = useState("");
  const [dashboardTemplate, setDashboardTemplate] = useState(null);
  const [goToTableLinks, setGoToTableLinks] = useState([]);
  const [menuCollapsed, setMenuCollapsed] = useState(true);

  const userRoles = useUserRoles();

  const { startLoading, stopLoading } = useLoader();

  const router = useRouter();

  const { status } = useSession();

  const handleMenuClick = (data) => {
    if (data === "toggle_menu") {
      setMenuCollapsed((prev) => !prev);
    } else {
      router.replace("/table");
      setMenuPointChosen(data);

      if (data !== "expiring-driver-docs") {
        // Set or refresh the cookie with an 8-hour expiration
        Cookies.set("4tracks_menuClickData", data, { expires: 1 / 3 });
      }
    }
  };

  const loadTableData = () => {
    setServerData(null);
    setGoToTableLinks([]);
    startLoading();

    let fetchLink = "";
    if (menuPointChosen === "dashboard") {
      setTableTemplate(null);
      setDashboardTemplate(MAIN_DASHBOARD_TEMPLATE);
      setTableType("");
      fetchLink = "/api/get-main-dashboard";
    } else if (menuPointChosen === "recruiting") {
      setDashboardTemplate(null);
      setTableType("driver");
      setTableTemplate(DRIVERS_TABLE_FIELDS_RECRUITING);
      fetchLink = "/api/get-drivers-recruiting";
    } else if (menuPointChosen === "active_drivers") {
      setDashboardTemplate(null);
      setTableType("driver");
      setTableTemplate(DRIVERS_TABLE_FIELDS_SAFETY);
      fetchLink = "/api/get-drivers-safety";
    } else if (menuPointChosen === "all_drivers_data") {
      setDashboardTemplate(null);
      setTableType("driver");
      setTableTemplate(DRIVERS_TABLE_FIELDS_REPORT);
      fetchLink = "";
      stopLoading();
    } else if (menuPointChosen === "trucks") {
      setDashboardTemplate(null);
      setTableTemplate(TRUCKS_TABLE_FIELDS);
      setTableType("truck");
      fetchLink = "/api/get-trucks-table";
    } else if (menuPointChosen === "equipment") {
      setDashboardTemplate(null);
      setTableTemplate(EQUIPMENT_TABLE_FIELDS);
      setTableType("equipment");
      fetchLink = "/api/get-equipment";
    } else if (menuPointChosen === "driver_reports") {
      setDashboardTemplate(null);
      setTableTemplate(DRIVER_REPORT_TABLE_FIELDS);
      setTableType("driver_reports");
      fetchLink = "/api/get-driver-reports";
    } else if (menuPointChosen === "expiring-driver-docs") {
      setDashboardTemplate(null);
      setTableType("driver");
      setTableTemplate(DRIVERS_TABLE_DOCUMENTS_EXPIRING);
      fetchLink = "/api/get-expiring-documents-drivers";
    } else if (menuPointChosen === "drivers_to_be_reviewed") {
      setDashboardTemplate(null);
      setTableType("driver");
      setTableTemplate(DRIVERS_TABLE_TO_BE_REVIEWED_BY_SAFETY);
      fetchLink = "/api/get-drivers-to-be-reviewed";
    } else if (menuPointChosen === "incidents") {
      setDashboardTemplate(null);
      setTableType("incident");
      setTableTemplate(INCIDENTS_TABLE);
      fetchLink = "/api/get-incidents-table";
    } else if (menuPointChosen === "fuel-report") {
      setDashboardTemplate(null);
      setTableType("fuel-report");
      setGoToTableLinks(GO_TO_TABLE_LINKS_FUEL_REPORT);
      setTableTemplate(FUEL_REPORT_TABLE);
      fetchLink = "/api/get-fuel-transactions";
    } else if (menuPointChosen === "fuel-report-quarterly") {
      setDashboardTemplate(null);
      setTableType("fuel-report");
      setTableTemplate(FUEL_REPORT_TABLE_QUARTERLY);
      setGoToTableLinks(GO_TO_TABLE_LINKS_FUEL_REPORT_QUARTERLY);
      fetchLink = "/api/get-fuel-quarterly";
    } else if (menuPointChosen === "violations") {
      setDashboardTemplate(null);
      setTableType("violation");
      setTableTemplate(VIOLATIONS_TABLE);
      fetchLink = "/api/get-violations";
    } else if (menuPointChosen === "office_employees") {
      setDashboardTemplate(null);
      setTableType("employee");
      setTableTemplate(OFFICE_TABLE_FIELDS_SAFETY);
      fetchLink = "/api/get-office-employees";
    } else if (menuPointChosen === "wcb_claims") {
      setDashboardTemplate(null);
      setTableType("wcb");
      setTableTemplate(WCB_TABLE);
      fetchLink = "/api/get-wcb-claims";
    } else if (menuPointChosen === "dispatch_availability") {
      setDashboardTemplate(null);
      setTableType("driver");
      setTableTemplate(DRIVERS_AVAILABILITY_SHEET);
      fetchLink = "";
      stopLoading();
    } else if (menuPointChosen === "seals_report") {
      setDashboardTemplate(null);
      setTableType("driver");
      setTableTemplate(DRIVERS_SEALS_REPORT);
      fetchLink = "/api/get-seals";
    } else {
      setDashboardTemplate(null);
      setTableTemplate(null);
      setServerData(null);
      setTableType("");
      stopLoading();
    }

    if (fetchLink.length > 0) {
      fetch(fetchLink, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.status === 403) {
            stopLoading();
            return response.json().then((data) => {
              Cookies.remove("4tracks_menuClickData");
              router.push("/no-access-section");
              throw new Error(data.message);
            });
          }
          return response.json();
        })
        .then((data) => {
          setServerData(data);
          stopLoading();
        })
        .catch((error) => console.log(error.message));
    }
  };

  const loadReport = () => {
    setReportIsLoading(true);
    fetch("/api/get-drivers-report", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setReportData(data);
        setReportIsLoading(false);
      });
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      stopLoading();
      router.push("/");
    }
  }, [status]);

  useEffect(() => {
    if (userRoles.includes("no roles")) {
      router.push("/no-access");
    }
  }, [userRoles]);

  useEffect(() => {
    if (menuPointChosen === "") {
      return;
    }

    if (userRoles.length === 0 || userRoles.includes("no roles")) {
      return;
    }

    loadTableData();
  }, [menuPointChosen, userRoles]);

  return (
    <SettingsProvider>
      <InfoCardProvider>
        <CreateObjectProvider>
          <AvailabilityProvider>
            <DriverAttendanceProvider>
              <ThreeDotsLoader />
              <ThemeProvider
                theme={createTheme({
                  breakpoints: {
                    values: {
                      desktop: 1280,
                      extraLarge: 3000,
                    },
                  },
                })}
              >
                {status === "authenticated" &&
                  userRoles.length > 0 &&
                  !userRoles.includes("no roles") && (
                    <div className="flex flex-col justify-center min-h-screen max-h-screen w-screen bg-white">
                      <Box
                        sx={{ height: "100vh", width: "100%", display: "fex" }}
                      >
                        <Box
                          sx={{
                            maxHeight: "100%",
                            borderRight: "1px solid #e0e0e0",
                            width: menuCollapsed ? "50px" : "250px",
                          }}
                        >
                          <Menu
                            menuClick={handleMenuClick}
                            menuPointChosen={menuPointChosen}
                            reportIsLoading={reportIsLoading}
                            reportDataSet={!!reportData}
                            menuCollapsed={menuCollapsed}
                          />
                        </Box>
                        <Box
                          sx={{
                            padding: 1,
                            maxHeight: "100%",
                            flexBasis: 0,
                            flexGrow: 1,
                            width: "100%",
                            maxWidth: "100%",
                          }}
                        >
                          {serverData &&
                          tableTemplate &&
                          !SPECIAL_MENU_POINTS.includes(menuPointChosen) ? (
                            <TableView
                              key={menuPointChosen}
                              data={serverData}
                              columns={tableTemplate}
                              handleRefresh={loadTableData}
                              tableType={tableType}
                              menuPointChosen={menuPointChosen}
                              goToTable={handleMenuClick}
                              goToTableLinks={goToTableLinks}
                            />
                          ) : serverData && dashboardTemplate ? (
                            <DashboardContainer
                              key={menuPointChosen}
                              dashboardTemplate={dashboardTemplate}
                              data={serverData}
                              tileClick={handleMenuClick}
                            />
                          ) : null}
                          {reportData &&
                          tableTemplate &&
                          menuPointChosen === "all_drivers_data" ? (
                            <TableView
                              key={menuPointChosen}
                              data={reportData}
                              columns={tableTemplate}
                              handleRefresh={loadReport}
                              tableType={tableType}
                              menuPointChosen={menuPointChosen}
                              goToTable={handleMenuClick}
                              goToTableLinks={goToTableLinks}
                              reportIsLoading={reportIsLoading}
                            />
                          ) : !reportData &&
                            tableTemplate &&
                            menuPointChosen === "all_drivers_data" ? (
                            <div className="gap-1 w-full min-h-full max-h-full flex flex-col">
                              <div className="flex-auto flex justify-center items-center w-full h-full">
                                {reportIsLoading ? (
                                  <div className="flex flex-col gap-5 items-center justify-center">
                                    <p className="font-bold uppercase">
                                      Report is Loading
                                    </p>
                                    <RotatingLines
                                      visible={true}
                                      height="50"
                                      width="50"
                                      strokeColor="orange"
                                      strokeWidth="5"
                                      animationDuration="0.75"
                                      ariaLabel="rotating-lines-loading"
                                    />
                                  </div>
                                ) : (
                                  <Button
                                    content={"Load Report"}
                                    fn={() => loadReport()}
                                    style={"classicButton"}
                                    highlighted={true}
                                  />
                                )}
                              </div>
                            </div>
                          ) : null}
                          {tableTemplate &&
                            menuPointChosen === "dispatch_availability" && (
                              <TrucksDriversProvider>
                                <AvailabilitySheet
                                  key={menuPointChosen}
                                  columns={tableTemplate}
                                />
                              </TrucksDriversProvider>
                            )}
                          {serverData &&
                            tableTemplate &&
                            menuPointChosen === "seals_report" && (
                              <TrucksDriversProvider>
                                <SealsReport
                                  key={menuPointChosen}
                                  columns={tableTemplate}
                                  data={serverData}
                                  handleRefresh={loadTableData}
                                  tableType={tableType}
                                  menuPointChosen={menuPointChosen}
                                />
                              </TrucksDriversProvider>
                            )}
                        </Box>
                      </Box>
                    </div>
                  )}
              </ThemeProvider>
            </DriverAttendanceProvider>
          </AvailabilityProvider>
        </CreateObjectProvider>
      </InfoCardProvider>
    </SettingsProvider>
  );
};

export default TablePage;
