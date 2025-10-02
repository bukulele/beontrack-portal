"use client";

import React, { useState } from "react";
import Button from "../button/Button";
import { useLoader } from "@/app/context/LoaderContext";
import ModalContainer from "../modalContainer/ModalContainer";
import compressAllFiles from "@/app/functions/compressAllFiles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
// Only import Compressor and heic2any if we're on the client

function FileLoaderMultiple({
  apiRoute,
  name,
  label,
  disabled,
  uploadKey,
  dataType,
  driverId,
  loadData,
  accept,
}) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [filesLoaded, setFilesLoaded] = useState(null);
  const [fileSent, setFileSent] = useState(false);

  const { startLoading, stopLoading } = useLoader();

  const showLoadFileModal = () => {
    setModalIsOpen(true);
  };

  const closeLoadFileModal = () => {
    setFileSent(false);
    setModalIsOpen(false);
  };

  const handleFileChange = async (event) => {
    startLoading();
    const { files } = event.target;
    const compressedFiles = await compressAllFiles(Array.from(files));

    setFilesLoaded(compressedFiles);
    stopLoading();

    // compressAllFiles(Array.from(files));
  };

  const uploadFiles = () => {
    startLoading();
    const data = new FormData();

    data.append(dataType, driverId);

    filesLoaded.forEach((file) => {
      data.append(uploadKey, file);
    });

    fetch(apiRoute, {
      method: "POST",
      body: data,
    })
      .then((response) => {
        stopLoading();
        if (response.ok) {
          loadData();
          setFileSent(true);
        } else {
          console.error("Error sending files");
        }
      })
      .catch((error) => {
        console.error("Error sending files:", error);
      });
  };

  return (
    <>
      <Button
        content={<FontAwesomeIcon icon={faPlus} />}
        style={"iconButton"}
        fn={showLoadFileModal}
        highlighted={true}
        disabled={disabled}
      />
      <ModalContainer modalIsOpen={modalIsOpen}>
        {fileSent ? (
          <>
            <p>File sent successfully</p>
            <Button
              content={"OK"}
              style={"classicButton"}
              fn={closeLoadFileModal}
            />
          </>
        ) : (
          <div className="prose flex flex-col gap-2">
            <h4 className="text-center">{label}</h4>
            <input
              className="rounded border-gray-300"
              id={name}
              name={name}
              type={"file"}
              onChange={handleFileChange}
              multiple
              accept={accept}
            />
            <div className="flex gap-3 mt-3">
              <Button
                content={"Close"}
                style={"classicButton"}
                fn={closeLoadFileModal}
              />
              <Button
                content={"Add files"}
                style={"classicButton"}
                fn={uploadFiles}
                disabled={!filesLoaded}
              />
            </div>
          </div>
        )}
      </ModalContainer>
    </>
  );
}

export default FileLoaderMultiple;
