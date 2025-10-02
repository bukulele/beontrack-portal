import React, { useEffect } from "react";
import Modal from "react-modal";
import { useInfoCard } from "@/app/context/InfoCardContext";
import DriverCard from "../driverCard/DriverCard";
import TruckCard from "../truckCard/TruckCard";
import EquipmentCard from "../equipmentCard/EquipmentCard";
import DriverReportCard from "../driverReportCard/DriverReportCard";
import IncidentCard from "../incidentCard/IncidentCard";
import ViolationCard from "../violationCard/ViolationCard";
import EmployeeCard from "../employeeCard/EmployeeCard";
import WCBCard from "../wcbCard/WCBCard";

function InfoCardModalContainer() {
  const {
    infoCardModalIsOpen,
    idForInfoCard,
    infoCardType,
    handleModalClose,
    tabToOpen,
    tabData,
  } = useInfoCard();

  useEffect(() => {
    Modal.setAppElement("main");
  }, []);

  return (
    <Modal
      isOpen={infoCardModalIsOpen}
      contentLabel="Modal Popup"
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
      onRequestClose={handleModalClose}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1,
        },
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#fff",
          padding: "0",
          borderRadius: "5px",
          color: "black",
          maxHeight: "98%",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "98%",
          height: "100%",
          overflow: "clip",
        },
      }}
    >
      <div className="h-full">
        {infoCardType === "driver" && (
          <DriverCard userId={idForInfoCard} tabToOpen={tabToOpen} />
        )}
        {infoCardType === "truck" && <TruckCard truckId={idForInfoCard} />}
        {infoCardType === "equipment" && (
          <EquipmentCard equipmentId={idForInfoCard} />
        )}
        {infoCardType === "driver_reports" && (
          <DriverReportCard driverReportId={idForInfoCard} />
        )}
        {infoCardType === "incident" && (
          <IncidentCard incidentId={idForInfoCard} />
        )}
        {infoCardType === "violation" && (
          <ViolationCard violationId={idForInfoCard} />
        )}
        {infoCardType === "wcb" && <WCBCard wcbId={idForInfoCard} />}
        {infoCardType === "employee" && (
          <EmployeeCard
            tabToOpen={tabToOpen}
            userId={idForInfoCard}
            tabData={tabData}
          />
        )}
      </div>
    </Modal>
  );
}

export default InfoCardModalContainer;
