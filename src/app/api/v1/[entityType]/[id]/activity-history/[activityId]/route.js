/**
 * Universal Activity History Detail API - Next.js 16
 *
 * GET /api/v1/{entityType}/{id}/activity-history/{activityId} - Get single activity history entry
 * PATCH /api/v1/{entityType}/{id}/activity-history/{activityId} - Update activity history entry
 * DELETE /api/v1/{entityType}/{id}/activity-history/{activityId} - Soft delete activity history entry
 *
 * Note: Activity history is currently employee-specific but uses universal API pattern
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// Supported entity types (only employees have activity history for now)
const VALID_ENTITY_TYPES = ['employees'];

// Map entity types to Prisma models
const ENTITY_MODELS = {
  employees: 'officeEmployee',
};

/**
 * GET /api/v1/{entityType}/{id}/activity-history/{activityId}
 * Get single activity history entry
 */
export async function GET(request, { params }) {
  try {
    // Authenticate user
    // TEMPORARILY DISABLED FOR TESTING
    // const session = await getServerSession(authOptions);
    // if (!session?.user) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }

    // Next.js 16: params is now a Promise
    const { entityType, id, activityId } = await params;

    // Validate entity type
    if (!VALID_ENTITY_TYPES.includes(entityType)) {
      return NextResponse.json(
        { error: `Invalid entity type: ${entityType}` },
        { status: 400 }
      );
    }

    // Verify activity history exists and belongs to this entity
    const activityHistory = await prisma.activityHistory.findUnique({
      where: { id: activityId },
    });

    if (!activityHistory || activityHistory.isDeleted || activityHistory.employeeId !== id) {
      return NextResponse.json(
        { error: 'Activity history not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: activityHistory,
    });
  } catch (error) {
    console.error('Error fetching activity history:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch activity history',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/v1/{entityType}/{id}/activity-history/{activityId}
 * Update activity history entry
 */
export async function PATCH(request, { params }) {
  try {
    // Authenticate user
    // TEMPORARILY DISABLED FOR TESTING
    // const session = await getServerSession(authOptions);
    // if (!session?.user) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }

    // Next.js 16: params is now a Promise
    const { entityType, id, activityId } = await params;

    // Validate entity type
    if (!VALID_ENTITY_TYPES.includes(entityType)) {
      return NextResponse.json(
        { error: `Invalid entity type: ${entityType}` },
        { status: 400 }
      );
    }

    // Verify activity history exists and belongs to this entity
    const existingActivity = await prisma.activityHistory.findUnique({
      where: { id: activityId },
    });

    if (!existingActivity || existingActivity.isDeleted || existingActivity.employeeId !== id) {
      return NextResponse.json(
        { error: 'Activity history not found' },
        { status: 404 }
      );
    }

    // Parse request body
    const data = await request.json();

    // Build update data
    const updateData = {};

    if (data.activityType !== undefined) updateData.activityType = data.activityType;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.startDate !== undefined) updateData.startDate = new Date(data.startDate);
    if (data.endDate !== undefined) updateData.endDate = data.endDate ? new Date(data.endDate) : null;
    if (data.tillNow !== undefined) {
      updateData.tillNow = data.tillNow;
      if (data.tillNow) updateData.endDate = null; // Clear endDate if tillNow is true
    }
    if (data.organizationName !== undefined) updateData.organizationName = data.organizationName;
    if (data.roleOrPosition !== undefined) updateData.roleOrPosition = data.roleOrPosition;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.emailAddress !== undefined) updateData.emailAddress = data.emailAddress;

    // Update activity history
    const updatedActivity = await prisma.activityHistory.update({
      where: { id: activityId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: updatedActivity,
    });
  } catch (error) {
    console.error('Error updating activity history:', error);
    return NextResponse.json(
      {
        error: 'Failed to update activity history',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/{entityType}/{id}/activity-history/{activityId}
 * Soft delete activity history entry
 */
export async function DELETE(request, { params }) {
  try {
    // Authenticate user
    // TEMPORARILY DISABLED FOR TESTING
    // const session = await getServerSession(authOptions);
    // if (!session?.user) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }

    // Next.js 16: params is now a Promise
    const { entityType, id, activityId } = await params;

    // Validate entity type
    if (!VALID_ENTITY_TYPES.includes(entityType)) {
      return NextResponse.json(
        { error: `Invalid entity type: ${entityType}` },
        { status: 400 }
      );
    }

    // Verify activity history exists and belongs to this entity
    const existingActivity = await prisma.activityHistory.findUnique({
      where: { id: activityId },
    });

    if (!existingActivity || existingActivity.isDeleted || existingActivity.employeeId !== id) {
      return NextResponse.json(
        { error: 'Activity history not found' },
        { status: 404 }
      );
    }

    // Soft delete
    await prisma.activityHistory.update({
      where: { id: activityId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Activity history deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting activity history:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete activity history',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
