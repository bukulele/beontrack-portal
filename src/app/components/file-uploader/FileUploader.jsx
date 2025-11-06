"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSession } from '@/lib/auth-client';
import { useLoader } from '@/app/context/LoaderContext';
import { FieldRenderer } from './FieldRenderer';
import { FileInput } from './FileInput';
import { FilePreview } from './FilePreview';
import { processFile, validateFile } from '@/lib/fileProcessing';
import { createFieldConfig } from '@/config/file-uploader/fieldTypes';
import { UPLOAD_MODES } from '@/config/file-uploader/uploaderSchema';

/**
 * FileUploader Component
 *
 * Universal file uploader with dynamic field configuration
 *
 * @param {Object} config - Uploader configuration
 * @param {boolean} open - Whether dialog is open
 * @param {Function} onClose - Close handler
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback
 * @param {Object} entityData - Entity data (entityId, entityType)
 */
export function FileUploader({
  config,
  open,
  onClose,
  onSuccess,
  onError,
  entityData = {}
}) {
  const { data: session } = useSession();
  const { startLoading, stopLoading } = useLoader();

  // Field values state
  const [fieldValues, setFieldValues] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setFieldValues({});
      setFieldErrors({});
      setUploadSuccess(false);
      setUploadError(null);
    }
  }, [open]);

  // Check if form is valid
  const isFormValid = () => {
    if (!config?.fields) return false;

    return config.fields.every(field => {
      const fieldConfig = createFieldConfig(field);
      const value = fieldValues[field.name];

      // Check if required field is filled
      if (field.required) {
        if (field.type === 'file') {
          // Handle both single file and array of files
          if (Array.isArray(value)) {
            return value.length > 0;
          }
          return !!value; // File must be selected
        }
        return value !== undefined && value !== null && value !== '';
      }

      return true;
    });
  };

  // Validate individual field
  const validateField = (field, value) => {
    const errors = [];

    // Required validation
    if (field.required && !value) {
      errors.push(`${field.label || field.name} is required`);
    }

    // File-specific validation
    if (field.type === 'file' && value) {
      const validation = validateFile(value, field.validation || {});
      if (!validation.valid) {
        errors.push(...validation.errors);
      }
    }

    // Pattern validation
    if (field.validation?.pattern && value) {
      const pattern = new RegExp(field.validation.pattern);
      if (!pattern.test(value)) {
        errors.push(field.validation.errorMessage || `Invalid format for ${field.label || field.name}`);
      }
    }

    // Length validation
    if (field.validation?.minLength && value && value.length < field.validation.minLength) {
      errors.push(`${field.label || field.name} must be at least ${field.validation.minLength} characters`);
    }

    if (field.validation?.maxLength && value && value.length > field.validation.maxLength) {
      errors.push(`${field.label || field.name} must be at most ${field.validation.maxLength} characters`);
    }

    return errors;
  };

  // Handle field value change
  const handleFieldChange = async (fieldName, value) => {
    const field = config.fields.find(f => f.name === fieldName);

    // Process file(s) if it's a file input
    if (field?.type === 'file' && value) {
      startLoading();
      try {
        // Check if value is an array (multiple files)
        if (Array.isArray(value)) {
          // Process all files
          const processedFiles = await Promise.all(
            value.map(file =>
              processFile(file, {
                compress: field.props?.compress !== false,
              })
            )
          );
          setFieldValues(prev => ({ ...prev, [fieldName]: processedFiles }));
        } else {
          // Process single file
          const processedFile = await processFile(value, {
            compress: field.props?.compress !== false,
          });
          setFieldValues(prev => ({ ...prev, [fieldName]: processedFile }));
        }
      } catch (error) {
        console.error('Error processing file:', error);
        setFieldValues(prev => ({ ...prev, [fieldName]: value }));
      } finally {
        stopLoading();
      }
    } else {
      setFieldValues(prev => ({ ...prev, [fieldName]: value }));
    }

    // Clear error for this field
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  // Handle form submit
  const handleSubmit = async () => {
    // Validate all fields
    const errors = {};
    config.fields.forEach(field => {
      const fieldErrors = validateField(field, fieldValues[field.name]);
      if (fieldErrors.length > 0) {
        errors[field.name] = fieldErrors[0]; // Show first error
      }
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    // Build FormData
    startLoading();
    const formData = new FormData();

    // Add documentType (required by Prisma API)
    if (config.documentType) {
      formData.append('documentType', config.documentType);
    }

    // Build metadata object from non-file fields
    const metadata = {};
    let fileField = null;

    // Add field values
    config.fields.forEach(field => {
      const value = fieldValues[field.name];

      if (value !== undefined && value !== null && value !== '') {
        if (field.type === 'file') {
          // Store file separately (will be added as 'file' to FormData)
          fileField = value;
        } else {
          // Add to metadata object
          metadata[field.name] = value;
        }
      }
    });

    // Add main file
    if (fileField) {
      formData.append('file', fileField);
    }

    // Add metadata as JSON string if exists
    if (Object.keys(metadata).length > 0) {
      formData.append('metadata', JSON.stringify(metadata));
    }

    // Submit
    try {
      const response = await fetch(config.apiEndpoint, {
        method: 'POST',
        body: formData,
      });

      stopLoading();

      if (response.ok) {
        setUploadSuccess(true);
        if (onSuccess) onSuccess(await response.json());

        // Auto-close after success
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        const errorText = await response.text();
        setUploadError(errorText || 'Upload failed');
        if (onError) onError(errorText);
      }
    } catch (error) {
      stopLoading();
      console.error('Upload error:', error);
      setUploadError(error.message);
      if (onError) onError(error);
    }
  };

  if (!config) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {config.title || 'Upload File'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Success Message */}
          {uploadSuccess && (
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">
                ✓ File uploaded successfully!
              </AlertDescription>
            </Alert>
          )}

          {/* Error Message */}
          {uploadError && (
            <Alert variant="destructive">
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}

          {/* Render Fields */}
          {config.fields.map(field => {
            const fieldConfig = createFieldConfig(field);
            const value = fieldValues[field.name];
            const error = fieldErrors[field.name];

            if (field.type === 'file') {
              const handleRemove = Array.isArray(value)
                ? (index) => {
                    // Remove file at index from array
                    const newFiles = value.filter((_, i) => i !== index);
                    handleFieldChange(field.name, newFiles.length > 0 ? newFiles : null);
                  }
                : () => handleFieldChange(field.name, null);

              return (
                <div key={field.name} className="space-y-2">
                  <FileInput
                    field={fieldConfig}
                    onChange={(file) => handleFieldChange(field.name, file)}
                    error={error}
                  />
                  {value && (
                    <FilePreview
                      file={value}
                      onRemove={handleRemove}
                    />
                  )}
                </div>
              );
            }

            return (
              <FieldRenderer
                key={field.name}
                field={fieldConfig}
                value={value}
                onChange={(val) => handleFieldChange(field.name, val)}
                error={error}
              />
            );
          })}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid() || uploadSuccess}
          >
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default FileUploader;
