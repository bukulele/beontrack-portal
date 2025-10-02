import React, { useContext, useEffect, useState } from "react";
import { IncidentContext } from "@/app/context/IncidentContext";
import CheckListFieldFrame from "../checklistField/CheckListFieldFrame";
import {
  CLAIM_STATUS_CHOICES,
  CLAIM_TYPE_MAPPING,
  OBJECT_TYPES,
} from "@/app/assets/tableData";
import CheckListField from "../checklistField/CheckListField";
import Button from "../button/Button";
import { useCreateObject } from "@/app/context/CreateObjectContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import ModalContainer from "../modalContainer/ModalContainer";
import { useLoader } from "@/app/context/LoaderContext";

function ClaimDetails({ claimType, fieldsTemplate, filesTemplate }) {
  const OBJECT_TYPE_MAPPING = {
    MPI: "claim_mpi",
    LL: "claim_ll",
    TP: "claim_tp",
  };
  const [fieldsToShow, setFieldsToShow] = useState([]);
  const [confirmDeleteClaimModal, setConfirmDeleteClaimModal] = useState(false);
  const [claimIdToDelete, setClaimIdToDelete] = useState(0);

  const { incidentData, loadIncidentData } = useContext(IncidentContext);
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
    loadIncidentData();
  };

  const handleOpenCreateClaim = () => {
    setAfterCreateCallback(() => afterObjectCreateCallback);
    setObjectType(OBJECT_TYPE_MAPPING[claimType]);
    setCreateObjectModalIsOpen(true);
    setServerData(incidentData);
  };

  const handleEditClaim = (claimId) => {
    let dataToSet = incidentData.incident_claims.find(
      (item) => item.id === claimId
    );
    setUpdateObject(true);
    setAfterCreateCallback(() => afterObjectCreateCallback);
    setObjectType(OBJECT_TYPE_MAPPING[claimType] + "_e");
    setCreateObjectModalIsOpen(true);
    setServerData(dataToSet);
  };

  const handleDeleteClaim = (claimId) => {
    setClaimIdToDelete(claimId);
    setConfirmDeleteClaimModal(true);
  };

  const handleCloseDeleteClaimModal = () => {
    setClaimIdToDelete(0);
    setConfirmDeleteClaimModal(false);
  };

  const deleteClaim = () => {
    startLoading();
    fetch("/api/get-claims", {
      body: JSON.stringify({ id: claimIdToDelete }),
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        loadIncidentData();
        handleCloseDeleteClaimModal();
      })
      .finally(() => stopLoading())
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    if (!incidentData) return;

    let claimsByUseArr = incidentData.incident_claims
      .filter((item) => item.claim_to === claimType)
      .map((claim) => {
        let claimFields = Object.values(fieldsTemplate).map((field, index) => {
          if (
            (claim.claim_type === "CR1" || claim.claim_type === "CR2") &&
            field.key === "unit_number"
          )
            return null;
          return (
            <CheckListFieldFrame
              key={`${field.key}_${index}`}
              fieldName={field.name}
            >
              {field.key === "status"
                ? CLAIM_STATUS_CHOICES[claim[field.key]]
                : claim[field.key]}
            </CheckListFieldFrame>
          );
        });
        claimFields.push(
          <CheckListField
            key={`${claim.id}_claim_documents`}
            value={claim.claim_documents}
            settings={filesTemplate.claim_documents}
            dataId={claim.id}
            loadData={loadIncidentData}
            dataType={"claim"}
            noCheck={true}
            apiRoute={"/api/update-file"}
          />
        );
        return { claimFields, claimType: claim.claim_type, claimId: claim.id };
      });
    setFieldsToShow(claimsByUseArr);
  }, [incidentData]);

  return (
    <>
      <div className="p-1">
        <Button
          content={`ADD ${OBJECT_TYPES[OBJECT_TYPE_MAPPING[claimType]]}`}
          style={"classicButton"}
          fn={handleOpenCreateClaim}
        />
      </div>
      <div className="w-full overflow-y-scroll flex-auto pb-5">
        {fieldsToShow.map((fields, index) => {
          return (
            <div key={`${fields.claimType}_${index}`} className="w-full pt-4">
              {
                <div className="w-full flex gap-2 bg-slate-100">
                  <p className="px-2 font-bold">
                    {claimType !== "TP"
                      ? CLAIM_TYPE_MAPPING[fields.claimType]
                      : "Third Party Info " + (index + 1)}
                  </p>
                  <Button
                    content={<FontAwesomeIcon icon={faPenToSquare} />}
                    style={"iconButton"}
                    fn={() => handleEditClaim(fields.claimId)}
                  />
                  <Button
                    content={<FontAwesomeIcon icon={faTrashCan} />}
                    style={"iconButton"}
                    fn={() => handleDeleteClaim(fields.claimId)}
                    tooltipContent={"Delete claim"}
                    tooltipId={`delete_claim_${fields.claimId}`}
                  />
                </div>
              }
              {[...fields.claimFields]}
            </div>
          );
        })}
      </div>
      <ModalContainer modalIsOpen={confirmDeleteClaimModal}>
        <p className="font-bold text-red-600">Are you sure to delete claim?</p>
        <div className="flex justify-between items-center">
          <Button
            content={"Cancel"}
            style={"classicButton"}
            fn={handleCloseDeleteClaimModal}
          />
          <Button
            content={"DELETE"}
            style={"classicButton"}
            highlighted={true}
            fn={deleteClaim}
          />
        </div>
      </ModalContainer>
    </>
  );
}

export default ClaimDetails;
