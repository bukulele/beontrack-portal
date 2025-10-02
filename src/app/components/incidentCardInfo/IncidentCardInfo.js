"use client";

import React, { useState, useContext, useRef, useEffect } from "react";
import Image from "next/image";
import Button from "../button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowsRotate,
  faArrowUpRightFromSquare,
  faGlobe,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import InfoCardField from "../infoCardField/InfoCardField";
import formatDate from "@/app/functions/formatDate";
import { SettingsContext } from "@/app/context/SettingsContext";
import { useLoader } from "@/app/context/LoaderContext";
import { faFileLines, faFloppyDisk } from "@fortawesome/free-regular-svg-icons";
import OptionsSelector from "../optionsSelector/OptionsSelector";
import findHighestIdObject from "@/app/functions/findHighestIdObject";
import {
  CARGO_1_INCIDENT_BLOCK,
  CARGO_2_INCIDENT_BLOCK,
  CONVERTER_INCIDENT_BLOCK,
  DRIVER_1_INCIDENT_BLOCK,
  DRIVER_2_INCIDENT_BLOCK,
  INCIDENT_CARD_FIELDS,
  POLICE_INCIDENT_BLOCK,
  TRAILER_1_INCIDENT_BLOCK,
  TRAILER_2_INCIDENT_BLOCK,
} from "@/app/assets/incidentCardData";
import { IncidentContext } from "@/app/context/IncidentContext";
import {
  INCIDENT_CHECKLIST,
  INCIDENT_STATUS_CHOICES,
} from "@/app/assets/tableData";
import useUserRoles from "@/app/functions/useUserRoles";
import { INCIDENT_CARD_INFO_FIELDS_FOR_CHANGE } from "@/app/assets/tableData";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import NextJsImage from "../nextJsImage/NextJsImage";
import IncidentInfoBlock from "../incidentInfoBlock/IncidentInfoBlock";
import { useInfoCard } from "@/app/context/InfoCardContext";
import { TrucksDriversContext } from "@/app/context/TrucksDriversContext";
import { useCreateObject } from "@/app/context/CreateObjectContext";
import FileLoaderMultiple from "../fileLoader/FileLoaderMultiple";
import MapModalContainer from "../modalContainer/MapModalContainer";
import dynamic from "next/dynamic";
import InfoCardFieldFile from "../infoCardField/InfoCardFieldFile";
import TextareaInput from "../textareaInput/TextareaInput";

const MapComponent = dynamic(() => import("../mapComponent/MapComponent"), {
  ssr: false,
});

function IncidentCardInfo() {
  const [statusChoicesFiltered, setStatusChoicesFiltered] = useState(null);
  const [incidentDataToChange, setIncidentDataToChange] = useState(
    INCIDENT_CARD_INFO_FIELDS_FOR_CHANGE
  );
  const [changesToSave, setChangesToSave] = useState(false);
  const [statusBackground, setStatusBackground] = useState("");
  const [photosArray, setPhotosArray] = useState([]);
  const [photosToShow, setPhotosToShow] = useState([]);
  const [index, setIndex] = useState(-1);
  const [showMapModal, setShowMapModal] = useState(false);
  const [initialCoordinates, setInitialCoordinates] = useState("");

  const { incidentData, loadIncidentData } = useContext(IncidentContext);
  const { hiredDriversList, activeTrucksList, loadTrucksDriversData } =
    useContext(TrucksDriversContext);

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

  const thumbnailsRef = useRef(null);

  const { handleCardDataSet } = useInfoCard();

  const updateContext = () => {
    loadIncidentData();
    loadTrucksDriversData();
  };

  const handleIncidentChanges = () => {
    updateContext();
    handleCreateObjectModalClose();
  };

  const handleOpenEditIncident = () => {
    setAfterCreateCallback(() => handleIncidentChanges);
    setObjectType("incident");
    setServerData(incidentData);
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

  const showInfoFields = () => {
    return Object.values(INCIDENT_CARD_FIELDS).map((field, index) => {
      let value = field.date
        ? formatDate(incidentData[field.key])
        : incidentData[field.key];

      if (field.accessKey) {
        value = findHighestIdObject(incidentData[field.key])[field.accessKey];
      }

      if (field.multiple) {
        value = incidentData[field.key]
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

      if (field.key === "truck") {
        value = `${
          activeTrucksList[incidentData[field.key]]?.unit_number ||
          "[no unit number]"
        } | ${
          findHighestIdObject(
            activeTrucksList[incidentData[field.key]]?.truck_license_plates ||
              "[no license plate]"
          )?.plate_number || ""
        } | ${
          activeTrucksList[incidentData[field.key]]?.make ||
          "[no truck make info]"
        } | ${
          activeTrucksList[incidentData[field.key]]?.model ||
          "[no truck model info]"
        }`;
      }

      let sideData = "";

      if (field.key === "incident_number") {
        sideData = (
          <div className="flex items-center gap-2">
            {incidentData.report && (
              <Button
                content={<FontAwesomeIcon icon={faFileLines} />}
                style={"iconButton-l"}
                fn={() =>
                  handleCardDataSet(incidentData.report, "driver_reports")
                }
                tooltipId={"open_report_card_tooltip"}
                tooltipContent={"Open driver report"}
              />
            )}
            <Button
              content={<FontAwesomeIcon icon={faPenToSquare} />}
              style={"iconButton-l"}
              fn={handleOpenEditIncident}
              tooltipId={"edit_incident_button_tooltip"}
              tooltipContent={"Edit incident"}
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
                  value={incidentDataToChange.status}
                  updateState={setIncidentDataToChange}
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
                    {INCIDENT_STATUS_CHOICES[incidentData.status]}
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
            fn={() => handleCardDataSet(incidentData.truck, "truck")}
            style={"iconButton"}
            highlighted={true}
            tooltipContent={
              !incidentData.truck || incidentData.truck.length === 0
                ? ""
                : "Go To Truck Card"
            }
            tooltipId={`go-to-truck-card-tooltip_${incidentData.truck}`}
            disabled={!incidentData.truck || incidentData.truck.length === 0}
          />
        );
      }

      if (field.key === "location" && incidentData.gps_coordinates.length > 0) {
        sideData = (
          <Button
            content={<FontAwesomeIcon icon={faGlobe} />}
            style={"iconButton"}
            highlighted={true}
            tooltipContent={"View on map"}
            tooltipId={"view_on_map_icon"}
            fn={() => openMap(incidentData.gps_coordinates)}
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

    for (let item in incidentDataToChange) {
      data[item] = incidentDataToChange[item];
    }
    data.id = incidentData.id;

    fetch(`/api/get-incidents`, {
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
    if (!incidentData) return;

    let data = {};

    for (let key in INCIDENT_CARD_INFO_FIELDS_FOR_CHANGE) {
      data[key] = incidentData[key];
    }

    setIncidentDataToChange(data);
  }, [incidentData]);

  useEffect(() => {
    if (!incidentData) return;

    let changes = false;

    for (let key in incidentDataToChange) {
      if (incidentDataToChange[key] !== incidentData[key]) {
        changes = true;
        break;
      }
    }

    setChangesToSave(changes);
  }, [incidentData, incidentDataToChange]);

  useEffect(() => {
    if (!incidentData || !statusSettings) return;

    // FORM ARRAY OF ALLOWED STATUSES
    let allowedStatuses = [];
    statusSettings.equipment.status_transitions.forEach((element) => {
      if (element.status_from === incidentData.status) {
        allowedStatuses.push(element.status_to);
      }
    });

    // FILTER STATUS_CHOICES OBJECT
    let statusesFiltered = {};

    for (let key in INCIDENT_STATUS_CHOICES) {
      // if (allowedStatuses.includes(key) || key === incidentData.status) {
      statusesFiltered[key] = INCIDENT_STATUS_CHOICES[key];
      // }
    }

    setStatusChoicesFiltered(statusesFiltered);

    // let statusColor = statusSettings.equipment.status_colors.find(
    //   (element) => element.status === incidentData.status
    // );

    // setStatusBackground(statusColor.color);
  }, [incidentData, statusSettings]);

  useEffect(() => {
    if (!incidentData) return;

    const photosCombined = [
      ...incidentData.report_photos,
      ...incidentData.incident_photos,
    ];

    const photosForPreview = photosCombined.map((photo) => {
      return { src: photo.photo };
    });

    const photosGallery = photosCombined.map((photo, index) => {
      return (
        <div
          className="cursor-pointer"
          key={`photo_${index}`}
          onClick={() => setIndex(index)}
        >
          <Image
            key={`driverReportData_photo_${photo.id}`}
            src={photo.photo}
            alt={`driverReportData_photo_${photo.id}`}
            width={200}
            height={100}
            style={{ objectFit: "contain", objectPosition: "center top" }}
          />
        </div>
      );
    });

    setPhotosArray(photosForPreview);
    setPhotosToShow(photosGallery);
  }, [incidentData]);

  return (
    incidentData &&
    hiredDriversList &&
    activeTrucksList &&
    statusChoicesFiltered && (
      <div className="flex gap-2 relative">
        <div className="flex flex-col grow">
          {showInfoFields()}
          <InfoCardField
            label={"Analysis"}
            value={
              <TextareaInput
                name={"analysis"}
                value={incidentDataToChange.analysis}
                updateState={setIncidentDataToChange}
              />
            }
          />
          <InfoCardFieldFile
            value={incidentData.incident_documents}
            settings={INCIDENT_CHECKLIST.incident_documents}
            dataId={incidentData.id}
            loadData={loadIncidentData}
            dataType={"incident"}
          />
          <div className="grid grid-cols-2 gap-2 py-2">
            <IncidentInfoBlock
              template={DRIVER_1_INCIDENT_BLOCK}
              title={`Driver: ${
                hiredDriversList[incidentData.main_driver_id]?.first_name || ""
              } ${
                hiredDriversList[incidentData.main_driver_id]?.last_name || ""
              } ${
                hiredDriversList[incidentData.main_driver_id]?.driver_id || ""
              }`}
              side={
                <Button
                  content={<FontAwesomeIcon icon={faArrowUpRightFromSquare} />}
                  fn={() =>
                    handleCardDataSet(incidentData.main_driver_id, "driver")
                  }
                  style={"iconButton"}
                  highlighted={true}
                  tooltipContent={
                    !incidentData.main_driver_id ||
                    incidentData.main_driver_id.length === 0
                      ? ""
                      : "Go To Driver Card"
                  }
                  tooltipId={`go-to-driver-card-tooltip_${incidentData.main_driver_id}`}
                  disabled={
                    !incidentData.main_driver_id ||
                    incidentData.main_driver_id.length === 0
                  }
                />
              }
            />
            <IncidentInfoBlock
              template={DRIVER_2_INCIDENT_BLOCK}
              title={`Co-Driver: ${
                hiredDriversList[incidentData.co_driver_id]?.first_name || ""
              } ${
                hiredDriversList[incidentData.co_driver_id]?.last_name || ""
              } ${
                hiredDriversList[incidentData.co_driver_id]?.driver_id || ""
              }`}
              side={
                <Button
                  content={<FontAwesomeIcon icon={faArrowUpRightFromSquare} />}
                  fn={() =>
                    handleCardDataSet(incidentData.co_driver_id, "driver")
                  }
                  style={"iconButton"}
                  highlighted={true}
                  tooltipContent={
                    !incidentData.co_driver_id ||
                    incidentData.co_driver_id.length === 0
                      ? ""
                      : "Go To Driver Card"
                  }
                  tooltipId={`go-to-driver-card-tooltip_${incidentData.co_driver_id}`}
                  disabled={
                    !incidentData.co_driver_id ||
                    incidentData.co_driver_id.length === 0
                  }
                />
              }
            />
            <IncidentInfoBlock
              template={TRAILER_1_INCIDENT_BLOCK}
              title={"Trailer 1"}
              optional={true}
            />
            <IncidentInfoBlock
              template={CARGO_1_INCIDENT_BLOCK}
              title={"Cargo 1"}
              optional={true}
            />
            {incidentData.trailer_2_unit_number && (
              <>
                <IncidentInfoBlock
                  template={TRAILER_2_INCIDENT_BLOCK}
                  title={"Trailer 2"}
                  optional={true}
                />
                <IncidentInfoBlock
                  template={CARGO_2_INCIDENT_BLOCK}
                  title={"Cargo 2"}
                  optional={true}
                />
              </>
            )}
            <IncidentInfoBlock
              template={POLICE_INCIDENT_BLOCK}
              title={"Police"}
              optional={true}
            />
            <IncidentInfoBlock
              template={CONVERTER_INCIDENT_BLOCK}
              title={"Converter"}
              optional={true}
            />
          </div>
          <div className="mt-3">
            <div className="flex gap-2 items-center">
              <p className="text-lg font-semibold">Incident photos</p>
              <FileLoaderMultiple
                apiRoute={"/api/send-incident-photos"}
                name={"incident_photos"}
                label={"Photos"}
                uploadKey={"photos"}
                dataType={"incident_id"}
                driverId={incidentData.id}
                loadData={loadIncidentData}
                accept={"image/*"}
              />
            </div>
            <div className="grid gap-1 grid-cols-5">{photosToShow}</div>
            <Lightbox
              plugins={[Thumbnails]}
              thumbnails={{ ref: thumbnailsRef }}
              on={{
                click: () => {
                  (thumbnailsRef.current?.visible
                    ? thumbnailsRef.current?.hide
                    : thumbnailsRef.current?.show)?.();
                },
              }}
              index={index}
              slides={photosArray}
              open={index >= 0}
              close={() => setIndex(-1)}
              render={{ slide: NextJsImage }}
            />
          </div>
          <MapModalContainer
            modalIsOpen={showMapModal}
            setModalClose={closeMap}
          >
            <MapComponent
              location={incidentData.location}
              initialCoordinates={initialCoordinates}
            />
          </MapModalContainer>
        </div>
      </div>
    )
  );
}

export default IncidentCardInfo;
