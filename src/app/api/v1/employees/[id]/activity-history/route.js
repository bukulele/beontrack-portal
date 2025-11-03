/**
 * Activity History API - Next.js 16
 *
 * GET /api/v1/employees/:id/activity-history - List all activity history for an employee
 * POST /api/v1/employees/:id/activity-history - Create new activity history entry
 *
 * Follows Prisma schema from PRISMA_MIGRATION_PLAN.md
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/v1/employees/:id/activity-history
 * Get all activity history entries for an employee
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
    const { id } = await params;

    // Verify employee exists
    const employee = await prisma.officeEmployee.findUnique({
      where: { id },
    });

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Fetch activity history
    const activityHistory = await prisma.activityHistory.findMany({
      where: {
        employeeId: id,
        isDeleted: false,
      },
      orderBy: [
        { startDate: 'desc' },
        { createdAt: 'desc' },
      ],
    });

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
 * POST /api/v1/employees/:id/activity-history
 * Create new activity history entry
 */
export async function POST(request, { params }) {
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
    const { id } = await params;

    // Verify employee exists
    const employee = await prisma.officeEmployee.findUnique({
      where: { id },
    });

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Parse request body
    const data = await request.json();

    // Validate required fields
    if (!data.activityType) {
      return NextResponse.json(
        { error: 'activityType is required' },
        { status: 400 }
      );
    }

    if (!data.startDate) {
      return NextResponse.json(
        { error: 'startDate is required' },
        { status: 400 }
      );
    }

    // Create activity history entry
    const activityHistory = await prisma.activityHistory.create({
      data: {
        employeeId: id,
        activityType: data.activityType,
        description: data.description || null,
        startDate: new Date(data.startDate),
        endDate: data.endDate && !data.tillNow ? new Date(data.endDate) : null,
        tillNow: data.tillNow || false,
        organizationName: data.organizationName || null,
        roleOrPosition: data.roleOrPosition || null,
        location: data.location || null,
        emailAddress: data.emailAddress || null,
      },
    });

    return NextResponse.json(activityHistory, { status: 201 });
  } catch (error) {
    console.error('Error creating activity history:', error);
    return NextResponse.json(
      {
        error: 'Failed to create activity history',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
