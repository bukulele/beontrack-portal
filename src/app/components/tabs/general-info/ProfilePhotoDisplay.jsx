"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import PhotoEditor from "@/app/components/photo-editor/PhotoEditor";
import { Camera, Trash2, Info } from "lucide-react";
import * as LucideIcons from "lucide-react";

/**
 * ProfilePhotoDisplay Component
 *
 * Universal interactive photo display with hover-based actions.
 * Features:
 * - Displays current photo or placeholder (icon or image)
 * - Hover overlay with "Change Photo" and "Delete Photo" buttons
 * - Info tooltip showing photo metadata
 * - Opens PhotoEditor for photo upload/editing
 * - Confirmation dialog for deletion
 *
 * @param {object} entityData - Entity data containing photo
 * @param {string} entityType - Type of entity
 * @param {string} entityId - ID of the entity
 * @param {function} onReload - Callback to reload entity data after changes
 * @param {number} width - Photo width (default: 200)
 * @param {number} height - Photo height (default: 300)
 * @param {string|function} photoSrc - Photo source URL or function that returns URL
 * @param {object} placeholder - Placeholder configuration { icon: "User" }
 * @param {string} uploadEndpoint - API endpoint for uploading documents
 * @param {string} updateEndpoint - API endpoint for updating entity
 * @param {string} photoFieldName - Field name for photo ID (e.g., 'profilePhotoId')
 * @param {string} documentType - Document type (e.g., 'profile_photo')
 */
function ProfilePhotoDisplay({
  entityData,
  entityType,
  entityId,
  onReload,
  width = 200,
  height = 300,
  photoSrc,
  placeholder = { icon: "User" },
  uploadEndpoint,
  updateEndpoint,
  photoFieldName = "profilePhotoId",
  documentType = "profile_photo",
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [photoEditorOpen, setPhotoEditorOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Resolve photo source
  const resolvedPhotoSrc = typeof photoSrc === "function"
    ? photoSrc(entityData)
    : photoSrc;

  const hasPhoto = !!entityData?.profilePhoto?.filePath;

  // Get placeholder icon
  const PlaceholderIcon = placeholder?.icon
    ? LucideIcons[placeholder.icon]
    : LucideIcons.User;

  const handleDeletePhoto = async () => {
    try {
      const response = await fetch(updateEndpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          [photoFieldName]: null,
        }),
      });

      if (response.ok) {
        if (onReload) {
          onReload();
        }
      } else {
        console.error("Failed to delete photo");
      }
    } catch (error) {
      console.error("Error deleting photo:", error);
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handlePhotoUploadSuccess = () => {
    if (onReload) {
      onReload();
    }
    setPhotoEditorOpen(false);
  };

  return (
    <>
      <div
        className="relative group"
        style={{ width, height }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Photo or Placeholder Icon */}
        {hasPhoto && resolvedPhotoSrc ? (
          <Image
            src={resolvedPhotoSrc}
            alt="Photo"
            width={width}
            height={height}
            className="rounded-lg object-cover border"
            priority
          />
        ) : (
          <div
            className="rounded-lg border bg-muted flex items-center justify-center"
            style={{ width, height }}
          >
            <PlaceholderIcon className="h-24 w-24 text-muted-foreground" />
          </div>
        )}

        {/* Hover Overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/60 rounded-lg flex flex-col items-center justify-center gap-2 transition-opacity">
            {/* Upload/Change Photo Button */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPhotoEditorOpen(true)}
              className="w-[160px]"
            >
              <Camera className="mr-2 h-4 w-4" />
              {hasPhoto ? "Change Photo" : "Upload Photo"}
            </Button>

            {/* Delete Photo Button (only if photo exists) */}
            {hasPhoto && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setDeleteDialogOpen(true)}
                className="w-[160px]"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Photo
              </Button>
            )}

            {/* Info Hover Card */}
            {hasPhoto && entityData?.profilePhoto && (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-[160px]">
                    <Info className="mr-2 h-4 w-4" />
                    Photo Info
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-64">
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-semibold">File:</span>{" "}
                      {entityData.profilePhoto.fileName}
                    </div>
                    {entityData.profilePhoto.uploadedAt && (
                      <div>
                        <span className="font-semibold">Uploaded:</span>{" "}
                        {new Date(entityData.profilePhoto.uploadedAt).toLocaleDateString()}
                      </div>
                    )}
                    {entityData.profilePhoto.uploadedBy?.name && (
                      <div>
                        <span className="font-semibold">By:</span>{" "}
                        {entityData.profilePhoto.uploadedBy.name}
                      </div>
                    )}
                    {entityData.profilePhoto.fileSize && (
                      <div>
                        <span className="font-semibold">Size:</span>{" "}
                        {(entityData.profilePhoto.fileSize / 1024).toFixed(1)} KB
                      </div>
                    )}
                  </div>
                </HoverCardContent>
              </HoverCard>
            )}
          </div>
        )}
      </div>

      {/* Photo Editor Dialog */}
      <PhotoEditor
        open={photoEditorOpen}
        onOpenChange={setPhotoEditorOpen}
        entityId={entityId}
        entityType={entityType}
        uploadEndpoint={uploadEndpoint}
        updateEndpoint={updateEndpoint}
        photoFieldName={photoFieldName}
        documentType={documentType}
        label="Upload Photo"
        onSuccess={handlePhotoUploadSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Profile Photo?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this profile photo? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePhoto}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default ProfilePhotoDisplay;
