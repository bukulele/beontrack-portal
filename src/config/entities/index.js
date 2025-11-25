/**
 * Entity Configurations for Unified Table Page
 *
 * This file defines the configuration for all entity types in the application.
 * Each entity has:
 * - Table columns definition
 * - Card configuration for UniversalCard
 * - API endpoint for data fetching (universal API pattern)
 * - Context provider information
 * - ID field mapping
 */

// Table definitions
import { OFFICE_TABLE_FIELDS_SAFETY } from "@/data/tables/employees";
import { WCB_CLAIMS_TABLE_FIELDS } from "@/data/tables/wcbClaims";

// Card configurations
import { EMPLOYEE_CARD_CONFIG } from "@/config/cards/employeeCard.config";
import { WCB_CLAIM_CARD_CONFIG } from "@/config/cards/wcbClaimCard.config";

// Form configurations
import { EMPLOYEE_CREATE_FORM_CONFIG } from "@/config/forms/employeeCreateForm.config";
import { WCB_CLAIM_CREATE_FORM_CONFIG } from "@/config/forms/wcbClaimCreateForm.config";

/**
 * Entity type configurations
 * Each key represents an entity type accessible via URL param: /table?entity={key}
 *
 * Only migrated entities using universal API (/api/v1/{entityType}) are included
 */
export const ENTITY_CONFIGS = {
  employees: {
    name: "Office Employees",
    columns: OFFICE_TABLE_FIELDS_SAFETY,
    cardConfig: EMPLOYEE_CARD_CONFIG,
    createFormConfig: EMPLOYEE_CREATE_FORM_CONFIG,
    apiEndpoint: "/api/v1/employees",
    idField: "id",
    dialogTitle: "Employee Details",
  },
  wcb_claims: {
    name: "WCB Claims",
    columns: WCB_CLAIMS_TABLE_FIELDS,
    cardConfig: WCB_CLAIM_CARD_CONFIG,
    createFormConfig: WCB_CLAIM_CREATE_FORM_CONFIG,
    apiEndpoint: "/api/v1/wcb_claims",
    idField: "id",
    dialogTitle: "WCB Claim Details",
  },
};

/**
 * Helper function to get entity configuration by type
 * @param {string} entityType - The entity type (e.g., 'employees')
 * @returns {object} Entity configuration object
 */
export const getEntityConfig = (entityType) => {
  return ENTITY_CONFIGS[entityType] || ENTITY_CONFIGS.employees; // Default to employees if invalid
};

/**
 * Get list of all valid entity types
 * @returns {string[]} Array of entity type keys
 */
export const getEntityTypes = () => {
  return Object.keys(ENTITY_CONFIGS);
};

/**
 * Check if an entity type is valid
 * @param {string} entityType - The entity type to check
 * @returns {boolean} True if valid entity type
 */
export const isValidEntityType = (entityType) => {
  return Object.keys(ENTITY_CONFIGS).includes(entityType);
};
