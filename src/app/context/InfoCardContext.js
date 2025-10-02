"use client";

import React, { useContext, createContext, useState } from "react";

const InfoCardContext = createContext();

export const useInfoCard = () => useContext(InfoCardContext);

export const InfoCardProvider = ({ children }) => {
  const [infoCardModalIsOpen, setInfoCardModalIsOpen] = useState(false);
  const [idForInfoCard, setIdForInfoCard] = useState("");
  const [prevIdForInfoCard, setPrevIdForInfoCard] = useState("");
  const [infoCardType, setInfoTypeCard] = useState(""); // driver, truck, equipment, driver_reports, incident, violation, employee, wcb
  const [prevInfoCardType, setPrevInfoTypeCard] = useState(""); // driver, truck, equipment, driver_reports, incident, violation, employee, wcb
  const [tabToOpen, setTabToOpen] = useState("");
  const [tabData, setTabData] = useState({});

  const handleCardDataSet = (id, cardType, tabToOpen = "", tabData = {}) => {
    setPrevIdForInfoCard(idForInfoCard);
    setPrevInfoTypeCard(infoCardType);
    setIdForInfoCard(id);
    setTabToOpen(tabToOpen);
    setInfoTypeCard(cardType);
    setTabData((prev) => ({ ...prev, ...tabData }));
  };

  const handleModalClose = () => {
    setIdForInfoCard("");
    setPrevIdForInfoCard("");
    setInfoTypeCard("");
    setPrevInfoTypeCard("");
    setTabToOpen("");
    setTabData({});
    setInfoCardModalIsOpen(false);
  };

  return (
    <InfoCardContext.Provider
      value={{
        infoCardModalIsOpen,
        idForInfoCard,
        prevIdForInfoCard,
        infoCardType,
        prevInfoCardType,
        tabToOpen,
        tabData,
        setInfoCardModalIsOpen,
        handleCardDataSet,
        handleModalClose,
      }}
    >
      {children}
    </InfoCardContext.Provider>
  );
};
