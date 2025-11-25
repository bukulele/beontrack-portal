/**
 * Employee Entity Configuration
 *
 * Centralized configuration for employee entity permissions, tabs, and operations.
 * This config maps database permissions to UI elements and API operations.
 */

/**
 * Tab-Level Role-Based Access Control
 *
 * Simple role-based mapping: which roles can access which tabs.
 * For each tab, list the roles that are allowed to see it.
 *
 * Employee card has 6 tabs:
 * - general-info: Employee overview with documents (read-only view)
 * - pre-hiring: Pre-hiring checklist
 * - onboarding: Onboarding checklist
 * - wcb-claims: WCB claims list
 * - notes: Internal notes
 * - timecard: Time tracking and payroll
 */
export const TAB_PERMISSIONS = {
  'general-info': {
    allowedRoles: [
      'admin',
      'humanResources',
      'productionManager',
      'qualityControl',
      'finance',
      'safetyCompliance',
    ],
  },

  'pre-hiring': {
    allowedRoles: [
      'admin',
      'humanResources',
      'safetyCompliance',
    ],
  },

  'onboarding': {
    allowedRoles: [
      'admin',
      'humanResources',
      'safetyCompliance',
    ],
  },

  'wcb-claims': {
    allowedRoles: [
      'admin',
      'humanResources',
      'safetyCompliance',
      'productionManager',
      'finance',
    ],
  },

  'notes': {
    allowedRoles: [
      'admin',
      'humanResources',
      'safetyCompliance',
    ],
  },

  'timecard': {
    allowedRoles: [
      'admin',
      'humanResources',
      'finance',
      'safetyCompliance',
    ],
  },
};

/**
 * Document Operation Permissions
 *
 * Maps document operations to required permission actions.
 * These should match the permissions defined in seed.js for the employees entity.
 */
export const DOCUMENT_PERMISSIONS = {
  view: 'document_view',      // Can view/download documents
  upload: 'document_upload',   // Can upload new documents
  edit: 'document_edit',       // Can mark documents as reviewed, update metadata
  delete: 'document_delete',   // Can delete documents
};

/**
 * Role-Based Document Access Matrix
 *
 * Defines what document operations each role can perform.
 * This is a reference - actual enforcement uses database Permission table.
 */
export const ROLE_DOCUMENT_ACCESS = {
  admin: {
    view: true,
    upload: true,
    edit: true,
    delete: true,
  },
  humanResources: {
    view: true,
    upload: true,
    edit: true,
    delete: true,
  },
  productionManager: {
    view: true,
    upload: true,
    edit: true,
    delete: false,  // Can manage but not delete
  },
  finance: {
    view: true,
    upload: false,
    edit: false,
    delete: false,  // Read-only for payroll purposes
  },
  safetyCompliance: {
    view: true,
    upload: false,
    edit: false,
    delete: false,  // Read-only for compliance tracking
  },
  qualityControl: {
    view: true,
    upload: false,
    edit: false,
    delete: false,  // Read-only
  },
  maintenance: {
    view: true,
    upload: false,
    edit: false,
    delete: false,  // Read-only
  },
  productionWorker: {
    view: false,  // No document access
    upload: false,
    edit: false,
    delete: false,
  },
};

/**
 * Role-Based Tab Access Matrix
 *
 * Defines which tabs each role can access.
 * This is a reference - actual tab filtering uses permission checks.
 */
export const ROLE_TAB_ACCESS = {
  admin: {
    'general-info': true,
    'checklist': true,
    'timecard': true,
    'activity-log': true,
    'sub-entities': true,
  },
  humanResources: {
    'general-info': true,
    'checklist': true,
    'timecard': true,
    'activity-log': true,
    'sub-entities': true,
  },
  productionManager: {
    'general-info': true,
    'checklist': true,
    'timecard': true,
    'activity-log': true,
    'sub-entities': true,
  },
  finance: {
    'general-info': true,
    'checklist': false,  // No document management
    'timecard': true,    // Needs timecard for payroll
    'activity-log': true,
    'sub-entities': false,
  },
  safetyCompliance: {
    'general-info': true,
    'checklist': false,  // Read-only, no document management
    'timecard': false,
    'activity-log': true,
    'sub-entities': true,  // For incidents/violations
  },
  qualityControl: {
    'general-info': true,
    'checklist': false,
    'timecard': false,
    'activity-log': true,
    'sub-entities': true,  // For quality issues
  },
  maintenance: {
    'general-info': true,  // Basic employee info only
    'checklist': false,
    'timecard': false,
    'activity-log': false,
    'sub-entities': false,
  },
  productionWorker: {
    'general-info': true,  // Own info only
    'checklist': false,
    'timecard': false,     // Might be enabled for self-service time clock
    'activity-log': false,
    'sub-entities': false,
  },
};

/**
 * Field-Level Visibility
 *
 * Defines which fields each role can view/edit.
 * Maps to the 'fields' JSON in Permission table.
 */
export const ROLE_FIELD_ACCESS = {
  productionWorker: {
    allowed: ['firstName', 'lastName', 'email', 'phoneNumber', 'employeeId', 'status'],
  },
  qualityControl: {
    allowed: ['firstName', 'lastName', 'email', 'phoneNumber', 'employeeId', 'department', 'status'],
  },
  maintenance: {
    allowed: ['firstName', 'lastName', 'email', 'phoneNumber', 'employeeId', 'department', 'status'],
  },
  safetyCompliance: {
    allowed: ['firstName', 'lastName', 'email', 'phoneNumber', 'employeeId', 'department', 'status'],
  },
  // Other roles have full field access (null in database = all fields)
};

/**
 * Get document permissions for current user
 *
 * @param {Object} permissions - User's permissions object from usePermissions()
 * @returns {Object} Document operation permissions { canView, canUpload, canEdit, canDelete }
 */
export function getDocumentPermissions(permissions) {
  return {
    canView: permissions.actions?.includes('document_view') || permissions.isSuperuser || false,
    canUpload: permissions.actions?.includes('document_upload') || permissions.isSuperuser || false,
    canEdit: permissions.actions?.includes('document_edit') || permissions.isSuperuser || false,
    canDelete: permissions.actions?.includes('document_delete') || permissions.isSuperuser || false,
  };
}

/**
 * Check if user can access a specific tab (SIMPLE ROLE-BASED)
 *
 * @param {string} tabId - Tab identifier (e.g., 'general-info', 'timecard')
 * @param {string[]} userRoles - Array of user's role names from session
 * @param {boolean} isSuperuser - Whether user is a superuser
 * @returns {boolean} Whether user can access the tab
 */
export function canAccessTab(tabId, userRoles, isSuperuser) {
  // Superuser can access everything
  if (isSuperuser) {
    return true;
  }

  const tabConfig = TAB_PERMISSIONS[tabId];

  // If tab not in config, deny access by default
  if (!tabConfig) {
    return false;
  }

  // Check if user has any of the allowed roles
  const allowedRoles = tabConfig.allowedRoles || [];
  return userRoles.some(role => allowedRoles.includes(role));
}

/**
 * Entity configuration export
 */
export const EMPLOYEES_ENTITY_CONFIG = {
  entityType: 'employees',
  displayName: 'Employees',
  tabPermissions: TAB_PERMISSIONS,
  documentPermissions: DOCUMENT_PERMISSIONS,
  roleDocumentAccess: ROLE_DOCUMENT_ACCESS,
  roleTabAccess: ROLE_TAB_ACCESS,
  roleFieldAccess: ROLE_FIELD_ACCESS,
};

export default EMPLOYEES_ENTITY_CONFIG;
