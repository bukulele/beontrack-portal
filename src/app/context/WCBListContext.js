import React, { createContext, useState, useEffect } from "react";
import { useLoader } from "./LoaderContext";

export const WCBListContext = createContext();

export const WCBListProvider = ({ children }) => {
  const [wcbClaimsList, setWCBClaimsList] = useState(null);

  const { startLoading, stopLoading } = useLoader();

  const loadWCBClaimsListData = () => {
    startLoading();
    // LOADING WCB Claims LIST
    fetch("/api/get-wcb-list", {
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

        setWCBClaimsList(preparedData);
      })
      .catch((error) => {
        console.error("Failed to fetch data:", error);
      })
      .finally(() => {
        stopLoading();
      });
  };

  useEffect(() => {
    loadWCBClaimsListData();
  }, []);

  return (
    <WCBListContext.Provider
      value={{
        wcbClaimsList,
        loadWCBClaimsListData,
      }}
    >
      {children}
    </WCBListContext.Provider>
  );
};
