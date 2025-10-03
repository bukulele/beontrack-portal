/**
 * File Processing Utilities
 *
 * Universal utilities for file processing:
 * - Image compression (using existing compressFile)
 * - HEIC to JPEG conversion (using existing convertHeicToJpeg)
 * - File validation
 *
 * Uses existing tested functions from /src/app/functions/
 */

import compressFile from '@/app/functions/compressFile';
import convertHeicToJpeg from '@/app/functions/convertHeicToJpeg';

/**
 * Processes a file (HEIC conversion + compression)
 * Uses the existing tested implementation
 *
 * @param {File} file - File to process
 * @param {Object} options - Processing options
 * @returns {Promise<File>} Processed file
 */
export async function processFile(file, options = {}) {
  let processedFile = file;

  // Check if it's an image
  if (!file.type.startsWith('image/')) {
    return processedFile;
  }

  try {
    // Step 1: Convert HEIC/HEIF to JPEG if needed
    if (file.type === 'image/heic' || file.type === 'image/heif') {
      processedFile = await convertHeicToJpeg(processedFile);
    }

    // Step 2: Compress image if enabled (default: true)
    if (options.compress !== false) {
      processedFile = await compressFile(processedFile);
    }

    return processedFile;
  } catch (error) {
    console.error('Error processing file:', error);
    // Return original file if processing fails
    return file;
  }
}

/**
 * Validates file size
 *
 * @param {File} file - File to validate
 * @param {number} maxSize - Maximum size in bytes
 * @returns {Object} { valid: boolean, error: string|null }
 */
export function validateFileSize(file, maxSize) {
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `File size (${fileSizeMB}MB) exceeds maximum allowed size (${maxSizeMB}MB)`,
    };
  }

  return { valid: true, error: null };
}

/**
 * Validates file type
 *
 * @param {File} file - File to validate
 * @param {string} accept - Accepted file types (e.g., 'image/*,application/pdf')
 * @returns {Object} { valid: boolean, error: string|null }
 */
export function validateFileType(file, accept) {
  if (!accept || accept === '*/*') {
    return { valid: true, error: null };
  }

  const acceptedTypes = accept.split(',').map(type => type.trim());
  const fileType = file.type;
  const fileExtension = `.${file.name.split('.').pop().toLowerCase()}`;

  const isValid = acceptedTypes.some(acceptedType => {
    // Wildcard match (e.g., 'image/*')
    if (acceptedType.endsWith('/*')) {
      const typePrefix = acceptedType.slice(0, -2);
      return fileType.startsWith(typePrefix);
    }

    // Extension match (e.g., '.pdf')
    if (acceptedType.startsWith('.')) {
      return fileExtension === acceptedType.toLowerCase();
    }

    // Exact MIME type match
    return fileType === acceptedType;
  });

  if (!isValid) {
    return {
      valid: false,
      error: `File type "${fileType}" is not accepted. Allowed types: ${accept}`,
    };
  }

  return { valid: true, error: null };
}

/**
 * Validates a file against size and type constraints
 *
 * @param {File} file - File to validate
 * @param {Object} constraints - Validation constraints { maxSize, accept }
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export function validateFile(file, constraints = {}) {
  const errors = [];

  // Validate size
  if (constraints.maxSize) {
    const sizeValidation = validateFileSize(file, constraints.maxSize);
    if (!sizeValidation.valid) {
      errors.push(sizeValidation.error);
    }
  }

  // Validate type
  if (constraints.accept) {
    const typeValidation = validateFileType(file, constraints.accept);
    if (!typeValidation.valid) {
      errors.push(typeValidation.error);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Formats file size for display
 *
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted size (e.g., '2.5 MB')
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Gets file extension from filename
 *
 * @param {string} filename - File name
 * @returns {string} File extension (lowercase, without dot)
 */
export function getFileExtension(filename) {
  return filename.split('.').pop().toLowerCase();
}

/**
 * Checks if file is an image
 *
 * @param {File} file - File to check
 * @returns {boolean}
 */
export function isImage(file) {
  return file.type.startsWith('image/');
}

/**
 * Checks if file is a PDF
 *
 * @param {File} file - File to check
 * @returns {boolean}
 */
export function isPDF(file) {
  return file.type === 'application/pdf';
}

/**
 * Creates a preview URL for an image file
 *
 * @param {File} file - Image file
 * @returns {string} Object URL for preview
 */
export function createImagePreviewURL(file) {
  if (!isImage(file)) {
    return null;
  }

  return URL.createObjectURL(file);
}

/**
 * Revokes a preview URL to free memory
 *
 * @param {string} url - Object URL to revoke
 */
export function revokePreviewURL(url) {
  if (url) {
    URL.revokeObjectURL(url);
  }
}

// Re-export existing functions for convenience
export { compressFile, convertHeicToJpeg };
