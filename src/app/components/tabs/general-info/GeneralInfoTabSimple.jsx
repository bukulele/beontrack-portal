"use client";

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
} from "@/components/ui/item";
import { Badge } from "@/components/ui/badge";
import {
  TRUCK_STATUS_CHOICES,
  VEHICLE_TYPE_CHOICES,
  TERMINAL_CHOICES,
  OWNEDBY_CHOICES_TRUCKS,
} from "@/app/assets/tableData";
import formatDate from "@/app/functions/formatDate";
import findHighestIdObject from "@/app/functions/findHighestIdObject";

/**
 * GeneralInfoTabSimple - Simplified read-only general info tab
 *
 * This is a temporary component for Phase 3 testing.
 * Full general info tab with editing will be implemented in Phase 4.
 *
 * @param {Object} entityData - Entity data from context
 * @param {string} entityType - Entity type (truck)
 */
function GeneralInfoTabSimple({ entityData, entityType }) {
  if (!entityData) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No data available
      </div>
    );
  }

  // Get status badge color
  const getStatusColor = (status) => {
    const colorMap = {
      AC: "bg-green-600",
      NW: "bg-blue-600",
      IN: "bg-yellow-600",
      SL: "bg-orange-600",
      TL: "bg-red-600",
      OS: "bg-gray-600",
      LE: "bg-purple-600",
      RE: "bg-pink-600",
    };
    return colorMap[status] || "bg-gray-600";
  };

  // Helper to get value or "N/A"
  const getValue = (value) => value || "N/A";

  // Get license plate info
  const licensePlate = findHighestIdObject(entityData.truck_license_plates || []);
  const plateNumber = licensePlate?.plate_number || "N/A";
  const plateExpiry = licensePlate?.expiry_date
    ? formatDate(licensePlate.expiry_date)
    : "N/A";

  // Get safety info
  const safetyDoc = findHighestIdObject(entityData.truck_safety_docs || []);
  const safetyExpiry = safetyDoc?.expiry_date
    ? formatDate(safetyDoc.expiry_date)
    : "N/A";

  // Get registration info
  const registrationDoc = findHighestIdObject(entityData.truck_registration_docs || []);
  const registrationExpiry = registrationDoc?.expiry_date
    ? formatDate(registrationDoc.expiry_date)
    : "N/A";

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Status Badge */}
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">{entityData.unit_number}</h2>
          <Badge className={`${getStatusColor(entityData.status)} text-white`}>
            {TRUCK_STATUS_CHOICES[entityData.status] || entityData.status}
          </Badge>
        </div>

        {/* Basic Information */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase">
            Basic Information
          </h3>
          <ItemGroup>
            <Item variant="outline" size="sm">
              <ItemContent>
                <ItemTitle>Unit Number</ItemTitle>
                <ItemDescription>{getValue(entityData.unit_number)}</ItemDescription>
              </ItemContent>
            </Item>
            <ItemSeparator />
            <Item variant="outline" size="sm">
              <ItemContent>
                <ItemTitle>VIN</ItemTitle>
                <ItemDescription>{getValue(entityData.vin)}</ItemDescription>
              </ItemContent>
            </Item>
            <ItemSeparator />
            <Item variant="outline" size="sm">
              <ItemContent>
                <ItemTitle>Make & Model</ItemTitle>
                <ItemDescription>
                  {getValue(entityData.make)} {getValue(entityData.model)}
                </ItemDescription>
              </ItemContent>
            </Item>
            <ItemSeparator />
            <Item variant="outline" size="sm">
              <ItemContent>
                <ItemTitle>Year</ItemTitle>
                <ItemDescription>{getValue(entityData.year)}</ItemDescription>
              </ItemContent>
            </Item>
            <ItemSeparator />
            <Item variant="outline" size="sm">
              <ItemContent>
                <ItemTitle>Vehicle Type</ItemTitle>
                <ItemDescription>
                  {VEHICLE_TYPE_CHOICES[entityData.vehicle_type] ||
                    getValue(entityData.vehicle_type)}
                </ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
        </div>

        {/* Location & Ownership */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase">
            Location & Ownership
          </h3>
          <ItemGroup>
            <Item variant="outline" size="sm">
              <ItemContent>
                <ItemTitle>Terminal</ItemTitle>
                <ItemDescription>
                  {TERMINAL_CHOICES[entityData.terminal] ||
                    getValue(entityData.terminal)}
                </ItemDescription>
              </ItemContent>
            </Item>
            <ItemSeparator />
            <Item variant="outline" size="sm">
              <ItemContent>
                <ItemTitle>Owned By</ItemTitle>
                <ItemDescription>
                  {OWNEDBY_CHOICES_TRUCKS[entityData.owned_by] ||
                    getValue(entityData.owned_by)}
                </ItemDescription>
              </ItemContent>
            </Item>
            <ItemSeparator />
            <Item variant="outline" size="sm">
              <ItemContent>
                <ItemTitle>Value (CAD)</ItemTitle>
                <ItemDescription>
                  {entityData.value_in_cad
                    ? `$${parseFloat(entityData.value_in_cad).toLocaleString()}`
                    : "N/A"}
                </ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
        </div>

        {/* Documents & Expiry Dates */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase">
            Documents & Expiry Dates
          </h3>
          <ItemGroup>
            <Item variant="outline" size="sm">
              <ItemContent>
                <ItemTitle>License Plate</ItemTitle>
                <ItemDescription>
                  {plateNumber} (Expires: {plateExpiry})
                </ItemDescription>
              </ItemContent>
            </Item>
            <ItemSeparator />
            <Item variant="outline" size="sm">
              <ItemContent>
                <ItemTitle>Safety Expiry</ItemTitle>
                <ItemDescription>{safetyExpiry}</ItemDescription>
              </ItemContent>
            </Item>
            <ItemSeparator />
            <Item variant="outline" size="sm">
              <ItemContent>
                <ItemTitle>Registration Expiry</ItemTitle>
                <ItemDescription>{registrationExpiry}</ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
        </div>

        {/* Remarks */}
        {entityData.remarks && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase">
              Remarks
            </h3>
            <div className="border rounded-lg p-4 bg-muted/50">
              <p className="text-sm whitespace-pre-wrap">{entityData.remarks}</p>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

export default GeneralInfoTabSimple;
