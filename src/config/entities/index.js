/**
 * Entity Configurations for Unified Table Page
 *
 * This file defines the configuration for all entity types in the application.
 * Each entity has:
 * - Table columns definition
 * - Card configuration for UniversalCard
 * - API endpoint for data fetching
 * - Context provider information
 * - ID field mapping
 */

// Table definitions
import { DRIVERS_TABLE_FIELDS_SAFETY } from "@/data/tables/drivers";
import { TRUCKS_TABLE_FIELDS } from "@/data/tables/trucks";
import { OFFICE_TABLE_FIELDS_SAFETY } from "@/data/tables/employees";
import { EQUIPMENT_TABLE_FIELDS } from "@/data/tables/equipment";
import { INCIDENTS_TABLE } from "@/data/tables/incidents";
import { VIOLATIONS_TABLE } from "@/data/tables/violations";
import { WCB_TABLE } from "@/data/tables/wcb";

// Card configurations
import { DRIVER_CARD_CONFIG } from "@/config/cards/driverCard.config";
import { TRUCK_CARD_CONFIG } from "@/config/cards/truckCard.config";
import { EMPLOYEE_CARD_CONFIG } from "@/config/cards/employeeCard.config";
import { EQUIPMENT_CARD_CONFIG } from "@/config/cards/equipmentCard.config";
import { INCIDENT_CARD_CONFIG } from "@/config/cards/incidentCard.config";
import { VIOLATION_CARD_CONFIG } from "@/config/cards/violationCard.config";
import { WCB_CARD_CONFIG } from "@/config/cards/wcbCard.config";

/**
 * Entity type configurations
 * Each key represents an entity type accessible via URL param: /table?entity={key}
 */
export const ENTITY_CONFIGS = {
  drivers: {
    name: "Drivers",
    columns: DRIVERS_TABLE_FIELDS_SAFETY,
    cardConfig: DRIVER_CARD_CONFIG,
    apiEndpoint: "/api/get-drivers-safety",
    idField: "id", // DataGrid row id field
    dialogTitle: "Driver Details",
  },

  trucks: {
    name: "Trucks",
    columns: TRUCKS_TABLE_FIELDS,
    cardConfig: TRUCK_CARD_CONFIG,
    apiEndpoint: "/api/get-trucks",
    idField: "id",
    dialogTitle: "Truck Details",
  },

  employees: {
    name: "Office Employees",
    columns: OFFICE_TABLE_FIELDS_SAFETY,
    cardConfig: EMPLOYEE_CARD_CONFIG,
    apiEndpoint: "/api/get-office-employees",
    idField: "id",
    dialogTitle: "Employee Details",
  },

  equipment: {
    name: "Equipment",
    columns: EQUIPMENT_TABLE_FIELDS,
    cardConfig: EQUIPMENT_CARD_CONFIG,
    apiEndpoint: "/api/get-equipment",
    idField: "id",
    dialogTitle: "Equipment Details",
  },

  incidents: {
    name: "Incidents",
    columns: INCIDENTS_TABLE,
    cardConfig: INCIDENT_CARD_CONFIG,
    apiEndpoint: "/api/get-incidents",
    idField: "id",
    dialogTitle: "Incident Details",
  },

  violations: {
    name: "Violations",
    columns: VIOLATIONS_TABLE,
    cardConfig: VIOLATION_CARD_CONFIG,
    apiEndpoint: "/api/get-violations",
    idField: "id",
    dialogTitle: "Violation Details",
  },

  wcb: {
    name: "WCB Claims",
    columns: WCB_TABLE,
    cardConfig: WCB_CARD_CONFIG,
    apiEndpoint: "/api/get-wcb-claims",
    idField: "id",
    dialogTitle: "WCB Claim Details",
  },
};

/**
 * Helper function to get entity configuration by type
 * @param {string} entityType - The entity type (e.g., 'drivers', 'trucks')
 * @returns {object} Entity configuration object
 */
export const getEntityConfig = (entityType) => {
  return ENTITY_CONFIGS[entityType] || ENTITY_CONFIGS.drivers; // Default to drivers if invalid
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
