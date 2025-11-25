import React, { createContext, useState, useEffect, useCallback } from "react";
import { useLoader } from "./LoaderContext";

export const WcbClaimContext = createContext();

export const WcbClaimProvider = ({ children, claimId }) => {
  const [wcbClaimData, setWcbClaimData] = useState(null);

  const { startLoading, stopLoading } = useLoader();

  // Memoize loadWcbClaimData to ensure it only changes when claimId changes
  const loadWcbClaimData = useCallback(() => {
    if (!claimId) {
      console.error('WcbClaimProvider: claimId is required');
      return;
    }

    startLoading();
    fetch(`/api/v1/wcb_claims/${claimId}`, {
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
        setWcbClaimData(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch WCB claim data:", error);
      });
  }, [claimId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (claimId) {
      loadWcbClaimData();
    }
  }, [loadWcbClaimData, claimId]);

  return (
    <WcbClaimContext.Provider value={{ wcbClaimData, loadWcbClaimData }}>
      {children}
    </WcbClaimContext.Provider>
  );
};
