/**
 * WCB Claims Entity Configuration
 *
 * Centralized configuration for WCB claims entity permissions, tabs, and operations.
 */

export const TAB_PERMISSIONS = {
  'general-info': {
    allowedRoles: [
      'admin',
      'humanResources',
      'safetyCompliance',
      'productionManager',
      'finance',
    ],
  },
  'medical-info': {
    allowedRoles: [
      'admin',
      'humanResources',
      'safetyCompliance',
    ],
  },
  'documents': {
    allowedRoles: [
      'admin',
      'humanResources',
      'safetyCompliance',
    ],
  },
  'notes': {
    allowedRoles: [
      'admin',
      'humanResources',
      'safetyCompliance',
    ],
  },
};

export const DOCUMENT_PERMISSIONS = {
  view: 'document_view',
  upload: 'document_upload',
  edit: 'document_edit',
  delete: 'document_delete',
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
 * Check if user can access a specific tab
 *
 * @param {string} tabId - Tab identifier (e.g., 'general-info', 'medical-info')
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
export const WCB_CLAIMS_ENTITY_CONFIG = {
  entityType: 'wcb_claims',
  displayName: 'WCB Claims',
  tabPermissions: TAB_PERMISSIONS,
  documentPermissions: DOCUMENT_PERMISSIONS,
};

export default WCB_CLAIMS_ENTITY_CONFIG;
