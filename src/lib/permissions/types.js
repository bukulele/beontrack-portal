/**
 * Permission Types and Constants
 *
 * Centralized permission action definitions for the ABAC system.
 * These constants should be used throughout the application for consistency.
 */

/**
 * Base Entity Actions
 *
 * Core CRUD operations that apply to all entities.
 */
export const ENTITY_ACTIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
};

/**
 * Document Operation Actions
 *
 * Special actions for document management within entities.
 * These are entity-specific (e.g., employees + document_view).
 */
export const DOCUMENT_ACTIONS = {
  VIEW: 'document_view',       // View/download documents
  UPLOAD: 'document_upload',   // Upload new documents
  EDIT: 'document_edit',       // Edit document metadata, mark as reviewed
  DELETE: 'document_delete',   // Delete documents
};

/**
 * Tab Access Actions
 *
 * Optional: Actions for controlling tab-level access.
 * Currently implemented via entity permissions + config logic.
 */
export const TAB_ACTIONS = {
  GENERAL: 'tab_general',
  CHECKLIST: 'tab_checklist',
  TIMECARD: 'tab_timecard',
  ACTIVITY: 'tab_activity',
  SUB_ENTITIES: 'tab_sub_entities',
};

/**
 * All Permission Actions
 *
 * Combined list of all valid permission actions.
 */
export const ALL_ACTIONS = {
  ...ENTITY_ACTIONS,
  ...DOCUMENT_ACTIONS,
  ...TAB_ACTIONS,
};

/**
 * Permission Action Groups
 *
 * Commonly used permission combinations.
 */
export const ACTION_GROUPS = {
  // Full CRUD access
  FULL_ACCESS: [
    ENTITY_ACTIONS.CREATE,
    ENTITY_ACTIONS.READ,
    ENTITY_ACTIONS.UPDATE,
    ENTITY_ACTIONS.DELETE,
  ],

  // Read-only access
  READ_ONLY: [ENTITY_ACTIONS.READ],

  // Read and update (no create/delete)
  READ_UPDATE: [ENTITY_ACTIONS.READ, ENTITY_ACTIONS.UPDATE],

  // Create and read (for data entry roles)
  CREATE_READ: [ENTITY_ACTIONS.CREATE, ENTITY_ACTIONS.READ],

  // Full document management
  DOCUMENT_FULL: [
    DOCUMENT_ACTIONS.VIEW,
    DOCUMENT_ACTIONS.UPLOAD,
    DOCUMENT_ACTIONS.EDIT,
    DOCUMENT_ACTIONS.DELETE,
  ],

  // Document view only
  DOCUMENT_VIEW_ONLY: [DOCUMENT_ACTIONS.VIEW],

  // Document view and upload (for data entry)
  DOCUMENT_VIEW_UPLOAD: [DOCUMENT_ACTIONS.VIEW, DOCUMENT_ACTIONS.UPLOAD],

  // Document management without delete
  DOCUMENT_MANAGE: [
    DOCUMENT_ACTIONS.VIEW,
    DOCUMENT_ACTIONS.UPLOAD,
    DOCUMENT_ACTIONS.EDIT,
  ],
};

/**
 * Entity Types
 *
 * Valid entity types in the system.
 * Should match EntityType enum in Prisma schema.
 */
export const ENTITY_TYPES = {
  EMPLOYEES: 'employees',
  DRIVERS: 'drivers',
  TRUCKS: 'trucks',
  EQUIPMENT: 'equipment',
  INCIDENTS: 'incidents',
  VIOLATIONS: 'violations',
  WCB: 'wcb',
  TIME_ENTRIES: 'time_entries',
  ADJUSTMENTS: 'adjustments',
};

/**
 * Role Names
 *
 * Valid role identifiers matching database Role table.
 */
export const ROLES = {
  ADMIN: 'admin',
  PRODUCTION_MANAGER: 'productionManager',
  PRODUCTION_WORKER: 'productionWorker',
  QUALITY_CONTROL: 'qualityControl',
  MAINTENANCE: 'maintenance',
  HUMAN_RESOURCES: 'humanResources',
  FINANCE: 'finance',
  SAFETY_COMPLIANCE: 'safetyCompliance',
};

/**
 * Permission Check Helpers
 */

/**
 * Check if actions array includes a specific action
 *
 * @param {string[]} actions - Array of permission actions
 * @param {string} action - Action to check
 * @returns {boolean}
 */
export function hasAction(actions, action) {
  return Array.isArray(actions) && actions.includes(action);
}

/**
 * Check if actions array includes all required actions
 *
 * @param {string[]} actions - Array of permission actions
 * @param {string[]} required - Required actions
 * @returns {boolean}
 */
export function hasAllActions(actions, required) {
  if (!Array.isArray(actions) || !Array.isArray(required)) {
    return false;
  }
  return required.every(action => actions.includes(action));
}

/**
 * Check if actions array includes any of the specified actions
 *
 * @param {string[]} actions - Array of permission actions
 * @param {string[]} anyOf - Actions to check
 * @returns {boolean}
 */
export function hasAnyAction(actions, anyOf) {
  if (!Array.isArray(actions) || !Array.isArray(anyOf)) {
    return false;
  }
  return anyOf.some(action => actions.includes(action));
}

/**
 * Get CRUD capabilities object from actions array
 *
 * @param {string[]} actions - Array of permission actions
 * @param {boolean} isSuperuser - Whether user is superuser
 * @returns {Object} { canCreate, canRead, canUpdate, canDelete }
 */
export function getCRUDCapabilities(actions, isSuperuser = false) {
  if (isSuperuser) {
    return {
      canCreate: true,
      canRead: true,
      canUpdate: true,
      canDelete: true,
    };
  }

  return {
    canCreate: hasAction(actions, ENTITY_ACTIONS.CREATE),
    canRead: hasAction(actions, ENTITY_ACTIONS.READ),
    canUpdate: hasAction(actions, ENTITY_ACTIONS.UPDATE),
    canDelete: hasAction(actions, ENTITY_ACTIONS.DELETE),
  };
}

/**
 * Get document capabilities object from actions array
 *
 * @param {string[]} actions - Array of permission actions
 * @param {boolean} isSuperuser - Whether user is superuser
 * @returns {Object} { canView, canUpload, canEdit, canDelete }
 */
export function getDocumentCapabilities(actions, isSuperuser = false) {
  if (isSuperuser) {
    return {
      canView: true,
      canUpload: true,
      canEdit: true,
      canDelete: true,
    };
  }

  return {
    canView: hasAction(actions, DOCUMENT_ACTIONS.VIEW),
    canUpload: hasAction(actions, DOCUMENT_ACTIONS.UPLOAD),
    canEdit: hasAction(actions, DOCUMENT_ACTIONS.EDIT),
    canDelete: hasAction(actions, DOCUMENT_ACTIONS.DELETE),
  };
}

export default {
  ENTITY_ACTIONS,
  DOCUMENT_ACTIONS,
  TAB_ACTIONS,
  ALL_ACTIONS,
  ACTION_GROUPS,
  ENTITY_TYPES,
  ROLES,
  hasAction,
  hasAllActions,
  hasAnyAction,
  getCRUDCapabilities,
  getDocumentCapabilities,
};
