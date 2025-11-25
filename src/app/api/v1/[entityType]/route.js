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
const VALID_ENTITY_TYPES = ['employees', 'wcb_claims'];

// Map entity types to Prisma models
const ENTITY_MODELS = {
  employees: 'officeEmployee',
  wcb_claims: 'wcbClaim',
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

    // Entity-specific filters (for wcb_claims)
    if (entityType === 'wcb_claims') {
      // Search filter (claimNumber, wcbClaimNumber, injuryType)
      if (search) {
        where.OR = [
          { claimNumber: { contains: search, mode: 'insensitive' } },
          { wcbClaimNumber: { contains: search, mode: 'insensitive' } },
          { injuryType: { contains: search, mode: 'insensitive' } },
        ];
      }

      // Status filter
      if (status) {
        where.status = status;
      }

      // Province filter
      const province = searchParams.get('province');
      if (province) {
        where.province = province;
      }

      // Entity filter (filter by linked entity)
      const linkedEntityType = searchParams.get('linkedEntityType');
      const linkedEntityId = searchParams.get('linkedEntityId');
      if (linkedEntityType && linkedEntityId) {
        where.entityType = linkedEntityType;
        where.entityId = linkedEntityId;
      }
    }

    // Build orderBy clause
    const orderBy = {
      [sortBy]: sortOrder,
    };

    // Calculate skip
    const skip = (page - 1) * limit;

    // Build include clause (entity-specific)
    const include = {
      createdBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      updatedBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    };

    // Add profilePhoto for employees only
    if (entityType === 'employees') {
      include.profilePhoto = {
        select: {
          id: true,
          filePath: true,
          fileName: true,
        },
      };
    }

    // Execute queries in parallel
    const [entities, totalCount] = await Promise.all([
      prisma[modelName].findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include,
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
  // Next.js 16: params is now a Promise
  const resolvedParams = await params;
  const entityType = resolvedParams.entityType;

  try {

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
      const { email, employeeId } = body;

      // Email is always required
      if (!email) {
        return createErrorResponse(
          400,
          'Validation Error',
          'Email is required'
        );
      }

      // Check if employeeId already exists (only if provided)
      if (employeeId) {
        const existingEntity = await prisma[modelName].findUnique({
          where: { employeeId },
        });

        if (existingEntity) {
          return createErrorResponse(400, 'Validation Error', 'Employee ID already exists');
        }
      }
    }

    // Entity-specific validation (for wcb_claims)
    if (entityType === 'wcb_claims') {
      const { incidentDate, province, entityType: linkedEntityType, entityId: linkedEntityId, incidentDetails } = body;

      // Required fields validation
      if (!incidentDate) {
        return createErrorResponse(400, 'Validation Error', 'Incident date is required');
      }
      if (!province) {
        return createErrorResponse(400, 'Validation Error', 'Province is required');
      }
      if (!linkedEntityType || !linkedEntityId) {
        return createErrorResponse(400, 'Validation Error', 'Linked entity (entityType and entityId) is required');
      }
      if (!incidentDetails) {
        return createErrorResponse(400, 'Validation Error', 'Incident details are required');
      }

      // Check if claimNumber already exists (only if provided)
      if (body.claimNumber) {
        const existingClaim = await prisma[modelName].findUnique({
          where: { claimNumber: body.claimNumber },
        });

        if (existingClaim) {
          return createErrorResponse(400, 'Validation Error', 'Claim number already exists');
        }
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
        status: 'new',
        createdById: user.id,
        updatedById: user.id,
      };
    }

    if (entityType === 'wcb_claims') {
      // Generate claim number if not provided
      const claimNumber = body.claimNumber || `WCB-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      entityData = {
        claimNumber,
        wcbClaimNumber: body.wcbClaimNumber || null,
        status: 'new',

        // Incident details (required)
        incidentDate: new Date(body.incidentDate),
        location: body.location || null,
        province: body.province,
        incidentDetails: body.incidentDetails,

        // Generic entity linking (required)
        entityType: body.entityType,
        entityId: body.entityId,

        // Injury details (optional)
        injuryType: body.injuryType || null,
        bodyPartAffected: body.bodyPartAffected || null,
        severityLevel: body.severityLevel || null,

        // Medical information (optional)
        reportedToDoctor: body.reportedToDoctor !== undefined ? body.reportedToDoctor : false,
        firstContactDate: body.firstContactDate ? new Date(body.firstContactDate) : null,
        doctorName: body.doctorName || null,
        doctorPhone: body.doctorPhone || null,
        medicalFacility: body.medicalFacility || null,

        // WCB contact (optional)
        wcbContactName: body.wcbContactName || null,
        wcbContactPhone: body.wcbContactPhone || null,
        wcbContactEmail: body.wcbContactEmail || null,

        // Return to work (optional)
        expectedReturnDate: body.expectedReturnDate ? new Date(body.expectedReturnDate) : null,
        actualReturnDate: body.actualReturnDate ? new Date(body.actualReturnDate) : null,
        lostTimeDays: body.lostTimeDays !== undefined ? parseInt(body.lostTimeDays) : 0,

        // Financial (optional)
        estimatedCost: body.estimatedCost !== undefined ? parseFloat(body.estimatedCost) : null,
        actualCost: body.actualCost !== undefined ? parseFloat(body.actualCost) : null,

        // Notes (optional)
        statusNote: body.statusNote || null,
        remarksComments: body.remarksComments || null,

        // Audit fields
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
            firstName: true,
            lastName: true,
          },
        },
        updatedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // For employees: Create linked User account for portal access (if email provided)
    if (entityType === 'employees' && entity.email) {
      try {
        const portalUser = await prisma.user.create({
          data: {
            email: entity.email.toLowerCase(),
            firstName: entity.firstName || '',
            lastName: entity.lastName || '',
            emailVerified: true,
            isActive: true,
          },
        });

        // Link the user to the employee
        await prisma[modelName].update({
          where: { id: entity.id },
          data: { userId: portalUser.id },
        });

        console.log(`✓ Created portal user account for ${entity.email}`);
      } catch (userError) {
        console.error('Failed to create portal user:', userError);
        // Continue - employee is created, but portal access will need to be set up manually
      }
    }

    // Create activity log with entity-specific display value
    let displayValue = entity.id;
    if (entityType === 'employees') {
      displayValue = `${entity.firstName} ${entity.lastName}`;
    } else if (entityType === 'wcb_claims') {
      displayValue = `Claim ${entity.claimNumber}`;
    }

    await prisma.activityLog.create({
      data: {
        entityType,
        entityId: entity.id,
        actionType: 'created',
        newValue: displayValue,
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
