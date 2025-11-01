import React, { createContext, useState, useEffect } from "react";

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [statusSettings, setStatusSettings] = useState({});

  const loadData = () => {
    // Entity types to load status settings for
    // Add 'driver', 'truck', 'equipment' when their endpoints are ready
    const entitiesToLoad = ['employee'];

    entitiesToLoad.forEach(entityType => {
      fetch(`/api/v1/status-settings/${entityType}`, {
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
            [entityType]: data,
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
