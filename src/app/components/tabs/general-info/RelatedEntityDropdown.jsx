"use client";

import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInfoCard } from "@/app/context/InfoCardContext";

/**
 * RelatedEntityDropdown - Dropdown selector to navigate to related entities
 *
 * Displays a dropdown of related entities (incidents, violations, WCB claims, etc.)
 * and navigates to the selected entity card.
 *
 * @param {string} label - Dropdown label
 * @param {Array} relatedIds - Array of related entity IDs
 * @param {Object} entitiesList - Full list of entities to filter from
 * @param {string} entityType - Type of entity (incident, violation, wcb)
 * @param {string} displayField - Field to display in dropdown (e.g., 'incident_number')
 * @param {string} defaultLabel - Default option label (e.g., 'Go to incident')
 */
function RelatedEntityDropdown({
  label,
  relatedIds = [],
  entitiesList = {},
  entityType,
  displayField = "id",
  defaultLabel = "Select...",
}) {
  const [value, setValue] = useState("0");
  const [filteredEntities, setFilteredEntities] = useState({});

  const { handleCardDataSet } = useInfoCard();

  // Filter entities by related IDs
  useEffect(() => {
    if (!entitiesList || !relatedIds) return;

    const filtered = { 0: defaultLabel };

    relatedIds.forEach((relatedId) => {
      if (entitiesList[relatedId]) {
        filtered[relatedId] = entitiesList[relatedId][displayField] || relatedId;
      }
    });

    setFilteredEntities(filtered);
  }, [relatedIds, entitiesList, displayField, defaultLabel]);

  // Handle selection change
  const handleValueChange = (newValue) => {
    setValue(newValue);

    if (newValue !== "0") {
      handleCardDataSet(newValue, entityType);
    }
  };

  // Reset selection after navigation
  useEffect(() => {
    if (value !== "0") {
      // Reset to default after a short delay
      const timer = setTimeout(() => setValue("0"), 300);
      return () => clearTimeout(timer);
    }
  }, [value]);

  // Don't render if no related entities
  if (!relatedIds || relatedIds.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {label && (
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
          {label}:
        </span>
      )}
      <Select value={value} onValueChange={handleValueChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(filteredEntities).map(([id, displayValue]) => (
            <SelectItem key={id} value={id}>
              {displayValue}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default RelatedEntityDropdown;
