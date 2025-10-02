import React, { useState, useEffect, useRef } from "react";
import Button from "../button/Button";
import { useLoader } from "@/app/context/LoaderContext";
import ModalContainer from "../modalContainer/ModalContainer";
import compressFile from "@/app/functions/compressFile";
import convertHeicToJpeg from "@/app/functions/convertHeicToJpeg";
import AvatarEditor from "react-avatar-editor";
import { Slider } from "@/components/ui/slider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateLeft,
  faArrowRotateRight,
  faEraser,
} from "@fortawesome/free-solid-svg-icons";
import { useSession } from "next-auth/react";

function PhotoLoader({
  driverId,
  data,
  dataType,
  apiRoute,
  name,
  label,
  checkAllFields,
  disabled,
  loadData,
  keyName,
  modalIsOpen,
  setModalIsOpen,
}) {
  const [loadedFileName, setLoadedFileName] = useState("");
  // const [modalIsOpen, setModalIsOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [fileSent, setFileSent] = useState(false);
  const [checkSubmitAvailable, setCheckSubmitAvailable] = useState(false);
  const [warned, setWarned] = useState(false);
  const [rotate, setRotate] = useState(0);
  const [scale, setScale] = useState(1);

  const editor = useRef(null);

  const { data: session } = useSession();

  const { startLoading, stopLoading } = useLoader();

  const resetPhotoSettings = () => {
    setRotate(0);
    setScale(1);
  };

  const handleRotate90 = (direction) => {
    let newAngle = rotate;

    if (direction === "left" && rotate > -180) {
      newAngle -= 90;
    } else if (direction === "left" && rotate <= -180) {
      newAngle = 90;
    }

    if (direction === "right" && rotate < 180) {
      newAngle += 90;
    } else if (direction === "right" && rotate >= 180) {
      newAngle = -90;
    }
    setRotate(newAngle);
  };

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
    const file = files[0];
    let processedFile = file;

    try {
      if (file.type === "image/heic" || file.type === "image/heif") {
        processedFile = await convertHeicToJpeg(file);
      }
      processedFile = await compressFile(processedFile);

      setFile(processedFile);
    } catch (error) {
      console.error("Error processing file:", error);
    } finally {
      stopLoading();
    }
  };

  const uploadFile = async () => {
    startLoading();
    const data = new FormData();

    const dataUrl = editor.current.getImage().toDataURL("image/png");
    const res = await fetch(dataUrl);
    const blob = await res.blob();

    data.append("file", blob, `${driverId}_photo.png`);
    // data.append("driver", driverId);
    data.append(dataType, driverId);
    data.append("last_changed_by", session.user.name);
    data.append("endpointIdentifier", keyName);

    fetch(apiRoute, {
      method: "POST",
      body: data,
    })
      .then((response) => {
        stopLoading();
        if (response.ok) {
          loadData();
          // updateState((prevData) => ({
          //   ...prevData,
          //   [name]: [{ file: `${driverId}_photo.png` }],
          // }));
          setFileSent(true);
        } else {
          console.error("Error submitting form");
        }
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
      });
  };

  useEffect(() => {
    if (!data || data.length === 0 || Object.keys(data).length === 0) return;

    let fileName = "";
    let fileNameArr = data.file.split("/");
    fileName = fileNameArr[fileNameArr.length - 1];

    setLoadedFileName(fileName);
  }, [data]);

  useEffect(() => {
    let submitAvailable = true;

    if (!file) {
      submitAvailable = false;
    }

    setCheckSubmitAvailable(submitAvailable);
  }, [file]);

  useEffect(() => {
    if (loadedFileName.length === 0 && checkAllFields) {
      setWarned(true);
    } else {
      setWarned(false);
    }
  }, [checkAllFields, loadedFileName]);

  return (
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
            accept={"image/*"}
          />
          {file && (
            <div className="flex flex-col w-full items-center">
              <AvatarEditor
                ref={editor}
                image={file}
                width={200}
                height={300}
                border={0}
                scale={scale}
                rotate={rotate}
              />
              <div className="flex w-full items-center justify-center gap-2 py-2">
                <Button
                  content={<FontAwesomeIcon icon={faEraser} />}
                  style={"classicButton"}
                  fn={resetPhotoSettings}
                  tooltipContent={"Reset"}
                  tooltipId={"reset_photo_settings_tooltip"}
                />
                <Button
                  content={<FontAwesomeIcon icon={faArrowRotateLeft} />}
                  style={"classicButton"}
                  fn={() => handleRotate90("left")}
                  tooltipContent={"Rotate left"}
                  tooltipId={"rotate_photo_left_tooltip"}
                />
                <Button
                  content={<FontAwesomeIcon icon={faArrowRotateRight} />}
                  style={"classicButton"}
                  fn={() => handleRotate90("right")}
                  tooltipContent={"Rotate right"}
                  tooltipId={"rotate_photo_right_tooltip"}
                />
              </div>
              <div className="w-full flex gap-1">
                <p className="m-0 w-1/5">Rotate</p>
                <Slider
                  className="w-4/5"
                  value={[rotate]}
                  onValueChange={(n) => setRotate(...n)}
                  min={-180}
                  max={180}
                  step={1}
                />
              </div>
              <div className="w-full flex gap-1">
                <p className="m-0 w-1/5">Scale</p>
                <Slider
                  className="w-4/5"
                  value={[scale]}
                  onValueChange={(n) => setScale(...n)}
                  min={1}
                  max={5}
                  step={0.1}
                />
              </div>
            </div>
          )}
          <div className="flex gap-3 mt-3">
            <Button
              content={"Close"}
              style={"classicButton"}
              fn={closeLoadFileModal}
            />
            <Button
              content={"Send file"}
              style={"classicButton"}
              fn={uploadFile}
              disabled={!checkSubmitAvailable}
            />
          </div>
        </div>
      )}
    </ModalContainer>
  );
}

export default PhotoLoader;
