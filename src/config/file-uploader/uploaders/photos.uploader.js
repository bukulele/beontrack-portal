/**
 * Photos Uploader Configuration
 *
 * Configuration for uploading multiple photos to incidents, violations, or driver reports
 */

export const photosUploaderConfig = {
  title: 'Upload Photos',
  apiEndpoint: '', // Will be set dynamically based on entity type
  endpointIdentifier: 'photos',

  fields: [
    {
      type: 'file',
      name: 'photos',
      label: 'Select Photos',
      required: true,
      props: {
        multiple: true,  // Enable multiple file selection
        compress: true,  // Enable compression
      },
      validation: {
        accept: 'image/*',  // Only images
        maxSize: 10 * 1024 * 1024,  // 10MB per file
      },
    },
  ],
};

/**
 * Get photos uploader config for specific entity
 *
 * @param {string} entityType - 'incident', 'violation', or 'driver_report'
 * @returns {Object} Configured uploader
 */
export function getPhotosUploaderConfig(entityType) {
  const apiEndpoints = {
    incident: '/api/send-incident-photos',
    violation: '/api/send-violation-photos',
    driver_report: '/api/send-driver-report-photos',
  };

  return {
    ...photosUploaderConfig,
    apiEndpoint: apiEndpoints[entityType] || '/api/send-photos',
  };
}
