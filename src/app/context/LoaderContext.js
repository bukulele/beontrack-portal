"use client";

import React, { createContext, useContext, useState } from "react";

const LoaderContext = createContext();

export const useLoader = () => useContext(LoaderContext);

export const LoaderProvider = ({ children }) => {
  const [activeRequests, setActiveRequests] = useState(0);

  const startLoading = () => setActiveRequests((prev) => prev + 1);
  const stopLoading = () => setActiveRequests((prev) => Math.max(0, prev - 1));

  return (
    <LoaderContext.Provider
      value={{ isLoading: activeRequests > 0, startLoading, stopLoading }}
    >
      {children}
    </LoaderContext.Provider>
  );
};
