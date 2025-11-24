/**
 * PermissionChecker Class
 *
 * Server-side permission checking with ABAC support.
 * Checks entity-level, action-level, field-level, and record-level permissions.
 */

import {
  evaluateConditions,
  filterRecordsByConditions,
  conditionsToPrismaWhere,
  canAccessField,
  filterObjectFields,
  getAccessibleFields,
} from './policy-engine.js';

export class PermissionChecker {
  /**
   * Create a permission checker for a user
   *
   * @param {Object} user - User object from session (must include roles and permissions)
   */
  constructor(user) {
    if (!user) {
      throw new Error('PermissionChecker requires a user object');
    }

    this.user = user;
    this.roles = user.roles || [];
    this.permissions = user.permissions || [];
    this.isSuperuser = user.isSuperuser || false;

    // Context for ABAC evaluation
    this.context = {
      user: {
        id: user.id,
        email: user.email,
        department: user.department,
        location: user.location,
        roles: this.roles,
      },
    };
  }

  /**
   * Check if user can perform an action on an entity type
   *
   * @param {string} action - Action to check ('create', 'read', 'update', 'delete')
   * @param {string} entityType - Entity type ('employees', 'trucks', etc.)
   * @returns {boolean} - Whether user has permission
   */
  can(action, entityType) {
    // Superuser has all permissions
    if (this.isSuperuser) {
      return true;
    }

    // Find permissions for this entity type
    const entityPermissions = this.permissions.filter(
      p => p.entityType === entityType
    );

    if (entityPermissions.length === 0) {
      return false; // No permissions for this entity
    }

    // Check if any permission grants this action
    return entityPermissions.some(p => p.actions.includes(action));
  }

  /**
   * Get all permissions for an entity type and action
   *
   * @param {string} action - Action to check
   * @param {string} entityType - Entity type
   * @returns {Array} - Array of permission objects
   */
  getPermissions(action, entityType) {
    if (this.isSuperuser) {
      // Superuser gets unrestricted permission
      return [{
        entityType,
        actions: ['create', 'read', 'update', 'delete'],
        fields: null,
        conditions: null,
      }];
    }

    return this.permissions.filter(
      p => p.entityType === entityType && p.actions.includes(action)
    );
  }

  /**
   * Check if user can access a specific field
   *
   * @param {string} action - Action type ('read', 'update')
   * @param {string} entityType - Entity type
   * @param {string} fieldName - Field name to check
   * @returns {boolean} - Whether field is accessible
   */
  canAccessField(action, entityType, fieldName) {
    if (this.isSuperuser) {
      return true;
    }

    const permissions = this.getPermissions(action, entityType);

    if (permissions.length === 0) {
      return false;
    }

    // If any permission allows the field, grant access
    return permissions.some(p => canAccessField(p.fields, fieldName));
  }

  /**
   * Get all accessible fields for an entity type and action
   *
   * @param {string} action - Action type
   * @param {string} entityType - Entity type
   * @param {Array} allFields - All possible field names
   * @returns {Array} - Array of accessible field names
   */
  getAccessibleFields(action, entityType, allFields) {
    if (this.isSuperuser) {
      return allFields;
    }

    const permissions = this.getPermissions(action, entityType);

    if (permissions.length === 0) {
      return [];
    }

    // Combine accessible fields from all permissions (union)
    const accessibleFieldsSet = new Set();

    permissions.forEach(p => {
      const fields = getAccessibleFields(p.fields, allFields);
      fields.forEach(field => accessibleFieldsSet.add(field));
    });

    return Array.from(accessibleFieldsSet);
  }

  /**
   * Filter object to only include accessible fields
   *
   * @param {string} action - Action type
   * @param {string} entityType - Entity type
   * @param {Object} obj - Object to filter
   * @returns {Object} - Filtered object
   */
  filterFields(action, entityType, obj) {
    if (this.isSuperuser || !obj) {
      return obj;
    }

    const permissions = this.getPermissions(action, entityType);

    if (permissions.length === 0) {
      return {};
    }

    // System fields that must ALWAYS be included regardless of permissions
    const SYSTEM_FIELDS = ['id', 'createdAt', 'updatedAt'];

    // Apply most permissive field filter (union of all allowed fields)
    const allFields = Object.keys(obj);
    const accessibleFields = this.getAccessibleFields(action, entityType, allFields);

    const filtered = {};

    // Always include system fields first
    SYSTEM_FIELDS.forEach(field => {
      if (field in obj) {
        filtered[field] = obj[field];
      }
    });

    // Then add accessible fields
    accessibleFields.forEach(field => {
      if (field in obj) {
        filtered[field] = obj[field];
      }
    });

    return filtered;
  }

  /**
   * Check if user can access a specific record based on ABAC conditions
   *
   * @param {string} action - Action type
   * @param {string} entityType - Entity type
   * @param {Object} record - Record to check
   * @returns {boolean} - Whether user can access this record
   */
  canAccessRecord(action, entityType, record) {
    if (this.isSuperuser) {
      return true;
    }

    const permissions = this.getPermissions(action, entityType);

    if (permissions.length === 0) {
      return false;
    }

    // If any permission allows access to this record, grant it
    return permissions.some(p => {
      if (!p.conditions) {
        return true; // No conditions means all records accessible
      }
      return evaluateConditions(p.conditions, record, this.context);
    });
  }

  /**
   * Filter array of records based on ABAC conditions
   *
   * @param {string} action - Action type
   * @param {string} entityType - Entity type
   * @param {Array} records - Array of records to filter
   * @returns {Array} - Filtered records
   */
  filterRecords(action, entityType, records) {
    if (this.isSuperuser) {
      return records;
    }

    const permissions = this.getPermissions(action, entityType);

    if (permissions.length === 0) {
      return [];
    }

    // Apply least restrictive conditions (union - if any permission allows, include)
    return records.filter(record =>
      permissions.some(p => {
        if (!p.conditions) {
          return true;
        }
        return evaluateConditions(p.conditions, record, this.context);
      })
    );
  }

  /**
   * Get Prisma WHERE clause for record-level filtering
   * More efficient than filtering in application code
   *
   * @param {string} action - Action type
   * @param {string} entityType - Entity type
   * @returns {Object} - Prisma WHERE clause (OR of all permission conditions)
   */
  getPrismaWhere(action, entityType) {
    if (this.isSuperuser) {
      return {}; // No filtering for superuser
    }

    const permissions = this.getPermissions(action, entityType);

    if (permissions.length === 0) {
      // No permissions - return impossible condition
      return { id: null };
    }

    // Check if any permission has no conditions (means access to all records)
    const hasUnrestrictedPermission = permissions.some(p => !p.conditions);
    if (hasUnrestrictedPermission) {
      return {}; // No filtering needed
    }

    // Combine conditions with OR logic
    const whereClauses = permissions
      .filter(p => p.conditions)
      .map(p => conditionsToPrismaWhere(p.conditions, this.context));

    if (whereClauses.length === 0) {
      return {};
    }

    if (whereClauses.length === 1) {
      return whereClauses[0];
    }

    // Multiple conditions - use OR
    return { OR: whereClauses };
  }

  /**
   * Get Prisma select clause for field-level filtering
   *
   * @param {string} action - Action type
   * @param {string} entityType - Entity type
   * @param {Array} allFields - All possible field names
   * @returns {Object} - Prisma select object
   */
  getPrismaSelect(action, entityType, allFields) {
    if (this.isSuperuser) {
      return undefined; // Select all fields
    }

    const accessibleFields = this.getAccessibleFields(action, entityType, allFields);

    if (accessibleFields.length === 0) {
      return { id: true }; // At minimum, return ID
    }

    const select = {};
    accessibleFields.forEach(field => {
      select[field] = true;
    });

    return select;
  }

  /**
   * Check if user has any of the specified roles
   *
   * @param {Array|string} roles - Role name(s) to check
   * @returns {boolean} - Whether user has any of these roles
   */
  hasRole(roles) {
    if (this.isSuperuser) {
      return true;
    }

    const rolesToCheck = Array.isArray(roles) ? roles : [roles];
    return rolesToCheck.some(role => this.roles.includes(role));
  }

  /**
   * Check if user has all of the specified roles
   *
   * @param {Array|string} roles - Role name(s) to check
   * @returns {boolean} - Whether user has all of these roles
   */
  hasAllRoles(roles) {
    if (this.isSuperuser) {
      return true;
    }

    const rolesToCheck = Array.isArray(roles) ? roles : [roles];
    return rolesToCheck.every(role => this.roles.includes(role));
  }
}
