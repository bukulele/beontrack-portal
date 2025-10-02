"use client";

import React, { useState, useContext, useEffect } from "react";
import Image from "next/image";
import Button from "../button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowsRotate,
  faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import { faFloppyDisk } from "@fortawesome/free-regular-svg-icons";
import { TruckContext } from "@/app/context/TruckContext";
import { TRUCK_CARD_FIELDS } from "@/app/assets/truckCardData";
import InfoCardField from "../infoCardField/InfoCardField";
import formatDate from "@/app/functions/formatDate";
import {
  OWNEDBY_CHOICES_TRUCKS,
  TRUCK_CARD_INFO_FIELDS_FOR_CHANGE,
  TRUCK_STATUS_CHOICES,
  VEHICLE_TYPE_CHOICES,
} from "@/app/assets/tableData";
import OptionsSelector from "../optionsSelector/OptionsSelector";
import { SettingsContext } from "@/app/context/SettingsContext";
import { useLoader } from "@/app/context/LoaderContext";
import findHighestIdObject from "@/app/functions/findHighestIdObject";
import TextInputSearch from "../textInput/TextInputSearch";
import { useInfoCard } from "@/app/context/InfoCardContext";
import useUserRoles from "@/app/functions/useUserRoles";

function TruckCardInfo() {
  // const [imageSrc, setImageSrc] = useState(null);
  const [statusChoicesFiltered, setStatusChoicesFiltered] = useState(null);
  const [truckDataToChange, setTruckDataToChange] = useState(
    TRUCK_CARD_INFO_FIELDS_FOR_CHANGE
  );
  const [changesToSave, setChangesToSave] = useState(false);
  const [statusBackground, setStatusBackground] = useState("");

  const { truckData, driverList, loadData } = useContext(TruckContext);
  const { statusSettings } = useContext(SettingsContext);

  const { handleCardDataSet } = useInfoCard();

  const { startLoading, stopLoading } = useLoader();
  const userRoles = useUserRoles();

  const openDriverCard = () => {
    handleCardDataSet(truckData.driver, "driver");
  };

  const showInfoFields = () => {
    return Object.values(TRUCK_CARD_FIELDS).map((field, index) => {
      let value = field.date
        ? formatDate(truckData[field.key])
        : truckData[field.key];

      if (field.key === "make_model") {
        value = `${truckData.make} ${truckData.model}`;
      }

      if (field.accessKey) {
        value = findHighestIdObject(truckData[field.key])[field.accessKey];
      }

      let sideData = "";

      if (field.key === "unit_number") {
        sideData =
          truckData.status === "NW" ? (
            <div className="flex gap-3">
              <p className="font-semibold">
                <span
                  style={{
                    backgroundColor: statusBackground,
                  }}
                  className="px-2 py-1 text-white rounded-full"
                >
                  {TRUCK_STATUS_CHOICES[truckData.status]}
                </span>
              </p>
            </div>
          ) : (
            <div className="flex gap-1">
              <OptionsSelector
                value={truckDataToChange.status}
                updateState={setTruckDataToChange}
                name={"status"}
                data={statusChoicesFiltered}
                style={"small"}
                background={statusBackground}
              />
            </div>
          );
      }

      if (field.key === "driver" && truckData.owned_by === "OO") {
        value =
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
              name={field.key}
              value={driverList[truckDataToChange[field.key]]}
              updateState={setTruckDataToChange}
              style={"small"}
              searchableData={driverList}
              searchableFields={["first_name", "last_name", "driver_id"]}
            />
          ) : (
            `${driverList[truckDataToChange[field.key]]?.first_name || ""} ${
              driverList[truckDataToChange[field.key]]?.last_name || ""
            } ${driverList[truckDataToChange[field.key]]?.driver_id || ""}`
          );

        sideData = (
          <Button
            content={<FontAwesomeIcon icon={faArrowUpRightFromSquare} />}
            fn={openDriverCard}
            style={"iconButton"}
            highlighted={true}
            tooltipContent={
              !truckData.driver || truckData.driver.length === 0
                ? ""
                : "Go To Driver Card"
            }
            tooltipId={"go-to-driver-card-tooltip"}
            disabled={!truckData.driver || truckData.driver.length === 0}
          />
        );
      } else if (field.key === "driver" && truckData.owned_by !== "OO") {
        return null;
      }

      return (
        <InfoCardField
          key={`${field.key}_${index}`}
          label={field.name}
          value={value}
          side={sideData}
        />
      );
    });
  };

  const handleSaveChanges = () => {
    startLoading();

    const data = new FormData();

    for (let item in truckDataToChange) {
      data.append(item, truckDataToChange[item]);
    }

    fetch(`/api/upload-truck-data/${truckData.id}`, {
      method: "PATCH",
      body: data,
    }).then((response) => {
      stopLoading();
      if (response.ok) {
        loadData();
      }
    });
  };

  useEffect(() => {
    if (!truckData) return;

    let data = {};

    for (let key in TRUCK_CARD_INFO_FIELDS_FOR_CHANGE) {
      data[key] = truckData[key];
    }

    setTruckDataToChange(data);
  }, [truckData]);

  useEffect(() => {
    if (!truckData) return;

    let changes = false;

    for (let key in truckDataToChange) {
      if (truckDataToChange[key] !== truckData[key]) {
        changes = true;
        break;
      }
    }

    setChangesToSave(changes);
  }, [truckData, truckDataToChange]);

  useEffect(() => {
    if (!truckData || !statusSettings) return;

    // FORM ARRAY OF ALLOWED STATUSES
    let allowedStatuses = [];
    statusSettings.truck.status_transitions.forEach((element) => {
      if (element.status_from === truckData.status) {
        allowedStatuses.push(element.status_to);
      }
    });

    // FILTER STATUS_CHOICES OBJECT
    let statusesFiltered = {};

    for (let key in TRUCK_STATUS_CHOICES) {
      if (allowedStatuses.includes(key) || key === truckData.status) {
        statusesFiltered[key] = TRUCK_STATUS_CHOICES[key];
      }
    }

    setStatusChoicesFiltered(statusesFiltered);

    let statusColor = statusSettings.truck.status_colors.find(
      (element) => element.status === truckData.status
    );

    if (statusColor && statusColor.color) {
      setStatusBackground(statusColor.color);
    } else {
      setStatusBackground("grey");
    }
  }, [truckData, statusSettings]);

  // useEffect(() => {
  //   if (!truckData) return;

  //   fetch(`/api/get-photo?photoPath=${encodeURIComponent(truckData.photo)}`)
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Failed to load the photo");
  //       }
  //       return response.blob();
  //     })
  //     .then((blob) => {
  //       const imageUrl = URL.createObjectURL(blob);
  //       setImageSrc(imageUrl);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching the photo:", error);
  //     });
  // }, [truckData]);

  return (
    truckData &&
    driverList &&
    statusChoicesFiltered && (
      <div className="flex gap-2 relative">
        <div className="flex flex-col gap-2 max-w-52">
          <Image
            src={
              `/truck_photos/${truckData.vehicle_type}.jpg` ||
              "/no_photo_truck.png"
            }
            alt="Truck Photo"
            width={300}
            height={200}
            style={{ objectFit: "contain", objectPosition: "center top" }}
          />
          <div className="flex gap-2 items-center justify-center">
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
          <p>
            <span className="font-semibold">Owned by: </span>
            {OWNEDBY_CHOICES_TRUCKS[truckData.owned_by]}
          </p>
          <p>
            <span className="font-semibold">Type: </span>
            {VEHICLE_TYPE_CHOICES[truckData.vehicle_type]}
          </p>
        </div>
        <div className="flex flex-col grow">{showInfoFields()}</div>
      </div>
    )
  );
}

export default TruckCardInfo;
