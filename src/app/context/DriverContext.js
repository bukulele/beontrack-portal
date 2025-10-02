import React, { createContext, useState, useEffect, useCallback } from "react";
import { useLoader } from "./LoaderContext";

export const DriverContext = createContext();

export const DriverProvider = ({ children, userId }) => {
  const [userData, setUserData] = useState(null);
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

  // Memoize loadData to ensure it only changes when userId changes
  const loadData = useCallback(() => {
    startLoading();
    fetch(`/api/get-driver-data/${userId}`, {
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
        loadTableContextData();
        setUserData(data);
      })
      .catch((error) => {
        console.error("Failed to fetch data:", error);
      });
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <DriverContext.Provider value={{ userData, driverList, loadData }}>
      {children}
    </DriverContext.Provider>
  );
};
