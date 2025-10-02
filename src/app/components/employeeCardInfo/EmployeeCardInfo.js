"use client";

import React, { useState, useContext, useRef, useEffect } from "react";
import Image from "next/image";
import Button from "../button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCopy,
  faPhone,
  faEnvelope,
  faArrowsRotate,
  faUpload,
  faPenToSquare,
  faUserPen,
  faIdBadge,
} from "@fortawesome/free-solid-svg-icons";
import InfoCardField from "../infoCardField/InfoCardField";
import calculateAge from "@/app/functions/calculateAge";
import copy from "copy-to-clipboard";
import { EmployeeContext } from "@/app/context/EmployeeContext";
import {
  STATUS_CHOICES,
  TERMINAL_CHOICES,
  IMMIGRATION_STATUS,
  EMPLOYEE_CARD_INFO_FIELDS_FOR_CHANGE,
  DEPARTMENT_CHOICES,
  UPDATE_STATUS_CHOICES_EMPLOYEE,
} from "@/app/assets/tableData";
import phoneNumberFormatter from "@/app/functions/phoneNumberFormatter";
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
import PhotoLoader from "../photoLoader/PhotoLoader";
import { useCreateObject } from "@/app/context/CreateObjectContext";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

function EmployeeCardInfo() {
  const [showCopyDataWindow, setShowCopyDataWindow] = useState(false);
  const [employeeDataToChange, setEmployeeDataToChange] = useState(
    EMPLOYEE_CARD_INFO_FIELDS_FOR_CHANGE
  );
  const [changesToSave, setChangesToSave] = useState(false);
  const [statusChoicesFiltered, setStatusChoicesFiltered] = useState(null);
  const [statusBackground, setStatusBackground] = useState("");
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [showPhotoButtons, setShowPhotoButtons] = useState(false);
  const [openEmployeePhotoLoaderModal, setOpenEmployeePhotoLoaderModal] =
    useState(false);
  const [showInfoModal, setShowInfoModal] = useState({
    show: false,
    message: "",
  });
  const [showMessageToEmployeeModal, setShowMessageToEmployeeModal] =
    useState(false);
  const [showLeavingDateModal, setShowLeavingDateModal] = useState(false);
  const [showStatusNoteModal, setShowStatusNoteModal] = useState(false);
  const [suspendedUntil, setSuspendedUntil] = useState("");

  const { userData, loadEmployeeData } = useContext(EmployeeContext);
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

    for (let item in employeeDataToChange) {
      if (
        item !== "status_note" &&
        item === "update_status_message" &&
        employeeDataToChange.update_status === "OK"
      ) {
        data.append(item, "");
      } else if (
        item === "status_note" &&
        employeeDataToChange.status === "SP" &&
        employeeDataToChange.status !== userData.status
      ) {
        data.append(
          item,
          `${employeeDataToChange[item]} | Will be back on ${suspendedUntil}`
        );
      } else {
        data.append(item, employeeDataToChange[item]);
      }

      if (
        item === "status" &&
        employeeDataToChange[item] !== userData[item] &&
        employeeDataToChange[item] === "AR"
      ) {
        let todayFormattedString = moment
          .tz("America/Winnipeg")
          .format("YYYY-MM-DD");

        data.append("application_date", todayFormattedString);
      }
    }

    data.append("changed_by", session.user.name);

    fetch(`/api/upload-employee-data/${userData.id}`, {
      method: "PATCH",
      body: data,
    }).then((response) => {
      stopLoading();
      setShowMessageToEmployeeModal(false);
      setShowLeavingDateModal(false);
      setShowStatusNoteModal(false);
      setSuspendedUntil("");
      if (response.ok) {
        loadEmployeeData();
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
      employeeDataToChange.update_status !== userData.update_status &&
      employeeDataToChange.update_status === "UR"
    ) {
      setShowMessageToEmployeeModal(true);
    } else if (
      employeeDataToChange.status !== userData.status &&
      (employeeDataToChange.status === "RE" ||
        employeeDataToChange.status === "TE")
    ) {
      setShowLeavingDateModal(true);
    } else if (
      employeeDataToChange.status !== userData.status &&
      (employeeDataToChange.status === "WCB" ||
        employeeDataToChange.status === "OL" ||
        employeeDataToChange.status === "SP" ||
        employeeDataToChange.status === "VA")
    ) {
      setShowStatusNoteModal(true);
    } else {
      saveChanges();
    }
  };

  const handleEmployeePhotoClick = (photoExists) => {
    if (photoExists) {
      setConfirmDeleteModal(true);
    } else {
      setOpenEmployeePhotoLoaderModal(true);
    }
  };

  const deleteEmployeePhoto = async () => {
    try {
      const response = await fetch(`/api/update-file-employee`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          endpointIdentifier: "employee_photo",
          id: userData.employee_photo.id,
          username: session.user.name,
        }),
      });

      setConfirmDeleteModal(false);

      if (response.ok) {
        loadEmployeeData();
      } else {
        console.error("Failed to delete file");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const updateContext = () => {
    loadEmployeeData();
  };

  const handleEmployeeChanges = () => {
    updateContext();
    handleCreateObjectModalClose();
  };

  const handleOpenEditEmployee = () => {
    setAfterCreateCallback(() => handleEmployeeChanges);
    setObjectType("employee");
    setServerData(userData);
    setUpdateObject(true);
    setCreateObjectModalIsOpen(true);
  };

  const downloadEmployeeCardPDF = () => {
    fetch(`/api/get-employee-card-pdf/${userData.id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to download PDF");
        }

        // Extract the filename directly
        const contentDisposition = response.headers.get("Content-Disposition");
        const fileName = contentDisposition.match(/filename="(.+?)"/)[1];

        return response.blob().then((blob) => ({ blob, fileName }));
      })
      .then(({ blob, fileName }) => {
        const downloadUrl = window.URL.createObjectURL(blob); // Create a URL from the Blob
        const a = document.createElement("a"); // Create <a> element
        a.href = downloadUrl;
        a.download = fileName; // Set the filename
        document.body.appendChild(a);
        a.click(); // Simulate click to trigger download
        a.remove(); // Clean up
        window.URL.revokeObjectURL(downloadUrl); // Free up resources
      })
      .catch((error) => {
        console.error("Error downloading the PDF:", error.message);
      });
  };

  useEffect(() => {
    if (!userData) return;

    let data = {};

    for (let key in EMPLOYEE_CARD_INFO_FIELDS_FOR_CHANGE) {
      data[key] = userData[key];
    }

    setEmployeeDataToChange(data);
  }, [userData]);

  useEffect(() => {
    if (!userData) return;

    let changes = false;

    for (let key in employeeDataToChange) {
      if (employeeDataToChange[key] !== userData[key]) {
        changes = true;
        break;
      }
    }

    setChangesToSave(changes);
  }, [userData, employeeDataToChange]);

  useEffect(() => {
    if (!userData || !statusSettings || !statusSettings.employee) return;

    // FORM ARRAY OF ALLOWED STATUSES
    let allowedStatuses = [];
    statusSettings.employee.status_transitions.forEach((element) => {
      if (element.status_from === userData.status) {
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

    let statusColor = statusSettings.employee.status_colors.find(
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
    statusChoicesFiltered && (
      <div className="flex gap-2 relative">
        <div className="flex flex-col gap-2 max-w-52">
          <div
            className="relative"
            onMouseEnter={() => setShowPhotoButtons(true)}
            onMouseLeave={() => setShowPhotoButtons(false)}
          >
            <Image
              src={userData.employee_photo.file || "/no_photo_driver.png"}
              alt="Employee Photo"
              width={200}
              height={300}
              style={{ objectFit: "contain", objectPosition: "center top" }}
            />
            {(userRoles.includes(
              process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_ADMIN
            ) ||
              userRoles.includes(
                process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PAYROLL
              ) ||
              userRoles.includes(
                process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PAYROLL_MANAGER
              ) ||
              userRoles.includes(
                process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_HR
              )) && (
              <div
                onClick={() =>
                  handleEmployeePhotoClick(!!userData.employee_photo.file)
                }
                className={`${
                  showPhotoButtons ? "flex" : "hidden"
                } items-center justify-center w-full h-fit gap-2 py-1 bg-white bg-opacity-70 absolute bottom-0 left-0 cursor-pointer hover:text-red-500`}
              >
                {userData.employee_photo.file ? (
                  <FontAwesomeIcon icon={faTrashCan} />
                ) : (
                  <FontAwesomeIcon icon={faUpload} />
                )}
                {userData.employee_photo.file ? "Delete photo" : "Upload photo"}
              </div>
            )}
          </div>
          <div className="flex gap-2 items-center justify-center">
            <Button
              content={
                <FontAwesomeIcon
                  className="pointer-events-none"
                  icon={faIdBadge}
                />
              }
              style={"iconButton-l"}
              fn={downloadEmployeeCardPDF}
              tooltipId={"card_in_pdf_tooltip"}
              tooltipContent={"Employee ID Card"}
            />
            {userRoles.includes(
              process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_ADMIN
            ) && (
              <Link
                className="leading-none p-1 rounded text-xl hover:bg-[#b92531] hover:text-white hover:shadow-sm active:bg-orange-600 cursor-pointer"
                target="_blank"
                href={`${process.env.NEXT_PUBLIC_OFFICE_ADMIN_URL}${userData.id}/change/`}
              >
                <FontAwesomeIcon
                  className="pointer-events-none"
                  icon={faUserPen}
                />
              </Link>
            )}
            {(userRoles.includes(
              process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_ADMIN
            ) ||
              userRoles.includes(
                process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PAYROLL
              ) ||
              userRoles.includes(
                process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PAYROLL_MANAGER
              ) ||
              userRoles.includes(
                process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_HR
              )) && (
              <Button
                content={
                  <FontAwesomeIcon
                    className="pointer-events-none"
                    icon={faPenToSquare}
                  />
                }
                style={"iconButton-l"}
                fn={handleOpenEditEmployee}
                tooltipId={"edit_driver_data_button_tooltip"}
                tooltipContent={"Edit employee data"}
              />
            )}
            <Button
              content={
                <FontAwesomeIcon
                  className="pointer-events-none"
                  icon={faArrowsRotate}
                />
              }
              style={"iconButton-l"}
              fn={loadEmployeeData}
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
            {IMMIGRATION_STATUS[userData.immigration_status]}
          </p>
        </div>
        <div className="flex flex-col grow">
          <InfoCardField
            label={"Employee ID"}
            value={userData.employee_id}
            side={
              userRoles.includes(
                process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_ADMIN
              ) ||
              userRoles.includes(
                process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PAYROLL_MANAGER
              ) ||
              userRoles.includes(
                process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PAYROLL
              ) ||
              userRoles.includes(
                process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_HR
              ) ? (
                <div className="flex gap-1">
                  <OptionsSelector
                    value={employeeDataToChange.update_status}
                    updateState={setEmployeeDataToChange}
                    name={"update_status"}
                    data={UPDATE_STATUS_CHOICES_EMPLOYEE}
                    style={"small"}
                  />
                  <OptionsSelector
                    value={employeeDataToChange.status}
                    updateState={setEmployeeDataToChange}
                    name={"status"}
                    data={statusChoicesFiltered}
                    style={"small"}
                    background={statusBackground}
                  />
                </div>
              ) : (
                <div className="flex gap-3">
                  <p className="font-semibold">
                    {UPDATE_STATUS_CHOICES_EMPLOYEE[userData.update_status]}
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
            label={"Card #"}
            value={userData.card_number}
            side={
              <Button
                content={<FontAwesomeIcon icon={faCopy} />}
                style={"iconButton"}
                fn={() => handleCopy(userData.card_number)}
                tooltipContent={"Copy employee card number"}
                tooltipId={"copyCardNumber_tooltip"}
              />
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
                tooltipContent={"Copy employee name"}
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
                  href={`https://wa.me/${userData.phone_number}`}
                  target="_blank"
                >
                  <Button
                    content={<FontAwesomeIcon icon={faWhatsapp} />}
                    style={"iconButton"}
                    fn={null}
                    tooltipContent={"Contact via WhatsApp"}
                    tooltipId={"contactWhatsApp_tooltip"}
                  />
                </Link>
                <Button
                  content={<FontAwesomeIcon icon={faPhone} />}
                  style={"iconButton"}
                  fn={() => callPhoneNumber(userData.phone_number)}
                  tooltipContent={"Call employee"}
                  tooltipId={"callEmployee_tooltip"}
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
              <p>
                {userData.title} | {DEPARTMENT_CHOICES[userData.department]}
              </p>
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
              fn={() => deleteEmployeePhoto()}
            />
          </div>
        </ModalContainer>
        <ModalContainer modalIsOpen={showInfoModal.show}>
          <p className="font-bold text-red-600">{showInfoModal.message}</p>
          <Button
            content={"Cancel"}
            style={"classicButton"}
            fn={() => setShowInfoModal({ show: false, message: "" })}
          />
        </ModalContainer>
        <ModalContainer modalIsOpen={showMessageToEmployeeModal}>
          <TextareaInput
            name={"update_status_message"}
            label={"Message for employee"}
            value={employeeDataToChange.update_status_message}
            updateState={setEmployeeDataToChange}
          />
          <div className="flex justify-between items-center">
            <Button
              content={"Cancel"}
              style={"classicButton"}
              fn={() => setShowMessageToEmployeeModal(false)}
            />
            <Button
              content={"Send"}
              style={"classicButton"}
              fn={saveChanges}
              highlighted={true}
              disabled={employeeDataToChange.update_status_message.length === 0}
              tooltipId={"update_status_message_tooltip"}
              tooltipContent={
                employeeDataToChange.update_status_message.length === 0
                  ? "Please input the message for employee first"
                  : "Send message to employee and save data"
              }
            />
          </div>
        </ModalContainer>
        <ModalContainer modalIsOpen={showLeavingDateModal}>
          <DateInput
            name={"date_of_leaving"}
            label={"employee leaving date"}
            value={employeeDataToChange.date_of_leaving}
            updateState={setEmployeeDataToChange}
          />
          <TextareaInput
            name={"reason_for_leaving"}
            value={employeeDataToChange.reason_for_leaving}
            placeholder={"Please input reason of leaving here"}
            updateState={setEmployeeDataToChange}
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
                employeeDataToChange.date_of_leaving.length === 0 ||
                employeeDataToChange.reason_for_leaving.length === 0
              }
              tooltipId={"date_of_leaving_tooltip"}
              tooltipContent={
                employeeDataToChange.date_of_leaving.length === 0 ||
                employeeDataToChange.reason_for_leaving.length === 0
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
            value={employeeDataToChange.status_note}
            updateState={setEmployeeDataToChange}
          />
          {employeeDataToChange.status === "SP" && (
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
                employeeDataToChange.status_note.length === 0 ||
                (suspendedUntil.length === 0 &&
                  employeeDataToChange.status === "SP")
              }
              tooltipId={"status_note_tooltip"}
              tooltipContent={
                employeeDataToChange.status_note.length === 0 ||
                (suspendedUntil.length === 0 &&
                  employeeDataToChange.status === "SP")
                  ? "Please input the status note for employee first"
                  : "Save data"
              }
            />
          </div>
        </ModalContainer>
        <PhotoLoader
          driverId={userData.id}
          data={findHighestIdObject(userData.employee_photo)}
          apiRoute={"/api/update-file-employee"}
          name={"employee_photo"}
          label={"Upload employee Photo"}
          keyName={"employee_photo"}
          loadData={loadEmployeeData}
          modalIsOpen={openEmployeePhotoLoaderModal}
          dataType={"employee"}
          setModalIsOpen={setOpenEmployeePhotoLoaderModal}
        />
      </div>
    )
  );
}

export default EmployeeCardInfo;
