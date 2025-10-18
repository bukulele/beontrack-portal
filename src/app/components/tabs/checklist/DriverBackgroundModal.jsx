"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLoader } from "@/app/context/LoaderContext";
import { useSession } from "next-auth/react";

/**
 * DriverBackgroundModal - Modal for editing driver background information
 *
 * Allows editing driver's educational background, accident history,
 * license issues, and other background information.
 *
 * @param {boolean} open - Modal open state
 * @param {Function} onClose - Close modal callback
 * @param {Object} item - Item configuration
 * @param {Array|Object} itemData - Driver background data
 * @param {Object} entityData - Entity data
 * @param {Function} loadData - Reload entity data
 * @param {string} entityType - Entity type (driver)
 * @param {number} entityId - Entity ID
 */
export function DriverBackgroundModal({
  open,
  onClose,
  item,
  itemData,
  entityData,
  loadData,
  entityType,
  entityId,
}) {
  const BACKGROUND_TEMPLATE = {
    file_box_number: "",
    highest_level_of_education: "",
    name_of_school: "",
    school_location: "",
    certificates_additional_training: "",
    accidents_history: "",
    traffic_convictions: "",
    denied_license: false,
    denied_license_reason: "",
    license_suspended_or_revoked: false,
    suspension_or_revocation_reason: "",
  };

  const [background, setBackground] = useState(BACKGROUND_TEMPLATE);
  const [originalBackground, setOriginalBackground] = useState(BACKGROUND_TEMPLATE);
  const [hasChanges, setHasChanges] = useState(false);
  const { startLoading, stopLoading } = useLoader();
  const { data: session } = useSession();

  // Initialize background data
  useEffect(() => {
    if (entityData) {
      const backgroundData = {
        file_box_number: entityData.file_box_number || "",
        highest_level_of_education: entityData.highest_level_of_education || "",
        name_of_school: entityData.name_of_school || "",
        school_location: entityData.school_location || "",
        certificates_additional_training: entityData.certificates_additional_training || "",
        accidents_history: entityData.accidents_history || "",
        traffic_convictions: entityData.traffic_convictions || "",
        denied_license: entityData.denied_license || false,
        denied_license_reason: entityData.denied_license_reason || "",
        license_suspended_or_revoked: entityData.license_suspended_or_revoked || false,
        suspension_or_revocation_reason: entityData.suspension_or_revocation_reason || "",
      };
      setBackground(backgroundData);
      setOriginalBackground(JSON.parse(JSON.stringify(backgroundData)));
    }
    setHasChanges(false);
  }, [entityData, open]);

  const updateField = (field, value) => {
    setBackground(prev => ({ ...prev, [field]: value }));
  };

  // Check for changes whenever background changes
  useEffect(() => {
    const changed = JSON.stringify(background) !== JSON.stringify(originalBackground);
    setHasChanges(changed);
  }, [background, originalBackground]);

  const saveBackground = async () => {
    try {
      startLoading();

      const data = new FormData();

      // Append all fields
      Object.entries(background).forEach(([key, value]) => {
        data.append(key, value);
      });

      data.append("changed_by", session?.user?.name || "Unknown");

      const response = await fetch(`/api/upload-${entityType}-data/${entityId}`, {
        method: "PATCH",
        body: data,
      });

      if (!response.ok) {
        throw new Error("Failed to save driver background");
      }

      stopLoading();
      loadData();
      onClose();
    } catch (error) {
      console.error("Error saving driver background:", error);
      stopLoading();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Driver Background</DialogTitle>
          <DialogDescription>
            Edit driver&apos;s educational background, accident history, and license information.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Box Number */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">General Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <Label>File Box Number</Label>
                <Input
                  value={background.file_box_number}
                  onChange={(e) => updateField("file_box_number", e.target.value)}
                  placeholder="Enter file box number"
                />
              </div>
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Education</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <Label>Highest Level of Education</Label>
                <Input
                  value={background.highest_level_of_education}
                  onChange={(e) => updateField("highest_level_of_education", e.target.value)}
                  placeholder="e.g., High School, Bachelor's Degree"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Name of School</Label>
                  <Input
                    value={background.name_of_school}
                    onChange={(e) => updateField("name_of_school", e.target.value)}
                    placeholder="School name"
                  />
                </div>

                <div className="space-y-1">
                  <Label>School Location</Label>
                  <Input
                    value={background.school_location}
                    onChange={(e) => updateField("school_location", e.target.value)}
                    placeholder="City, Province/State"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label>Certificates and Additional Training</Label>
                <Textarea
                  value={background.certificates_additional_training}
                  onChange={(e) => updateField("certificates_additional_training", e.target.value)}
                  placeholder="List any certificates or additional training..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Driving History */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Driving History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <Label>Accidents History</Label>
                <Textarea
                  value={background.accidents_history}
                  onChange={(e) => updateField("accidents_history", e.target.value)}
                  placeholder="Describe any accident history..."
                  rows={3}
                />
              </div>

              <div className="space-y-1">
                <Label>Traffic Convictions</Label>
                <Textarea
                  value={background.traffic_convictions}
                  onChange={(e) => updateField("traffic_convictions", e.target.value)}
                  placeholder="List any traffic convictions..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* License Issues */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">License Issues</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Denied License */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={background.denied_license}
                    onCheckedChange={(checked) => updateField("denied_license", checked)}
                  />
                  <Label className="cursor-pointer" onClick={() =>
                    updateField("denied_license", !background.denied_license)
                  }>
                    Ever been denied a license?
                  </Label>
                </div>

                {background.denied_license && (
                  <div className="ml-6 space-y-1">
                    <Label>Reason for Denial</Label>
                    <Textarea
                      value={background.denied_license_reason}
                      onChange={(e) => updateField("denied_license_reason", e.target.value)}
                      placeholder="Explain why the license was denied..."
                      rows={2}
                    />
                  </div>
                )}
              </div>

              {/* Suspended/Revoked License */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={background.license_suspended_or_revoked}
                    onCheckedChange={(checked) => updateField("license_suspended_or_revoked", checked)}
                  />
                  <Label className="cursor-pointer" onClick={() =>
                    updateField("license_suspended_or_revoked", !background.license_suspended_or_revoked)
                  }>
                    Ever had license suspended or revoked?
                  </Label>
                </div>

                {background.license_suspended_or_revoked && (
                  <div className="ml-6 space-y-1">
                    <Label>Reason for Suspension/Revocation</Label>
                    <Textarea
                      value={background.suspension_or_revocation_reason}
                      onChange={(e) => updateField("suspension_or_revocation_reason", e.target.value)}
                      placeholder="Explain why the license was suspended or revoked..."
                      rows={2}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <ButtonGroup>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={saveBackground} disabled={!hasChanges}>
              Save Changes
            </Button>
          </ButtonGroup>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DriverBackgroundModal;
