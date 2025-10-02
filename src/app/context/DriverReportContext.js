import React, { createContext, useState, useEffect, useCallback } from "react";

export const DriverReportContext = createContext();

export const DriverReportProvider = ({ children, driverReportId }) => {
  const [driverReportData, setDriverReportData] = useState(null);

  // Memoize loadData to ensure it only changes when driverReportId changes
  const loadData = useCallback(() => {
    fetch(`/api/get-driver-report-data/${driverReportId}`, {
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
        setDriverReportData(data);
      })
      .catch((error) => {
        console.error("Failed to fetch data:", error);
      });
  }, [driverReportId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <DriverReportContext.Provider value={{ driverReportData, loadData }}>
      {children}
    </DriverReportContext.Provider>
  );
};
