"use client";

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InfoField from "./InfoField";
import StatusBadge from "./StatusBadge";
import FileSectionAccordion from "./FileSectionAccordion";
import Image from "next/image";

/**
 * GeneralInfoTab - Full-featured general information tab
 *
 * Displays entity details with inline editing, status management,
 * and file sections.
 *
 * @param {Object} config - Tab configuration
 * @param {Array} config.sections - Field sections
 * @param {Array} config.fileSections - File sections
 * @param {Object} config.image - Image configuration
 * @param {Object} config.statusConfig - Status badge configuration
 * @param {Object} entityData - Entity data from context
 * @param {Function} loadData - Reload entity data
 * @param {string} entityType - Entity type
 * @param {number} entityId - Entity ID
 */
function GeneralInfoTab({
  config,
  entityData,
  loadData,
  entityType,
  entityId,
}) {
  if (!entityData) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Loading...
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-6">
        <div className="flex gap-6">
          {/* Left Side - Image */}
          {config.image && (
            <div className="flex flex-col gap-4 w-64 shrink-0">
              <Image
                src={config.image.src(entityData)}
                alt={config.image.alt || "Entity Image"}
                width={config.image.width || 300}
                height={config.image.height || 200}
                className="rounded-lg object-contain"
              />

              {/* Additional info below image */}
              {config.image.additionalInfo && (
                <div className="space-y-2 text-sm">
                  {config.image.additionalInfo.map((info, index) => (
                    <div key={index}>
                      <span className="font-semibold">{info.label}: </span>
                      <span>{info.value(entityData)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Right Side - Fields and Sections */}
          <div className="flex-1 space-y-6">
            {/* Header with Status Badge */}
            {config.statusConfig && (
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold">
                  {config.titleField ? entityData[config.titleField] : ""}
                </h2>
                <StatusBadge
                  currentStatus={entityData.status}
                  statusChoices={config.statusConfig.statusChoices}
                  entityType={entityType}
                  entityId={entityId}
                  onStatusChange={loadData}
                  editable={config.statusConfig.editable}
                />
              </div>
            )}

            {/* Field Sections */}
            {config.sections?.map((section, sectionIndex) => (
              <Card key={sectionIndex}>
                {section.title && (
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-muted-foreground uppercase">
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                )}
                <CardContent className="space-y-0 p-4 pt-0">
                  {section.fields?.map((fieldConfig, fieldIndex) => (
                    <InfoField
                      key={fieldIndex}
                      fieldConfig={fieldConfig}
                      value={entityData[fieldConfig.key]}
                      entityData={entityData}
                      entityType={entityType}
                      entityId={entityId}
                      onSave={loadData}
                    />
                  ))}
                </CardContent>
              </Card>
            ))}

            {/* File Sections */}
            {config.fileSections?.map((section, sectionIndex) => (
              <FileSectionAccordion
                key={sectionIndex}
                section={section}
                entityData={entityData}
                loadData={loadData}
                entityType={entityType}
                entityId={entityId}
              />
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

export default GeneralInfoTab;
