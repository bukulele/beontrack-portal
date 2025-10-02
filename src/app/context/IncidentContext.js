import React, { createContext, useState, useEffect, useCallback } from "react";
import { useLoader } from "./LoaderContext";

export const IncidentContext = createContext();

export const IncidentProvider = ({ children, incidentId }) => {
  const [incidentData, setIncidentData] = useState(null);

  const { startLoading, stopLoading } = useLoader();

  // Memoize loadData to ensure it only changes when IncidentId changes
  const loadIncidentData = useCallback(() => {
    startLoading();

    fetch(`/api/get-incident-data/${incidentId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .finally(() => stopLoading())
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setIncidentData(data);
      })
      .catch((error) => {
        console.error("Failed to fetch data:", error);
      });
  }, [incidentId]);

  useEffect(() => {
    loadIncidentData();
  }, [loadIncidentData]);

  return (
    <IncidentContext.Provider value={{ incidentData, loadIncidentData }}>
      {children}
    </IncidentContext.Provider>
  );
};
