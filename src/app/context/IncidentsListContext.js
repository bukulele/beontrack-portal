import React, { createContext, useState, useEffect } from "react";
import { useLoader } from "./LoaderContext";

export const IncidentsListContext = createContext();

export const IncidentsListProvider = ({ children }) => {
  const [incidentsList, setIncidentsList] = useState(null);

  const { startLoading, stopLoading } = useLoader();

  const loadIncidentsListData = () => {
    startLoading();
    // LOADING INCIDENTS LIST
    fetch("/api/get-incidents-list", {
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
        }

        setIncidentsList(preparedData);
      })
      .catch((error) => {
        console.error("Failed to fetch data:", error);
      })
      .finally(() => {
        stopLoading();
      });
  };

  useEffect(() => {
    loadIncidentsListData();
  }, []);

  return (
    <IncidentsListContext.Provider
      value={{
        incidentsList,
        loadIncidentsListData,
      }}
    >
      {children}
    </IncidentsListContext.Provider>
  );
};
