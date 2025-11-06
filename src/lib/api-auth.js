/**
 * API Authorization Middleware
 *
 * Reusable authorization functions for protecting API routes.
 * Implements entity-level, action-level, field-level, and record-level (ABAC) permissions.
 */

import { getSession } from './auth.js';
import { PermissionChecker } from './permissions/permission-checker.js';
import { NextResponse } from 'next/server';

/**
 * Main authorization check for API routes
 * Validates session and checks if user can perform action on entity
 *
 * @param {Request} request - Next.js request object
 * @param {string} entityType - Entity type ('employees', 'trucks', etc.)
 * @param {string} action - Action to check ('create', 'read', 'update', 'delete')
 * @returns {Promise<Object>} - { checker, user, session } or { error, status, response }
 *
 * @example
 * const authResult = await authorizeRequest(request, 'employees', 'read');
 * if (authResult.error) return authResult.response;
 * const { checker, user } = authResult;
 */
export async function authorizeRequest(request, entityType, action) {
  // Get session from request headers
  const session = await getSession(request.headers);

  if (!session?.user) {
    return {
      error: 'Authentication required',
      status: 401,
      response: NextResponse.json(
        {
          error: 'Authentication required',
          message: 'You must be logged in to access this resource',
        },
        { status: 401 }
      ),
    };
  }

  const user = session.user;

  // Create permission checker
  const checker = new PermissionChecker(user);

  // Check if user has permission for this action on this entity
  if (!checker.can(action, entityType)) {
    return {
      error: 'Forbidden',
      status: 403,
      response: NextResponse.json(
        {
          error: 'Forbidden',
          message: `You do not have permission to ${action} ${entityType}`,
          required: { action, entityType },
        },
        { status: 403 }
      ),
    };
  }

  // Authorization successful
  return {
    checker,
    user,
    session,
  };
}

/**
 * Check if user can access a specific record
 *
 * @param {PermissionChecker} checker - Permission checker instance
 * @param {string} action - Action type
 * @param {string} entityType - Entity type
 * @param {Object} record - Record to check
 * @returns {Object} - { allowed: true } or { error, status, response }
 *
 * @example
 * const recordAuth = await authorizeRecordAccess(checker, 'update', 'employees', employee);
 * if (recordAuth.error) return recordAuth.response;
 */
export async function authorizeRecordAccess(checker, action, entityType, record) {
  if (!record) {
    return {
      error: 'Not found',
      status: 404,
      response: NextResponse.json(
        {
          error: 'Not found',
          message: 'The requested resource was not found',
        },
        { status: 404 }
      ),
    };
  }

  if (!checker.canAccessRecord(action, entityType, record)) {
    return {
      error: 'Forbidden',
      status: 403,
      response: NextResponse.json(
        {
          error: 'Forbidden',
          message: 'You do not have permission to access this record',
        },
        { status: 403 }
      ),
    };
  }

  return { allowed: true };
}

/**
 * Check if user can access specific fields
 * Validates each field being read or written
 *
 * @param {PermissionChecker} checker - Permission checker instance
 * @param {string} action - Action type
 * @param {string} entityType - Entity type
 * @param {Array<string>} fields - Array of field names to check
 * @returns {Object} - { allowed: true } or { error, status, response }
 *
 * @example
 * const fieldAuth = await authorizeFieldAccess(checker, 'update', 'employees', Object.keys(updateData));
 * if (fieldAuth.error) return fieldAuth.response;
 */
export async function authorizeFieldAccess(checker, action, entityType, fields) {
  const deniedFields = fields.filter(
    (field) => !checker.canAccessField(action, entityType, field)
  );

  if (deniedFields.length > 0) {
    return {
      error: 'Forbidden',
      status: 403,
      response: NextResponse.json(
        {
          error: 'Forbidden',
          message: `You do not have permission to ${action} the following fields`,
          deniedFields,
        },
        { status: 403 }
      ),
    };
  }

  return { allowed: true };
}

/**
 * Get Prisma WHERE clause for record-level filtering
 * More efficient than filtering in application code
 *
 * @param {PermissionChecker} checker - Permission checker instance
 * @param {string} action - Action type
 * @param {string} entityType - Entity type
 * @returns {Object} - Prisma WHERE clause object
 *
 * @example
 * const where = applyRecordFiltering(checker, 'read', 'employees');
 * const records = await prisma.officeEmployee.findMany({
 *   where: { isDeleted: false, ...where }
 * });
 */
export function applyRecordFiltering(checker, action, entityType) {
  return checker.getPrismaWhere(action, entityType);
}

/**
 * Filter response data to only include accessible fields
 * Removes fields the user doesn't have permission to see
 *
 * @param {PermissionChecker} checker - Permission checker instance
 * @param {string} action - Action type
 * @param {string} entityType - Entity type
 * @param {Object|Array} data - Data to filter (single object or array)
 * @returns {Object|Array} - Filtered data
 *
 * @example
 * const filteredData = applyFieldFiltering(checker, 'read', 'employees', employees);
 */
export function applyFieldFiltering(checker, action, entityType, data) {
  if (!data) return data;

  // Handle array of records
  if (Array.isArray(data)) {
    return data.map((record) => checker.filterFields(action, entityType, record));
  }

  // Handle single record
  return checker.filterFields(action, entityType, data);
}

/**
 * Get Prisma SELECT clause for field-level filtering
 * Alternative to in-memory filtering, more efficient for large datasets
 *
 * @param {PermissionChecker} checker - Permission checker instance
 * @param {string} action - Action type
 * @param {string} entityType - Entity type
 * @param {Array<string>} allFields - All possible field names
 * @returns {Object|undefined} - Prisma select object or undefined for all fields
 *
 * @example
 * const select = applyFieldSelection(checker, 'read', 'employees', ALL_EMPLOYEE_FIELDS);
 * const records = await prisma.officeEmployee.findMany({ select });
 */
export function applyFieldSelection(checker, action, entityType, allFields) {
  return checker.getPrismaSelect(action, entityType, allFields);
}

/**
 * Create standardized error response
 *
 * @param {number} status - HTTP status code
 * @param {string} error - Error type
 * @param {string} message - Error message
 * @param {Object} additional - Additional error data
 * @returns {NextResponse} - Next.js response object
 */
export function createErrorResponse(status, error, message, additional = {}) {
  return NextResponse.json(
    {
      error,
      message,
      ...additional,
    },
    { status }
  );
}

/**
 * Create standardized success response
 *
 * @param {Object} data - Response data
 * @param {Object} additional - Additional response data (pagination, etc.)
 * @returns {NextResponse} - Next.js response object
 */
export function createSuccessResponse(data, additional = {}) {
  return NextResponse.json({
    success: true,
    data,
    ...additional,
  });
}
