/**
 * ABAC Policy Engine
 *
 * Core engine for evaluating attribute-based access control policies.
 * Supports conditions with operators: eq, ne, in, notIn, gt, lt, gte, lte, contains
 */

/**
 * Evaluate a single condition against a value
 *
 * @param {any} value - The value to check
 * @param {Object} condition - The condition object with operator and expected value
 * @param {Object} context - Context object containing user attributes
 * @returns {boolean} - Whether the condition is satisfied
 */
function evaluateCondition(value, condition, context) {
  // Get the operator (eq, ne, in, notIn, etc.)
  const operator = Object.keys(condition)[0];
  let expectedValue = condition[operator];

  // Replace template variables like ${user.department} with actual values
  if (typeof expectedValue === 'string' && expectedValue.startsWith('${')) {
    const path = expectedValue.slice(2, -1); // Remove ${ and }
    expectedValue = getNestedValue(context, path);
  }

  // Handle array of expected values (some may be templates)
  if (Array.isArray(expectedValue)) {
    expectedValue = expectedValue.map(v => {
      if (typeof v === 'string' && v.startsWith('${')) {
        const path = v.slice(2, -1);
        return getNestedValue(context, path);
      }
      return v;
    });
  }

  // Evaluate based on operator
  switch (operator) {
    case 'eq': // Equal
      return value === expectedValue;

    case 'ne': // Not equal
      return value !== expectedValue;

    case 'in': // In array
      if (!Array.isArray(expectedValue)) {
        expectedValue = [expectedValue];
      }
      return expectedValue.includes(value);

    case 'notIn': // Not in array
      if (!Array.isArray(expectedValue)) {
        expectedValue = [expectedValue];
      }
      return !expectedValue.includes(value);

    case 'gt': // Greater than
      return value > expectedValue;

    case 'lt': // Less than
      return value < expectedValue;

    case 'gte': // Greater than or equal
      return value >= expectedValue;

    case 'lte': // Less than or equal
      return value <= expectedValue;

    case 'contains': // String contains (case-insensitive)
      if (typeof value !== 'string' || typeof expectedValue !== 'string') {
        return false;
      }
      return value.toLowerCase().includes(expectedValue.toLowerCase());

    default:
      console.warn(`Unknown operator: ${operator}`);
      return false;
  }
}

/**
 * Get nested value from object using dot notation
 * E.g., "user.department" returns context.user.department
 *
 * @param {Object} obj - The object to traverse
 * @param {string} path - Dot-notation path
 * @returns {any} - The value at that path
 */
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Evaluate all conditions in a conditions object
 *
 * @param {Object} conditions - Conditions object from permission
 *   Example: { "department": { "eq": "${user.department}" }, "status": { "in": ["active", "trainee"] } }
 * @param {Object} record - The record being checked
 * @param {Object} context - Context with user attributes
 * @returns {boolean} - Whether all conditions are satisfied
 */
export function evaluateConditions(conditions, record, context) {
  if (!conditions || Object.keys(conditions).length === 0) {
    return true; // No conditions means access granted
  }

  // All conditions must be satisfied (AND logic)
  for (const [fieldName, condition] of Object.entries(conditions)) {
    const recordValue = record[fieldName];
    const satisfied = evaluateCondition(recordValue, condition, context);

    if (!satisfied) {
      return false; // Short-circuit on first failure
    }
  }

  return true; // All conditions satisfied
}

/**
 * Filter records based on ABAC conditions
 *
 * @param {Array} records - Array of records to filter
 * @param {Object} conditions - Conditions object from permission
 * @param {Object} context - Context with user attributes
 * @returns {Array} - Filtered records
 */
export function filterRecordsByConditions(records, conditions, context) {
  if (!conditions || Object.keys(conditions).length === 0) {
    return records; // No filtering needed
  }

  return records.filter(record => evaluateConditions(conditions, record, context));
}

/**
 * Convert ABAC conditions to Prisma WHERE clause
 * This is more efficient than filtering in application code
 *
 * @param {Object} conditions - Conditions object from permission
 * @param {Object} context - Context with user attributes
 * @returns {Object} - Prisma WHERE clause
 */
export function conditionsToPrismaWhere(conditions, context) {
  if (!conditions || Object.keys(conditions).length === 0) {
    return {}; // No filtering
  }

  const where = {};

  for (const [fieldName, condition] of Object.entries(conditions)) {
    const operator = Object.keys(condition)[0];
    let value = condition[operator];

    // Replace template variables
    if (typeof value === 'string' && value.startsWith('${')) {
      const path = value.slice(2, -1);
      value = getNestedValue(context, path);
    }

    // Handle array templates
    if (Array.isArray(value)) {
      value = value.map(v => {
        if (typeof v === 'string' && v.startsWith('${')) {
          const path = v.slice(2, -1);
          return getNestedValue(context, path);
        }
        return v;
      });
    }

    // Map to Prisma operators
    switch (operator) {
      case 'eq':
        where[fieldName] = value;
        break;

      case 'ne':
        where[fieldName] = { not: value };
        break;

      case 'in':
        where[fieldName] = { in: Array.isArray(value) ? value : [value] };
        break;

      case 'notIn':
        where[fieldName] = { notIn: Array.isArray(value) ? value : [value] };
        break;

      case 'gt':
        where[fieldName] = { gt: value };
        break;

      case 'lt':
        where[fieldName] = { lt: value };
        break;

      case 'gte':
        where[fieldName] = { gte: value };
        break;

      case 'lte':
        where[fieldName] = { lte: value };
        break;

      case 'contains':
        where[fieldName] = { contains: value, mode: 'insensitive' };
        break;

      default:
        console.warn(`Unknown operator for Prisma: ${operator}`);
    }
  }

  return where;
}

/**
 * Evaluate field-level permissions
 *
 * @param {Object} fields - Fields permission object { allowed: [...], denied: [...] }
 * @param {string} fieldName - Name of the field to check
 * @returns {boolean} - Whether the field is accessible
 */
export function canAccessField(fields, fieldName) {
  // No field restrictions means all fields accessible
  if (!fields) {
    return true;
  }

  const { allowed, denied } = fields;

  // If denied list exists and field is in it, deny access
  if (denied && Array.isArray(denied) && denied.includes(fieldName)) {
    return false;
  }

  // If allowed list exists, field must be in it
  if (allowed && Array.isArray(allowed)) {
    return allowed.includes(fieldName);
  }

  // No explicit allow/deny, default to allow
  return true;
}

/**
 * Filter object fields based on permissions
 *
 * @param {Object} obj - Object to filter
 * @param {Object} fields - Fields permission object
 * @returns {Object} - Filtered object with only allowed fields
 */
export function filterObjectFields(obj, fields) {
  if (!fields || !obj) {
    return obj;
  }

  const filtered = {};

  for (const [key, value] of Object.entries(obj)) {
    if (canAccessField(fields, key)) {
      filtered[key] = value;
    }
  }

  return filtered;
}

/**
 * Get list of accessible fields
 *
 * @param {Object} fields - Fields permission object
 * @param {Array} allFields - All possible field names
 * @returns {Array} - Array of accessible field names
 */
export function getAccessibleFields(fields, allFields) {
  if (!fields) {
    return allFields; // All fields accessible
  }

  const { allowed, denied } = fields;

  // If allowed list exists, return only those
  if (allowed && Array.isArray(allowed)) {
    return allowed;
  }

  // If only denied list exists, return all except denied
  if (denied && Array.isArray(denied)) {
    return allFields.filter(field => !denied.includes(field));
  }

  return allFields;
}
