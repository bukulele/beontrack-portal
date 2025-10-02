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
import {
  CONVERTER_VIOLATION_BLOCK,
  VIOLATION_CARD_FIELDS,
  POLICE_VIOLATION_BLOCK,
  TRAILER_1_VIOLATION_BLOCK,
  TRAILER_2_VIOLATION_BLOCK,
  TRUCK_VIOLATION_BLOCK,
} from "@/app/assets/violationCardData";
import { ViolationContext } from "@/app/context/ViolationContext";
import {
  CANADIAN_PROVINCES,
  USA_STATES,
  VIOLATION_STATUS_CHOICES,
  VIOLATIONS_CHECKLIST,
} from "@/app/assets/tableData";
import useUserRoles from "@/app/functions/useUserRoles";
import { VIOLATION_CARD_INFO_FIELDS_FOR_CHANGE } from "@/app/assets/tableData";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import NextJsImage from "../nextJsImage/NextJsImage";
import ViolationInfoBlock from "../violationInfoBlock/ViolationInfoBlock";
import { useInfoCard } from "@/app/context/InfoCardContext";
import { TrucksDriversContext } from "@/app/context/TrucksDriversContext";
import { useCreateObject } from "@/app/context/CreateObjectContext";
import FileLoaderMultiple from "../fileLoader/FileLoaderMultiple";
import MapModalContainer from "../modalContainer/MapModalContainer";
import dynamic from "next/dynamic";
import { LAWYER_VIOLATION_BLOCK } from "@/app/assets/violationCardData";
import InfoCardFieldFile from "../infoCardField/InfoCardFieldFile";

const MapComponent = dynamic(() => import("../mapComponent/MapComponent"), {
  ssr: false,
});

function ViolationCardInfo() {
  const [statusChoicesFiltered, setStatusChoicesFiltered] = useState(null);
  const [violationDataToChange, setViolationDataToChange] = useState(
    VIOLATION_CARD_INFO_FIELDS_FOR_CHANGE
  );
  const [changesToSave, setChangesToSave] = useState(false);
  const [statusBackground, setStatusBackground] = useState("");
  const [photosArray, setPhotosArray] = useState([]);
  const [photosToShow, setPhotosToShow] = useState([]);
  const [index, setIndex] = useState(-1);
  const [showMapModal, setShowMapModal] = useState(false);
  const [initialCoordinates, setInitialCoordinates] = useState("");

  const { violationData, loadViolationData } = useContext(ViolationContext);
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
    loadViolationData();
    loadTrucksDriversData();
  };

  const handleViolationChanges = () => {
    updateContext();
    handleCreateObjectModalClose();
  };

  const handleOpenEditViolation = () => {
    setAfterCreateCallback(() => handleViolationChanges);
    setObjectType("violation");
    setServerData(violationData);
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

  const handleOpenEditLawyerData = () => {
    setAfterCreateCallback(() => handleViolationChanges);
    setObjectType("lawyer");
    setServerData(violationData);
    setUpdateObject(true);
    setCreateObjectModalIsOpen(true);
  };

  const showInfoFields = () => {
    return Object.values(VIOLATION_CARD_FIELDS).map((field, index) => {
      let value = field.date
        ? formatDate(violationData[field.key])
        : violationData[field.key];
      let sideData = "";

      if (field.accessKey) {
        value = findHighestIdObject(violationData[field.key])[field.accessKey];
      }

      if (field.multiple) {
        value = violationData[field.key]
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
          hiredDriversList[violationData.main_driver_id]?.first_name || ""
        } ${hiredDriversList[violationData.main_driver_id]?.last_name || ""} ${
          hiredDriversList[violationData.main_driver_id]?.driver_id || ""
        }`;

        sideData = (
          <Button
            content={<FontAwesomeIcon icon={faArrowUpRightFromSquare} />}
            fn={() => handleCardDataSet(violationData.main_driver_id, "driver")}
            style={"iconButton"}
            highlighted={true}
            tooltipContent={
              !violationData.main_driver_id ||
              violationData.main_driver_id.length === 0
                ? ""
                : "Go To Driver Card"
            }
            tooltipId={`go-to-driver-card-tooltip_${violationData.main_driver_id}`}
            disabled={
              !violationData.main_driver_id ||
              violationData.main_driver_id.length === 0
            }
          />
        );
      }

      if (field.key === "violation_settings") {
        sideData = (
          <div className="flex gap-2 items-center">
            <div className="flex gap-1 items-center">
              <p className="font-semibold">Traffic Ticket</p>
              <Button
                style={"iconButton"}
                fn={() =>
                  setViolationDataToChange((prev) => {
                    return { ...prev, has_ticket: !prev.has_ticket };
                  })
                }
                content={
                  violationDataToChange.has_ticket ? (
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
                  setViolationDataToChange((prev) => {
                    return { ...prev, has_inspection: !prev.has_inspection };
                  })
                }
                content={
                  violationDataToChange.has_inspection ? (
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
                  setViolationDataToChange((prev) => {
                    return { ...prev, has_lawyer: !prev.has_lawyer };
                  })
                }
                content={
                  violationDataToChange.has_lawyer ? (
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

      if (field.key === "violation_number") {
        sideData = (
          <div className="flex items-center gap-2">
            {violationData.report && (
              <Button
                content={<FontAwesomeIcon icon={faFileLines} />}
                style={"iconButton-l"}
                fn={() =>
                  handleCardDataSet(violationData.report, "driver_reports")
                }
                tooltipId={"open_report_card_tooltip"}
                tooltipContent={"Open driver report"}
              />
            )}
            <Button
              content={<FontAwesomeIcon icon={faPenToSquare} />}
              style={"iconButton-l"}
              fn={handleOpenEditViolation}
              tooltipId={"edit_violation_button_tooltip"}
              tooltipContent={"Edit violation"}
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
                  value={violationDataToChange.status}
                  updateState={setViolationDataToChange}
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
                    {VIOLATION_STATUS_CHOICES[violationData.status]}
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
            fn={() => handleCardDataSet(violationData.truck, "truck")}
            style={"iconButton"}
            highlighted={true}
            tooltipContent={
              !violationData.truck || violationData.truck.length === 0
                ? ""
                : "Go To Truck Card"
            }
            tooltipId={`go-to-truck-card-tooltip_${violationData.truck}`}
            disabled={!violationData.truck || violationData.truck.length === 0}
          />
        );
      }

      if (field.key === "location") {
        value = `${violationData.city || "[city]"} | ${
          violationData.country === "USA"
            ? USA_STATES[violationData.province] || "[state]"
            : CANADIAN_PROVINCES[violationData.province] || "[province]"
        } | ${violationData.country || "[country]"}`;
      }

      if (
        field.key === "location" &&
        violationData.gps_coordinates.length > 0
      ) {
        sideData = (
          <Button
            content={<FontAwesomeIcon icon={faGlobe} />}
            style={"iconButton"}
            highlighted={true}
            tooltipContent={"View on map"}
            tooltipId={"view_on_map_icon"}
            fn={() => openMap(violationData.gps_coordinates)}
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

    for (let item in violationDataToChange) {
      data[item] = violationDataToChange[item];
    }
    data.id = violationData.id;

    fetch(`/api/get-violations`, {
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
    if (!violationData) return;

    let data = {};

    for (let key in VIOLATION_CARD_INFO_FIELDS_FOR_CHANGE) {
      data[key] = violationData[key];
    }

    setViolationDataToChange(data);
  }, [violationData]);

  useEffect(() => {
    if (!violationData) return;

    let changes = false;

    for (let key in violationDataToChange) {
      if (violationDataToChange[key] !== violationData[key]) {
        changes = true;
        break;
      }
    }

    setChangesToSave(changes);
  }, [violationData, violationDataToChange]);

  useEffect(() => {
    if (!violationData || !statusSettings) return;

    // FORM ARRAY OF ALLOWED STATUSES
    let allowedStatuses = [];
    statusSettings.equipment.status_transitions.forEach((element) => {
      if (element.status_from === violationData.status) {
        allowedStatuses.push(element.status_to);
      }
    });

    // FILTER STATUS_CHOICES OBJECT
    let statusesFiltered = {};

    for (let key in VIOLATION_STATUS_CHOICES) {
      statusesFiltered[key] = VIOLATION_STATUS_CHOICES[key];
    }

    setStatusChoicesFiltered(statusesFiltered);
  }, [violationData, statusSettings]);

  useEffect(() => {
    if (!violationData) return;

    const photosCombined = [
      ...violationData.report_photos,
      ...violationData.violation_photos,
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
  }, [violationData]);

  return (
    violationData &&
    hiredDriversList &&
    activeTrucksList &&
    statusChoicesFiltered && (
      <div className="flex gap-2 relative">
        <div className="flex flex-col grow">
          {showInfoFields()}
          <InfoCardFieldFile
            value={violationData.violation_documents}
            settings={VIOLATIONS_CHECKLIST.violation_documents}
            dataId={violationData.id}
            loadData={loadViolationData}
            dataType={"violation"}
          />
          <div className="grid grid-cols-2 gap-2 py-2">
            <ViolationInfoBlock
              template={TRUCK_VIOLATION_BLOCK}
              title={"Truck"}
              optional={true}
              violationData={{
                truck_unit_number:
                  activeTrucksList[violationData.truck]?.unit_number ||
                  "[no unit number]",
                truck_license_plate:
                  findHighestIdObject(
                    activeTrucksList[violationData.truck]
                      ?.truck_license_plates || "[no license plate]"
                  )?.plate_number || "",
                truck_make_model: `${
                  activeTrucksList[violationData.truck]?.make ||
                  "[no truck make info]"
                } ${
                  activeTrucksList[violationData.truck]?.model ||
                  "[no truck model info]"
                }`,
                truck_violation: violationData.truck_violation,
              }}
              side={
                <Button
                  content={<FontAwesomeIcon icon={faArrowUpRightFromSquare} />}
                  fn={() => handleCardDataSet(violationData.truck, "truck")}
                  style={"iconButton"}
                  highlighted={true}
                  tooltipContent={
                    !violationData.truck || violationData.truck.length === 0
                      ? ""
                      : "Go To Truck Card"
                  }
                  tooltipId={`go-to-truck-card-tooltip_${violationData.truck}`}
                  disabled={
                    !violationData.truck || violationData.truck.length === 0
                  }
                />
              }
            />
            <ViolationInfoBlock
              template={POLICE_VIOLATION_BLOCK}
              title={"Police"}
              optional={true}
              violationData={violationData}
            />
            {violationData.has_lawyer && (
              <ViolationInfoBlock
                template={LAWYER_VIOLATION_BLOCK}
                title={"Lawyer"}
                violationData={violationData}
                side={
                  <Button
                    content={<FontAwesomeIcon icon={faPenToSquare} />}
                    style={"iconButton-l"}
                    fn={handleOpenEditLawyerData}
                    tooltipId={"edit_lawyer_data_button_tooltip"}
                    tooltipContent={"Edit lawyer data"}
                  />
                }
              />
            )}
            <ViolationInfoBlock
              template={TRAILER_1_VIOLATION_BLOCK}
              title={"Trailer 1"}
              optional={true}
              violationData={violationData}
            />
            <ViolationInfoBlock
              template={TRAILER_2_VIOLATION_BLOCK}
              title={"Trailer 2"}
              optional={true}
              violationData={violationData}
            />
            <ViolationInfoBlock
              template={CONVERTER_VIOLATION_BLOCK}
              title={"Converter"}
              optional={true}
              violationData={violationData}
            />
          </div>
          <div className="mt-3">
            <div className="flex gap-2 items-center">
              <p className="text-lg font-semibold">Violation photos</p>
              <FileLoaderMultiple
                apiRoute={"/api/send-violation-photos"}
                name={"violation_photos"}
                label={"Photos"}
                uploadKey={"photos"}
                dataType={"violation_id"}
                driverId={violationData.id}
                loadData={loadViolationData}
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
              location={violationData.location}
              initialCoordinates={initialCoordinates}
            />
          </MapModalContainer>
        </div>
      </div>
    )
  );
}

export default ViolationCardInfo;
