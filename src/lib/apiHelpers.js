/**
 * API Helper Utilities
 * Reusable functions for API endpoints
 */

/**
 * Build Prisma where clause for employee filtering
 * @param {Object} filters - Filter parameters
 * @param {string} filters.search - Search term for name/email/employeeId
 * @param {string} filters.status - Employee status filter
 * @param {string} filters.department - Department filter
 * @returns {Object} Prisma where clause
 */
export function buildEmployeeWhereClause(filters = {}) {
  const where = {
    isDeleted: false,
  };

  // Search filter (firstName, lastName, email, employeeId)
  if (filters.search) {
    where.OR = [
      { firstName: { contains: filters.search, mode: 'insensitive' } },
      { lastName: { contains: filters.search, mode: 'insensitive' } },
      { email: { contains: filters.search, mode: 'insensitive' } },
      { employeeId: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  // Status filter
  if (filters.status) {
    where.status = filters.status;
  }

  // Department filter
  if (filters.department) {
    where.department = { contains: filters.department, mode: 'insensitive' };
  }

  return where;
}

/**
 * Build Prisma orderBy clause
 * @param {string} sortBy - Field to sort by
 * @param {string} sortOrder - Sort order ('asc' or 'desc')
 * @returns {Object} Prisma orderBy clause
 */
export function buildOrderBy(sortBy = 'createdAt', sortOrder = 'desc') {
  // Validate sortOrder
  const validOrder = ['asc', 'desc'].includes(sortOrder) ? sortOrder : 'desc';

  return {
    [sortBy]: validOrder,
  };
}

/**
 * Calculate pagination metadata
 * @param {number} totalCount - Total number of items
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @returns {Object} Pagination metadata
 */
export function calculatePagination(totalCount, page, limit) {
  const totalPages = Math.ceil(totalCount / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  return {
    page,
    limit,
    totalCount,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  };
}

/**
 * Format employee response (transform DB snake_case to API camelCase if needed)
 * Note: Prisma already maps snake_case to camelCase via @map() in schema
 * This function is for additional transformations if needed
 * @param {Object} employee - Employee object from Prisma
 * @returns {Object} Formatted employee object
 */
export function formatEmployeeResponse(employee) {
  // Prisma handles snake_case -> camelCase automatically via @map()
  // Additional formatting can be added here if needed
  return employee;
}

/**
 * Format employee input (transform API camelCase to DB snake_case if needed)
 * Note: Prisma already maps camelCase to snake_case via @map() in schema
 * This function is for additional transformations if needed
 * @param {Object} data - Employee data from request
 * @returns {Object} Formatted data for Prisma
 */
export function formatEmployeeInput(data) {
  // Prisma handles camelCase -> snake_case automatically via @map()
  // Additional formatting can be added here if needed
  return data;
}

/**
 * Track field changes for activity log
 * @param {Object} currentData - Current employee data
 * @param {Object} newData - New employee data from request
 * @param {string} employeeId - Employee ID
 * @param {string} userId - User ID performing the change
 * @returns {Array} Array of activity log entries
 */
export function trackFieldChanges(currentData, newData, employeeId, userId) {
  const activityLogs = [];

  // Field mapping for updatable fields
  const fieldMapping = {
    employeeId: 'employeeId',
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'email',
    phoneNumber: 'phoneNumber',
    emergencyContactName: 'emergencyContactName',
    emergencyContactPhone: 'emergencyContactPhone',
    addressLine1: 'addressLine1',
    addressLine2: 'addressLine2',
    city: 'city',
    stateProvince: 'stateProvince',
    postalCode: 'postalCode',
    country: 'country',
    hireDate: 'hireDate',
    terminationDate: 'terminationDate',
    jobTitle: 'jobTitle',
    department: 'department',
    employmentType: 'employmentType',
    officeLocation: 'officeLocation',
    dateOfBirth: 'dateOfBirth',
    status: 'status',
    profilePhotoId: 'profilePhotoId',
  };

  for (const [key, dbKey] of Object.entries(fieldMapping)) {
    if (key in newData) {
      let newValue = newData[key];
      let oldValue = currentData[dbKey];

      // Handle date fields
      if (['hireDate', 'terminationDate', 'dateOfBirth'].includes(dbKey)) {
        if (newValue) newValue = new Date(newValue);
        if (oldValue) oldValue = oldValue.toISOString().split('T')[0];
      }

      // Only log if value changed
      if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
        activityLogs.push({
          employeeId,
          actionType: 'updated',
          fieldName: dbKey,
          oldValue: oldValue ? String(oldValue) : null,
          newValue: newValue ? String(newValue) : null,
          performedById: userId,
        });
      }
    }
  }

  return activityLogs;
}

/**
 * Validate pagination parameters
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @param {number} maxLimit - Maximum allowed limit (default 100)
 * @returns {Object} { valid: boolean, error: string|null }
 */
export function validatePagination(page, limit, maxLimit = 100) {
  if (page < 1) {
    return { valid: false, error: 'Page must be greater than 0' };
  }

  if (limit < 1) {
    return { valid: false, error: 'Limit must be greater than 0' };
  }

  if (limit > maxLimit) {
    return { valid: false, error: `Limit must not exceed ${maxLimit}` };
  }

  return { valid: true, error: null };
}
