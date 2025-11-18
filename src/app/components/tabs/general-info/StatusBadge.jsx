"use client";

import React, { useState, useEffect, useContext } from "react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "@/lib/auth-client";
import { useLoader } from "@/app/context/LoaderContext";
import { SettingsContext } from "@/app/context/SettingsContext";

/**
 * StatusBadge - Editable status badge component
 *
 * Displays entity status as a colored badge. Can be clicked to change status
 * (filtered by allowed transitions from settings).
 *
 * Gets status choices dynamically from statusSettings context (database-driven).
 *
 * @param {string} currentStatus - Current status code
 * @param {string} entityType - Entity type (employees, trucks, drivers, etc.)
 * @param {string} entityId - Entity ID
 * @param {Function} onStatusChange - Callback after successful change
 * @param {boolean} editable - Can change status (default true)
 */
function StatusBadge({
  currentStatus,
  entityType,
  entityId,
  onStatusChange,
  editable = true,
}) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [allowedStatuses, setAllowedStatuses] = useState({});
  const [statusColor, setStatusColor] = useState("");
  const [statusLabel, setStatusLabel] = useState("");

  const { data: session } = useSession();
  const { startLoading, stopLoading } = useLoader();
  const { statusSettings } = useContext(SettingsContext);

  // Update when current status changes
  useEffect(() => {
    setSelectedStatus(currentStatus);
  }, [currentStatus]);

  // Calculate allowed statuses, labels, and color from statusSettings (database-driven)
  useEffect(() => {
    if (!statusSettings || !currentStatus) return;

    const entitySettings = statusSettings[entityType];
    if (!entitySettings) return;

    // Build statusChoices map from status_colors (database)
    const allStatusChoices = {};
    entitySettings.status_colors?.forEach((item) => {
      // Convert status code to readable label (capitalize and replace underscores)
      const label = item.status
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      allStatusChoices[item.status] = label;
    });

    // Get allowed status transitions
    const allowedList = [];
    entitySettings.status_transitions?.forEach((transition) => {
      if (transition.status_from === currentStatus) {
        allowedList.push(transition.status_to);
      }
    });

    // Filter to only allowed transitions (exclude current status)
    const filtered = {};
    for (const [key, label] of Object.entries(allStatusChoices)) {
      if (allowedList.includes(key)) {
        filtered[key] = label;
      }
    }
    setAllowedStatuses(filtered);

    // Set current status label
    setStatusLabel(allStatusChoices[currentStatus] || currentStatus);

    // Get status color
    const colorConfig = entitySettings.status_colors?.find(
      (item) => item.status === currentStatus
    );
    setStatusColor(colorConfig?.color || "#6B7280"); // Default gray
  }, [statusSettings, currentStatus, entityType]);

  // Handle status change
  const handleStatusChange = async (newStatus) => {
    if (newStatus === currentStatus) {
      return;
    }

    try {
      startLoading();

      const response = await fetch(`/api/v1/${entityType}/${entityId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (response.ok) {
        setSelectedStatus(newStatus);
        if (onStatusChange) onStatusChange(newStatus);
      } else {
        stopLoading();
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to update status:", errorData);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      stopLoading();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={!editable}>
        <Badge
          className="text-white hover:opacity-80 cursor-pointer"
          style={{ backgroundColor: statusColor }}
        >
          {statusLabel || currentStatus}
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {Object.entries(allowedStatuses).map(([key, label]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => handleStatusChange(key)}
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default StatusBadge;
