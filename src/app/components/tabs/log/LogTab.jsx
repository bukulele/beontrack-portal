"use client";

import React, { useState, useEffect } from "react";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { Box } from "@mui/material";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TextareaInput from "../../textareaInput/TextareaInput";
import DateInput from "../../dateInput/DateInput";
import Button from "../../button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { useLoader } from "@/app/context/LoaderContext";
import { useSession } from "next-auth/react";

/**
 * Universal Log Tab Component
 *
 * Displays:
 * - Editable fields at top (in a Card for visual separation)
 * - Change history table below (using MUI DataGrid with two-container pattern)
 *
 * Two-Container Pattern for DataGrid:
 * - Outer Box: flex: 1, position: "relative" (takes available space)
 * - Inner Box: position: "absolute", inset: 0 (fills outer box)
 * - DataGrid: fills inner box, scrolls internally
 *
 * Used by: DriverCard, EmployeeCard, IncidentCard, ViolationCard
 *
 * Props:
 * @param {Object} config - Log tab configuration
 * @param {Object} context - Entity context (DriverContext, EmployeeContext, etc.)
 */
function LogTab({ config, context }) {
  const [editableFieldsData, setEditableFieldsData] = useState({});
  const [changeLog, setChangeLog] = useState([]);

  const { startLoading, stopLoading } = useLoader();
  const { data: session } = useSession();

  // Extract context data
  const userData = context[config.contextDataKey];
  const loadData = context[config.contextLoadFunction];

  /**
   * Load change log from API
   */
  const loadChangeLog = () => {
    if (!userData?.id) return;

    fetch(`${config.api.getLogEndpoint}/${userData.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 403) {
          return response.json().then((data) => {
            throw new Error(data.message);
          });
        }
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.statusText);
        }
      })
      .then((data) => {
        // Sort by ID desc (newest first)
        const sortedData = data.sort((a, b) => b.id - a.id);
        setChangeLog(sortedData);
      })
      .catch((error) => {
        console.error("Error loading change log:", error);
      });
  };

  /**
   * Save individual editable field
   */
  const handleFieldSave = (fieldKey) => {
    if (!userData?.id) return;

    startLoading();

    const formData = new FormData();
    formData.append(fieldKey, editableFieldsData[fieldKey] || "");

    // Add changed_by if session available
    if (session?.user?.name) {
      formData.append("changed_by", session.user.name);
    }

    fetch(`${config.api.updateEndpoint}/${userData.id}`, {
      method: "PATCH",
      body: formData,
    })
      .then((response) => {
        stopLoading();
        if (response.ok) {
          loadData(); // Reload entity data
          loadChangeLog(); // Reload change log
        } else {
          throw new Error("Failed to save field");
        }
      })
      .catch((error) => {
        stopLoading();
        console.error("Error saving field:", error);
      });
  };

  // Initialize editable fields from userData
  useEffect(() => {
    if (!userData || !config.editableFields) return;

    const initialData = {};
    config.editableFields.forEach((field) => {
      initialData[field.key] = userData[field.key] || "";
    });
    setEditableFieldsData(initialData);
  }, [userData, config.editableFields]);

  // Load change log when userData changes
  useEffect(() => {
    if (userData) {
      loadChangeLog();
    }
  }, [userData]);

  // Prepare rows for DataGrid
  const rows = changeLog.map((row) => ({
    id: row.id,
    ...row,
  }));

  if (!userData) {
    return <div className="p-5 text-gray-500">Loading...</div>;
  }

  return (
    <div className="h-full w-full flex flex-col p-5 gap-4">
      {/* Editable Fields Card - shrink-0 to prevent shrinking */}
      {config.editableFields && config.editableFields.length > 0 && (
        <Card className="shrink-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              {config.editableFieldsTitle || "Notes"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {config.editableFields.map((field, index) => {
              const isDateField = field.type === "date";
              const hasChanged =
                editableFieldsData[field.key] !== userData[field.key];

              return (
                <div
                  key={`log_${field.key}_${index}`}
                  className="flex gap-2 items-end"
                >
                  {isDateField ? (
                    <DateInput
                      label={field.label}
                      name={field.key}
                      value={editableFieldsData[field.key]}
                      updateState={setEditableFieldsData}
                      style="minimalistic"
                    />
                  ) : (
                    <TextareaInput
                      name={field.key}
                      label={field.label}
                      value={editableFieldsData[field.key]}
                      updateState={setEditableFieldsData}
                      style="compact"
                    />
                  )}
                  {hasChanged && (
                    <Button
                      style="iconButton"
                      fn={() => handleFieldSave(field.key)}
                      content={<FontAwesomeIcon icon={faCheck} />}
                      tooltipContent="Save"
                      tooltipId={`save_${field.key}_tooltip`}
                    />
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Change Log Section Title */}
      <h3 className="text-lg font-bold shrink-0">
        {config.changeLogTitle || "Change Log"}
      </h3>

      {/* Change Log DataGrid with Two-Container Pattern */}
      {changeLog && changeLog.length > 0 ? (
        <Box sx={{ flex: 1, position: "relative" }}>
          <Box sx={{ position: "absolute", inset: 0 }}>
            <DataGridPro
              rows={rows}
              columns={config.changeLogColumns}
              density="compact"
              disableRowSelectionOnClick
              disableColumnMenu
              hideFooter
            />
          </Box>
        </Box>
      ) : (
        <Card className="shrink-0">
          <CardContent className="p-8 text-center text-gray-500">
            No change history available
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default LogTab;
