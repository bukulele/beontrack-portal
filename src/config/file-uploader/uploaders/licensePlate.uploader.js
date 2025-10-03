/**
 * License Plate Uploader Configuration
 *
 * Used for truck/equipment license plates
 * Special: No file upload, only plate number and expiry date
 */

import { UPLOAD_MODES } from '../uploaderSchema';

export const licensePlateUploaderConfig = {
  id: 'license_plate',
  mode: UPLOAD_MODES.IMMEDIATE,
  apiEndpoint: '/api/update-file',
  entityType: 'truck', // Can also be 'equipment'
  endpointIdentifier: 'truck_license_plates', // Or 'equipment_license_plates'

  fields: [
    {
      name: 'plate_number',
      type: 'text',
      label: 'License Plate Number',
      required: true,
      validation: {
        pattern: /^[A-Z0-9\-\s]{1,10}$/i,
        minLength: 1,
        maxLength: 10,
        errorMessage: 'Invalid license plate format',
      },
      props: {
        maxLength: 10,
        placeholder: 'ABC-1234',
      },
    },
    {
      name: 'expiry_date',
      type: 'date',
      label: 'Expiry Date',
      required: true,
    },
  ],

  // Special: No file upload for license plates
  fileOff: true,
};
