import React, { createContext, useState } from "react";

export const AvailabilityContext = createContext();

export const AvailabilityProvider = ({ children }) => {
  const [availabilitySheetData, setAvailabilitySheetData] = useState([]);

  return (
    <AvailabilityContext.Provider
      value={{ availabilitySheetData, setAvailabilitySheetData }}
    >
      {children}
    </AvailabilityContext.Provider>
  );
};
