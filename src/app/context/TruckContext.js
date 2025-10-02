import React, { createContext, useState, useEffect, useCallback } from "react";
import { useLoader } from "./LoaderContext";

export const TruckContext = createContext();

export const TruckProvider = ({ children, truckId }) => {
  const [truckData, setTruckData] = useState(null);
  const [driverList, setDriverList] = useState(null);

  const { startLoading, stopLoading } = useLoader();

  const loadTableContextData = () => {
    // LOADING DRIVERS LIST
    fetch("/api/get-owner-operators", {
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

        setDriverList(preparedData);
      })
      .catch((error) => {
        console.error("Failed to fetch data:", error);
      });
  };

  // Memoize loadData to ensure it only changes when truckId changes
  const loadData = useCallback(() => {
    startLoading();
    fetch(`/api/get-truck-data/${truckId}`, {
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
        setTruckData(data);
        loadTableContextData();
      })
      .catch((error) => {
        console.error("Failed to fetch data:", error);
      });
  }, [truckId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <TruckContext.Provider value={{ truckData, driverList, loadData }}>
      {children}
    </TruckContext.Provider>
  );
};
