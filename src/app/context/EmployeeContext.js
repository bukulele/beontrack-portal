import React, { createContext, useState, useEffect, useCallback } from "react";
import { useLoader } from "./LoaderContext";

export const EmployeeContext = createContext();

export const EmployeeProvider = ({ children, userId, employeeId }) => {
  const [userData, setUserData] = useState(null);

  const { startLoading, stopLoading } = useLoader();

  // Support both userId (legacy) and employeeId (universal table page)
  const id = employeeId || userId;

  // Memoize loadEmployeeData to ensure it only changes when id changes
  const loadEmployeeData = useCallback(() => {
    startLoading();
    fetch(`/api/v1/employees/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include session cookies
    })
      .finally(() => stopLoading())
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((response) => {
        // v1 API returns: { success: true, data: {...} }
        setUserData(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch data:", error);
      });
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadEmployeeData();
  }, [loadEmployeeData]);

  return (
    <EmployeeContext.Provider value={{ userData, loadEmployeeData }}>
      {children}
    </EmployeeContext.Provider>
  );
};
