/**
 * Portal Config Loader
 *
 * Dynamically loads the appropriate portal configuration based on entity type.
 * Similar pattern to how card configs are loaded.
 */

import { EMPLOYEE_PORTAL_CONFIG } from './employeePortal.config';

// Registry of portal configs by entity type
const PORTAL_CONFIGS = {
  employees: EMPLOYEE_PORTAL_CONFIG,
  // Add more entity types as needed:
  // clients: CLIENT_PORTAL_CONFIG,
  // suppliers: SUPPLIER_PORTAL_CONFIG,
};

/**
 * Get portal configuration for a specific entity type
 * @param {string} entityType - The entity type (employees, clients, suppliers)
 * @returns {object|null} Portal configuration or null if not found
 */
export function getPortalConfig(entityType) {
  return PORTAL_CONFIGS[entityType] || null;
}

/**
 * Get all available portal entity types
 * @returns {string[]} Array of entity type keys
 */
export function getAvailablePortalTypes() {
  return Object.keys(PORTAL_CONFIGS);
}

export default PORTAL_CONFIGS;
