/**
 * Licenses Uploader Configuration
 *
 * Used for uploading driver licenses (front and back)
 * Includes: issue date, expiry date, license number, province
 */

import { UPLOAD_MODES } from '../uploaderSchema';

export const licensesUploaderConfig = {
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
        maxSize: 10 * 1024 * 1024,
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
      options: 'CANADIAN_PROVINCES', // Reference to clientData.js
    },
  ],
};
