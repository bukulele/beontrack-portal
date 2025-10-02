import React, { createContext, useState, useEffect } from "react";

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [buttonsSettings, setButtonsSettings] = useState({});
  const [statusSettings, setStatusSettings] = useState({});

  const loadData = () => {
    // LOADING STATUS BUTTONS SETTINGS
    for (let source of ["driver", "employee"]) {
      fetch(`/api/get-${source}-buttons-settings`, {
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
          setButtonsSettings((prevData) => {
            return {
              ...prevData,
              [source]: data,
            };
          });
        })
        .catch((error) => {
          console.error("Failed to fetch data:", error);
        });
    }
    // LOADING STATUS SETTINGS
    for (let source of ["driver", "truck", "equipment", "employee"]) {
      fetch(`/api/get-${source}-status-settings`, {
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
          setStatusSettings((prevData) => {
            return {
              ...prevData,
              [source]: data,
            };
          });
        })
        .catch((error) => {
          console.error("Failed to fetch data:", error);
        });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <SettingsContext.Provider value={{ buttonsSettings, statusSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
