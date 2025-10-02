import React, { createContext, useState, useEffect } from "react";
import { useLoader } from "./LoaderContext";

export const ViolationsListContext = createContext();

export const ViolationsListProvider = ({ children }) => {
  const [violationsList, setViolationsList] = useState(null);

  const { startLoading, stopLoading } = useLoader();

  const loadViolationsListData = () => {
    startLoading();
    // LOADING VIOLATIONS LIST
    fetch("/api/get-violations-list", {
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

        setViolationsList(preparedData);
      })
      .catch((error) => {
        console.error("Failed to fetch data:", error);
      })
      .finally(() => {
        stopLoading();
      });
  };

  useEffect(() => {
    loadViolationsListData();
  }, []);

  return (
    <ViolationsListContext.Provider
      value={{
        violationsList,
        loadViolationsListData,
      }}
    >
      {children}
    </ViolationsListContext.Provider>
  );
};
