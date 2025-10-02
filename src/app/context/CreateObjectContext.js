"use client";

import React, { useContext, createContext, useState } from "react";

const CreateObjectContext = createContext();

export const useCreateObject = () => useContext(CreateObjectContext);

export const CreateObjectProvider = ({ children }) => {
  const [createObjectModalIsOpen, setCreateObjectModalIsOpen] = useState(false);
  const [objectType, setObjectType] = useState("");
  const [serverData, setServerData] = useState(null);
  const [afterCreateCallback, setAfterCreateCallback] = useState(null);
  const [updateObject, setUpdateObject] = useState(false);

  const handleCreateObjectModalClose = () => {
    setObjectType("");
    setServerData(null);
    setAfterCreateCallback(null);
    setUpdateObject(false);
    setCreateObjectModalIsOpen(false);
  };

  return (
    <CreateObjectContext.Provider
      value={{
        createObjectModalIsOpen,
        objectType,
        serverData,
        afterCreateCallback,
        updateObject,
        setUpdateObject,
        setAfterCreateCallback,
        setServerData,
        setObjectType,
        setCreateObjectModalIsOpen,
        handleCreateObjectModalClose,
      }}
    >
      {children}
    </CreateObjectContext.Provider>
  );
};
