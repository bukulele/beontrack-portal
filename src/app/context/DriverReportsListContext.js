import React, { createContext, useState, useEffect } from "react";
import { useLoader } from "./LoaderContext";
// import formatDate from "../functions/formatDate";
import moment from "moment-timezone";

export const DriverReportsListContext = createContext();

export const DriverReportsListProvider = ({ children }) => {
  const [driverReportsList, setDriverReportsList] = useState(null);

  const { startLoading, stopLoading } = useLoader();

  const loadDriverReportsData = () => {
    startLoading();
    // LOADING INCIDENTS LIST
    fetch("/api/get-driver-reports-list", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        let preparedData = {};

        for (let item of data) {
          preparedData[item.id] = { ...item };
          preparedData[item.id].date_time = moment(item.date_time).format(
            "MMM Do YYYY, hh:mm"
          );
        }

        setDriverReportsList(preparedData);
      })
      .catch((error) => {
        console.error("Failed to fetch data:", error);
      })
      .finally(() => {
        stopLoading();
      });
  };

  useEffect(() => {
    loadDriverReportsData();
  }, []);

  return (
    <DriverReportsListContext.Provider
      value={{
        driverReportsList,
        loadDriverReportsData,
      }}
    >
      {children}
    </DriverReportsListContext.Provider>
  );
};
