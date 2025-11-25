"use client";

import React, { createContext, useState, useEffect } from "react";

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [statusSettings, setStatusSettings] = useState({});

  const loadData = () => {
    // Map of entityType (plural, used in app) to API endpoint (may be singular)
    const entityTypeMapping = {
      'employees': 'employee', // App uses 'employees', API uses 'employee'
      'wcb_claims': 'wcb_claims', // App uses 'wcb_claims', API uses 'wcb_claims'
    };

    Object.entries(entityTypeMapping).forEach(([entityType, apiEndpoint]) => {
      fetch(`/api/v1/status-settings/${apiEndpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch ${entityType} status settings`);
          }
          return response.json();
        })
        .then((data) => {
          setStatusSettings((prevData) => ({
            ...prevData,
            [entityType]: data, // Store with plural key
          }));
        })
        .catch((error) => {
          console.error(`Failed to fetch ${entityType} status settings:`, error);
        });
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <SettingsContext.Provider value={{ statusSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
