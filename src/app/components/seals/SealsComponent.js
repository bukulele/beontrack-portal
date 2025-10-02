// components/SealGrid.js
"use client";

import React, { useState, useEffect, useMemo, useRef, useContext } from "react";
import { DataGridPro } from "@mui/x-data-grid-pro";
import Button from "../button/Button";
import ModalContainer from "../modalContainer/ModalContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "next-auth/react";
import { useLoader } from "@/app/context/LoaderContext";
import { SEALS_COLUMNS_FIELDS } from "@/app/tableData/sealsTable";
import { DriverContext } from "@/app/context/DriverContext";
import CustomToolbar from "./SealsCustomToolbar";

export default function SealsComponent({ userId }) {
  const [data, setData] = useState([]);
  const [saveError, setSaveError] = useState("");

  // modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [newSeal, setNewSeal] = useState("");
  const [sealList, setSealList] = useState([]);

  const [existingAssigned, setExistingAssigned] = useState([]);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);

  const inputRef = useRef(null);

  const { startLoading, stopLoading } = useLoader();
  const { data: session } = useSession();

  const { userData } = useContext(DriverContext);

  const fetchSeals = () => {
    startLoading();
    fetch(`/api/update-seals/${userId}`, { method: "GET" })
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((error) => {
        console.error("Error fetching seals:", error);
      })
      .finally(() => stopLoading());
  };

  useEffect(() => {
    if (!userId) return;

    fetchSeals();
  }, [userId]);

  // auto-focus when modal opens
  useEffect(() => {
    if (modalOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [modalOpen]);

  // Sort newest first
  const rows = useMemo(
    () =>
      [...data].sort(
        (a, b) =>
          new Date(b.date_time).getTime() - new Date(a.date_time).getTime()
      ),
    [data]
  );

  // highlight & block duplicates
  const duplicates = useMemo(() => {
    const freq = {};
    sealList.forEach((s) => {
      freq[s] = (freq[s] || 0) + 1;
    });
    return new Set(
      Object.entries(freq)
        .filter(([_, count]) => count > 1)
        .map(([s]) => s)
    );
  }, [sealList]);

  const hasDuplicates = duplicates.size > 0;

  const handleAddSeal = () => {
    const trimmed = newSeal.trim();
    if (!trimmed) return;
    setSealList((prev) => [trimmed, ...prev]); // add to front
    setNewSeal("");
    if (inputRef.current) inputRef.current.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSeal();
    }
  };

  const handleClose = () => {
    setModalOpen(false);
    setNewSeal("");
    setSealList([]);
  };

  const handleSave = () => {
    startLoading();
    const dateTime = new Date().toISOString();
    const payload = sealList.map((seal) => ({
      driver: userId,
      date_time: dateTime,
      issued_by: session?.user?.name || "Unknown",
      seal_number: seal,
      location: "Driver",
    }));

    fetch(`/api/update-seals/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        const body = await res.json().catch(() => ({}));

        if (!res.ok) {
          const errors = body?.errors || {};

          // 1) Prefer explicit UI for already-assigned style errors
          const assigned = [
            ...(Array.isArray(errors.existing_in_db)
              ? errors.existing_in_db
              : []),
            ...(Array.isArray(errors.already_assigned)
              ? errors.already_assigned
              : []),
          ];
          if (assigned.length > 0) {
            setExistingAssigned(assigned);
            return null; // stop success flow
          }

          // 2) Prefer humanized messages from the API route
          if (
            Array.isArray(body?.error_messages) &&
            body.error_messages.length > 0
          ) {
            throw new Error(body.error_messages.join("; "));
          }

          // 3) Fallbacks
          if (typeof errors.detail === "string" && errors.detail) {
            throw new Error(errors.detail);
          }
          if (typeof errors.network === "string" && errors.network) {
            throw new Error(errors.network);
          }

          // 4) Last resort: stringify whatever we got (no hardcoding)
          const parts = Object.entries(errors).map(([k, v]) => {
            const val =
              typeof v === "string"
                ? v
                : Array.isArray(v) || typeof v === "object"
                ? JSON.stringify(v)
                : String(v);
            return `${k}: ${val}`;
          });
          throw new Error(parts.join("; ") || "request failed");
        }

        return body; // success
      })
      .then((body) => {
        if (!body) return; // handled above (e.g., already assigned)
        handleClose();
        fetchSeals();
      })
      .catch((err) => {
        console.error("Error saving seals:", err);
        setSaveError(err.message || "Error saving seals");
      })
      .finally(() => stopLoading());
  };

  const handleRemoveSeal = (idx) => {
    setSealList((prev) => prev.filter((_, i) => i !== idx));
    // immediately put focus back on the input:
    inputRef.current?.focus();
  };

  const handleDeleteClick = (id) => {
    setToDeleteId(id);
    setDeleteModalOpen(true);
  };

  const handleCancelDelete = () => {
    setToDeleteId(null);
    setDeleteModalOpen(false);
  };

  const handleConfirmDelete = () => {
    // console.log("toDeleteId: ", toDeleteId);
    // return;
    startLoading();

    const dateTime = new Date().toISOString();
    const payload = {
      driver: "",
      date_time: dateTime,
      issued_by: session?.user?.name || "Unknown",
      location: "Deleted",
      is_assigned: false,
    };

    fetch(`/api/update-seal/${toDeleteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        const body = await res.json().catch(() => ({}));

        if (!res.ok) {
          const errors = body?.errors || {};

          // Prefer humanized messages from the API route (same as handleSave)
          if (
            Array.isArray(body?.error_messages) &&
            body.error_messages.length > 0
          ) {
            throw new Error(body.error_messages.join("; "));
          }

          // Fallbacks
          if (typeof errors.detail === "string" && errors.detail) {
            throw new Error(errors.detail);
          }
          if (typeof errors.network === "string" && errors.network) {
            throw new Error(errors.network);
          }

          // Last resort: stringify whatever we got (no hardcoding)
          const parts = Object.entries(errors).map(([k, v]) => {
            const val =
              typeof v === "string"
                ? v
                : Array.isArray(v) || typeof v === "object"
                ? JSON.stringify(v)
                : String(v);
            return `${k}: ${val}`;
          });
          throw new Error(parts.join("; ") || "request failed");
        }

        return body;
      })
      .then(() => {
        handleCancelDelete();
        fetchSeals();
      })
      .catch((err) => {
        console.error("Error deleting seal:", err);
        setSaveError(err.message || "Error deleting seal");
      })
      .finally(() => stopLoading());
  };

  const handleCellClick = (params) => {
    const { row, colDef } = params;

    if (!colDef.onCellClick) return;
    if (colDef.onCellClick === "delete") handleDeleteClick(params.id);
  };

  const deletingSeal =
    toDeleteId != null
      ? data.find((item) => item.id === toDeleteId)?.seal_number
      : "";
  const deletingDriverId = userData?.driver_id;

  if (!userData) return null;

  return (
    <div
      className="w-full flex flex-col p-2" // column-flex stack
      style={{ height: "calc(100% - 80px)" }} // or h-full if an ancestor already has a height
    >
      {/* Assign Seals button */}
      <div className="flex items-center justify-between mb-2 shrink-0">
        <p className="font-bold">
          {`${userData.first_name} ${userData.last_name} ${userData.driver_id}`}
        </p>
        <Button
          content="Assign Seals"
          style="classicButton"
          fn={() => setModalOpen(true)}
        />
      </div>

      {/* Data grid */}
      <DataGridPro
        className="flex-1 min-h-0" /* flex-grow + allowed to shrink */
        sx={{
          "--DataGrid-minHeight": "0px",
        }} /* removes built-in 400 px floor */
        rows={rows}
        columns={SEALS_COLUMNS_FIELDS}
        // hideFooter
        disableColumnMenu
        disableSelectionOnClick
        onCellClick={handleCellClick}
        slots={{
          toolbar: CustomToolbar, // Enable the built-in toolbar
        }}
        slotProps={{
          toolbar: {
            driverTextData: `${userData.first_name} ${userData.last_name} ${userData.driver_id} seals`,
          },
        }}
      />

      {/* Modal */}
      {modalOpen && (
        <ModalContainer modalIsOpen={modalOpen}>
          <div className="w-96 max-w-full">
            <h2 className="text-xl font-semibold mb-4">Assign Seals</h2>
            <p className="text-s mb-2">
              {`Scan or type seals for driver ${userData.first_name} ${userData.last_name} ${userData.driver_id}`}
            </p>
            {/* Input + Add */}
            <div className="flex items-center gap-2 mb-2">
              <input
                autoFocus
                ref={inputRef}
                type="text"
                value={newSeal}
                onChange={(e) => setNewSeal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter seal number"
                className="rounded flex-1"
              />
              <Button content="Add" style="classicButton" fn={handleAddSeal} />
            </div>
            <p className="text-s my-1 text-slate-500">
              {`Number of scanned seals: ${sealList.length}`}
            </p>

            {/* Pending seals list */}
            <ul className="mb-4 space-y-2 max-h-96 overflow-y-auto">
              {sealList.map((seal, i) => (
                <li
                  key={i}
                  className={`flex items-center justify-between p-1 rounded ${
                    duplicates.has(seal)
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100"
                  }`}
                >
                  <span className="mr-2">{seal}</span>
                  <Button
                    content={<FontAwesomeIcon icon={faXmark} size="sm" />}
                    style="iconButton"
                    fn={() => handleRemoveSeal(i)}
                  />
                </li>
              ))}
            </ul>
            {hasDuplicates && (
              <div className="text-red-600 mb-2 text-center">
                Duplicate seal numbers detected — please remove them before
                saving.
              </div>
            )}

            {/* Cancel + Save */}
            <div className="flex justify-between">
              <Button content="Cancel" style="classicButton" fn={handleClose} />{" "}
              <Button
                content="Save"
                style="classicButton"
                fn={handleSave}
                disabled={hasDuplicates}
              />{" "}
            </div>
          </div>
        </ModalContainer>
      )}
      {saveError && (
        <ModalContainer modalIsOpen={true}>
          <h2 className="text-xl font-semibold mb-2 text-red-600">
            Save Failed
          </h2>
          <p className="mb-4">{saveError}</p>
          <div className="flex justify-end">
            <Button
              content="Close"
              style="classicButton"
              fn={() => setSaveError("")}
            />
          </div>
        </ModalContainer>
      )}
      {existingAssigned.length > 0 && (
        <ModalContainer modalIsOpen={true}>
          <h2 className="text-xl font-semibold mb-4 text-center">
            The following seal numbers are already assigned to a driver
          </h2>
          <table className="min-w-full divide-y divide-gray-200 mb-4">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Seal Number
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Driver
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {existingAssigned.map((item, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2">{item.seal_number}</td>
                  <td className="px-4 py-2">
                    {`${item.first_name} ${item.last_name} (${item.driver_id})`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end">
            <Button
              content="Close"
              style="classicButton"
              fn={() => setExistingAssigned([])}
            />
          </div>
        </ModalContainer>
      )}
      {deleteModalOpen && (
        <ModalContainer modalIsOpen={deleteModalOpen}>
          <h2 className="text-lg text-center font-semibold mb-4">
            Confirm deletion
          </h2>
          <p className="mb-4">
            {`Are you sure you want to delete seal ${deletingSeal} from driver ${deletingDriverId}?`}
          </p>{" "}
          <div className="flex justify-between w-full space-x-2">
            <Button
              content="Cancel"
              style="classicButton"
              fn={handleCancelDelete}
            />
            <Button
              content="Delete"
              style="classicButton"
              fn={handleConfirmDelete}
              highlighted={true}
            />
          </div>
        </ModalContainer>
      )}
    </div>
  );
}
