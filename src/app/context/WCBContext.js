import React, { createContext, useState, useEffect, useCallback } from "react";
import { useLoader } from "./LoaderContext";

export const WCBContext = createContext();

export const WCBProvider = ({ children, wcbId }) => {
  const [wcbData, setWCBData] = useState(null);

  const { startLoading, stopLoading } = useLoader();

  // Memoize loadData to ensure it only changes when wcbId changes
  const loadWCBData = useCallback(() => {
    startLoading();

    fetch(`/api/get-wcb-data/${wcbId}`, {
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
        setWCBData(data);
      })
      .catch((error) => {
        console.error("Failed to fetch data:", error);
      });
  }, [wcbId]);

  useEffect(() => {
    loadWCBData();
  }, [loadWCBData]);

  return (
    <WCBContext.Provider value={{ wcbData, loadWCBData }}>
      {children}
    </WCBContext.Provider>
  );
};
