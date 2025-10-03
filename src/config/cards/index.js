/**
 * Card Configuration Loader
 *
 * Central registry for all card configurations.
 * Imports and exports all card configs with validation.
 */

import { validateCardConfig, ENTITY_TYPES } from "./schema";

/**
 * Card configurations will be imported here as they are created
 *
 * Example:
 * import { truckCardConfig } from "./truckCard.config";
 * import { driverCardConfig } from "./driverCard.config";
 */

// Placeholder configs for now (will be replaced with actual configs)
const configs = {
  // truck: truckCardConfig,
  // driver: driverCardConfig,
  // equipment: equipmentCardConfig,
  // employee: employeeCardConfig,
  // incident: incidentCardConfig,
  // violation: violationCardConfig,
  // wcb: wcbCardConfig,
  // driverReport: driverReportCardConfig,
};

/**
 * Gets a card configuration by entity type
 *
 * @param {string} entityType - Type of entity (driver, truck, etc.)
 * @returns {Object|null} - Card configuration or null if not found
 * @throws {Error} - If configuration is invalid
 */
export function getCardConfig(entityType) {
  const config = configs[entityType];

  if (!config) {
    console.error(`No configuration found for entity type: ${entityType}`);
    return null;
  }

  // Validate config
  const validation = validateCardConfig(config);
  if (!validation.valid) {
    console.error(`Invalid configuration for ${entityType}:`, validation.errors);
    throw new Error(
      `Invalid card configuration for ${entityType}: ${validation.errors.join(", ")}`
    );
  }

  return config;
}

/**
 * Gets all available card configurations
 *
 * @returns {Object} - Map of entity types to configurations
 */
export function getAllCardConfigs() {
  return { ...configs };
}

/**
 * Registers a new card configuration
 *
 * Useful for dynamic registration or testing
 *
 * @param {string} entityType - Type of entity
 * @param {Object} config - Card configuration
 * @throws {Error} - If configuration is invalid
 */
export function registerCardConfig(entityType, config) {
  const validation = validateCardConfig(config);

  if (!validation.valid) {
    throw new Error(
      `Invalid card configuration for ${entityType}: ${validation.errors.join(", ")}`
    );
  }

  configs[entityType] = config;
  console.log(`✓ Registered card config for: ${entityType}`);
}

/**
 * Checks if a card configuration exists for an entity type
 *
 * @param {string} entityType - Type of entity
 * @returns {boolean} - True if config exists
 */
export function hasCardConfig(entityType) {
  return !!configs[entityType];
}

// Export entity types for convenience
export { ENTITY_TYPES } from "./schema";
