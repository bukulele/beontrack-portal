/**
 * Universal Entity Detail API - Next.js 16
 *
 * GET /api/v1/{entityType}/{id} - Get single entity with relations
 * PATCH /api/v1/{entityType}/{id} - Update entity
 * DELETE /api/v1/{entityType}/{id} - Soft delete entity
 *
 * Supports: employees (extensible to trucks, drivers, equipment)
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  authorizeRequest,
  authorizeRecordAccess,
  authorizeFieldAccess,
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
 * GET /api/v1/{entityType}/{id}
 * Get single entity with all relations and ABAC field filtering
 */
export async function GET(request, { params }) {
  // Next.js 16: params is now a Promise
  const { entityType, id } = await params;

  try {
    // Validate entity type
    if (!VALID_ENTITY_TYPES.includes(entityType)) {
      return createErrorResponse(400, 'Bad Request', `Invalid entity type: ${entityType}`);
    }

    // Authorize request - check if user can 'read' this entity type
    const authResult = await authorizeRequest(request, entityType, 'read');
    if (authResult.error) {
      return authResult.response;
    }

    const { checker } = authResult;
    const modelName = ENTITY_MODELS[entityType];

    // Fetch entity with relations
    const entity = await prisma[modelName].findUnique({
      where: { id },
      include: {
        profilePhoto: {
          select: {
            id: true,
            filePath: true,
            fileName: true,
            mimeType: true,
            fileSize: true,
            createdAt: true,
            uploadedBy: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        activityHistory: {
          where: { isDeleted: false },
          include: {
            reviewedBy: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: [
            { startDate: 'desc' },
            { createdAt: 'desc' },
          ],
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
    });

    // Check if entity exists and not soft-deleted
    if (!entity || entity.isDeleted) {
      return createErrorResponse(404, 'Not Found', `${entityType} not found`);
    }

    // Check if user can access this specific record (ABAC)
    const recordAuth = await authorizeRecordAccess(checker, 'read', entityType, entity);
    if (recordAuth.error) {
      return recordAuth.response;
    }

    // Fetch documents manually using entityType + entityId
    const documents = await prisma.document.findMany({
      where: {
        entityType,
        entityId: id,
        isDeleted: false,
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        reviewedBy: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Fetch activity logs manually using entityType + entityId
    const activityLogs = await prisma.activityLog.findMany({
      where: {
        entityType,
        entityId: id,
      },
      include: {
        performedBy: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Latest 50 activity logs
    });

    // Group documents by documentType for checklist consumption
    const groupedDocuments = {};
    documents.forEach(doc => {
      if (!groupedDocuments[doc.documentType]) {
        groupedDocuments[doc.documentType] = [];
      }
      groupedDocuments[doc.documentType].push(doc);
    });

    // Combine entity data with manually fetched relations
    const entityData = {
      ...entity,
      documents: undefined, // Remove if exists
      activityLogs,
      ...groupedDocuments, // Spread grouped documents at top level
    };

    // Apply field-level filtering
    const filteredData = applyFieldFiltering(checker, 'read', entityType, entityData);

    return createSuccessResponse(filteredData);
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
 * PATCH /api/v1/{entityType}/{id}
 * Update entity with field-level change tracking and ABAC checks
 */
export async function PATCH(request, { params }) {
  // Next.js 16: params is now a Promise
  const { entityType, id } = await params;

  try {
    // Validate entity type
    if (!VALID_ENTITY_TYPES.includes(entityType)) {
      return createErrorResponse(400, 'Bad Request', `Invalid entity type: ${entityType}`);
    }

    // Authorize request - check if user can 'update' this entity type
    const authResult = await authorizeRequest(request, entityType, 'update');
    if (authResult.error) {
      return authResult.response;
    }

    const { checker, user } = authResult;
    const modelName = ENTITY_MODELS[entityType];

    // Parse request body
    const body = await request.json();

    // Fetch current entity data for change tracking
    const currentEntity = await prisma[modelName].findUnique({
      where: { id },
    });

    if (!currentEntity || currentEntity.isDeleted) {
      return createErrorResponse(404, 'Not Found', `${entityType} not found`);
    }

    // Check if user can access this specific record (ABAC)
    const recordAuth = await authorizeRecordAccess(checker, 'update', entityType, currentEntity);
    if (recordAuth.error) {
      return recordAuth.response;
    }

    // Check if user can update the specific fields being changed
    const fieldsToUpdate = Object.keys(body);
    const fieldAuth = await authorizeFieldAccess(checker, 'update', entityType, fieldsToUpdate);
    if (fieldAuth.error) {
      return fieldAuth.response;
    }

    // Check if employeeId is being changed and if it conflicts (for employees)
    if (entityType === 'employees' && body.employeeId && body.employeeId !== currentEntity.employeeId) {
      const existingEntity = await prisma[modelName].findUnique({
        where: { employeeId: body.employeeId },
      });

      if (existingEntity) {
        return createErrorResponse(400, 'Validation Error', 'Employee ID already exists');
      }
    }

    // Prepare update data
    const updateData = {
      updatedById: user.id,
    };

    // Map of updatable fields (specific to employees for now)
    const fieldMapping = entityType === 'employees' ? {
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
      statusNote: 'statusNote',
      remarksComments: 'remarksComments',
      reasonForLeaving: 'reasonForLeaving',
      dateOfLeaving: 'dateOfLeaving',
      profilePhotoId: 'profilePhotoId',
    } : {};

    // Track changes and build update data
    const activityLogs = [];

    for (const [bodyKey, dbKey] of Object.entries(fieldMapping)) {
      if (bodyKey in body) {
        let newValue = body[bodyKey];
        let oldValue = currentEntity[dbKey];

        // Handle date fields
        if (['hireDate', 'terminationDate', 'dateOfBirth', 'dateOfLeaving'].includes(dbKey)) {
          newValue = newValue ? new Date(newValue) : null;
          oldValue = oldValue ? oldValue.toISOString().split('T')[0] : null;
        }

        // Only update if value changed
        if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
          updateData[dbKey] = newValue;

          // Create activity log entry
          activityLogs.push({
            entityType,
            entityId: id,
            actionType: 'updated',
            fieldName: dbKey,
            oldValue: oldValue ? String(oldValue) : null,
            newValue: newValue ? String(newValue) : null,
            performedById: user.id,
          });
        }
      }
    }

    // Update entity
    const updatedEntity = await prisma[modelName].update({
      where: { id },
      data: updateData,
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
    });

    // Create activity log entries
    if (activityLogs.length > 0) {
      await prisma.activityLog.createMany({
        data: activityLogs,
      });
    }

    return createSuccessResponse(updatedEntity, {
      message: `${entityType} updated successfully`,
      changesCount: activityLogs.length,
    });
  } catch (error) {
    console.error(`Error updating ${entityType}:`, error);
    return createErrorResponse(
      500,
      'Internal Server Error',
      `Failed to update ${entityType}`,
      { details: process.env.NODE_ENV === 'development' ? error.message : undefined }
    );
  }
}

/**
 * DELETE /api/v1/{entityType}/{id}
 * Soft delete entity with authorization
 */
export async function DELETE(request, { params }) {
  // Next.js 16: params is now a Promise
  const { entityType, id } = await params;

  try {
    // Validate entity type
    if (!VALID_ENTITY_TYPES.includes(entityType)) {
      return createErrorResponse(400, 'Bad Request', `Invalid entity type: ${entityType}`);
    }

    // Authorize request - check if user can 'delete' this entity type
    const authResult = await authorizeRequest(request, entityType, 'delete');
    if (authResult.error) {
      return authResult.response;
    }

    const { checker, user } = authResult;
    const modelName = ENTITY_MODELS[entityType];

    // Check if entity exists
    const entity = await prisma[modelName].findUnique({
      where: { id },
    });

    if (!entity || entity.isDeleted) {
      return createErrorResponse(404, 'Not Found', `${entityType} not found`);
    }

    // Check if user can access this specific record (ABAC)
    const recordAuth = await authorizeRecordAccess(checker, 'delete', entityType, entity);
    if (recordAuth.error) {
      return recordAuth.response;
    }

    // Soft delete entity
    await prisma[modelName].update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    // Create activity log
    await prisma.activityLog.create({
      data: {
        entityType,
        entityId: id,
        actionType: 'deleted',
        newValue: entityType === 'employees' ? `${entity.firstName} ${entity.lastName}` : entity.id,
        performedById: user.id,
      },
    });

    return createSuccessResponse(null, {
      message: `${entityType} deleted successfully`,
    });
  } catch (error) {
    console.error(`Error deleting ${entityType}:`, error);
    return createErrorResponse(
      500,
      'Internal Server Error',
      `Failed to delete ${entityType}`,
      { details: process.env.NODE_ENV === 'development' ? error.message : undefined }
    );
  }
}
