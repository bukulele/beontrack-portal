/**
 * Configuration Schema for Universal Card System
 *
 * This file defines the structure and validation for card configurations.
 * Each card type (Driver, Truck, Equipment, etc.) will have a config file
 * that conforms to this schema.
 */

/**
 * Valid tab types supported by the system
 */
export const TAB_TYPES = {
  GENERAL_INFO: "general-info",
  CHECKLIST: "checklist",
  LOG: "log",
  LIST: "list",
  TIMECARD: "timecard",
  CUSTOM_CLAIMS: "custom-claims",
  CUSTOM_VIOLATION_DETAILS: "custom-violation-details",
  CUSTOM_SEALS: "custom-seals",
};

/**
 * Valid entity types
 */
export const ENTITY_TYPES = {
  DRIVER: "driver",
  TRUCK: "truck",
  EQUIPMENT: "equipment",
  EMPLOYEE: "employee",
  INCIDENT: "incident",
  VIOLATION: "violation",
  WCB: "wcb",
  DRIVER_REPORT: "driverReport",
};

/**
 * Validates a card configuration object
 *
 * @param {Object} config - Card configuration to validate
 * @returns {Object} - { valid: boolean, errors: Array<string> }
 */
export function validateCardConfig(config) {
  const errors = [];

  // Check required top-level fields
  if (!config) {
    return { valid: false, errors: ["Config is required"] };
  }

  if (!config.entity) {
    errors.push("entity is required");
  } else {
    // Validate entity
    if (!config.entity.type) {
      errors.push("entity.type is required");
    } else if (!Object.values(ENTITY_TYPES).includes(config.entity.type)) {
      errors.push(`entity.type must be one of: ${Object.values(ENTITY_TYPES).join(", ")}`);
    }

    if (!config.entity.contextProvider) {
      errors.push("entity.contextProvider is required");
    }

    if (!config.entity.idField) {
      errors.push("entity.idField is required");
    }
  }

  // Validate tabs
  if (!config.tabs || !Array.isArray(config.tabs)) {
    errors.push("tabs must be an array");
  } else if (config.tabs.length === 0) {
    errors.push("tabs array cannot be empty");
  } else {
    // Validate each tab
    config.tabs.forEach((tab, index) => {
      if (!tab.id) {
        errors.push(`tabs[${index}].id is required`);
      }

      if (!tab.label) {
        errors.push(`tabs[${index}].label is required`);
      }

      if (!tab.type) {
        errors.push(`tabs[${index}].type is required`);
      } else if (!Object.values(TAB_TYPES).includes(tab.type)) {
        errors.push(
          `tabs[${index}].type must be one of: ${Object.values(TAB_TYPES).join(", ")}`
        );
      }

      if (!tab.config) {
        errors.push(`tabs[${index}].config is required`);
      }

      // Check for duplicate tab IDs
      const duplicateIds = config.tabs.filter((t) => t.id === tab.id);
      if (duplicateIds.length > 1) {
        errors.push(`Duplicate tab ID found: ${tab.id}`);
      }
    });
  }

  // Validate defaultTab
  if (!config.defaultTab) {
    errors.push("defaultTab is required");
  } else if (config.tabs && !config.tabs.find((t) => t.id === config.defaultTab)) {
    errors.push(`defaultTab "${config.defaultTab}" does not match any tab ID`);
  }

  // Optional fields validation
  if (config.width && typeof config.width !== "string") {
    errors.push("width must be a string (Tailwind class)");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Creates a default card configuration template
 *
 * @param {string} entityType - Type of entity
 * @returns {Object} - Default configuration object
 */
export function createDefaultConfig(entityType) {
  return {
    entity: {
      type: entityType,
      contextProvider: `${entityType.charAt(0).toUpperCase() + entityType.slice(1)}Provider`,
      idField: `${entityType}Id`,
      contexts: [],
    },
    tabs: [
      {
        id: "general",
        label: `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} Card`,
        type: TAB_TYPES.GENERAL_INFO,
        config: {
          sections: [],
          fileSections: [],
        },
      },
    ],
    defaultTab: "general",
    width: "w-[1024px]",
  };
}

/**
 * Example configuration for reference
 */
export const EXAMPLE_CONFIG = {
  entity: {
    type: "truck",
    contextProvider: "TruckProvider",
    idField: "truckId",
    contexts: [
      {
        providerName: "TruckProvider",
        props: {
          // Props will be passed dynamically
        },
      },
    ],
  },
  tabs: [
    {
      id: "general",
      label: "Truck Card",
      type: TAB_TYPES.GENERAL_INFO,
      config: {
        sections: [
          {
            title: "Basic Information",
            fields: [
              {
                key: "unit_number",
                label: "Unit #",
                type: "text",
                editable: true,
              },
              {
                key: "status",
                label: "Status",
                type: "badge",
                editable: true,
              },
            ],
          },
        ],
        fileSections: [],
      },
    },
    {
      id: "checklist",
      label: "Truck Checklist",
      type: TAB_TYPES.CHECKLIST,
      config: {
        items: [],
        apiEndpoint: "/api/upload-truck-data",
      },
    },
  ],
  defaultTab: "general",
  width: "w-[1024px]",
};
