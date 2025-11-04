"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLoader } from "@/app/context/LoaderContext";
import compressFile from "@/app/functions/compressFile";
import convertHeicToJpeg from "@/app/functions/convertHeicToJpeg";
import AvatarEditor from "react-avatar-editor";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RotateCcw, RotateCw, Undo2 } from "lucide-react";
import { useSession } from "next-auth/react";

/**
 * PhotoEditor Component
 *
 * Universal photo editing component with rotation, scaling, and cropping.
 * Features:
 * - HEIC to JPEG conversion
 * - Image compression
 * - Rotation (-180° to 180°) with quick 90° buttons
 * - Scaling (1x to 5x zoom)
 * - Live preview with AvatarEditor
 *
 * @param {boolean} open - Dialog open state
 * @param {function} onOpenChange - Dialog state change handler
 * @param {string} entityId - ID of the entity
 * @param {string} entityType - Type of entity ('employee', 'driver', 'truck', etc.)
 * @param {string} uploadEndpoint - API endpoint for document upload (e.g., '/api/v1/employees/:id/documents')
 * @param {string} updateEndpoint - API endpoint to update photo reference (e.g., '/api/v1/employees/:id')
 * @param {string} photoFieldName - Field name for photo ID (e.g., 'profilePhotoId')
 * @param {string} documentType - Document type for upload (e.g., 'profile_photo')
 * @param {string} label - Dialog title label
 * @param {function} onSuccess - Callback after successful upload
 */
function PhotoEditor({
  open,
  onOpenChange,
  entityId,
  entityType,
  uploadEndpoint,
  updateEndpoint,
  photoFieldName = "profilePhotoId",
  documentType = "profile_photo",
  label = "Upload Photo",
  onSuccess,
}) {
  const [file, setFile] = useState(null);
  const [fileSent, setFileSent] = useState(false);
  const [rotate, setRotate] = useState(0);
  const [scale, setScale] = useState(1);

  const editor = useRef(null);
  const { data: session } = useSession();
  const { startLoading, stopLoading } = useLoader();

  const resetPhotoSettings = () => {
    setRotate(0);
    setScale(1);
  };

  const handleRotate90 = (direction) => {
    let newAngle = rotate;

    if (direction === "left" && rotate > -180) {
      newAngle -= 90;
    } else if (direction === "left" && rotate <= -180) {
      newAngle = 90;
    }

    if (direction === "right" && rotate < 180) {
      newAngle += 90;
    } else if (direction === "right" && rotate >= 180) {
      newAngle = -90;
    }
    setRotate(newAngle);
  };

  const handleFileChange = async (event) => {
    startLoading();
    const { files } = event.target;
    const selectedFile = files[0];
    let processedFile = selectedFile;

    try {
      if (
        selectedFile.type === "image/heic" ||
        selectedFile.type === "image/heif"
      ) {
        processedFile = await convertHeicToJpeg(selectedFile);
      }
      processedFile = await compressFile(processedFile);

      setFile(processedFile);
    } catch (error) {
      console.error("Error processing file:", error);
    } finally {
      stopLoading();
    }
  };

  const uploadFile = async () => {
    if (!editor.current) return;

    startLoading();

    try {
      // Get edited image as JPEG (smaller file size, quality 0.9)
      const dataUrl = editor.current.getImage().toDataURL("image/jpeg", 0.9);
      const res = await fetch(dataUrl);
      const blob = await res.blob();

      // Step 1: Upload document
      const uploadData = new FormData();
      uploadData.append("file", blob, `photo.jpg`);
      uploadData.append("documentType", documentType);

      const uploadResponse = await fetch(uploadEndpoint, {
        method: "POST",
        body: uploadData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload photo");
      }

      const uploadResult = await uploadResponse.json();
      const documentId = uploadResult.data.id;

      // Step 2: Update entity's photo reference
      const updateResponse = await fetch(updateEndpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          [photoFieldName]: documentId,
        }),
      });

      stopLoading();

      if (updateResponse.ok) {
        setFileSent(true);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        console.error("Error updating photo reference");
      }
    } catch (error) {
      stopLoading();
      console.error("Error uploading photo:", error);
    }
  };

  const handleClose = () => {
    setFileSent(false);
    setFile(null);
    resetPhotoSettings();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        {fileSent ? (
          <>
            <DialogHeader>
              <DialogTitle>Success</DialogTitle>
              <DialogDescription>
                Photo uploaded successfully!
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={handleClose}>OK</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{label}</DialogTitle>
              <DialogDescription>
                Select a photo to upload. You can rotate and zoom before
                uploading.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* File Input */}
              <div className="space-y-2">
                <Label htmlFor="photo-upload">Select Photo</Label>
                <Input
                  id="photo-upload"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="cursor-pointer"
                />
              </div>

              {/* Photo Editor */}
              {file && (
                <div className="flex flex-col items-center space-y-4">
                  {/* Avatar Editor Preview */}
                  <div className="border rounded-lg overflow-hidden">
                    <AvatarEditor
                      ref={editor}
                      image={file}
                      width={200}
                      height={300}
                      border={0}
                      scale={scale}
                      rotate={rotate}
                    />
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleRotate90("left")}
                      title="Rotate left 90°"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleRotate90("right")}
                      title="Rotate right 90°"
                    >
                      <RotateCw className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={resetPhotoSettings}
                      title="Reset rotation and scale"
                    >
                      <Undo2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Rotation Slider */}
                  <div className="w-full space-y-2">
                    <div className="flex justify-between">
                      <Label>Rotate</Label>
                      <span className="text-sm text-muted-foreground">
                        {rotate}°
                      </span>
                    </div>
                    <Slider
                      value={[rotate]}
                      onValueChange={(n) => setRotate(n[0])}
                      min={-180}
                      max={180}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  {/* Scale Slider */}
                  <div className="w-full space-y-2">
                    <div className="flex justify-between">
                      <Label>Scale</Label>
                      <span className="text-sm text-muted-foreground">
                        {scale.toFixed(1)}x
                      </span>
                    </div>
                    <Slider
                      value={[scale]}
                      onValueChange={(n) => setScale(n[0])}
                      min={1}
                      max={5}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={uploadFile} disabled={!file}>
                Upload Photo
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default PhotoEditor;
