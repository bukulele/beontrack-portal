"use client";

import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

/**
 * FileInput Component
 *
 * Custom file input with drag & drop support
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
  const inputRef = useRef(null);

  const handleFileSelect = (e) => {
    if (multiple) {
      // Handle multiple files - return array
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        onChange(files);
      }
    } else {
      // Handle single file - return file
      const file = e.target.files?.[0];
      if (file) {
        onChange(file);
      }
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="space-y-1.5">
      <Label htmlFor={name} className="text-sm font-medium text-slate-700">
        {label || name}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-colors hover:border-slate-400 hover:bg-slate-50
          ${error ? 'border-red-500' : 'border-slate-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onClick={!disabled ? handleClick : undefined}
      >
        <input
          ref={inputRef}
          id={name}
          type="file"
          className="hidden"
          accept={validation.accept || '*/*'}
          onChange={handleFileSelect}
          disabled={disabled}
          multiple={multiple}
        />

        <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />

        <p className="text-sm text-slate-600 mb-1">
          {multiple ? 'Click to upload multiple files or drag and drop' : 'Click to upload or drag and drop'}
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
