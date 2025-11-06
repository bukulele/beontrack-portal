/**
 * Permission React Hooks
 *
 * Client-side hooks for checking permissions in React components.
 * These are UI helpers - actual enforcement happens server-side.
 */

"use client";

import { useMemo } from 'react';
import { useSession } from '../auth-client';
import { canAccessField as checkFieldAccess } from './policy-engine';

/**
 * Hook to check if user has permission for an action on an entity
 *
 * @param {string} entityType - Entity type ('employees', 'trucks', etc.)
 * @param {string} action - Action ('create', 'read', 'update', 'delete')
 * @returns {{
 *   can: boolean,
 *   loading: boolean,
 *   user: Object|null
 * }}
 *
 * @example
 * const { can, loading } = usePermission('employees', 'update');
 * if (loading) return <Spinner />;
 * if (!can) return <AccessDenied />;
 */
export function usePermission(entityType, action) {
  const { data: session, isPending } = useSession();

  const can = useMemo(() => {
    if (!session?.user) return false;

    const user = session.user;

    // Superuser has all permissions
    if (user.isSuperuser) return true;

    // Check if user has permission for this action on this entity
    const permissions = user.permissions || [];
    return permissions.some(
      p => p.entityType === entityType && p.actions.includes(action)
    );
  }, [session, entityType, action]);

  return {
    can,
    loading: isPending,
    user: session?.user || null,
  };
}

/**
 * Hook to check multiple permissions at once
 *
 * @param {string} entityType - Entity type
 * @returns {{
 *   canCreate: boolean,
 *   canRead: boolean,
 *   canUpdate: boolean,
 *   canDelete: boolean,
 *   loading: boolean,
 *   user: Object|null
 * }}
 *
 * @example
 * const { canCreate, canUpdate, canDelete } = usePermissions('employees');
 */
export function usePermissions(entityType) {
  const { data: session, isPending } = useSession();

  const permissions = useMemo(() => {
    if (!session?.user) {
      return {
        canCreate: false,
        canRead: false,
        canUpdate: false,
        canDelete: false,
      };
    }

    const user = session.user;

    if (user.isSuperuser) {
      return {
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
      };
    }

    const userPermissions = user.permissions || [];
    const entityPermissions = userPermissions.filter(
      p => p.entityType === entityType
    );

    const actions = new Set();
    entityPermissions.forEach(p => {
      p.actions.forEach(action => actions.add(action));
    });

    return {
      canCreate: actions.has('create'),
      canRead: actions.has('read'),
      canUpdate: actions.has('update'),
      canDelete: actions.has('delete'),
    };
  }, [session, entityType]);

  return {
    ...permissions,
    loading: isPending,
    user: session?.user || null,
  };
}

/**
 * Hook to check field-level permissions
 *
 * @param {string} entityType - Entity type
 * @param {string} fieldName - Field name to check
 * @param {string} action - Action ('read' or 'update')
 * @returns {{
 *   canView: boolean,
 *   canEdit: boolean,
 *   loading: boolean
 * }}
 *
 * @example
 * const { canView, canEdit } = useFieldPermission('employees', 'salary');
 * if (!canView) return null;
 * if (canEdit) return <Input />; else return <ReadOnlyField />;
 */
export function useFieldPermission(entityType, fieldName, action = 'read') {
  const { data: session, isPending } = useSession();

  const fieldPermissions = useMemo(() => {
    if (!session?.user) {
      return { canView: false, canEdit: false };
    }

    const user = session.user;

    if (user.isSuperuser) {
      return { canView: true, canEdit: true };
    }

    const permissions = user.permissions || [];
    const entityPermissions = permissions.filter(
      p => p.entityType === entityType
    );

    // Check read permission
    const canView = entityPermissions.some(p => {
      if (!p.actions.includes('read')) return false;
      return checkFieldAccess(p.fields, fieldName);
    });

    // Check update permission
    const canEdit = entityPermissions.some(p => {
      if (!p.actions.includes('update')) return false;
      return checkFieldAccess(p.fields, fieldName);
    });

    return { canView, canEdit };
  }, [session, entityType, fieldName]);

  return {
    ...fieldPermissions,
    loading: isPending,
  };
}

/**
 * Hook to get all accessible fields for an entity and action
 *
 * @param {string} entityType - Entity type
 * @param {string} action - Action type
 * @param {Array} allFields - All possible field names
 * @returns {{
 *   accessibleFields: Array,
 *   loading: boolean
 * }}
 *
 * @example
 * const { accessibleFields } = useAccessibleFields('employees', 'read', ALL_EMPLOYEE_FIELDS);
 * const columns = accessibleFields.map(field => ({ field, headerName: ... }));
 */
export function useAccessibleFields(entityType, action, allFields = []) {
  const { data: session, isPending } = useSession();

  const accessibleFields = useMemo(() => {
    if (!session?.user) return [];

    const user = session.user;

    if (user.isSuperuser) return allFields;

    const permissions = user.permissions || [];
    const entityPermissions = permissions.filter(
      p => p.entityType === entityType && p.actions.includes(action)
    );

    if (entityPermissions.length === 0) return [];

    // Collect all accessible fields (union of all permissions)
    const fieldsSet = new Set();

    entityPermissions.forEach(p => {
      if (!p.fields) {
        // No field restrictions - all fields accessible
        allFields.forEach(field => fieldsSet.add(field));
      } else if (p.fields.allowed) {
        // Explicit allow list
        p.fields.allowed.forEach(field => fieldsSet.add(field));
      } else if (p.fields.denied) {
        // Deny list - add all except denied
        allFields.forEach(field => {
          if (!p.fields.denied.includes(field)) {
            fieldsSet.add(field);
          }
        });
      } else {
        // No restrictions
        allFields.forEach(field => fieldsSet.add(field));
      }
    });

    return Array.from(fieldsSet);
  }, [session, entityType, action, allFields]);

  return {
    accessibleFields,
    loading: isPending,
  };
}

/**
 * Hook to check if user has specific role(s)
 *
 * @param {string|Array} roles - Role name(s) to check
 * @returns {{
 *   hasRole: boolean,
 *   loading: boolean,
 *   userRoles: Array
 * }}
 *
 * @example
 * const { hasRole } = useRole('admin');
 * const { hasRole } = useRole(['admin', 'payroll']); // Has any of these roles
 */
export function useRole(roles) {
  const { data: session, isPending } = useSession();

  const hasRole = useMemo(() => {
    if (!session?.user) return false;

    const user = session.user;

    if (user.isSuperuser) return true;

    const userRoles = user.roles || [];
    const rolesToCheck = Array.isArray(roles) ? roles : [roles];

    return rolesToCheck.some(role => userRoles.includes(role));
  }, [session, roles]);

  return {
    hasRole,
    loading: isPending,
    userRoles: session?.user?.roles || [],
  };
}

/**
 * Hook to get current user session with permissions
 *
 * @returns {{
 *   user: Object|null,
 *   loading: boolean,
 *   isAuthenticated: boolean,
 *   isSuperuser: boolean,
 *   roles: Array,
 *   permissions: Array
 * }}
 *
 * @example
 * const { user, isAuthenticated, roles } = useCurrentUser();
 */
export function useCurrentUser() {
  const { data: session, isPending } = useSession();

  return {
    user: session?.user || null,
    loading: isPending,
    isAuthenticated: !!session?.user,
    isSuperuser: session?.user?.isSuperuser || false,
    roles: session?.user?.roles || [],
    permissions: session?.user?.permissions || [],
  };
}
