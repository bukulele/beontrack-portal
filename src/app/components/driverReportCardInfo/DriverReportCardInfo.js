"use client";

import React, { useState, useContext, useEffect, useRef } from "react";
import { DriverReportContext } from "@/app/context/DriverReportContext";
import {
  DRIVER_REPORT_CARD_FIELDS,
  INJURY_DRIVER_REPORT_CARD_FIELDS,
} from "@/app/assets/driverReportCardData";
import InfoCardField from "../infoCardField/InfoCardField";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import NextJsImage from "../nextJsImage/NextJsImage";
import Image from "next/image";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Button from "../button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faGlobe,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";
import { useInfoCard } from "@/app/context/InfoCardContext";
import { useCreateObject } from "@/app/context/CreateObjectContext";
import { TrucksDriversContext } from "@/app/context/TrucksDriversContext";
import { IncidentsListContext } from "@/app/context/IncidentsListContext";
import OptionsSelector from "../optionsSelector/OptionsSelector";
import MapModalContainer from "../modalContainer/MapModalContainer";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import useUserRoles from "@/app/functions/useUserRoles";
import { ViolationsListContext } from "@/app/context/ViolationsListContext";
import { WCBListContext } from "@/app/context/WCBListContext";

const MapComponent = dynamic(() => import("../mapComponent/MapComponent"), {
  ssr: false,
});

function DriverReportCardInfo() {
  const [fieldsToShow, setFieldsToShow] = useState(null);
  const [photosArray, setPhotosArray] = useState([]);
  const [index, setIndex] = useState(-1);
  const [photosToShow, setPhotosToShow] = useState([]);
  const [incidentsChoicesFiltered, setIncidentsChoicesFiltered] =
    useState(null);
  const [violationsChoicesFiltered, setViolationsChoicesFiltered] =
    useState(null);
  const [wcbClaimsChoicesFiltered, setWCBChoicesChoicesFiltered] =
    useState(null);
  const [incidentChosen, setIncidentChosen] = useState(0);
  const [violationChosen, setViolationChosen] = useState(0);
  const [wcbClaimChosen, setWCBClaimChosen] = useState(0);
  const [showMapModal, setShowMapModal] = useState(false);
  const [initialCoordinates, setInitialCoordinates] = useState("");

  const { driverReportData, loadData } = useContext(DriverReportContext);
  const { hiredDriversList, activeTrucksList } =
    useContext(TrucksDriversContext);
  const { incidentsList, loadIncidentsListData } =
    useContext(IncidentsListContext);
  const { violationsList, loadViolationsListData } = useContext(
    ViolationsListContext
  );
  const { wcbClaimsList, loadWCBClaimsListData } = useContext(WCBListContext);

  const { handleCardDataSet } = useInfoCard();

  const {
    setCreateObjectModalIsOpen,
    setObjectType,
    setAfterCreateCallback,
    setServerData,
    handleCreateObjectModalClose,
  } = useCreateObject();

  const { data: session } = useSession();

  const userRoles = useUserRoles();

  const thumbnailsRef = useRef(null);

  const openDriverCard = () => {
    handleCardDataSet(driverReportData.driver, "driver");
  };

  const afterIncidentCreateCallback = () => {
    handleCreateObjectModalClose();
    loadIncidentsListData();
    loadViolationsListData();
    loadWCBClaimsListData();
    loadData();
  };

  const createIncident = () => {
    // CREATION OF THE SPECIAL OBJECT TO CREATE INCIDENT FROM
    let serverDataObject = {};
    serverDataObject.main_driver_id = driverReportData.driver;
    serverDataObject.truck =
      Object.values(activeTrucksList).find(
        (truck) => truck.unit_number == driverReportData.truck_number
      )?.id || "";
    serverDataObject.assigned_to = session.user.name;
    serverDataObject.trailer_1_unit_number = driverReportData.trailer_number;
    serverDataObject.incident_details = driverReportData.description;
    serverDataObject.date_time = driverReportData.date_time;
    serverDataObject.location = driverReportData.location;
    serverDataObject.gps_coordinates = driverReportData.gps_coordinates;
    serverDataObject.report = driverReportData.id;

    setAfterCreateCallback(() => afterIncidentCreateCallback);
    setObjectType("incident");
    setServerData(serverDataObject);
    setCreateObjectModalIsOpen(true);
  };

  const createViolation = () => {
    // CREATION OF THE SPECIAL OBJECT TO CREATE VIOLATION FROM
    let serverDataObject = {};
    serverDataObject.main_driver_id = driverReportData.driver;
    serverDataObject.truck =
      Object.values(activeTrucksList).find(
        (truck) => truck.unit_number == driverReportData.truck_number
      )?.id || "";
    serverDataObject.assigned_to = session.user.name;
    serverDataObject.trailer_1_unit_number = driverReportData.trailer_number;
    serverDataObject.violation_details = driverReportData.description;
    serverDataObject.date_time = driverReportData.date_time;
    serverDataObject.location = driverReportData.location;
    serverDataObject.gps_coordinates = driverReportData.gps_coordinates;
    serverDataObject.report = driverReportData.id;

    setAfterCreateCallback(() => afterIncidentCreateCallback);
    setObjectType("violation");
    setServerData(serverDataObject);
    setCreateObjectModalIsOpen(true);
  };

  const createWCBClaim = () => {
    // CREATION OF THE SPECIAL OBJECT TO CREATE VIOLATION FROM
    let serverDataObject = {};
    serverDataObject.driver_id = driverReportData.driver;
    serverDataObject.assigned_to = session.user.name;
    serverDataObject.incident_details = driverReportData.description;
    serverDataObject.date_time = driverReportData.date_time;
    serverDataObject.location = driverReportData.location;
    serverDataObject.gps_coordinates = driverReportData.gps_coordinates;
    serverDataObject.report = driverReportData.id;
    serverDataObject.reported_to_doctor = driverReportData.reported_to_doctor;
    serverDataObject.first_contact_after_injury =
      driverReportData.first_contact_after_injury;

    setAfterCreateCallback(() => afterIncidentCreateCallback);
    setObjectType("wcb");
    setServerData(serverDataObject);
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

  const downloadPDF = () => {
    fetch(`/api/get-driver-report-pdf/${driverReportData.id}`)
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
    if (!driverReportData || !activeTrucksList) return;

    let template =
      driverReportData.type_of_report === "IJ"
        ? INJURY_DRIVER_REPORT_CARD_FIELDS
        : DRIVER_REPORT_CARD_FIELDS;

    const fields = Object.values(template).map((field, index) => {
      let value = driverReportData[field.key];

      if (typeof value === "boolean") {
        value = value === true ? "Yes" : "No";
      }

      if (field.type === "enum") {
        value = field.values[driverReportData[field.key]];
      }

      let sideData = null;

      if (field.key === "driver_id") {
        if (hiredDriversList[driverReportData.driver]) {
          value = `${
            hiredDriversList[driverReportData.driver]?.first_name || ""
          } ${hiredDriversList[driverReportData.driver]?.last_name || ""} ${
            hiredDriversList[driverReportData.driver]?.driver_id || ""
          }`;
        } else {
          value = driverReportData.driver_id;
        }

        sideData = (
          <Button
            content={<FontAwesomeIcon icon={faArrowUpRightFromSquare} />}
            fn={openDriverCard}
            style={"iconButton"}
            highlighted={true}
            tooltipContent={
              !driverReportData.driver || driverReportData.driver.length === 0
                ? ""
                : "Go To Driver Card"
            }
            tooltipId={"go-to-driver-card-tooltip"}
            disabled={
              !driverReportData.driver || driverReportData.driver.length === 0
            }
          />
        );
      }

      if (field.key === "id") {
        sideData = (
          <div className="flex gap-1 items-center">
            <Button
              style={"iconButton"}
              fn={downloadPDF}
              content={<FontAwesomeIcon icon={faPrint} />}
              tooltipContent={"Get report in PDF"}
              tooltipId={"driver_report_get_pdf"}
            />
            {driverReportData.related_violations.length > 0 && (
              <div className="flex gap-1 items-center">
                <OptionsSelector
                  value={violationChosen}
                  updateState={setViolationChosen}
                  name={"related_incidents"}
                  data={violationsChoicesFiltered}
                  style={"small"}
                />
              </div>
            )}
            {driverReportData.related_incidents.length > 0 && (
              <div className="flex gap-1 items-center">
                <OptionsSelector
                  value={incidentChosen}
                  updateState={setIncidentChosen}
                  name={"related_incidents"}
                  data={incidentsChoicesFiltered}
                  style={"small"}
                />
              </div>
            )}
            {driverReportData.related_wcbclaims.length > 0 && (
              <div className="flex gap-1 items-center">
                <OptionsSelector
                  value={wcbClaimChosen}
                  updateState={setWCBClaimChosen}
                  name={"related_wcbclaims"}
                  data={wcbClaimsChoicesFiltered}
                  style={"small"}
                />
              </div>
            )}
            {userRoles.includes(
              process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_SAFETY
            ) && (
              <Button
                style={"classicButton-s"}
                fn={
                  driverReportData.type_of_report == "TK"
                    ? createViolation
                    : driverReportData.type_of_report == "IJ"
                    ? createWCBClaim
                    : createIncident
                }
                content={`Create ${
                  driverReportData.type_of_report == "TK"
                    ? "Violation"
                    : driverReportData.type_of_report == "IJ"
                    ? "WCB Claim"
                    : "Accident"
                }`}
              />
            )}
          </div>
        );
      }

      if (
        field.key === "location" &&
        driverReportData.gps_coordinates.length > 0
      ) {
        sideData = (
          <Button
            content={<FontAwesomeIcon icon={faGlobe} />}
            style={"iconButton"}
            highlighted={true}
            tooltipContent={"View on map"}
            tooltipId={"view_on_map_icon"}
            fn={() => openMap(driverReportData.gps_coordinates)}
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
    setFieldsToShow(fields);

    const photosForPreview = driverReportData.photos.map((photo) => {
      return { src: photo.photo };
    });

    const photosGallery = driverReportData.photos.map((photo, index) => {
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
  }, [
    driverReportData,
    activeTrucksList,
    incidentChosen,
    incidentsChoicesFiltered,
  ]);

  useEffect(() => {
    if (!incidentsList || !driverReportData) return;

    let incidentsFiltered = { 0: "Go to incident" };

    for (let key in incidentsList) {
      if (driverReportData.related_incidents.some((item) => item == key)) {
        incidentsFiltered[key] = incidentsList[key].incident_number;
      }
    }

    setIncidentsChoicesFiltered(incidentsFiltered);
  }, [incidentsList, driverReportData]);

  useEffect(() => {
    if (!violationsList || !driverReportData) return;

    let incidentsFiltered = { 0: "Go to violation" };

    for (let key in violationsList) {
      if (driverReportData.related_violations.some((item) => item == key)) {
        incidentsFiltered[key] = violationsList[key].violation_number;
      }
    }

    setViolationsChoicesFiltered(incidentsFiltered);
  }, [violationsList, driverReportData]);

  useEffect(() => {
    if (!wcbClaimsList || !driverReportData) return;

    let wcbClaimsFiltered = { 0: "Go to WCB claim" };

    for (let key in wcbClaimsList) {
      if (driverReportData.related_wcbclaims.some((item) => item == key)) {
        wcbClaimsFiltered[key] = wcbClaimsList[key].claim_number;
      }
    }

    setWCBChoicesChoicesFiltered(wcbClaimsFiltered);
  }, [wcbClaimsList, driverReportData]);

  useEffect(() => {
    if (incidentChosen === 0) return;
    handleCardDataSet(incidentChosen, "incident");
  }, [incidentChosen]);

  useEffect(() => {
    if (violationChosen === 0) return;
    handleCardDataSet(violationChosen, "violation");
  }, [violationChosen]);

  useEffect(() => {
    if (wcbClaimChosen === 0) return;
    handleCardDataSet(wcbClaimChosen, "wcb");
  }, [wcbClaimChosen]);

  return (
    driverReportData &&
    activeTrucksList &&
    incidentsList &&
    violationsList && (
      <div className="flex gap-2 relative">
        <div className="flex flex-col grow">
          {fieldsToShow}
          {driverReportData.type_of_report !== "IJ" && (
            <div className="mt-3">
              <p className="text-lg font-semibold">Driver Report photos</p>
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
          )}
        </div>
        <MapModalContainer modalIsOpen={showMapModal} setModalClose={closeMap}>
          <MapComponent
            location={driverReportData.location}
            initialCoordinates={initialCoordinates}
          />
        </MapModalContainer>
      </div>
    )
  );
}

export default DriverReportCardInfo;
