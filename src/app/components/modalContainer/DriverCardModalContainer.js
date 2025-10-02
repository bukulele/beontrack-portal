import React, { useEffect } from "react";
import Modal from "react-modal";

function DriverCardModalContainer({ modalIsOpen, children, setModalClose }) {
  useEffect(() => {
    Modal.setAppElement("main");
  }, []);

  return (
    <Modal
      isOpen={modalIsOpen}
      contentLabel="Modal Popup"
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
      onRequestClose={setModalClose ? setModalClose : null}
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
      {children}
    </Modal>
  );
}

export default DriverCardModalContainer;
