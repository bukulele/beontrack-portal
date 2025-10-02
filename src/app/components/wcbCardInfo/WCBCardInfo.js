"use client";

import React, { useState, useContext, useEffect } from "react";
import Button from "../button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowsRotate,
  faArrowUpRightFromSquare,
  faGlobe,
  faPenToSquare,
  faSquareCheck,
  faSquare,
} from "@fortawesome/free-solid-svg-icons";
import InfoCardField from "../infoCardField/InfoCardField";
import formatDate from "@/app/functions/formatDate";
import { SettingsContext } from "@/app/context/SettingsContext";
import { useLoader } from "@/app/context/LoaderContext";
import { faFileLines, faFloppyDisk } from "@fortawesome/free-regular-svg-icons";
import OptionsSelector from "../optionsSelector/OptionsSelector";
import findHighestIdObject from "@/app/functions/findHighestIdObject";
import { WCB_CARD_FIELDS, WCB_CONTACT_BLOCK } from "@/app/assets/wcbCardData";
import { WCBContext } from "@/app/context/WCBContext";
import {
  WCB_STATUS_CHOICES,
  WCB_CHECKLIST,
  WCB_CARD_INFO_FIELDS_FOR_CHANGE,
} from "@/app/assets/tableData";
import useUserRoles from "@/app/functions/useUserRoles";
import { useInfoCard } from "@/app/context/InfoCardContext";
import { TrucksDriversContext } from "@/app/context/TrucksDriversContext";
import { useCreateObject } from "@/app/context/CreateObjectContext";
import MapModalContainer from "../modalContainer/MapModalContainer";
import dynamic from "next/dynamic";
import InfoCardFieldFile from "../infoCardField/InfoCardFieldFile";
import WCBInfoBlock from "../wcbInfoBlock/WCBInfoBlock";
import TextareaInput from "../textareaInput/TextareaInput";
import { HiredEmployeesContext } from "@/app/context/HiredEmployeesContext";

const MapComponent = dynamic(() => import("../mapComponent/MapComponent"), {
  ssr: false,
});

function WCBCardInfo() {
  const [statusChoicesFiltered, setStatusChoicesFiltered] = useState(null);
  const [wcbDataToChange, setWCBDataToChange] = useState(
    WCB_CARD_INFO_FIELDS_FOR_CHANGE
  );
  const [changesToSave, setChangesToSave] = useState(false);
  const [statusBackground, setStatusBackground] = useState("");
  const [showMapModal, setShowMapModal] = useState(false);
  const [initialCoordinates, setInitialCoordinates] = useState("");

  const { wcbData, loadWCBData } = useContext(WCBContext);
  const { hiredDriversList, activeTrucksList, loadTrucksDriversData } =
    useContext(TrucksDriversContext);
  const { hiredEmployeesList } = useContext(HiredEmployeesContext);

  const { statusSettings } = useContext(SettingsContext);

  const { startLoading, stopLoading } = useLoader();

  const {
    setCreateObjectModalIsOpen,
    setObjectType,
    handleCreateObjectModalClose,
    setServerData,
    setAfterCreateCallback,
    setUpdateObject,
  } = useCreateObject();

  const userRoles = useUserRoles();

  const { handleCardDataSet } = useInfoCard();

  const updateContext = () => {
    loadWCBData();
    loadTrucksDriversData();
  };

  const handleWCBChanges = () => {
    updateContext();
    handleCreateObjectModalClose();
  };

  const handleOpenEditWCB = () => {
    setAfterCreateCallback(() => handleWCBChanges);
    setObjectType("wcb");
    setServerData(wcbData);
    setUpdateObject(true);
    setCreateObjectModalIsOpen(true);
  };

  const openMap = (coords) => {
    setInitialCoordinates(coords);
    setShowMapModal(true);
  };

  const closeMap = () => {
    setInitialCoordinates("");
    setShowMapModal(false);
  };

  const handleOpenEditContactData = () => {
    setAfterCreateCallback(() => handleWCBChanges);
    setObjectType("wcb_contact");
    setServerData(wcbData);
    setUpdateObject(true);
    setCreateObjectModalIsOpen(true);
  };

  const showInfoFields = () => {
    return Object.values(WCB_CARD_FIELDS).map((field, index) => {
      if (
        field.key === "main_driver_id" &&
        String(wcbData[field.key]).length === 0 &&
        String(wcbData.main_employee_id).length > 0
      ) {
        return null;
      }

      if (
        field.key === "main_employee_id" &&
        String(wcbData[field.key]).length === 0 &&
        String(wcbData.main_driver_id).length > 0
      )
        return null;

      let value = field.date
        ? formatDate(wcbData[field.key])
        : wcbData[field.key];
      let sideData = "";

      if (field.accessKey) {
        value = findHighestIdObject(wcbData[field.key])[field.accessKey];
      }

      if (field.multiple) {
        value = wcbData[field.key]
          .map((item) => {
            let res = field.accessKeys
              .map((key) => {
                return item[key];
              })
              .join(" ");
            return res;
          })
          .join(" | ");
      }

      if (typeof value === "boolean") {
        value = value === true ? "Yes" : "No";
      }

      if (field.key === "main_driver_id") {
        value = `${
          hiredDriversList[wcbData.main_driver_id]?.first_name || ""
        } ${hiredDriversList[wcbData.main_driver_id]?.last_name || ""} ${
          hiredDriversList[wcbData.main_driver_id]?.driver_id || ""
        }`;

        sideData = (
          <Button
            content={<FontAwesomeIcon icon={faArrowUpRightFromSquare} />}
            fn={() => handleCardDataSet(wcbData.main_driver_id, "driver")}
            style={"iconButton"}
            highlighted={true}
            tooltipContent={
              !wcbData.main_driver_id || wcbData.main_driver_id.length === 0
                ? ""
                : "Go To Driver Card"
            }
            tooltipId={`go-to-driver-card-tooltip_${wcbData.main_driver_id}`}
            disabled={
              !wcbData.main_driver_id || wcbData.main_driver_id.length === 0
            }
          />
        );
      }

      if (field.key === "main_employee_id") {
        value = `${
          hiredEmployeesList[wcbData.main_employee_id]?.first_name || ""
        } ${hiredEmployeesList[wcbData.main_employee_id]?.last_name || ""} ${
          hiredEmployeesList[wcbData.main_employee_id]?.employee_id || ""
        }`;

        sideData = (
          <Button
            content={<FontAwesomeIcon icon={faArrowUpRightFromSquare} />}
            fn={() => handleCardDataSet(wcbData.main_employee_id, "employee")}
            style={"iconButton"}
            highlighted={true}
            tooltipContent={
              !wcbData.main_employee_id || wcbData.main_employee_id.length === 0
                ? ""
                : "Go To Employee Card"
            }
            tooltipId={`go-to-employee-card-tooltip_${wcbData.main_employee_id}`}
            disabled={
              !wcbData.main_employee_id || wcbData.main_employee_id.length === 0
            }
          />
        );
      }

      if (field.key === "wcb_settings") {
        sideData = (
          <div className="flex gap-2 items-center">
            <div className="flex gap-1 items-center">
              <p className="font-semibold">Traffic Ticket</p>
              <Button
                style={"iconButton"}
                fn={() =>
                  setWCBDataToChange((prev) => {
                    return { ...prev, has_ticket: !prev.has_ticket };
                  })
                }
                content={
                  wcbDataToChange.has_ticket ? (
                    <FontAwesomeIcon icon={faSquareCheck} />
                  ) : (
                    <FontAwesomeIcon icon={faSquare} />
                  )
                }
              />
            </div>
            <div className="flex gap-1 items-center">
              <p className="font-semibold">Inspection</p>
              <Button
                style={"iconButton"}
                fn={() =>
                  setWCBDataToChange((prev) => {
                    return { ...prev, has_inspection: !prev.has_inspection };
                  })
                }
                content={
                  wcbDataToChange.has_inspection ? (
                    <FontAwesomeIcon icon={faSquareCheck} />
                  ) : (
                    <FontAwesomeIcon icon={faSquare} />
                  )
                }
              />
            </div>
            <div className="flex gap-1 items-center">
              <p className="font-semibold">Lawyer Involved</p>
              <Button
                style={"iconButton"}
                fn={() =>
                  setWCBDataToChange((prev) => {
                    return { ...prev, has_lawyer: !prev.has_lawyer };
                  })
                }
                content={
                  wcbDataToChange.has_lawyer ? (
                    <FontAwesomeIcon icon={faSquareCheck} />
                  ) : (
                    <FontAwesomeIcon icon={faSquare} />
                  )
                }
              />
            </div>
          </div>
        );
      }

      if (field.key === "claim_number") {
        sideData = (
          <div className="flex items-center gap-2">
            {wcbData.report && (
              <Button
                content={<FontAwesomeIcon icon={faFileLines} />}
                style={"iconButton-l"}
                fn={() => handleCardDataSet(wcbData.report, "driver_reports")}
                tooltipId={"open_report_card_tooltip"}
                tooltipContent={"Open driver report"}
              />
            )}
            <Button
              content={<FontAwesomeIcon icon={faPenToSquare} />}
              style={"iconButton-l"}
              fn={handleOpenEditWCB}
              tooltipId={"edit_wcb_button_tooltip"}
              tooltipContent={"Edit WCB"}
            />
            <Button
              content={<FontAwesomeIcon icon={faArrowsRotate} />}
              style={"iconButton-l"}
              fn={updateContext}
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
            {userRoles.includes(
              process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_SAFETY
            ) ? (
              <div className="flex gap-1">
                <OptionsSelector
                  value={wcbDataToChange.status}
                  updateState={setWCBDataToChange}
                  name={"status"}
                  data={statusChoicesFiltered}
                  style={"small"}
                  background={statusBackground}
                />
              </div>
            ) : (
              <div className="flex gap-3">
                <p className="font-semibold">
                  <span
                    style={{
                      backgroundColor: statusBackground,
                    }}
                    className="px-2 py-1 text-white rounded-full"
                  >
                    {WCB_STATUS_CHOICES[wcbData.status]}
                  </span>
                </p>
              </div>
            )}
          </div>
        );
      }

      if (field.key === "truck") {
        sideData = (
          <Button
            content={<FontAwesomeIcon icon={faArrowUpRightFromSquare} />}
            fn={() => handleCardDataSet(wcbData.truck, "truck")}
            style={"iconButton"}
            highlighted={true}
            tooltipContent={
              !wcbData.truck || wcbData.truck.length === 0
                ? ""
                : "Go To Truck Card"
            }
            tooltipId={`go-to-truck-card-tooltip_${wcbData.truck}`}
            disabled={!wcbData.truck || wcbData.truck.length === 0}
          />
        );
      }

      if (field.key === "location" && wcbData.gps_coordinates.length > 0) {
        sideData = (
          <Button
            content={<FontAwesomeIcon icon={faGlobe} />}
            style={"iconButton"}
            highlighted={true}
            tooltipContent={"View on map"}
            tooltipId={"view_on_map_icon"}
            fn={() => openMap(wcbData.gps_coordinates)}
          />
        );
      }

      return (
        <InfoCardField
          key={`${field.key}_${index}`}
          label={field.name}
          value={value}
          valueType={field.type}
          side={sideData}
        />
      );
    });
  };

  const handleSaveChanges = () => {
    startLoading();

    const data = {};

    for (let item in wcbDataToChange) {
      data[item] = wcbDataToChange[item];
    }
    data.id = wcbData.id;

    fetch(`/api/get-wcb-claims`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      stopLoading();
      if (response.ok) {
        updateContext();
      }
    });
  };

  useEffect(() => {
    if (!wcbData) return;

    let data = {};

    for (let key in WCB_CARD_INFO_FIELDS_FOR_CHANGE) {
      data[key] = wcbData[key];
    }

    setWCBDataToChange(data);
  }, [wcbData]);

  useEffect(() => {
    if (!wcbData) return;

    let changes = false;

    for (let key in wcbDataToChange) {
      if (wcbDataToChange[key] !== wcbData[key]) {
        changes = true;
        break;
      }
    }

    setChangesToSave(changes);
  }, [wcbData, wcbDataToChange]);

  useEffect(() => {
    if (!wcbData || !statusSettings) return;

    // FORM ARRAY OF ALLOWED STATUSES
    let allowedStatuses = [];
    statusSettings.equipment.status_transitions.forEach((element) => {
      if (element.status_from === wcbData.status) {
        allowedStatuses.push(element.status_to);
      }
    });

    // FILTER STATUS_CHOICES OBJECT
    let statusesFiltered = {};

    for (let key in WCB_STATUS_CHOICES) {
      statusesFiltered[key] = WCB_STATUS_CHOICES[key];
    }

    setStatusChoicesFiltered(statusesFiltered);
  }, [wcbData, statusSettings]);

  return (
    wcbData &&
    hiredDriversList &&
    activeTrucksList &&
    statusChoicesFiltered && (
      <div className="flex gap-2 relative">
        <div className="flex flex-col grow">
          {showInfoFields()}
          <InfoCardField
            label={"Remarks"}
            value={
              <TextareaInput
                name={"remarks"}
                value={wcbDataToChange.remarks}
                updateState={setWCBDataToChange}
              />
            }
          />
          <InfoCardFieldFile
            value={wcbData.wcbclaim_documents}
            settings={WCB_CHECKLIST.wcbclaim_documents}
            dataId={wcbData.id}
            loadData={loadWCBData}
            dataType={"claim"}
          />
          <div className="grid grid-cols-2 gap-2 py-2">
            <WCBInfoBlock
              template={WCB_CONTACT_BLOCK}
              title={"WCB Contact"}
              wcbData={wcbData}
              side={
                <Button
                  content={<FontAwesomeIcon icon={faPenToSquare} />}
                  style={"iconButton-l"}
                  fn={handleOpenEditContactData}
                  tooltipId={"edit_wcb_contact_data_button_tooltip"}
                  tooltipContent={"Edit data"}
                />
              }
            />
          </div>
          <MapModalContainer
            modalIsOpen={showMapModal}
            setModalClose={closeMap}
          >
            <MapComponent
              location={wcbData.location}
              initialCoordinates={initialCoordinates}
            />
          </MapModalContainer>
        </div>
      </div>
    )
  );
}

export default WCBCardInfo;
