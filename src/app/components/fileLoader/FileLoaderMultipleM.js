"use client";

import React, { useState } from "react";
import Button from "../button/Button";
import { useLoader } from "@/app/context/LoaderContext";
import ModalContainer from "../modalContainer/ModalContainer";
import compressAllFiles from "@/app/functions/compressAllFiles";
// Only import Compressor and heic2any if we're on the client

function FileLoaderMultipleM({
  data,
  name,
  label,
  checkAllFields,
  disabled,
  updateState,
  accept,
}) {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const { startLoading, stopLoading } = useLoader();

  const showLoadFileModal = () => {
    setModalIsOpen(true);
  };

  const closeLoadFileModal = () => {
    setModalIsOpen(false);
  };

  const handleFileChange = async (event) => {
    startLoading();
    const { files } = event.target;
    const compressedFiles = await compressAllFiles(Array.from(files));

    updateState((prevData) => ({
      ...prevData,
      [name]: compressedFiles,
    }));
    stopLoading();
  };

  return (
    <div
      className={`flex flex-col border shadow-inner rounded px-5 pb-5 ${
        checkAllFields && data.length === 0 ? "border-pink-500" : ""
      }`}
    >
      <h4>
        {label}
        {checkAllFields !== undefined ? "*" : ""}
      </h4>
      {data.length ? (
        <div className="flex gap-1">
          <p className="font-medium m-0">File loaded:</p>
          <p className="break-all m-0">
            {`${data.length} file${data.length === 1 ? "" : "s"}`}
          </p>
        </div>
      ) : (
        <p>No file loaded</p>
      )}
      <Button
        content={"Load file"}
        style={"classicButton"}
        fn={showLoadFileModal}
        disabled={disabled}
      />
      <ModalContainer modalIsOpen={modalIsOpen}>
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
          </div>
        </div>
      </ModalContainer>
    </div>
  );
}

export default FileLoaderMultipleM;
