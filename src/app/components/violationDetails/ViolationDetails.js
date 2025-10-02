import React, { useContext, useEffect, useState } from "react";
import CheckListFieldFrame from "../checklistField/CheckListFieldFrame";
import {
  INSPECTION_RESULT_CHOICES,
  OBJECT_TYPES,
  TICKET_GIVEN_TO_CHOICES,
  VIOLATION_TYPE_MAPPING,
} from "@/app/assets/tableData";
import CheckListField from "../checklistField/CheckListField";
import Button from "../button/Button";
import { useCreateObject } from "@/app/context/CreateObjectContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import ModalContainer from "../modalContainer/ModalContainer";
import { useLoader } from "@/app/context/LoaderContext";
import { ViolationContext } from "@/app/context/ViolationContext";

function ViolationDetails({
  deleteApi,
  detailsType,
  detailsName,
  fieldsTemplate,
  filesTemplate,
}) {
  const OBJECT_TYPE_MAPPING = {
    inspection: "inspection",
    ticket: "ticket",
  };
  const [fieldsToShow, setFieldsToShow] = useState([]);
  const [confirmDeleteDetailsModal, setConfirmDeleteDetailsModal] =
    useState(false);
  const [detailsIdToDelete, setDetailsIdToDelete] = useState(0);

  const { violationData, loadViolationData } = useContext(ViolationContext);
  const {
    setCreateObjectModalIsOpen,
    setObjectType,
    setServerData,
    setAfterCreateCallback,
    setUpdateObject,
    handleCreateObjectModalClose,
  } = useCreateObject();

  const { startLoading, stopLoading } = useLoader();

  const afterObjectCreateCallback = () => {
    // setCreateObjectModalIsOpen(false);
    handleCreateObjectModalClose();
    loadViolationData();
  };

  const handleOpenCreateDetails = () => {
    setAfterCreateCallback(() => afterObjectCreateCallback);
    setObjectType(OBJECT_TYPE_MAPPING[detailsType]);
    setCreateObjectModalIsOpen(true);
    setServerData(violationData);
  };

  const handleEditDetails = (id) => {
    let dataToSet = violationData[detailsName].find((item) => item.id === id);
    setUpdateObject(true);
    setAfterCreateCallback(() => afterObjectCreateCallback);
    setObjectType(OBJECT_TYPE_MAPPING[detailsType]);
    setCreateObjectModalIsOpen(true);
    setServerData(dataToSet);
  };

  const handleDeleteDetails = (id) => {
    setDetailsIdToDelete(id);
    setConfirmDeleteDetailsModal(true);
  };

  const handleCloseDeleteDetailsModal = () => {
    setDetailsIdToDelete(0);
    setConfirmDeleteDetailsModal(false);
  };

  const deleteDetails = () => {
    startLoading();
    fetch(deleteApi, {
      body: JSON.stringify({ id: detailsIdToDelete }),
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        loadViolationData();
        handleCloseDeleteDetailsModal();
      })
      .finally(() => stopLoading())
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    if (!violationData) return;

    let detailsByUseArr = violationData[detailsName].map((item) => {
      let detailsFields = Object.values(fieldsTemplate).map((field, index) => {
        return (
          <CheckListFieldFrame
            key={`${field.key}_${index}`}
            fieldName={field.name}
          >
            {field.key === "inspection_result"
              ? INSPECTION_RESULT_CHOICES[item[field.key]]
              : field.key === "given_to"
              ? TICKET_GIVEN_TO_CHOICES[item[field.key]]
              : item[field.key]}
          </CheckListFieldFrame>
        );
      });
      detailsFields.push(
        <CheckListField
          key={`${item.id}_${detailsType}_documents`}
          value={
            detailsType === "inspection"
              ? item.inspection_documents
              : item.ticket_documents
          }
          settings={
            detailsType === "inspection"
              ? filesTemplate.inspection_documents
              : filesTemplate.ticket_documents
          }
          dataId={item.id}
          loadData={loadViolationData}
          dataType={detailsType}
          noCheck={true}
          apiRoute={"/api/update-file"}
        />
      );
      return { detailsFields, id: item.id };
    });
    setFieldsToShow(detailsByUseArr);
  }, [violationData]);

  useEffect(() => {
    if (!violationData) return;

    if (
      detailsType === "inspection" &&
      violationData.violation_inspections.length > 0 &&
      violationData.violation_inspections.some(
        (inspection) => inspection.inspection_result === "FAIL"
      ) &&
      violationData.truck_violation.length === 0 &&
      violationData.trailer_1_violation.length === 0 &&
      violationData.trailer_2_violation.length === 0 &&
      violationData.converter_violation.length === 0
    ) {
      setUpdateObject(true);
      setAfterCreateCallback(() => afterObjectCreateCallback);
      setObjectType("indicate_violations");
      setCreateObjectModalIsOpen(true);
      setServerData(violationData);
    }
  }, [violationData, detailsType]);

  return (
    <>
      <div className="p-1">
        {((violationData.violation_inspections.length === 0 &&
          detailsType === "inspection") ||
          detailsType === "ticket") && (
          <Button
            content={`ADD ${OBJECT_TYPES[OBJECT_TYPE_MAPPING[detailsType]]}`}
            style={"classicButton"}
            fn={handleOpenCreateDetails}
          />
        )}
      </div>
      <div className="w-full overflow-y-scroll flex-auto pb-5">
        {fieldsToShow.map((fields, index) => {
          return (
            <div key={`${fields.detailsType}_${index}`} className="w-full pt-4">
              {
                <div className="w-full flex gap-2 bg-slate-100">
                  <p className="px-2 font-bold">
                    {VIOLATION_TYPE_MAPPING[detailsType]}
                  </p>
                  <Button
                    content={<FontAwesomeIcon icon={faPenToSquare} />}
                    style={"iconButton"}
                    fn={() => handleEditDetails(fields.id)}
                    tooltipContent={"Edit"}
                    tooltipId={`edit_${detailsType}_${fields.id}`}
                  />
                  <Button
                    content={<FontAwesomeIcon icon={faTrashCan} />}
                    style={"iconButton"}
                    fn={() => handleDeleteDetails(fields.id)}
                    tooltipContent={"Delete"}
                    tooltipId={`delete_${detailsType}_${fields.id}`}
                  />
                </div>
              }
              {[...fields.detailsFields]}
            </div>
          );
        })}
      </div>
      <ModalContainer modalIsOpen={confirmDeleteDetailsModal}>
        <p className="font-bold text-red-600">Are you sure to delete data?</p>
        <div className="flex justify-between items-center">
          <Button
            content={"Cancel"}
            style={"classicButton"}
            fn={handleCloseDeleteDetailsModal}
          />
          <Button
            content={"DELETE"}
            style={"classicButton"}
            highlighted={true}
            fn={deleteDetails}
          />
        </div>
      </ModalContainer>
    </>
  );
}

export default ViolationDetails;
