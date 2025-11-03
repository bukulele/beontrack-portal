/**
 * File Upload Utilities for Prisma Backend
 *
 * Handles server-side file operations:
 * - Saving uploaded files to disk
 * - Deleting files
 * - Generating file paths
 * - File validation
 */

import fs from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

// Base upload directory
const UPLOAD_BASE_DIR = path.join(process.cwd(), 'uploads');

/**
 * Ensures a directory exists, creates it if not
 * @param {string} dirPath - Directory path
 */
async function ensureDirectoryExists(dirPath) {
  if (!existsSync(dirPath)) {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

/**
 * Generates a unique filename with timestamp
 * @param {string} originalFilename - Original file name
 * @returns {string} Generated filename with timestamp
 */
export function generateFilename(originalFilename) {
  const timestamp = Date.now();
  const sanitizedFilename = originalFilename.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `${timestamp}_${sanitizedFilename}`;
}

/**
 * Gets the full file path for a document (GENERIC - supports any entity type)
 * @param {string} entityType - Entity type (employee, truck, driver, etc.)
 * @param {string} entityId - Entity UUID
 * @param {string} documentType - Type of document
 * @param {string} filename - File name
 * @returns {string} Full file path
 */
export function getFilePath(entityType, entityId, documentType, filename) {
  return path.join(UPLOAD_BASE_DIR, entityType, entityId, documentType, filename);
}

/**
 * Gets the relative file path (for storing in database - GENERIC)
 * @param {string} entityType - Entity type (employee, truck, driver, etc.)
 * @param {string} entityId - Entity UUID
 * @param {string} documentType - Type of document
 * @param {string} filename - File name
 * @returns {string} Relative file path
 */
export function getRelativeFilePath(entityType, entityId, documentType, filename) {
  return path.join('uploads', entityType, entityId, documentType, filename);
}

/**
 * Saves an uploaded file to disk (GENERIC - supports any entity type)
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} entityType - Entity type (employee, truck, driver, equipment, etc.)
 * @param {string} entityId - Entity UUID
 * @param {string} documentType - Type of document
 * @param {string} originalFilename - Original file name
 * @returns {Promise<Object>} { filePath, fileName, fileSize }
 */
export async function saveUploadedFile(fileBuffer, entityType, entityId, documentType, originalFilename) {
  try {
    // Generate filename
    const fileName = generateFilename(originalFilename);

    // Ensure document type directory exists (generic structure: uploads/{entityType}/{entityId}/{docType}/)
    const documentDir = path.join(UPLOAD_BASE_DIR, entityType, entityId, documentType);
    await ensureDirectoryExists(documentDir);

    // Full file path
    const filePath = getFilePath(entityType, entityId, documentType, fileName);

    // Write file to disk
    await fs.writeFile(filePath, fileBuffer);

    // Get file size
    const stats = await fs.stat(filePath);

    return {
      filePath: getRelativeFilePath(entityType, entityId, documentType, fileName), // Relative path for DB
      fileName: fileName,
      fileSize: stats.size,
    };
  } catch (error) {
    console.error('Error saving file:', error);
    throw new Error(`Failed to save file: ${error.message}`);
  }
}

/**
 * Deletes a file from disk
 * @param {string} filePath - Relative file path from database
 * @returns {Promise<boolean>} Success status
 */
export async function deleteFile(filePath) {
  try {
    const fullPath = path.join(process.cwd(), filePath);

    if (existsSync(fullPath)) {
      await fs.unlink(fullPath);
      return true;
    }

    return false; // File doesn't exist
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}

/**
 * Checks if a file exists
 * @param {string} filePath - Relative file path from database
 * @returns {boolean} Whether file exists
 */
export function fileExists(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  return existsSync(fullPath);
}

/**
 * Gets the full absolute path for a relative path
 * @param {string} relativePath - Relative file path from database
 * @returns {string} Absolute file path
 */
export function getAbsolutePath(relativePath) {
  return path.join(process.cwd(), relativePath);
}

/**
 * Validates file type based on MIME type
 * @param {string} mimeType - File MIME type
 * @param {string[]} allowedTypes - Allowed MIME types or wildcards (e.g., 'image/*')
 * @returns {boolean} Whether file type is valid
 */
export function validateFileType(mimeType, allowedTypes = ['*/*']) {
  if (allowedTypes.includes('*/*')) {
    return true;
  }

  return allowedTypes.some(allowedType => {
    if (allowedType.endsWith('/*')) {
      const typePrefix = allowedType.slice(0, -2);
      return mimeType.startsWith(typePrefix);
    }
    return mimeType === allowedType;
  });
}

/**
 * Validates file size
 * @param {number} fileSize - File size in bytes
 * @param {number} maxSize - Maximum allowed size in bytes
 * @returns {boolean} Whether file size is valid
 */
export function validateFileSize(fileSize, maxSize = 10 * 1024 * 1024) { // Default 10MB
  return fileSize <= maxSize;
}

/**
 * Gets MIME type from file extension
 * @param {string} filename - File name
 * @returns {string} MIME type
 */
export function getMimeTypeFromExtension(filename) {
  const ext = path.extname(filename).toLowerCase();

  const mimeTypes = {
    '.pdf': 'application/pdf',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.bmp': 'image/bmp',
    '.webp': 'image/webp',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.txt': 'text/plain',
  };

  return mimeTypes[ext] || 'application/octet-stream';
}
