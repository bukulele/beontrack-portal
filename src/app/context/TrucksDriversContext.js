import React, { createContext, useState, useEffect } from "react";
import { useLoader } from "./LoaderContext";
import findHighestIdObject from "../functions/findHighestIdObject";

export const TrucksDriversContext = createContext();

export const TrucksDriversProvider = ({ children }) => {
  const [hiredDriversList, setHiredDriversList] = useState(null);
  const [activeTrucksList, setActiveTrucksList] = useState(null);

  const { startLoading, stopLoading } = useLoader();

  const loadHiredDriversData = () => {
    startLoading();
    // LOADING DRIVERS LIST
    fetch("/api/get-hired-drivers", {
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

        setHiredDriversList(preparedData);
      })
      .catch((error) => {
        console.error("Failed to fetch data:", error);
      })
      .finally(() => {
        stopLoading();
      });
  };

  const loadActiveTrucksData = () => {
    startLoading();
    // LOADING DRIVERS LIST
    fetch("/api/get-active-trucks", {
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
          let newItem = { ...item };
          newItem.plate_number =
            findHighestIdObject(item.truck_license_plates).plate_number || "";
          preparedData[item.id] = { ...newItem };
        }

        setActiveTrucksList(preparedData);
      })
      .catch((error) => {
        console.error("Failed to fetch data:", error);
      })
      .finally(() => {
        stopLoading();
      });
  };

  const loadTrucksDriversData = () => {
    loadHiredDriversData();
    loadActiveTrucksData();
  };

  useEffect(() => {
    loadTrucksDriversData();
  }, []);

  return (
    <TrucksDriversContext.Provider
      value={{ hiredDriversList, activeTrucksList, loadTrucksDriversData }}
    >
      {children}
    </TrucksDriversContext.Provider>
  );
};
