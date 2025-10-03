/**
 * File Uploader Configuration Schema - Layer 2
 *
 * Defines the structure for specific uploader configurations.
 * Each uploader config specifies which fields to use and how to configure them.
 */

import { isValidFieldType } from './fieldTypes';

/**
 * Upload modes
 */
export const UPLOAD_MODES = {
  IMMEDIATE: 'immediate',      // Upload immediately on submit
  FORM_ATTACHED: 'form-attached', // Attach to form, upload later
  MULTIPLE: 'multiple',        // Multiple files at once
};

/**
 * Validates an uploader configuration
 *
 * @param {Object} config - Uploader configuration
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export function validateUploaderConfig(config) {
  const errors = [];

  // Required fields
  if (!config.id) {
    errors.push('id is required');
  }

  if (!config.mode) {
    errors.push('mode is required');
  } else if (!Object.values(UPLOAD_MODES).includes(config.mode)) {
    errors.push(`mode must be one of: ${Object.values(UPLOAD_MODES).join(', ')}`);
  }

  if (!config.apiEndpoint) {
    errors.push('apiEndpoint is required');
  }

  // Validate fields array
  if (!config.fields || !Array.isArray(config.fields)) {
    errors.push('fields must be an array');
  } else if (config.fields.length === 0) {
    errors.push('fields array cannot be empty');
  } else {
    // Validate each field
    config.fields.forEach((field, index) => {
      if (!field.name) {
        errors.push(`fields[${index}].name is required`);
      }

      if (!field.type) {
        errors.push(`fields[${index}].type is required`);
      } else if (!isValidFieldType(field.type)) {
        errors.push(`fields[${index}].type "${field.type}" is not a valid field type`);
      }

      if (field.label && typeof field.label !== 'string') {
        errors.push(`fields[${index}].label must be a string`);
      }

      if (field.required !== undefined && typeof field.required !== 'boolean') {
        errors.push(`fields[${index}].required must be a boolean`);
      }
    });

    // Check for duplicate field names
    const fieldNames = config.fields.map(f => f.name);
    const duplicates = fieldNames.filter((name, index) => fieldNames.indexOf(name) !== index);
    if (duplicates.length > 0) {
      errors.push(`Duplicate field names found: ${duplicates.join(', ')}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Creates a default uploader configuration template
 *
 * @param {string} uploaderId - Uploader identifier
 * @returns {Object} Default configuration
 */
export function createDefaultUploaderConfig(uploaderId) {
  return {
    id: uploaderId,
    mode: UPLOAD_MODES.IMMEDIATE,
    apiEndpoint: '/api/update-file',
    fields: [
      {
        name: 'file',
        type: 'file',
        label: 'File',
        required: true,
      },
    ],
    entityType: null,      // 'driver', 'truck', 'equipment', etc.
    endpointIdentifier: null, // The document type key
  };
}

/**
 * Example uploader configuration for reference
 */
export const EXAMPLE_UPLOADER_CONFIG = {
  id: 'licenses',
  mode: UPLOAD_MODES.IMMEDIATE,
  apiEndpoint: '/api/update-file',
  entityType: 'driver',
  endpointIdentifier: 'licenses',

  fields: [
    {
      name: 'file',
      type: 'file',
      label: 'Front of License',
      required: true,
      validation: {
        accept: 'image/*,application/pdf',
        maxSize: 10 * 1024 * 1024, // 10MB
      },
    },
    {
      name: 'file2',
      type: 'file',
      label: 'Back of License',
      required: false,
      validation: {
        accept: 'image/*,application/pdf',
      },
    },
    {
      name: 'issue_date',
      type: 'date',
      label: 'Issue Date',
      required: true,
    },
    {
      name: 'expiry_date',
      type: 'date',
      label: 'Expiry Date',
      required: true,
    },
    {
      name: 'dl_number',
      type: 'text',
      label: 'License Number',
      required: true,
    },
    {
      name: 'dl_province',
      type: 'select',
      label: 'Province',
      required: true,
      options: 'CANADIAN_PROVINCES', // Reference to OPTION_LISTS
    },
  ],
};
