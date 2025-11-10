"use client";

import React, { useState, useEffect } from "react";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { Box } from "@mui/material";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { parse, format, isValid } from "date-fns";
import Button from "../../button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { useLoader } from "@/app/context/LoaderContext";
import { useSession } from "@/lib/auth-client";

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

    fetch(`${config.api.getLogEndpoint}/${userData.id}/activity`, {
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
      .then((response) => {
        // Handle new API response format: { success, data, pagination }
        const logs = response.data || [];
        setChangeLog(logs);
      })
      .catch((error) => {
        console.error("Error loading change log:", error);
        setChangeLog([]); // Set empty array on error
      });
  };

  /**
   * Save individual editable field
   */
  const handleFieldSave = (fieldKey) => {
    if (!userData?.id) return;

    startLoading();

    // Prepare JSON payload for universal API
    const updateData = {
      [fieldKey]: editableFieldsData[fieldKey] || "",
    };

    fetch(`${config.api.updateEndpoint}/${userData.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    })
      .then((response) => {
        stopLoading();
        if (response.ok) {
          loadData(); // Reload entity data
          loadChangeLog(); // Reload change log
        } else {
          return response.json().then((data) => {
            throw new Error(data.error || "Failed to save field");
          });
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
      // Use actual value from userData, including null, to prevent false "changed" state
      initialData[field.key] = userData[field.key] ?? "";
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
              // Compare values, treating null and empty string as equivalent
              const originalValue = userData[field.key] ?? "";
              const currentValue = editableFieldsData[field.key] ?? "";
              const hasChanged = currentValue !== originalValue;

              return (
                <div
                  key={`log_${field.key}_${index}`}
                  className="flex gap-2 items-end"
                >
                  {isDateField ? (
                    <div className="flex flex-col gap-1.5 flex-1">
                      <Label htmlFor={field.key}>{field.label}</Label>
                      <DatePicker
                        value={
                          editableFieldsData[field.key]
                            ? parse(editableFieldsData[field.key], "yyyy-MM-dd", new Date())
                            : undefined
                        }
                        onChange={(date) => {
                          setEditableFieldsData((prev) => ({
                            ...prev,
                            [field.key]: date && isValid(date) ? format(date, "yyyy-MM-dd") : "",
                          }));
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1.5 flex-1">
                      <Label htmlFor={field.key}>{field.label}</Label>
                      <Textarea
                        id={field.key}
                        name={field.key}
                        value={editableFieldsData[field.key] || ""}
                        onChange={(e) =>
                          setEditableFieldsData((prev) => ({
                            ...prev,
                            [e.target.name]: e.target.value,
                          }))
                        }
                      />
                    </div>
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
