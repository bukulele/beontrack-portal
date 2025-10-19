"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import PhotoLightbox from "./PhotoLightbox";
import { FileUploader } from "@/app/components/file-uploader/FileUploader";
import { getPhotosUploaderConfig } from "@/config/file-uploader/uploaders/photos.uploader";

/**
 * PhotoGallerySection - Photo gallery with lightbox for GeneralInfoTab
 *
 * Features:
 * - Grid display of photos (configurable columns)
 * - Full-screen lightbox with zoom/pan
 * - Thumbnail navigation
 * - Upload new photos (uses modern FileUploader)
 * - Multiple photo sources
 *
 * @param {Object} config - Photo gallery configuration
 * @param {string} config.title - Section title
 * @param {Array} config.photoSources - Array of photo source keys from entityData
 * @param {number} config.gridCols - Grid columns (default: 5)
 * @param {Object} config.upload - Upload configuration
 * @param {string} config.upload.entityType - Entity type ('incident', 'violation', 'driver_report')
 * @param {string} config.upload.dataType - FormData key for entity ID (e.g., 'incident_id')
 * @param {Object} entityData - Entity data from context
 * @param {Function} loadData - Reload entity data after upload
 */
function PhotoGallerySection({ config, entityData, loadData }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [uploaderOpen, setUploaderOpen] = useState(false);

  if (!entityData || !config) return null;

  // Combine photos from multiple sources
  const photosCombined = config.photoSources.reduce((acc, sourceKey) => {
    const photos = entityData[sourceKey] || [];
    return [...acc, ...photos];
  }, []);

  // Don't render if no photos and no upload capability
  if (photosCombined.length === 0 && !config.upload) {
    return null;
  }

  // Handle photo click - open lightbox
  const handlePhotoClick = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // Render photo grid
  const photoGrid = photosCombined.map((photo, idx) => (
    <div
      key={`photo_${photo.id}_${idx}`}
      className="cursor-pointer rounded-lg overflow-hidden hover:opacity-80 transition-opacity border border-slate-200"
      onClick={() => handlePhotoClick(idx)}
    >
      <Image
        src={photo.photo}
        alt={`Photo ${idx + 1}`}
        width={200}
        height={100}
        className="object-contain object-top w-full h-24"
      />
    </div>
  ));

  // Get uploader config
  const uploaderConfig = config.upload
    ? getPhotosUploaderConfig(config.upload.entityType)
    : null;

  const handleUploadSuccess = () => {
    setUploaderOpen(false);
    if (loadData) {
      loadData();
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="p-4 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              {config.title || "Photos"}
            </CardTitle>
            {config.upload && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setUploaderOpen(true)}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload Photos
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {photosCombined.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No photos uploaded yet
            </p>
          ) : (
            <div className={`grid gap-2 grid-cols-${config.gridCols || 5}`}>
              {photoGrid}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Photo Lightbox */}
      <PhotoLightbox
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        photos={photosCombined}
        initialIndex={lightboxIndex}
      />

      {/* Photo Uploader */}
      {config.upload && uploaderConfig && (
        <FileUploader
          config={uploaderConfig}
          open={uploaderOpen}
          onClose={() => setUploaderOpen(false)}
          onSuccess={handleUploadSuccess}
          entityData={{
            entityType: config.upload.dataType,
            entityId: entityData.id,
          }}
        />
      )}
    </>
  );
}

export default PhotoGallerySection;
