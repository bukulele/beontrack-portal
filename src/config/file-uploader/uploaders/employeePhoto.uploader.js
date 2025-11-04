/**
 * Employee Profile Photo Uploader Configuration
 *
 * Configuration for uploading employee profile photos with editing capabilities.
 * Uses the PhotoEditor component for rotation, scaling, and cropping.
 */

export const employeePhotoUploaderConfig = {
  title: "Upload Profile Photo",
  apiEndpoint: "/api/update-file-employee",
  endpointIdentifier: "employee_photo",

  fields: [
    {
      type: "file",
      name: "photo",
      label: "Profile Photo",
      required: true,
      props: {
        multiple: false, // Single photo only
        compress: true, // Enable compression
      },
      validation: {
        accept: "image/*", // Only images
        maxSize: 5 * 1024 * 1024, // 5MB max size
      },
    },
  ],
};

/**
 * Get employee photo uploader config for a specific employee
 * @param {string} employeeId - The employee ID
 * @returns {object} Uploader configuration
 */
export function getEmployeePhotoUploaderConfig(employeeId) {
  return {
    ...employeePhotoUploaderConfig,
    metadata: {
      employeeId,
      documentType: "profile_photo",
    },
  };
}
