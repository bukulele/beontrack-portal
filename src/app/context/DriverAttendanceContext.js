import React, { createContext, useState } from "react";

export const DriverAttendanceContext = createContext();

export const DriverAttendanceProvider = ({ children }) => {
  const [driverAttendanceData, setDriverAttendanceData] = useState(null);

  return (
    <DriverAttendanceContext.Provider
      value={{ driverAttendanceData, setDriverAttendanceData }}
    >
      {children}
    </DriverAttendanceContext.Provider>
  );
};
