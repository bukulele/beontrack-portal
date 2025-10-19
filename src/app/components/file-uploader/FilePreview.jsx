"use client";

import React, { useEffect, useState } from 'react';
import { X, FileText, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { createImagePreviewURL, revokePreviewURL, isImage, isPDF, formatFileSize } from '@/lib/fileProcessing';

/**
 * FilePreview Component
 *
 * Displays preview of uploaded file(s) with option to remove
 * Supports both single file and array of files
 *
 * @param {File|File[]} file - File or array of files to preview
 * @param {Function} onRemove - Callback when file is removed (receives index for arrays)
 * @param {boolean} showRemove - Whether to show remove button
 */
export function FilePreview({ file, onRemove, showRemove = true }) {
  // Handle array of files
  if (Array.isArray(file)) {
    return (
      <div className="space-y-2">
        {file.map((singleFile, index) => (
          <SingleFilePreview
            key={index}
            file={singleFile}
            onRemove={onRemove ? () => onRemove(index) : undefined}
            showRemove={showRemove}
          />
        ))}
      </div>
    );
  }

  // Handle single file
  return (
    <SingleFilePreview
      file={file}
      onRemove={onRemove}
      showRemove={showRemove}
    />
  );
}

/**
 * SingleFilePreview Component
 *
 * Displays preview of a single uploaded file with option to remove
 *
 * @param {File} file - File to preview
 * @param {Function} onRemove - Callback when file is removed
 * @param {boolean} showRemove - Whether to show remove button
 */
function SingleFilePreview({ file, onRemove, showRemove = true }) {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (file && isImage(file)) {
      const url = createImagePreviewURL(file);
      setPreviewUrl(url);

      // Cleanup on unmount
      return () => revokePreviewURL(url);
    }
  }, [file]);

  if (!file) {
    return null;
  }

  return (
    <Card className="p-3">
      <div className="flex items-start gap-3">
        {/* File Icon/Preview */}
        <div className="flex-shrink-0">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-16 h-16 object-cover rounded border"
            />
          ) : isPDF(file) ? (
            <div className="w-16 h-16 flex items-center justify-center bg-red-50 rounded border border-red-200">
              <FileText className="w-8 h-8 text-red-600" />
            </div>
          ) : (
            <div className="w-16 h-16 flex items-center justify-center bg-slate-50 rounded border">
              <FileText className="w-8 h-8 text-slate-600" />
            </div>
          )}
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-900 truncate">
            {file.name}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            {formatFileSize(file.size)}
          </p>
        </div>

        {/* Remove Button */}
        {showRemove && onRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="flex-shrink-0 h-8 w-8 p-0"
            onClick={onRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Card>
  );
}

export default FilePreview;
