import React, { createContext, useState, useEffect } from "react";
import { useLoader } from "./LoaderContext";

export const HiredEmployeesContext = createContext();

export const HiredEmployeesProvider = ({ children }) => {
  const [hiredEmployeesList, setHiredEmployeesList] = useState(null);

  const { startLoading, stopLoading } = useLoader();

  const loadHiredEmployeesData = () => {
    startLoading();
    // LOADING EMPLOYEES LIST
    fetch("/api/get-hired-employees", {
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

        setHiredEmployeesList(preparedData);
      })
      .catch((error) => {
        console.error("Failed to fetch data:", error);
      })
      .finally(() => {
        stopLoading();
      });
  };

  useEffect(() => {
    loadHiredEmployeesData();
  }, []);

  return (
    <HiredEmployeesContext.Provider
      value={{ hiredEmployeesList, loadHiredEmployeesData }}
    >
      {children}
    </HiredEmployeesContext.Provider>
  );
};
