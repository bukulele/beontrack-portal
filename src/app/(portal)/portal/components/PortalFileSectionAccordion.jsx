"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CompactFileViewRow from "@/app/components/tabs/checklist/CompactFileViewRow";
import PortalChecklistItem from "./checklist/PortalChecklistItem";

/**
 * PortalFileSectionAccordion - Portal-specific collapsible file sections
 *
 * Simplified version for portal use with PortalChecklistItem.
 * Displays file-related checklist items in an accordion.
 *
 * @param {Object} section - Section configuration
 * @param {string} section.title - Section title
 * @param {Array} section.items - Checklist item configs
 * @param {boolean} section.defaultOpen - Open by default
 * @param {boolean} readOnly - Read-only mode (no upload/edit/review)
 * @param {Object} entityData - Entity data from context
 * @param {Function} loadData - Reload entity data
 * @param {string} entityType - Entity type
 * @param {number} entityId - Entity ID
 * @param {string} apiRoute - API endpoint for file operations
 */
function PortalFileSectionAccordion({
  section,
  readOnly = false,
  entityData,
  loadData,
  entityType,
  entityId,
  apiRoute = "/api/update-file",
}) {
  if (!section || !section.items || section.items.length === 0) {
    return null;
  }

  // Always use Accordion (for both read-only and edit modes)
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
          <div className="space-y-2">
            {readOnly ? (
              // Read-only mode: use CompactFileViewRow
              section.items.map((item) => (
                <CompactFileViewRow
                  key={item.key}
                  item={item}
                  entityData={entityData}
                  loadData={loadData}
                  entityType={entityType}
                />
              ))
            ) : (
              // Edit mode: use PortalChecklistItem
              section.items.map((item) => (
                <PortalChecklistItem
                  key={item.key}
                  item={item}
                  entityData={entityData}
                  loadData={loadData}
                  entityType={entityType}
                  entityId={entityId}
                  apiRoute={apiRoute}
                  readOnly={readOnly}
                />
              ))
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default PortalFileSectionAccordion;
