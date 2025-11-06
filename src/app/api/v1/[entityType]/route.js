/**
 * Universal Entity Collection API - Next.js 16
 *
 * GET /api/v1/{entityType} - List entities with filtering and pagination
 * POST /api/v1/{entityType} - Create new entity
 *
 * Supports: employees (extensible to trucks, drivers, equipment)
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  authorizeRequest,
  applyRecordFiltering,
  applyFieldFiltering,
  createErrorResponse,
  createSuccessResponse,
} from '@/lib/api-auth';

// Supported entity types
const VALID_ENTITY_TYPES = ['employees'];

// Map entity types to Prisma models
const ENTITY_MODELS = {
  employees: 'officeEmployee',
};

/**
 * GET /api/v1/{entityType}
 * List entities with filtering, pagination, sorting, and ABAC record/field filtering
 */
export async function GET(request, { params }) {
  try {
    // Next.js 16: params is now a Promise
    const { entityType } = await params;

    // Validate entity type
    if (!VALID_ENTITY_TYPES.includes(entityType)) {
      return createErrorResponse(400, 'Bad Request', `Invalid entity type: ${entityType}`);
    }

    // Authorize request - check if user can 'read' this entity type
    const authResult = await authorizeRequest(request, entityType, 'read');
    if (authResult.error) {
      return authResult.response;
    }

    const { checker, user } = authResult;
    const modelName = ENTITY_MODELS[entityType];

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Validate pagination
    if (page < 1 || limit < 1 || limit > 100) {
      return createErrorResponse(400, 'Bad Request', 'Invalid pagination parameters');
    }

    // Build base where clause
    const where = {
      isDeleted: false,
      // Apply ABAC record-level filtering
      ...applyRecordFiltering(checker, 'read', entityType),
    };

    // Entity-specific filters (for employees)
    if (entityType === 'employees') {
      // Search filter (firstName, lastName, email, employeeId)
      if (search) {
        where.OR = [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { employeeId: { contains: search, mode: 'insensitive' } },
        ];
      }

      // Status filter
      if (status) {
        where.status = status;
      }

      // Department filter
      const department = searchParams.get('department');
      if (department) {
        where.department = { contains: department, mode: 'insensitive' };
      }
    }

    // Build orderBy clause
    const orderBy = {
      [sortBy]: sortOrder,
    };

    // Calculate skip
    const skip = (page - 1) * limit;

    // Execute queries in parallel
    const [entities, totalCount] = await Promise.all([
      prisma[modelName].findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          profilePhoto: {
            select: {
              id: true,
              filePath: true,
              fileName: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
          updatedBy: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      prisma[modelName].count({ where }),
    ]);

    // Apply field-level filtering to response data
    const filteredEntities = applyFieldFiltering(checker, 'read', entityType, entities);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return createSuccessResponse(filteredEntities, {
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    });
  } catch (error) {
    console.error(`Error fetching ${entityType}:`, error);
    return createErrorResponse(
      500,
      'Internal Server Error',
      `Failed to fetch ${entityType}`,
      { details: process.env.NODE_ENV === 'development' ? error.message : undefined }
    );
  }
}

/**
 * POST /api/v1/{entityType}
 * Create a new entity with authorization checks
 */
export async function POST(request, { params }) {
  try {
    // Next.js 16: params is now a Promise
    const { entityType } = await params;

    // Validate entity type
    if (!VALID_ENTITY_TYPES.includes(entityType)) {
      return createErrorResponse(400, 'Bad Request', `Invalid entity type: ${entityType}`);
    }

    // Authorize request - check if user can 'create' this entity type
    const authResult = await authorizeRequest(request, entityType, 'create');
    if (authResult.error) {
      return authResult.response;
    }

    const { user } = authResult;
    const modelName = ENTITY_MODELS[entityType];

    // Parse request body
    const body = await request.json();

    // Entity-specific validation (for employees)
    if (entityType === 'employees') {
      const { employeeId, firstName, lastName } = body;
      if (!employeeId || !firstName || !lastName) {
        return createErrorResponse(
          400,
          'Validation Error',
          'Missing required fields: employeeId, firstName, lastName'
        );
      }

      // Check if employeeId already exists
      const existingEntity = await prisma[modelName].findUnique({
        where: { employeeId },
      });

      if (existingEntity) {
        return createErrorResponse(400, 'Validation Error', 'Employee ID already exists');
      }
    }

    // Build entity data (entity-specific for employees)
    let entityData = {};

    if (entityType === 'employees') {
      entityData = {
        employeeId: body.employeeId,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email || null,
        phoneNumber: body.phoneNumber || null,
        emergencyContactName: body.emergencyContactName || null,
        emergencyContactPhone: body.emergencyContactPhone || null,
        addressLine1: body.addressLine1 || null,
        addressLine2: body.addressLine2 || null,
        city: body.city || null,
        stateProvince: body.stateProvince || null,
        postalCode: body.postalCode || null,
        country: body.country || null,
        hireDate: body.hireDate ? new Date(body.hireDate) : null,
        terminationDate: body.terminationDate ? new Date(body.terminationDate) : null,
        jobTitle: body.jobTitle || null,
        department: body.department || null,
        employmentType: body.employmentType || null,
        officeLocation: body.officeLocation || null,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
        status: body.status || 'new',
        createdById: user.id,
        updatedById: user.id,
      };
    }

    // Create entity
    const entity = await prisma[modelName].create({
      data: entityData,
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        updatedBy: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Create activity log
    await prisma.activityLog.create({
      data: {
        entityType,
        entityId: entity.id,
        actionType: 'created',
        newValue: entityType === 'employees' ? `${entity.firstName} ${entity.lastName}` : entity.id,
        performedById: user.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: entity,
        message: `${entityType} created successfully`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(`Error creating ${entityType}:`, error);
    return createErrorResponse(
      500,
      'Internal Server Error',
      `Failed to create ${entityType}`,
      { details: process.env.NODE_ENV === 'development' ? error.message : undefined }
    );
  }
}
