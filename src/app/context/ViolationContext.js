import React, { createContext, useState, useEffect, useCallback } from "react";
import { useLoader } from "./LoaderContext";

export const ViolationContext = createContext();

export const ViolationProvider = ({ children, violationId }) => {
  const [violationData, setViolationData] = useState(null);

  const { startLoading, stopLoading } = useLoader();

  // Memoize loadData to ensure it only changes when violationId changes
  const loadViolationData = useCallback(() => {
    startLoading();

    fetch(`/api/get-violation-data/${violationId}`, {
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
        setViolationData(data);
      })
      .catch((error) => {
        console.error("Failed to fetch data:", error);
      });
  }, [violationId]);

  useEffect(() => {
    loadViolationData();
  }, [loadViolationData]);

  return (
    <ViolationContext.Provider value={{ violationData, loadViolationData }}>
      {children}
    </ViolationContext.Provider>
  );
};
