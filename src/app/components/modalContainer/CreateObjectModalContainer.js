import React, { useEffect } from "react";
import Modal from "react-modal";
import { useCreateObject } from "@/app/context/CreateObjectContext";
import { TrucksDriversProvider } from "@/app/context/TrucksDriversContext";
import CreateObjectComponent from "../createObjectComponent/CreateObjectComponent";
import {
  CREATE_OBJECT_API_ENDPOINT_MAPPING,
  CREATE_OBJECT_TEMPLATE_MAPPING,
  OBJECT_TEMPLATE_SETTINGS_MAPPING,
} from "@/app/assets/createObjectTemplate";
import { DriverReportsListProvider } from "@/app/context/DriverReportsListContext";
import { HiredEmployeesProvider } from "@/app/context/HiredEmployeesContext";

function CreateObjectModalContainer() {
  const { createObjectModalIsOpen, objectType } = useCreateObject();

  useEffect(() => {
    Modal.setAppElement("main");
  }, []);

  return (
    <Modal
      isOpen={createObjectModalIsOpen}
      contentLabel="Modal Popup"
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 10,
        },
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#fff",
          padding: "10px",
          borderRadius: "5px",
          color: "black",
          maxHeight: "98%",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "98%",
          overflow: "clip",
        },
      }}
    >
      <TrucksDriversProvider>
        <DriverReportsListProvider>
          <HiredEmployeesProvider>
            <CreateObjectComponent
              createObjectApi={
                CREATE_OBJECT_API_ENDPOINT_MAPPING[objectType] || ""
              }
              objectTemplate={
                CREATE_OBJECT_TEMPLATE_MAPPING[objectType] || null
              }
              objectTemplateSettings={
                OBJECT_TEMPLATE_SETTINGS_MAPPING[objectType] || null
              }
            />
          </HiredEmployeesProvider>
        </DriverReportsListProvider>
      </TrucksDriversProvider>
    </Modal>
  );
}

export default CreateObjectModalContainer;
