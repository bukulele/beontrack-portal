/**
 * SIN (Social Insurance Number) Uploader Configuration
 *
 * Used for uploading SIN documents
 * Includes: SIN number (9 digits, validated and formatted)
 */

import { UPLOAD_MODES } from '../uploaderSchema';

export const sinUploaderConfig = {
  id: 'sin',
  mode: UPLOAD_MODES.IMMEDIATE,
  apiEndpoint: '/api/update-file',
  entityType: 'driver', // Can also be 'employee'
  endpointIdentifier: 'sin',

  fields: [
    {
      name: 'file',
      type: 'file',
      label: 'SIN Document',
      required: true,
      validation: {
        accept: 'image/*,application/pdf',
        maxSize: 10 * 1024 * 1024,
      },
    },
    {
      name: 'number',
      type: 'number',
      label: 'SIN Number',
      required: true,
      validation: {
        pattern: /^\d{9}$/,
        minLength: 9,
        maxLength: 9,
        errorMessage: 'SIN must be exactly 9 digits',
      },
      props: {
        maxLength: 9,
        allowNegative: false,
        allowDecimal: false,
        format: '### ### ###', // Format as XXX XXX XXX
      },
    },
  ],
};
