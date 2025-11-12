/**
 * Single Time Entry API - Next.js 16
 *
 * GET    /api/v1/{entityType}/{id}/time-entries/{entryId} - Get single time entry
 * PATCH  /api/v1/{entityType}/{id}/time-entries/{entryId} - Update time entry (creates amendment)
 * DELETE /api/v1/{entityType}/{id}/time-entries/{entryId} - Soft delete time entry
 *
 * Amendment tracking: All updates create TimeAmendment records for audit trail
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  authorizeRequest,
  authorizeRecordAccess,
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
 * GET /api/v1/{entityType}/{id}/time-entries/{entryId}
 * Get a single time entry with full details
 */
export async function GET(request, { params }) {
  try {
    // Next.js 16: params is now a Promise
    const { entityType, id, entryId } = await params;

    // Validate entity type
    if (!VALID_ENTITY_TYPES.includes(entityType)) {
      return createErrorResponse(400, 'Bad Request', `Invalid entity type: ${entityType}`);
    }

    // Authorize request
    const authResult = await authorizeRequest(request, entityType, 'read');
    if (authResult.error) {
      return authResult.response;
    }

    const { checker } = authResult;
    const modelName = ENTITY_MODELS[entityType];

    // Verify entity exists and user has access
    const entity = await prisma[modelName].findUnique({
      where: { id, isDeleted: false },
    });

    const recordAuth = await authorizeRecordAccess(checker, 'read', entityType, entity);
    if (recordAuth.error) {
      return recordAuth.response;
    }

    // Fetch time entry
    const timeEntry = await prisma.timeEntry.findUnique({
      where: {
        id: entryId,
        entityType,
        entityId: id,
        isDeleted: false,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        breaks: {
          where: { isDeleted: false },
          include: {
            createdBy: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { startTime: 'asc' },
        },
        amendments: {
          include: {
            createdBy: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
              },
            },
            approvedBy: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        approvals: {
          include: {
            decidedBy: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { decidedAt: 'desc' },
        },
      },
    });

    if (!timeEntry) {
      return createErrorResponse(404, 'Not Found', 'Time entry not found');
    }

    return createSuccessResponse(timeEntry);

  } catch (error) {
    console.error('Error fetching time entry:', error);
    return createErrorResponse(500, 'Internal Server Error', 'Failed to fetch time entry', error.message);
  }
}

/**
 * PATCH /api/v1/{entityType}/{id}/time-entries/{entryId}
 * Update a time entry (creates amendment for audit trail)
 *
 * Body:
 * - clockInTime: ISO 8601 timestamp
 * - clockOutTime: ISO 8601 timestamp
 * - timezone: IANA timezone string
 * - entryType: TimeEntryType enum
 * - status: TimeEntryStatus enum
 * - amendmentReason: string (required for changes after submission)
 */
export async function PATCH(request, { params }) {
  try {
    // Next.js 16: params is now a Promise
    const { entityType, id, entryId } = await params;

    // Validate entity type
    if (!VALID_ENTITY_TYPES.includes(entityType)) {
      return createErrorResponse(400, 'Bad Request', `Invalid entity type: ${entityType}`);
    }

    // Authorize request
    const authResult = await authorizeRequest(request, entityType, 'update');
    if (authResult.error) {
      return authResult.response;
    }

    const { checker, user } = authResult;
    const modelName = ENTITY_MODELS[entityType];

    // Verify entity exists and user has access
    const entity = await prisma[modelName].findUnique({
      where: { id, isDeleted: false },
    });

    const recordAuth = await authorizeRecordAccess(checker, 'update', entityType, entity);
    if (recordAuth.error) {
      return recordAuth.response;
    }

    // Fetch existing time entry
    const existingEntry = await prisma.timeEntry.findUnique({
      where: {
        id: entryId,
        entityType,
        entityId: id,
        isDeleted: false,
      },
    });

    if (!existingEntry) {
      return createErrorResponse(404, 'Not Found', 'Time entry not found');
    }

    // Check if entry is locked (pay period closed)
    if (existingEntry.status === 'locked') {
      return createErrorResponse(403, 'Forbidden', 'Cannot modify locked time entry (pay period closed)');
    }

    // Parse update data
    const updates = await request.json();

    // Validate clock times if being updated
    if (updates.clockInTime && updates.clockOutTime) {
      const clockIn = new Date(updates.clockInTime);
      const clockOut = new Date(updates.clockOutTime);

      if (clockOut <= clockIn) {
        return createErrorResponse(400, 'Validation Error', 'Clock-out time must be after clock-in time');
      }
    }

    // Track changes for amendments
    const changes = [];
    const updateData = {};

    // Fields that can be updated
    const updatableFields = [
      'clockInTime',
      'clockOutTime',
      'timezone',
      'clockInLocation',
      'clockOutLocation',
      'entryType',
      'workType',
      'projectId',
      'departmentCode',
      'costCenter',
      'status',
    ];

    for (const field of updatableFields) {
      if (field in updates && updates[field] !== existingEntry[field]) {
        changes.push({
          field,
          oldValue: existingEntry[field]?.toString() || null,
          newValue: updates[field]?.toString() || null,
        });

        // Handle date fields
        if (field === 'clockInTime' || field === 'clockOutTime') {
          updateData[field] = updates[field] ? new Date(updates[field]) : null;
        } else {
          updateData[field] = updates[field];
        }
      }
    }

    // Recalculate total minutes if times changed
    if ('clockInTime' in updateData || 'clockOutTime' in updateData) {
      const newClockIn = updateData.clockInTime || existingEntry.clockInTime;
      const newClockOut = updateData.clockOutTime || existingEntry.clockOutTime;

      if (newClockIn && newClockOut) {
        const clockIn = new Date(newClockIn);
        const clockOut = new Date(newClockOut);
        updateData.totalMinutes = Math.round((clockOut - clockIn) / 60000);
      }
    }

    // If no changes, return early
    if (changes.length === 0) {
      return createSuccessResponse(existingEntry, {
        message: 'No changes detected',
      });
    }

    // Require amendment reason for submitted/approved entries
    if (
      existingEntry.status !== 'draft' &&
      !updates.amendmentReason
    ) {
      return createErrorResponse(400, 'Validation Error', 'Amendment reason is required for submitted/approved entries');
    }

    // Update time entry and create amendments in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update the time entry
      const updatedEntry = await tx.timeEntry.update({
        where: { id: entryId },
        data: updateData,
        include: {
          createdBy: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      // Create amendment records
      const amendments = await Promise.all(
        changes.map((change) =>
          tx.timeAmendment.create({
            data: {
              timeEntryId: entryId,
              amendmentType: 'time_correction',
              fieldChanged: change.field,
              oldValue: change.oldValue,
              newValue: change.newValue,
              reason: updates.amendmentReason || 'Updated via API',
              requiresApproval: existingEntry.status !== 'draft',
              createdById: user.id,
            },
          })
        )
      );

      return { updatedEntry, amendments };
    });

    return createSuccessResponse(result.updatedEntry, {
      message: 'Time entry updated successfully',
      amendmentsCreated: result.amendments.length,
    });

  } catch (error) {
    console.error('Error updating time entry:', error);
    return createErrorResponse(500, 'Internal Server Error', 'Failed to update time entry', error.message);
  }
}

/**
 * DELETE /api/v1/{entityType}/{id}/time-entries/{entryId}
 * Soft delete a time entry
 */
export async function DELETE(request, { params }) {
  try {
    // Next.js 16: params is now a Promise
    const { entityType, id, entryId } = await params;

    // Validate entity type
    if (!VALID_ENTITY_TYPES.includes(entityType)) {
      return createErrorResponse(400, 'Bad Request', `Invalid entity type: ${entityType}`);
    }

    // Authorize request
    const authResult = await authorizeRequest(request, entityType, 'delete');
    if (authResult.error) {
      return authResult.response;
    }

    const { checker } = authResult;
    const modelName = ENTITY_MODELS[entityType];

    // Verify entity exists and user has access
    const entity = await prisma[modelName].findUnique({
      where: { id, isDeleted: false },
    });

    const recordAuth = await authorizeRecordAccess(checker, 'delete', entityType, entity);
    if (recordAuth.error) {
      return recordAuth.response;
    }

    // Fetch time entry
    const timeEntry = await prisma.timeEntry.findUnique({
      where: {
        id: entryId,
        entityType,
        entityId: id,
        isDeleted: false,
      },
    });

    if (!timeEntry) {
      return createErrorResponse(404, 'Not Found', 'Time entry not found');
    }

    // Check if entry is locked
    if (timeEntry.status === 'locked') {
      return createErrorResponse(403, 'Forbidden', 'Cannot delete locked time entry (pay period closed)');
    }

    // Soft delete the time entry
    await prisma.timeEntry.update({
      where: { id: entryId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    return createSuccessResponse(null, {
      message: 'Time entry deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting time entry:', error);
    return createErrorResponse(500, 'Internal Server Error', 'Failed to delete time entry', error.message);
  }
}
