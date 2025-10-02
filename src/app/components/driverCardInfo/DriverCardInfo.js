"use client";

import React, { useState, useContext, useRef, useEffect } from "react";
import Image from "next/image";
import Button from "../button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCopy,
  faPhone,
  faEnvelope,
  faCheck,
  faPaperPlane,
  faArrowsRotate,
  faUpload,
  faArrowUpRightFromSquare,
  faPenToSquare,
  faUserPen,
} from "@fortawesome/free-solid-svg-icons";
import InfoCardField from "../infoCardField/InfoCardField";
import calculateAge from "@/app/functions/calculateAge";
import copy from "copy-to-clipboard";
import { DriverContext } from "@/app/context/DriverContext";
import {
  STATUS_CHOICES,
  TERMINAL_CHOICES,
  DRIVERTYPE_CHOICES,
  IMMIGRATION_STATUS,
  UPDATE_STATUS_CHOICES,
  DRIVER_CARD_INFO_FIELDS_FOR_CHANGE,
} from "@/app/assets/tableData";
import phoneNumberFormatter from "@/app/functions/phoneNumberFormatter";
import defineRoutes from "@/app/functions/defineRoutes";
import Link from "next/link";
import timePassedFrom from "@/app/functions/timePassedFrom";
import callPhoneNumber from "@/app/functions/callPhoneNumber";
import postalCodeFormatter from "@/app/functions/postalCodeFormatter";
import OptionsSelector from "../optionsSelector/OptionsSelector";
import { faFloppyDisk, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import useUserRoles from "@/app/functions/useUserRoles";
import { useLoader } from "@/app/context/LoaderContext";
import formatDate from "@/app/functions/formatDate";
import { SettingsContext } from "@/app/context/SettingsContext";
import findHighestIdObject from "@/app/functions/findHighestIdObject";
import { useSession } from "next-auth/react";
import ModalContainer from "../modalContainer/ModalContainer";
import TextareaInput from "../textareaInput/TextareaInput";
import moment from "moment-timezone";
import DateInput from "../dateInput/DateInput";
import { useInfoCard } from "@/app/context/InfoCardContext";
import TextInputSearch from "../textInput/TextInputSearch";
import PhotoLoader from "../photoLoader/PhotoLoader";
import { useCreateObject } from "@/app/context/CreateObjectContext";
import InfoMessageModalContainer from "../modalContainer/InfoMessageModalContainer";

function DriverCardInfo() {
  const DRIVER_STATUS_ALLOWED_FOR_RECRUITING = [
    "NW",
    "AR",
    "UR",
    "OH",
    "RO",
    "TR",
    "RJ",
    "AC",
    "VA",
    "OL",
  ];
  const [showCopyDataWindow, setShowCopyDataWindow] = useState(false);
  const [driverDataToChange, setDriverDataToChange] = useState(
    DRIVER_CARD_INFO_FIELDS_FOR_CHANGE
  );
  const [changesToSave, setChangesToSave] = useState(false);
  const [statusChoicesFiltered, setStatusChoicesFiltered] = useState(null);
  const [statusBackground, setStatusBackground] = useState("");
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [showPhotoButtons, setShowPhotoButtons] = useState(false);
  const [openDriverPhotoLoaderModal, setOpenDriverPhotoLoaderModal] =
    useState(false);
  const [showInfoModal, setShowInfoModal] = useState({
    show: false,
    message: "",
  });
  const [showMessageToDriverModal, setShowMessageToDriverModal] =
    useState(false);
  const [showLeavingDateModal, setShowLeavingDateModal] = useState(false);
  const [showStatusNoteModal, setShowStatusNoteModal] = useState(false);
  const [suspendedUntil, setSuspendedUntil] = useState("");

  const { userData, driverList, loadData } = useContext(DriverContext);
  const { statusSettings } = useContext(SettingsContext);

  const { data: session } = useSession();
  const { startLoading, stopLoading } = useLoader();
  const userRoles = useUserRoles();

  const {
    setCreateObjectModalIsOpen,
    setObjectType,
    handleCreateObjectModalClose,
    setServerData,
    setAfterCreateCallback,
    setUpdateObject,
  } = useCreateObject();

  const timeoutRef = useRef(null);

  const { handleCardDataSet } = useInfoCard();

  const openDriverCard = () => {
    handleCardDataSet(userData.work_for_driver, "driver");
  };

  const openEmailClient = (email) => {
    window.location.href = `mailto:${email}`;
  };

  const handleCopy = (data) => {
    clearTimeout(timeoutRef.current);
    setShowCopyDataWindow(true);
    copy(data);
    timeoutRef.current = setTimeout(() => {
      setShowCopyDataWindow(false);
    }, 3000);
  };

  const saveChanges = () => {
    startLoading();

    const data = new FormData();

    for (let item in driverDataToChange) {
      if (
        item !== "status_note" &&
        item === "update_status_message" &&
        driverDataToChange.update_status === "OK"
      ) {
        data.append(item, "");
      } else if (
        item === "status_note" &&
        driverDataToChange.status === "SP" &&
        driverDataToChange.status !== userData.status
      ) {
        data.append(
          item,
          `${driverDataToChange[item]} | Will be back on ${suspendedUntil}`
        );
      } else {
        data.append(item, driverDataToChange[item]);
      }

      if (
        item === "status" &&
        driverDataToChange[item] !== userData[item] &&
        driverDataToChange[item] === "AR"
      ) {
        let todayFormattedString = moment
          .tz("America/Winnipeg")
          .format("YYYY-MM-DD");

        data.append("application_date", todayFormattedString);
      }
    }

    fetch(`/api/upload-driver-data/${userData.id}`, {
      method: "PATCH",
      body: data,
    }).then((response) => {
      stopLoading();
      setShowMessageToDriverModal(false);
      setShowLeavingDateModal(false);
      setShowStatusNoteModal(false);
      setSuspendedUntil("");
      if (response.ok) {
        loadData();
      } else {
        setShowInfoModal({
          show: true,
          message: "Something went wrong. Please try to save changes again.",
        });
      }
    });
  };

  const handleSaveChanges = () => {
    if (
      driverDataToChange.update_status !== userData.update_status &&
      driverDataToChange.update_status === "UR"
    ) {
      setShowMessageToDriverModal(true);
    } else if (
      driverDataToChange.status !== userData.status &&
      (driverDataToChange.status === "RE" || driverDataToChange.status === "TE")
    ) {
      setShowLeavingDateModal(true);
    } else if (
      driverDataToChange.status !== userData.status &&
      (driverDataToChange.status === "WCB" ||
        driverDataToChange.status === "OL" ||
        driverDataToChange.status === "SP" ||
        driverDataToChange.status === "VA")
    ) {
      setShowStatusNoteModal(true);
    } else {
      saveChanges();
    }
  };

  const handleDriverPhotoClick = (photoExists) => {
    if (photoExists) {
      setConfirmDeleteModal(true);
    } else {
      setOpenDriverPhotoLoaderModal(true);
    }
  };

  const deleteDriverPhoto = async () => {
    try {
      const response = await fetch(`/api/update-file`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          endpointIdentifier: "driver_photo",
          id: userData.driver_photo.id,
          username: session.user.name,
        }),
      });

      setConfirmDeleteModal(false);

      if (response.ok) {
        loadData();
      } else {
        console.error("Failed to delete file");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const updateContext = () => {
    loadData();
  };

  const handleDriverChanges = () => {
    updateContext();
    handleCreateObjectModalClose();
  };

  const handleOpenEditDriver = () => {
    setAfterCreateCallback(() => handleDriverChanges);
    setObjectType("driver");
    setServerData(userData);
    setUpdateObject(true);
    setCreateObjectModalIsOpen(true);
  };

  useEffect(() => {
    if (!userData) return;

    let data = {};

    for (let key in DRIVER_CARD_INFO_FIELDS_FOR_CHANGE) {
      data[key] = userData[key];
    }

    setDriverDataToChange(data);
  }, [userData]);

  useEffect(() => {
    if (!userData) return;

    let changes = false;

    for (let key in driverDataToChange) {
      if (driverDataToChange[key] !== userData[key]) {
        changes = true;
        break;
      }
    }

    setChangesToSave(changes);
  }, [userData, driverDataToChange]);

  useEffect(() => {
    if (!userData || !statusSettings) return;

    // FORM ARRAY OF ALLOWED STATUSES
    let allowedStatuses = [];
    statusSettings.driver.status_transitions.forEach((element) => {
      if (
        element.status_from === userData.status &&
        // EXCLUDE TR OR AC STATUS DEPENDING ON MENTOR FORM CHECKED
        ((findHighestIdObject(userData.mentor_forms).was_reviewed &&
          element.status_to !== "TR") ||
          (!findHighestIdObject(userData.mentor_forms).was_reviewed &&
            element.status_to !== "AC"))
      ) {
        allowedStatuses.push(element.status_to);
      }
    });

    // FILTER STATUS_CHOICES OBJECT
    let statusesFiltered = {};

    for (let key in STATUS_CHOICES) {
      if (allowedStatuses.includes(key) || key === userData.status) {
        statusesFiltered[key] = STATUS_CHOICES[key];
      }
    }

    setStatusChoicesFiltered(statusesFiltered);

    let statusColor = statusSettings.driver.status_colors.find(
      (element) => element.status === userData.status
    );

    if (statusColor && statusColor.color) {
      setStatusBackground(statusColor.color);
    } else {
      setStatusBackground("grey");
    }
  }, [userData, statusSettings]);

  return (
    userData &&
    driverList &&
    statusChoicesFiltered && (
      <div className="flex gap-2 relative">
        <div className="flex flex-col gap-2 max-w-52">
          <div
            className="relative"
            onMouseEnter={() => setShowPhotoButtons(true)}
            onMouseLeave={() => setShowPhotoButtons(false)}
          >
            <Image
              src={userData.driver_photo.file || "/no_photo_driver.png"}
              alt="Driver Photo"
              width={200}
              height={300}
              style={{ objectFit: "contain", objectPosition: "center top" }}
            />
            {!userRoles.includes(
              process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PLANNER
            ) &&
              !userRoles.includes(
                process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_DISPATCH
              ) &&
              !userRoles.includes(
                process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_SHOP
              ) && (
                <div
                  onClick={() =>
                    handleDriverPhotoClick(!!userData.driver_photo.file)
                  }
                  className={`${
                    showPhotoButtons ? "flex" : "hidden"
                  } items-center justify-center w-full h-fit gap-2 py-1 bg-white bg-opacity-70 absolute bottom-0 left-0 cursor-pointer hover:text-red-500`}
                >
                  {userData.driver_photo.file ? (
                    <FontAwesomeIcon icon={faTrashCan} />
                  ) : (
                    <FontAwesomeIcon icon={faUpload} />
                  )}
                  {userData.driver_photo.file ? "Delete photo" : "Upload photo"}
                </div>
              )}
          </div>
          <div className="flex gap-2 items-center justify-center">
            {userRoles.includes(
              process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_ADMIN
            ) && (
              <Link
                className="leading-none p-1 rounded text-xl hover:bg-[#b92531] hover:text-white hover:shadow-sm active:bg-orange-600 cursor-pointer"
                target="_blank"
                href={`${process.env.NEXT_PUBLIC_DRIVERS_ADMIN_URL}${userData.id}/change/`}
              >
                <FontAwesomeIcon icon={faUserPen} />
              </Link>
            )}
            {(userRoles.includes(
              process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_ADMIN
            ) ||
              userRoles.includes(
                process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_RECRUITING
              ) ||
              userRoles.includes(
                process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_SAFETY
              )) && (
              <Button
                content={<FontAwesomeIcon icon={faPenToSquare} />}
                style={"iconButton-l"}
                fn={handleOpenEditDriver}
                tooltipId={"edit_driver_data_button_tooltip"}
                tooltipContent={"Edit driver data"}
              />
            )}
            <Button
              content={<FontAwesomeIcon icon={faArrowsRotate} />}
              style={"iconButton-l"}
              fn={loadData}
              tooltipId={"refresh_button_tooltip"}
              tooltipContent={"Refresh"}
            />
            {changesToSave && (
              <Button
                content={<FontAwesomeIcon icon={faFloppyDisk} />}
                style={"iconButton-l"}
                fn={handleSaveChanges}
                tooltipId={"save_button_tooltip"}
                tooltipContent={"Save changes"}
                highlighted={true}
              />
            )}
          </div>
          <p className="font-semibold">
            {DRIVERTYPE_CHOICES[userData.driver_type]}
          </p>
          {userData.lcv_certified && (
            <p className="font-semibold">
              LCV driver: {<FontAwesomeIcon icon={faCheck} />}
            </p>
          )}
          {userData.cp_driver && (
            <p className="font-semibold">
              CP driver: {<FontAwesomeIcon icon={faCheck} />}
            </p>
          )}
          <p className="font-semibold">
            {IMMIGRATION_STATUS[userData.immigration_status]}
          </p>
        </div>
        <div className="flex flex-col grow">
          <InfoCardField
            label={"Driver ID"}
            value={userData.driver_id}
            side={
              userRoles.includes(
                process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_SAFETY
              ) ||
              (userRoles.includes(
                process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_RECRUITING
              ) &&
                DRIVER_STATUS_ALLOWED_FOR_RECRUITING.includes(
                  userData.status
                )) ? (
                <div className="flex gap-1">
                  <OptionsSelector
                    value={driverDataToChange.update_status}
                    updateState={setDriverDataToChange}
                    name={"update_status"}
                    data={UPDATE_STATUS_CHOICES}
                    style={"small"}
                  />
                  <OptionsSelector
                    value={driverDataToChange.status}
                    updateState={setDriverDataToChange}
                    name={"status"}
                    data={statusChoicesFiltered}
                    style={"small"}
                    background={statusBackground}
                  />
                </div>
              ) : (
                <div className="flex gap-3">
                  <p className="font-semibold">
                    {UPDATE_STATUS_CHOICES[userData.update_status]}
                  </p>
                  |
                  <p className="font-semibold">
                    <span
                      style={{
                        backgroundColor: statusBackground,
                      }}
                      className="px-2 py-1 text-white rounded-full"
                    >
                      {STATUS_CHOICES[userData.status]}
                    </span>
                  </p>
                </div>
              )
            }
          />
          <InfoCardField
            label={"Name"}
            value={`${userData.first_name} ${userData.last_name}`}
            side={
              <Button
                content={<FontAwesomeIcon icon={faCopy} />}
                style={"iconButton"}
                fn={() =>
                  handleCopy(`${userData.first_name} ${userData.last_name}`)
                }
                tooltipContent={"Copy driver name"}
                tooltipId={"copyName_tooltip"}
              />
            }
          />
          <InfoCardField
            label={"Phone"}
            value={`+1 ${phoneNumberFormatter(
              userData.phone_number.slice(-10)
            )}`}
            side={
              <>
                <Link
                  href={`https://t.me/${userData.phone_number}`}
                  target="_blank"
                >
                  <Button
                    content={<FontAwesomeIcon icon={faPaperPlane} />}
                    style={"iconButton"}
                    fn={null}
                    tooltipContent={"Contact via telegram"}
                    tooltipId={"contactTelegram_tooltip"}
                  />
                </Link>
                <Button
                  content={<FontAwesomeIcon icon={faPhone} />}
                  style={"iconButton"}
                  fn={() => callPhoneNumber(userData.phone_number)}
                  tooltipContent={"Call driver"}
                  tooltipId={"callDriver_tooltip"}
                />
                <Button
                  content={<FontAwesomeIcon icon={faCopy} />}
                  style={"iconButton"}
                  fn={() => handleCopy(userData.phone_number)}
                  tooltipContent={"Copy phone number"}
                  tooltipId={"copyPhone_tooltip"}
                />
              </>
            }
          />
          <InfoCardField
            label={"Emergency contact"}
            value={userData.emergency_contact}
            side={
              <>
                <Button
                  content={<FontAwesomeIcon icon={faCopy} />}
                  style={"iconButton"}
                  fn={() => handleCopy(userData.emergency_contact)}
                  tooltipContent={"Copy emergency contact"}
                  tooltipId={"copyEmergencyContact_tooltip"}
                />
              </>
            }
          />
          <InfoCardField
            label={"Emergency phone"}
            value={`+1 ${phoneNumberFormatter(
              userData.emergency_phone.slice(-10)
            )}`}
            side={
              <>
                <Button
                  content={<FontAwesomeIcon icon={faPhone} />}
                  style={"iconButton"}
                  fn={() => callPhoneNumber(userData.emergency_phone)}
                  tooltipContent={"Call emergency contact"}
                  tooltipId={"callEmergency_tooltip"}
                />
                <Button
                  content={<FontAwesomeIcon icon={faCopy} />}
                  style={"iconButton"}
                  fn={() => handleCopy(userData.emergency_phone)}
                  tooltipContent={"Copy emergency phone number"}
                  tooltipId={"copyEmergencyPhone_tooltip"}
                />
              </>
            }
          />
          <InfoCardField
            label={"Email"}
            value={userData.email}
            side={
              <>
                <Button
                  content={<FontAwesomeIcon icon={faEnvelope} />}
                  style={"iconButton"}
                  fn={() => openEmailClient(userData.email)}
                  tooltipContent={"Write email"}
                  tooltipId={"writeEmail_tooltip"}
                />
                <Button
                  content={<FontAwesomeIcon icon={faCopy} />}
                  style={"iconButton"}
                  fn={() => handleCopy(userData.email)}
                  tooltipContent={"Copy email"}
                  tooltipId={"copyEmail_tooltip"}
                />
              </>
            }
          />
          <InfoCardField
            label={"Address"}
            value={`${userData.unit_or_suite} ${userData.street_number} ${
              userData.street
            }, ${userData.city}, ${userData.province}, ${postalCodeFormatter(
              userData.postal_code
            )} `}
            side={
              <Button
                content={<FontAwesomeIcon icon={faCopy} />}
                style={"iconButton"}
                fn={() =>
                  handleCopy(
                    `${userData.unit_or_suite} ${userData.street_number} ${
                      userData.street
                    }, ${userData.city}, ${
                      userData.province
                    }, ${postalCodeFormatter(userData.postal_code)} `
                  )
                }
                tooltipContent={"Copy address"}
                tooltipId={"copyAddress_tooltip"}
              />
            }
          />
          <InfoCardField
            label={"Date of Birth"}
            value={formatDate(userData.date_of_birth)}
            side={
              <>
                <p className="font-semibold">Age:</p>{" "}
                {calculateAge(userData.date_of_birth)}
              </>
            }
          />
          <InfoCardField
            label={"Terminal"}
            value={TERMINAL_CHOICES[userData.terminal]}
            side={
              <>
                <p className="font-semibold">Routes:</p>{" "}
                {defineRoutes(userData.routes)}
              </>
            }
          />
          <InfoCardField
            label={"Hiring Date"}
            value={`${formatDate(userData.hiring_date)} ${
              timePassedFrom(userData.hiring_date).length &&
              userData.status !== "RE" &&
              userData.status !== "TE"
                ? "(" + timePassedFrom(userData.hiring_date) + ")"
                : ""
            }`}
          />
          <InfoCardField
            label={"Application Date"}
            value={formatDate(userData.application_date)}
          />
          {userData.date_of_leaving &&
            (userData.status === "RE" || userData.status === "TE") && (
              <InfoCardField
                label={"Leaving Date"}
                value={`${formatDate(userData.date_of_leaving)} ${
                  timePassedFrom(userData.hiring_date, userData.date_of_leaving)
                    .length
                    ? "(" +
                      timePassedFrom(
                        userData.hiring_date,
                        userData.date_of_leaving
                      ) +
                      ")"
                    : ""
                }`}
              />
            )}
          {userData.driver_type === "OD" && (
            <InfoCardField
              label={"Owner Operator"}
              value={
                !userRoles.includes(
                  process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PLANNER
                ) &&
                !userRoles.includes(
                  process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_DISPATCH
                ) &&
                !userRoles.includes(
                  process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_SHOP
                ) ? (
                  <TextInputSearch
                    name={"work_for_driver"}
                    value={driverList[driverDataToChange.work_for_driver]}
                    updateState={setDriverDataToChange}
                    style={"small"}
                    searchableData={driverList}
                    searchableFields={["first_name", "last_name", "driver_id"]}
                  />
                ) : (
                  `${
                    driverList[driverDataToChange.work_for_driver].first_name
                  } ${
                    driverList[driverDataToChange.work_for_driver].last_name
                  } ${driverList[driverDataToChange.work_for_driver].driver_id}`
                )
              }
              side={
                <Button
                  content={<FontAwesomeIcon icon={faArrowUpRightFromSquare} />}
                  fn={openDriverCard}
                  style={"iconButton"}
                  highlighted={true}
                  tooltipContent={
                    !userData.work_for_driver ||
                    userData.work_for_driver.length === 0
                      ? ""
                      : "Go To Driver Card"
                  }
                  tooltipId={"go-to-driver-card-tooltip"}
                  disabled={
                    !userData.work_for_driver ||
                    userData.work_for_driver.length === 0
                  }
                />
              }
            />
          )}
        </div>
        {showCopyDataWindow && (
          <div className="absolute left-1/2 mx-auto bg-rose-100 rounded p-2 font-medium shadow-md">
            Data copied to clipboard
          </div>
        )}
        <ModalContainer modalIsOpen={confirmDeleteModal}>
          <p className="font-bold text-red-600">Are you sure to delete file?</p>
          <div className="flex justify-between items-center">
            <Button
              content={"Cancel"}
              style={"classicButton"}
              fn={() => setConfirmDeleteModal(false)}
            />
            <Button
              content={"DELETE"}
              style={"classicButton"}
              highlighted={true}
              fn={() => deleteDriverPhoto()}
            />
          </div>
        </ModalContainer>
        <InfoMessageModalContainer modalIsOpen={showInfoModal.show}>
          <p className="font-bold text-red-600">{showInfoModal.message}</p>
          <Button
            content={"Cancel"}
            style={"classicButton"}
            fn={() => setShowInfoModal({ show: false, message: "" })}
          />
        </InfoMessageModalContainer>
        <ModalContainer modalIsOpen={showMessageToDriverModal}>
          <TextareaInput
            name={"update_status_message"}
            label={"Message for driver"}
            value={driverDataToChange.update_status_message}
            updateState={setDriverDataToChange}
          />
          <div className="flex justify-between items-center">
            <Button
              content={"Cancel"}
              style={"classicButton"}
              fn={() => setShowMessageToDriverModal(false)}
            />
            <Button
              content={"Send"}
              style={"classicButton"}
              fn={saveChanges}
              highlighted={true}
              disabled={driverDataToChange.update_status_message.length === 0}
              tooltipId={"update_status_message_tooltip"}
              tooltipContent={
                driverDataToChange.update_status_message.length === 0
                  ? "Please input the message for driver first"
                  : "Send message to driver and save data"
              }
            />
          </div>
        </ModalContainer>
        <ModalContainer modalIsOpen={showLeavingDateModal}>
          <DateInput
            name={"date_of_leaving"}
            label={"Driver leaving date"}
            value={driverDataToChange.date_of_leaving}
            updateState={setDriverDataToChange}
          />
          <TextareaInput
            name={"reason_for_leaving"}
            value={driverDataToChange.reason_for_leaving}
            placeholder={"Please input reason of leaving here"}
            updateState={setDriverDataToChange}
          />
          <div className="flex justify-between items-center">
            <Button
              content={"Cancel"}
              style={"classicButton"}
              fn={() => setShowLeavingDateModal(false)}
            />
            <Button
              content={"Send"}
              style={"classicButton"}
              fn={saveChanges}
              highlighted={true}
              disabled={
                driverDataToChange.date_of_leaving.length === 0 ||
                driverDataToChange.reason_for_leaving.length === 0
              }
              tooltipId={"date_of_leaving_tooltip"}
              tooltipContent={
                driverDataToChange.date_of_leaving.length === 0 ||
                driverDataToChange.reason_for_leaving.length === 0
                  ? "Please fulfill all the data"
                  : "Save and close"
              }
            />
          </div>
        </ModalContainer>
        <ModalContainer modalIsOpen={showStatusNoteModal}>
          <TextareaInput
            name={"status_note"}
            label={"Please input the status note"}
            value={driverDataToChange.status_note}
            updateState={setDriverDataToChange}
          />
          {driverDataToChange.status === "SP" && (
            <DateInput
              name={"suspended_until"}
              label={"Suspended until"}
              value={suspendedUntil}
              updateState={setSuspendedUntil}
            />
          )}
          <div className="flex justify-between items-center">
            <Button
              content={"Cancel"}
              style={"classicButton"}
              fn={() => setShowStatusNoteModal(false)}
            />
            <Button
              content={"Send"}
              style={"classicButton"}
              fn={saveChanges}
              highlighted={true}
              disabled={
                driverDataToChange.status_note.length === 0 ||
                (suspendedUntil.length === 0 &&
                  driverDataToChange.status === "SP")
              }
              tooltipId={"status_note_tooltip"}
              tooltipContent={
                driverDataToChange.status_note.length === 0 ||
                (suspendedUntil.length === 0 &&
                  driverDataToChange.status === "SP")
                  ? "Please input the status note for driver first"
                  : "Save data"
              }
            />
          </div>
        </ModalContainer>
        <PhotoLoader
          driverId={userData.id}
          data={findHighestIdObject(userData.driver_photo)}
          apiRoute={"/api/update-file"}
          name={"driver_photo"}
          label={"Upload Driver Photo"}
          keyName={"driver_photo"}
          loadData={loadData}
          modalIsOpen={openDriverPhotoLoaderModal}
          dataType={"driver"}
          setModalIsOpen={setOpenDriverPhotoLoaderModal}
        />
      </div>
    )
  );
}

export default DriverCardInfo;
