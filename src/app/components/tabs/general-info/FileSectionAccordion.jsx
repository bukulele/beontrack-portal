"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ItemGroup } from "@/components/ui/item";
import ChecklistItem from "@/app/components/tabs/checklist/ChecklistItem";

/**
 * FileSectionAccordion - Collapsible file sections for general info tab
 *
 * Displays file-related checklist items in an accordion.
 * Reuses ChecklistItem component for file operations.
 *
 * @param {Object} section - Section configuration
 * @param {string} section.title - Section title
 * @param {Array} section.items - Checklist item configs
 * @param {boolean} section.defaultOpen - Open by default
 * @param {Object} entityData - Entity data from context
 * @param {Function} loadData - Reload entity data
 * @param {string} entityType - Entity type
 * @param {number} entityId - Entity ID
 * @param {string} apiRoute - API endpoint for file operations
 */
function FileSectionAccordion({
  section,
  entityData,
  loadData,
  entityType,
  entityId,
  apiRoute = "/api/update-file",
}) {
  if (!section || !section.items || section.items.length === 0) {
    return null;
  }

  return (
    <Accordion type="single" collapsible defaultValue={section.defaultOpen ? "section" : undefined}>
      <AccordionItem value="section" className="border rounded-lg">
        <AccordionTrigger className="px-4 py-3 hover:no-underline">
          <div className="flex items-center justify-between w-full pr-4">
            <h3 className="text-sm font-semibold">{section.title}</h3>
            {section.subtitle && (
              <span className="text-xs text-muted-foreground">{section.subtitle}</span>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-3 pb-3">
          <ItemGroup>
            {section.items.map((item) => (
              <ChecklistItem
                key={item.key}
                item={item}
                entityData={entityData}
                loadData={loadData}
                entityType={entityType}
                entityId={entityId}
                apiRoute={apiRoute}
              />
            ))}
          </ItemGroup>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default FileSectionAccordion;
