"use client";

import React, { useState, useContext, useRef, useEffect } from "react";
import Image from "next/image";
import Button from "../button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { EQUIPMENT_CARD_FIELDS } from "@/app/assets/equipmentCardData";
import InfoCardField from "../infoCardField/InfoCardField";
import formatDate from "@/app/functions/formatDate";
import { EquipmentContext } from "@/app/context/EquipmentContext";
import {
  EQUIPMENT_CARD_INFO_FIELDS_FOR_CHANGE,
  EQUIPMENT_STATUS_CHOICES,
  EQUIPMENT_TYPE_CHOICES,
  OWNEDBY_CHOICES_EQUIPMENT,
} from "@/app/assets/tableData";
import { SettingsContext } from "@/app/context/SettingsContext";
import { useLoader } from "@/app/context/LoaderContext";
import { faFloppyDisk } from "@fortawesome/free-regular-svg-icons";
import OptionsSelector from "../optionsSelector/OptionsSelector";
import findHighestIdObject from "@/app/functions/findHighestIdObject";

function EquipmentCardInfo() {
  const [imageSrc, setImageSrc] = useState(null);
  const [statusChoicesFiltered, setStatusChoicesFiltered] = useState(null);
  const [equipmentDataToChange, setEquipmentDataToChange] = useState(
    EQUIPMENT_CARD_INFO_FIELDS_FOR_CHANGE
  );
  const [changesToSave, setChangesToSave] = useState(false);
  const [statusBackground, setStatusBackground] = useState("");

  const { equipmentData, loadData } = useContext(EquipmentContext);
  const { statusSettings } = useContext(SettingsContext);

  const { startLoading, stopLoading } = useLoader();

  const showInfoFields = () =>
    Object.values(EQUIPMENT_CARD_FIELDS).map((field, index) => {
      let value = field.date
        ? formatDate(equipmentData[field.key])
        : equipmentData[field.key];

      if (field.key === "make_model") {
        value = `${equipmentData.make} ${equipmentData.model}`;
      }

      if (field.accessKey) {
        value = findHighestIdObject(equipmentData[field.key])[field.accessKey];
      }

      let sideData = "";

      if (field.key === "unit_number") {
        sideData =
          equipmentData.status === "NW" ? (
            <div className="flex gap-3">
              <p className="font-semibold">
                <span
                  style={{
                    backgroundColor: statusBackground,
                  }}
                  className="px-2 py-1 text-white rounded-full"
                >
                  {EQUIPMENT_STATUS_CHOICES[equipmentData.status]}
                </span>
              </p>
            </div>
          ) : (
            <div className="flex gap-1">
              <OptionsSelector
                value={equipmentDataToChange.status}
                updateState={setEquipmentDataToChange}
                name={"status"}
                data={statusChoicesFiltered}
                style={"small"}
                background={statusBackground}
              />
            </div>
          );
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

  const handleSaveChanges = () => {
    startLoading();

    const data = new FormData();

    for (let item in equipmentDataToChange) {
      data.append(item, equipmentDataToChange[item]);
    }

    fetch(`/api/upload-equipment-data/${equipmentData.id}`, {
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
    if (!equipmentData) return;

    let data = {};

    for (let key in EQUIPMENT_CARD_INFO_FIELDS_FOR_CHANGE) {
      data[key] = equipmentData[key];
    }

    setEquipmentDataToChange(data);
  }, [equipmentData]);

  useEffect(() => {
    if (!equipmentData) return;

    let changes = false;

    for (let key in equipmentDataToChange) {
      if (equipmentDataToChange[key] !== equipmentData[key]) {
        changes = true;
        break;
      }
    }

    setChangesToSave(changes);
  }, [equipmentData, equipmentDataToChange]);

  useEffect(() => {
    if (!equipmentData || !statusSettings) return;

    // FORM ARRAY OF ALLOWED STATUSES
    let allowedStatuses = [];
    statusSettings.equipment.status_transitions.forEach((element) => {
      if (element.status_from === equipmentData.status) {
        allowedStatuses.push(element.status_to);
      }
    });

    // FILTER STATUS_CHOICES OBJECT
    let statusesFiltered = {};

    for (let key in EQUIPMENT_STATUS_CHOICES) {
      if (allowedStatuses.includes(key) || key === equipmentData.status) {
        statusesFiltered[key] = EQUIPMENT_STATUS_CHOICES[key];
      }
    }

    setStatusChoicesFiltered(statusesFiltered);

    let statusColor = statusSettings.equipment.status_colors.find(
      (element) => element.status === equipmentData.status
    );

    if (statusColor && statusColor.color) {
      setStatusBackground(statusColor.color);
    } else {
      setStatusBackground("grey");
    }
  }, [equipmentData, statusSettings]);

  useEffect(() => {
    if (!equipmentData) return;

    fetch(`/api/get-photo?photoPath=${encodeURIComponent(equipmentData.photo)}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load the photo");
        }
        return response.blob();
      })
      .then((blob) => {
        const imageUrl = URL.createObjectURL(blob);
        setImageSrc(imageUrl);
      })
      .catch((error) => {
        console.error("Error fetching the photo:", error);
      });
  }, [equipmentData]);

  return (
    equipmentData &&
    statusChoicesFiltered && (
      <div className="flex gap-2 relative">
        <div className="flex flex-col gap-2 max-w-52">
          <Image
            src={imageSrc || "/no_photo_equipment.png"}
            alt="Equipment Photo"
            width={200}
            height={100}
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
            {OWNEDBY_CHOICES_EQUIPMENT[equipmentData.owned_by]}
          </p>
          <p>
            <span className="font-semibold">Type: </span>
            {EQUIPMENT_TYPE_CHOICES[equipmentData.equipment_type]}
          </p>
        </div>
        <div className="flex flex-col grow">{showInfoFields()}</div>
      </div>
    )
  );
}

export default EquipmentCardInfo;
