import React, { createContext, useState, useEffect, useCallback } from "react";
import { useLoader } from "./LoaderContext";
import useUserRoles from "../functions/useUserRoles";

export const EmployeeContext = createContext();

export const EmployeeProvider = ({ children, userId }) => {
  const [userData, setUserData] = useState(null);

  const { startLoading, stopLoading } = useLoader();

  const userRoles = useUserRoles();

  // Memoize loadEmployeeData to ensure it only changes when userId changes
  const loadEmployeeData = useCallback(() => {
    startLoading();
    fetch(`/api/get-employee-data/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-user-roles": JSON.stringify(userRoles),
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
        // console.log(data);
        setUserData(data);
      })
      .catch((error) => {
        console.error("Failed to fetch data:", error);
      });
  }, [userId, userRoles]);

  useEffect(() => {
    loadEmployeeData();
  }, [loadEmployeeData]);

  return (
    <EmployeeContext.Provider value={{ userData, loadEmployeeData }}>
      {children}
    </EmployeeContext.Provider>
  );
};
