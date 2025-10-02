import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircle as faCircleSolid,
  faSquare,
  faSquareCheck,
  faUpload,
  faCircleExclamation,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { faCircle as faCircleRegular } from "@fortawesome/free-regular-svg-icons";
import Button from "../button/Button";
import { useEffect, useState } from "react";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import ModalContainer from "../modalContainer/ModalContainer";
import extractFileNameFromURL from "@/app/functions/extractFileNameFromURL";
import Link from "next/link";
import FileLoaderSm from "../fileLoader/FileLoaderSm";
import findHighestIdObject from "@/app/functions/findHighestIdObject";
import { useSession } from "next-auth/react";
import { useLoader } from "@/app/context/LoaderContext";
import UpdateRatesContainer from "../updateRatesContainer/UpdateRatesContainer";
import ActivityHistoryContainer from "../activityHistory/ActivityHistoryContainer";
import checkActivityPeriod from "@/app/functions/checkActivityPeriod";
import defineDateBlock from "@/app/functions/defineDateBlock";
import sortObjectsByDateOrId from "@/app/functions/sortObjectsByDateOrId";
import { useCreateObject } from "@/app/context/CreateObjectContext";
import useUserRoles from "@/app/functions/useUserRoles";
import checkNumericInput from "@/app/functions/checkNumericInput";

function CheckListField({
  value,
  settings,
  dataId,
  loadData,
  dataType,
  noCheck,
  checklistType,
  apiRoute,
  activityHistoryPeriod,
}) {
  const [checked, setChecked] = useState(false);
  const [openFileModal, setOpenFileModal] = useState(false);
  const [fieldsToShow, setFieldsToShow] = useState([]);
  const [openFileLoaderModal, setOpenFileLoaderModal] = useState(false);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [showActivityHistory, setShowActivityHistory] = useState(false);
  const [deleteFileState, setDeleteFileState] = useState(null);
  const [showEditButton, setShowEditButton] = useState(false);

  const { data: session } = useSession();
  const { startLoading, stopLoading } = useLoader();
  const {
    setCreateObjectModalIsOpen,
    setObjectType,
    setServerData,
    setAfterCreateCallback,
    setUpdateObject,
    handleCreateObjectModalClose,
  } = useCreateObject();

  const userRoles = useUserRoles();

  const FILE_LOADER_SETTINGS = {
    keyName: settings.key,
    label: settings.name,
    accept: "image/*,application/pdf",
    issueDateOn: () => {
      if (
        settings.key === "road_tests" ||
        settings.key === "tax_papers" ||
        settings.key === "driver_statements" ||
        settings.key === "licenses" ||
        settings.key === "abstracts" ||
        settings.key === "lcv_certificates" ||
        settings.key === "good_to_go_cards" ||
        settings.key === "certificates_of_violations" ||
        settings.key === "truck_bill_of_sales" ||
        settings.key === "equipment_bill_of_sales"
      ) {
        return true;
      }
      return false;
    },
    expiryDateOn: () => {
      if (
        settings.key === "immigration_doc" ||
        settings.key === "pdic_certificates" ||
        settings.key === "licenses" ||
        settings.key === "tdg_cards" ||
        settings.key === "good_to_go_cards" ||
        settings.key === "lcv_licenses" ||
        settings.key === "truck_safety_docs" ||
        settings.key === "equipment_safety_docs" ||
        settings.key === "truck_registration_docs" ||
        settings.key === "equipment_registration_docs"
      ) {
        return true;
      }
      return false;
    },
    commentOn: () => {
      if (
        settings.key === "log_books" ||
        settings.key === "tax_papers" ||
        settings.key === "driver_statements" ||
        settings.key === "other_documents" ||
        settings.key === "truck_other_documents" ||
        settings.key === "equipment_other_documents" ||
        settings.key === "certificates_of_violations" ||
        settings.key === "claim_documents" ||
        settings.key === "violation_documents" ||
        settings.key === "inspection_documents" ||
        settings.key === "ticket_documents" ||
        settings.key === "id_documents"
      ) {
        return true;
      }
      return false;
    },
    numberOn: () => {
      if (settings.key === "sin") {
        return true;
      }
      return false;
    },
    fileOff: () => {
      // REMOVES FILE FIELD FROM THE FILELOADER WINDOW
      if (
        settings.key === "truck_license_plates" ||
        settings.key === "equipment_license_plates"
      ) {
        return true;
      }
      return false;
    },
    file2On: () => {
      if (settings.key === "licenses") {
        return true;
      }
      return false;
    },
    numberAnyOn: () => {
      if (
        settings.key === "licenses" ||
        settings.key === "incorp_docs" ||
        settings.key === "gst_docs"
      ) {
        return true;
      }
      return false;
    },
    dLProvinceOn: () => {
      if (settings.key === "licenses") {
        return true;
      }
      return false;
    },
    dateOfReviewOn: () => {
      if (settings.key === "annual_performance_reviews") {
        return true;
      }
      return false;
    },
    dateOfCompletionOn: () => {
      if (settings.key === "winter_courses") {
        return true;
      }
      return false;
    },
    companyOn: () => {
      if (settings.key === "reference_checks") {
        return true;
      }
      return false;
    },
    textFieldOn: () => {
      if (
        settings.key === "truck_license_plates" ||
        settings.key === "equipment_license_plates"
      ) {
        return true;
      }
      return false;
    },
    textFieldValue: () => {
      if (
        settings.key === "truck_license_plates" ||
        settings.key === "equipment_license_plates"
      ) {
        return "plate_number";
      }
      return "";
    },
    valueToUse: () => {
      if (settings.key === "licenses") {
        return {
          key: settings.key,
          dl_number: findHighestIdObject(value).dl_number || "",
          dl_province: findHighestIdObject(value).dl_province || "",
        };
      }
      return null;
    },
  };

  const FILE_LOADER_EDITING_FIELDS = [
    "road_tests",
    "log_books",
    "sin",
    "immigration_doc",
    "incorp_docs",
    "gst_docs",
    "pdic_certificates",
    "tax_papers",
    "driver_statements",
    "other_documents",
    "licenses",
    "abstracts",
    "tdg_cards",
    "good_to_go_cards",
    "lcv_certificates",
    "lcv_licenses",
    "certificates_of_violations",
    "annual_performance_reviews",
    "winter_courses",
    "reference_checks",
    "activity_history",
    // "id_documents",
  ];

  const handleDeleteModalOpening = () => {
    setOpenFileModal(true);
    setShowDeleteButton(true);
  };

  const handleEditActivityHistory = () => {
    setOpenFileModal(true);
    setShowActivityHistory(true);
  };

  const handleEditModalOpening = () => {
    if (settings.key === "activity_history") {
      handleEditActivityHistory();
    } else {
      setOpenFileModal(true);
      setShowEditButton(true);
    }
  };

  const handleModalClosing = () => {
    setOpenFileModal(false);
    setShowDeleteButton(false);
    setShowEditButton(false);
  };

  const handleConfirmDeleteModalOpening = (showModal, settingsKey, fieldId) => {
    setConfirmDeleteModal(showModal);

    if (!showModal) {
      setDeleteFileState(null);
      return;
    }

    setDeleteFileState({
      key: settingsKey,
      id: fieldId,
    });
  };

  const deleteFile = async (key, fileId) => {
    try {
      const response = await fetch(apiRoute, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          endpointIdentifier: key,
          id: fileId,
          changed_by: session.user.name,
          username: session.user.name,
        }),
      });

      handleConfirmDeleteModalOpening(false);

      if (response.ok) {
        loadData();
      } else {
        console.error("Failed to delete file");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const handleCheckMark = async (key, fieldId) => {
    try {
      startLoading();

      const data = {
        endpointIdentifier: key,
        id: fieldId,
        last_reviewed_by: session.user.name,
        was_reviewed: !findHighestIdObject(value).was_reviewed,
        changed_by: session.user.name,
      };

      const response = await fetch(apiRoute, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        loadData();
      } else {
        stopLoading();
        console.error("Failed to update file");
      }
    } catch (error) {
      console.error("Error updating file:", error);
    }
  };

  const afterObjectCreateCallback = () => {
    handleCreateObjectModalClose();
    loadData();
  };

  const handleEditFile = (fileData) => {
    let dataToSet = {
      endpointIdentifier: settings.key,
      ...fileData,
    };

    dataToSet.last_changed_by = session.user.name;
    dataToSet.last_reviewed_by = "";
    dataToSet.was_reviewed = false;

    let objectTypeToSet = "";
    if (dataType === "employee") {
      objectTypeToSet = `${dataType}_${settings.key}`;
    } else {
      objectTypeToSet = settings.key;
    }

    setUpdateObject(true);
    setAfterCreateCallback(() => afterObjectCreateCallback);
    setObjectType(objectTypeToSet);
    setCreateObjectModalIsOpen(true);
    setServerData(dataToSet);
  };

  useEffect(() => {
    // FIELDS TO SHOW INSIDE OF MODAL WINDOW
    let fields = [];
    if (Array.isArray(value)) {
      const sortedValue = sortObjectsByDateOrId(value);
      fields = sortedValue.map((field, index) => {
        if (settings.file) {
          return (
            <div
              key={`${settings.key}_${index}`}
              className="flex h-11 gap-5 px-2 py-1 border-b border-slate-300 justify-between items-center"
            >
              <Link
                href={field.file}
                target="_blank"
                className="font-semibold capitalize"
              >
                {field.dl_number
                  ? field.dl_number
                  : field.number && settings.key === "sin"
                  ? checkNumericInput(field.number)
                  : field.number && settings.key !== "sin"
                  ? field.number
                  : field.comment
                  ? field.comment
                  : field.company
                  ? field.company
                  : extractFileNameFromURL(field.file)}
              </Link>
              {defineDateBlock(field)}
              {showEditButton && (
                <Button
                  style={"iconButton"}
                  fn={() => handleEditFile(field)}
                  content={<FontAwesomeIcon icon={faPenToSquare} />}
                  tooltipContent={"Edit document"}
                  tooltipId={`file_edit_${settings.key}_${field.id}`}
                />
              )}
              {showDeleteButton && (
                <Button
                  style={"iconButton"}
                  fn={() =>
                    handleConfirmDeleteModalOpening(
                      true,
                      settings.key,
                      field.id
                    )
                  }
                  content={<FontAwesomeIcon icon={faTrashCan} />}
                  tooltipContent={"Delete file"}
                  tooltipId={`file_delete_${settings.key}_${field.id}`}
                />
              )}
            </div>
          );
        } else if (
          !settings.file &&
          (settings.key === "activity_history" ||
            settings.key === "driver_background" ||
            settings.key === "truck_license_plates" ||
            settings.key === "equipment_license_plates")
        ) {
          return (
            <div
              key={`${settings.key}_${index}`}
              className="border rounded border-gray-300 p-2"
            >
              {Object.entries(field).map(([key, value], index) => {
                if (
                  !value ||
                  key === "id" ||
                  key === "driver" ||
                  key === "employee" ||
                  key === "truck" ||
                  key === "equipment" ||
                  key === "last_changed_by" ||
                  key === "last_reviewed_by" ||
                  key === "was_reviewed"
                )
                  return;

                let fieldName = "";
                let keyArr = key.split("_");
                fieldName = keyArr.join(" ");
                return (
                  <div
                    className="flex items-center gap-2"
                    key={`items_list_${key}_${index}`}
                  >
                    <p className="font-semibold m-0 capitalize">{fieldName}:</p>
                    <p className="m-0">{value === true ? "Yes" : value}</p>
                  </div>
                );
              })}
            </div>
          );
        }
      });
    } else {
      fields = Object.entries(value).map(([key, value], index) => {
        if (!settings.file && settings.key === "driver_rates") {
          if (
            key === "last_changed_by" ||
            key === "last_reviewed_by" ||
            key === "was_reviewed" ||
            key === "driver" ||
            key === "id"
          ) {
            return null;
          }
          let rateName = "";

          switch (key) {
            case "ca_single":
              rateName = "CA single";
              break;
            case "ca_team":
              rateName = "CA team";
              break;
            case "us_team":
              rateName = "US team";
              break;
            case "city":
              rateName = "City";
              break;
            case "lcv_single":
              rateName = "LCV single";
              break;
            case "lcv_team":
              rateName = "LCV team";
              break;
          }
          return (
            <div
              className="flex items-center gap-2"
              key={`driver_rate_${key}_${index}`}
            >
              <p className="font-semibold m-0 capitalize">{rateName}:</p>
              <p className="m-0">{value}</p>
            </div>
          );
        }
      });
    }
    setFieldsToShow(fields);
  }, [value, showDeleteButton, confirmDeleteModal, showEditButton]);

  useEffect(() => {
    if (findHighestIdObject(value).was_reviewed) {
      setChecked(true);
      stopLoading();
    } else {
      setChecked(false);
      stopLoading();
    }
  }, [value]);

  return (
    <div className="flex hover:bg-slate-100 border-dotted border-b-2 border-slate-300 py-1 px-2">
      <div
        className={`flex gap-3 items-center w-2/5 font-semibold cursor-pointer ${
          settings.optional ? "text-slate-400" : ""
        }`}
        onClick={() => setOpenFileModal(true)}
      >
        {settings.name}
        {value.length === 0 ||
        (settings.key === "activity_history" &&
          checkActivityPeriod(value, activityHistoryPeriod).length > 0) ? (
          <FontAwesomeIcon
            icon={settings.optional ? faCircleRegular : faCircleSolid}
            className="text-red-600 text-xs"
          />
        ) : null}
      </div>
      <div className="flex gap-3 items-center">
        <Button
          style={"iconButton"}
          fn={() => setOpenFileLoaderModal(true)}
          content={<FontAwesomeIcon icon={faUpload} />}
          tooltipContent={"Upload new file"}
          tooltipId={`file_upload_${settings.key}`}
          disabled={
            settings.key === "activity_history" ||
            settings.key === "driver_background"
          }
        />
        {(userRoles.includes(
          process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_SAFETY
        ) ||
          userRoles.includes(process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_ADMIN) ||
          (userRoles.includes(
            process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_RECRUITING
          ) &&
            checklistType === 1)) && (
          <Button
            style={"iconButton"}
            fn={handleEditModalOpening}
            content={<FontAwesomeIcon icon={faPenToSquare} />}
            tooltipContent={"Edit document"}
            tooltipId={`file_edit_${settings.key}`}
            disabled={!FILE_LOADER_EDITING_FIELDS.includes(settings.key)}
          />
        )}
        <Button
          style={"iconButton"}
          fn={handleDeleteModalOpening}
          content={<FontAwesomeIcon icon={faTrashCan} />}
          tooltipContent={"Delete file"}
          tooltipId={`file_delete_${settings.key}`}
          disabled={
            settings.key === "activity_history" ||
            settings.key === "driver_rates" ||
            settings.key === "driver_background"
          }
        />
        {!noCheck && (
          <Button
            style={"iconButton"}
            fn={
              findHighestIdObject(value).was_reviewed !== undefined
                ? () =>
                    handleCheckMark(settings.key, findHighestIdObject(value).id)
                : null
            }
            content={
              checked ? (
                <FontAwesomeIcon icon={faSquareCheck} />
              ) : (
                <FontAwesomeIcon icon={faSquare} />
              )
            }
            tooltipContent={
              findHighestIdObject(value).was_reviewed !== undefined
                ? "Check file"
                : "No files to check!"
            }
            tooltipId={`file_check_${settings.key}`}
          />
        )}
      </div>
      <div className="pl-5">
        {findHighestIdObject(value).last_reviewed_by
          ? findHighestIdObject(value).last_reviewed_by
          : ""}
      </div>
      <ModalContainer modalIsOpen={openFileModal}>
        {showActivityHistory ? (
          <ActivityHistoryContainer
            activityHistoryData={value}
            userId={dataId}
            closeActivityHistory={() => setShowActivityHistory(false)}
            loadData={loadData}
            period={activityHistoryPeriod}
            dataType={dataType}
          />
        ) : (
          <>
            <div className="text-slate-700 min-w-80 flex flex-col gap-1 relative">
              <div className="flex items-center justify-center gap-1">
                <p className="text-center font-bold text-lg">{settings.name}</p>
                {settings.key === "activity_history" &&
                  checkActivityPeriod(value, activityHistoryPeriod).length >
                    0 && (
                    <Button
                      tooltipId={"activityHistoryWarnTooltip"}
                      tooltipContent={
                        <>
                          <p className="font-bold">Activity history gaps:</p>
                          {checkActivityPeriod(
                            value,
                            activityHistoryPeriod
                          ).map((item, idx) => (
                            <p key={`activity_gaps_${idx}`}>
                              from {item.start} to {item.end}
                            </p>
                          ))}
                        </>
                      }
                      content={
                        <FontAwesomeIcon
                          icon={faCircleExclamation}
                          className="text-red-500 text-xl"
                        />
                      }
                      style={"warnButton"}
                    />
                  )}
              </div>
              {fieldsToShow.length ? fieldsToShow : <p>There are no files</p>}
            </div>
            <div className="flex justify-between items-center">
              <Button
                content={"Close"}
                style={"classicButton"}
                fn={handleModalClosing}
              />
              {settings.key === "activity_history" && (
                <Button
                  content={"Edit"}
                  style={"classicButton"}
                  fn={() => setShowActivityHistory(true)}
                />
              )}
            </div>
          </>
        )}
      </ModalContainer>
      {settings.key === "driver_rates" ? (
        <UpdateRatesContainer
          value={value}
          modalIsOpen={openFileLoaderModal}
          setModalIsOpen={setOpenFileLoaderModal}
          keyName={FILE_LOADER_SETTINGS.keyName}
        />
      ) : (
        <FileLoaderSm
          driverId={dataId}
          apiRoute={apiRoute}
          keyName={FILE_LOADER_SETTINGS.keyName}
          label={FILE_LOADER_SETTINGS.label}
          accept={"image/*,application/pdf"}
          issueDateOn={FILE_LOADER_SETTINGS.issueDateOn()}
          expiryDateOn={FILE_LOADER_SETTINGS.expiryDateOn()}
          commentOn={FILE_LOADER_SETTINGS.commentOn()}
          numberOn={FILE_LOADER_SETTINGS.numberOn()}
          fileOff={FILE_LOADER_SETTINGS.fileOff()}
          file2On={FILE_LOADER_SETTINGS.file2On()}
          numberAnyOn={FILE_LOADER_SETTINGS.numberAnyOn()}
          dLProvinceOn={FILE_LOADER_SETTINGS.dLProvinceOn()}
          dateOfReviewOn={FILE_LOADER_SETTINGS.dateOfReviewOn()}
          dateOfCompletionOn={FILE_LOADER_SETTINGS.dateOfCompletionOn()}
          companyOn={FILE_LOADER_SETTINGS.companyOn()}
          textFieldOn={FILE_LOADER_SETTINGS.textFieldOn()}
          modalIsOpen={openFileLoaderModal}
          setModalIsOpen={setOpenFileLoaderModal}
          loadData={loadData}
          dataType={dataType}
          textFieldKey={FILE_LOADER_SETTINGS.textFieldValue()}
          valueToUse={FILE_LOADER_SETTINGS.valueToUse()}
        />
      )}
      <ModalContainer modalIsOpen={confirmDeleteModal}>
        <p className="font-bold text-red-600">Are you sure to delete file?</p>
        <div className="flex justify-between items-center">
          <Button
            content={"Cancel"}
            style={"classicButton"}
            fn={() => handleConfirmDeleteModalOpening(false)}
          />
          <Button
            content={"DELETE"}
            style={"classicButton"}
            highlighted={true}
            fn={() => deleteFile(deleteFileState.key, deleteFileState.id)}
          />
        </div>
      </ModalContainer>
    </div>
  );
}

export default CheckListField;
