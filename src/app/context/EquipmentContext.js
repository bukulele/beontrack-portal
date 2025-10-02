import React, { createContext, useState, useEffect, useCallback } from "react";
import { useLoader } from "./LoaderContext";

export const EquipmentContext = createContext();

export const EquipmentProvider = ({ children, equipmentId }) => {
  const [equipmentData, setEquipmentData] = useState(null);

  const { startLoading, stopLoading } = useLoader();

  // Memoize loadData to ensure it only changes when EquipmentId changes
  const loadData = useCallback(() => {
    startLoading();
    fetch(`/api/get-equipment-data/${equipmentId}`, {
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
        setEquipmentData(data);
      })
      .catch((error) => {
        console.error("Failed to fetch data:", error);
      });
  }, [equipmentId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <EquipmentContext.Provider value={{ equipmentData, loadData }}>
      {children}
    </EquipmentContext.Provider>
  );
};
