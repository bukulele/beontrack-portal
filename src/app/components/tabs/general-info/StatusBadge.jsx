"use client";

import React, { useState, useEffect, useContext } from "react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { useLoader } from "@/app/context/LoaderContext";
import { SettingsContext } from "@/app/context/SettingsContext";

/**
 * StatusBadge - Editable status badge component
 *
 * Displays entity status as a colored badge. Can be clicked to change status
 * (filtered by allowed transitions from settings).
 *
 * @param {string} currentStatus - Current status code
 * @param {Object} statusChoices - All status options {code: label}
 * @param {string} entityType - Entity type (truck, driver, etc.)
 * @param {number} entityId - Entity ID
 * @param {Function} onStatusChange - Callback after successful change
 * @param {boolean} editable - Can change status (default true)
 */
function StatusBadge({
  currentStatus,
  statusChoices,
  entityType,
  entityId,
  onStatusChange,
  editable = true,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [allowedStatuses, setAllowedStatuses] = useState({});
  const [statusColor, setStatusColor] = useState("");

  const { data: session } = useSession();
  const { startLoading, stopLoading } = useLoader();
  const { statusSettings } = useContext(SettingsContext);

  // Update when current status changes
  useEffect(() => {
    setSelectedStatus(currentStatus);
  }, [currentStatus]);

  // Calculate allowed statuses and color
  useEffect(() => {
    if (!statusSettings || !currentStatus) return;

    const entitySettings = statusSettings[entityType];
    if (!entitySettings) return;

    // Get allowed status transitions
    const allowedList = [];
    entitySettings.status_transitions?.forEach((transition) => {
      if (transition.status_from === currentStatus) {
        allowedList.push(transition.status_to);
      }
    });

    // Filter status choices
    const filtered = {};
    for (const [key, label] of Object.entries(statusChoices)) {
      if (allowedList.includes(key) || key === currentStatus) {
        filtered[key] = label;
      }
    }
    setAllowedStatuses(filtered);

    // Get status color
    const colorConfig = entitySettings.status_colors?.find(
      (item) => item.status === currentStatus
    );
    setStatusColor(colorConfig?.color || "#6B7280"); // Default gray
  }, [statusSettings, currentStatus, entityType, statusChoices]);

  // Handle status change
  const handleStatusChange = async (newStatus) => {
    if (newStatus === currentStatus) {
      setIsEditing(false);
      return;
    }

    try {
      startLoading();

      const data = new FormData();
      data.append("status", newStatus);
      data.append("changed_by", session.user.name);

      const response = await fetch(`/api/upload-${entityType}-data/${entityId}`, {
        method: "PATCH",
        body: data,
      });

      if (response.ok) {
        setIsEditing(false);
        setSelectedStatus(newStatus);
        if (onStatusChange) onStatusChange(newStatus);
      } else {
        stopLoading();
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      stopLoading();
    }
  };

  // Get badge variant based on status
  const getBadgeClass = () => {
    return `text-white hover:opacity-80 cursor-pointer`;
  };

  if (isEditing && editable) {
    return (
      <Select
        value={selectedStatus}
        onValueChange={(value) => {
          handleStatusChange(value);
        }}
        onOpenChange={(open) => {
          if (!open) setIsEditing(false);
        }}
        open={true}
      >
        <SelectTrigger className="w-[180px]" style={{ backgroundColor: statusColor }}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(allowedStatuses).map(([key, label]) => (
            <SelectItem key={key} value={key}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <Badge
      className={getBadgeClass()}
      style={{ backgroundColor: statusColor }}
      onClick={() => editable && setIsEditing(true)}
    >
      {statusChoices[currentStatus] || currentStatus}
    </Badge>
  );
}

export default StatusBadge;
