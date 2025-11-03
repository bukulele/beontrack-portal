/**
 * Activity History Item API - Next.js 16
 *
 * GET /api/v1/employees/:id/activity-history/:activityId - Get single activity history entry
 * PATCH /api/v1/employees/:id/activity-history/:activityId - Update activity history entry
 * DELETE /api/v1/employees/:id/activity-history/:activityId - Soft delete activity history entry
 *
 * Follows Prisma schema from PRISMA_MIGRATION_PLAN.md
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/v1/employees/:id/activity-history/:activityId
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
    const { id, activityId } = await params;

    // Fetch activity history entry
    const activityHistory = await prisma.activityHistory.findFirst({
      where: {
        id: activityId,
        employeeId: id,
        isDeleted: false,
      },
    });

    if (!activityHistory) {
      return NextResponse.json(
        { error: 'Activity history not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(activityHistory);
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
 * PATCH /api/v1/employees/:id/activity-history/:activityId
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
    const { id, activityId } = await params;

    // Verify activity history entry exists and belongs to employee
    const existing = await prisma.activityHistory.findFirst({
      where: {
        id: activityId,
        employeeId: id,
        isDeleted: false,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Activity history not found' },
        { status: 404 }
      );
    }

    // Parse request body
    const data = await request.json();

    // Build update data object (only include provided fields)
    const updateData = {};

    if (data.activityType !== undefined) updateData.activityType = data.activityType;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.startDate !== undefined) updateData.startDate = new Date(data.startDate);

    // Handle endDate and tillNow
    if (data.tillNow !== undefined) {
      updateData.tillNow = data.tillNow;
      if (data.tillNow) {
        updateData.endDate = null; // Clear endDate if tillNow is true
      }
    }
    if (data.endDate !== undefined && !data.tillNow) {
      updateData.endDate = new Date(data.endDate);
    }

    if (data.organizationName !== undefined) updateData.organizationName = data.organizationName;
    if (data.roleOrPosition !== undefined) updateData.roleOrPosition = data.roleOrPosition;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.emailAddress !== undefined) updateData.emailAddress = data.emailAddress;

    // Update activity history entry
    const activityHistory = await prisma.activityHistory.update({
      where: { id: activityId },
      data: updateData,
    });

    return NextResponse.json(activityHistory);
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
 * DELETE /api/v1/employees/:id/activity-history/:activityId
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
    const { id, activityId } = await params;

    // Verify activity history entry exists and belongs to employee
    const existing = await prisma.activityHistory.findFirst({
      where: {
        id: activityId,
        employeeId: id,
        isDeleted: false,
      },
    });

    if (!existing) {
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

    return NextResponse.json({ message: 'Activity history deleted successfully' });
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
