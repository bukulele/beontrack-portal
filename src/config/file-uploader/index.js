/**
 * File Uploader Configuration Loader - Universal Layer
 *
 * Central registry for all uploader configurations.
 * This is universal and client-agnostic.
 */

import { validateUploaderConfig } from './uploaderSchema';

/**
 * Registry of all uploader configurations
 * Will be populated by importing uploader configs
 */
const uploaderConfigs = {};

/**
 * Gets an uploader configuration by ID
 *
 * @param {string} uploaderId - Uploader identifier
 * @param {Object} overrides - Optional config overrides (entityType, endpointIdentifier, etc.)
 * @returns {Object|null} Uploader configuration or null if not found
 * @throws {Error} If configuration is invalid
 */
export function getUploaderConfig(uploaderId, overrides = {}) {
  const config = uploaderConfigs[uploaderId];

  if (!config) {
    console.error(`No uploader configuration found for: ${uploaderId}`);
    return null;
  }

  // Merge with overrides
  const mergedConfig = {
    ...config,
    ...overrides,
  };

  // Validate config
  const validation = validateUploaderConfig(mergedConfig);
  if (!validation.valid) {
    console.error(`Invalid uploader configuration for ${uploaderId}:`, validation.errors);
    throw new Error(
      `Invalid uploader configuration for ${uploaderId}: ${validation.errors.join(', ')}`
    );
  }

  return mergedConfig;
}

/**
 * Gets all available uploader configurations
 *
 * @returns {Object} Map of uploader IDs to configurations
 */
export function getAllUploaderConfigs() {
  return { ...uploaderConfigs };
}

/**
 * Registers a new uploader configuration
 *
 * @param {string} uploaderId - Uploader identifier
 * @param {Object} config - Uploader configuration
 * @throws {Error} If configuration is invalid
 */
export function registerUploaderConfig(uploaderId, config) {
  const validation = validateUploaderConfig(config);

  if (!validation.valid) {
    throw new Error(
      `Invalid uploader configuration for ${uploaderId}: ${validation.errors.join(', ')}`
    );
  }

  uploaderConfigs[uploaderId] = config;
  console.log(`✓ Registered uploader config: ${uploaderId}`);
}

/**
 * Checks if an uploader configuration exists
 *
 * @param {string} uploaderId - Uploader identifier
 * @returns {boolean}
 */
export function hasUploaderConfig(uploaderId) {
  return !!uploaderConfigs[uploaderId];
}

/**
 * Lists all available uploader IDs
 *
 * @returns {Array<string>}
 */
export function listUploaderIds() {
  return Object.keys(uploaderConfigs);
}

// Export field types and schema for convenience
export * from './fieldTypes';
export * from './uploaderSchema';
