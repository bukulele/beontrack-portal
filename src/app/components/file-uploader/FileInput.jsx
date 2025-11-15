"use client";

import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { Label } from '@/components/ui/label';

/**
 * FileInput Component
 *
 * File input with drag & drop support powered by react-dropzone
 * Supports both single and multiple file selection
 *
 * @param {Object} field - Field configuration
 * @param {Object} field.props - Field props (optional)
 * @param {boolean} field.props.multiple - Enable multiple file selection
 * @param {Function} onChange - File change handler (receives File or File[])
 * @param {boolean} disabled - Whether input is disabled
 * @param {string} error - Validation error message
 */
export function FileInput({ field, onChange, disabled = false, error }) {
  const { name, label, required, validation = {}, props = {} } = field;
  const { multiple = false } = props;

  const onDrop = React.useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      if (multiple) {
        // Handle multiple files - return array
        onChange(acceptedFiles);
      } else {
        // Handle single file - return first file only
        onChange(acceptedFiles[0]);
      }
    }
  }, [multiple, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    disabled,
    accept: validation.accept,
    maxSize: validation.maxSize,
  });

  return (
    <div className="space-y-1.5">
      <Label htmlFor={name} className="text-sm font-medium text-slate-700">
        {label || name}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : error ? 'border-red-500' : 'border-slate-300'}
          ${!disabled && !isDragActive ? 'hover:border-slate-400 hover:bg-slate-50' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} id={name} />

        <Upload className={`w-8 h-8 mx-auto mb-2 ${isDragActive ? 'text-blue-500' : 'text-slate-400'}`} />

        <p className="text-sm text-slate-600 mb-1">
          {isDragActive
            ? 'Drop files here...'
            : multiple
              ? 'Click to upload multiple files or drag and drop'
              : 'Click to upload or drag and drop'}
        </p>

        {validation.accept && (
          <p className="text-xs text-slate-500">
            Accepted: {validation.accept}
          </p>
        )}

        {validation.maxSize && (
          <p className="text-xs text-slate-500">
            Max size: {(validation.maxSize / (1024 * 1024)).toFixed(0)}MB
          </p>
        )}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default FileInput;
