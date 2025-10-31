/**
 * Employee Activity Log API - Next.js 16
 *
 * GET /api/v1/employees/:id/activity - Get activity log for employee
 *
 * Follows Prisma schema from PRISMA_MIGRATION_PLAN.md
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/v1/employees/:id/activity
 * Get paginated activity log for an employee
 */
export async function GET(request, { params }) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Next.js 16: params is now a Promise
    const { id: employeeId } = await params;

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    // Validate pagination
    if (page < 1 || limit < 1 || limit > 200) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }

    // Verify employee exists
    const employee = await prisma.officeEmployee.findUnique({
      where: { id: employeeId },
    });

    if (!employee || employee.isDeleted) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Calculate skip
    const skip = (page - 1) * limit;

    // Execute queries in parallel
    const [activityLogs, totalCount] = await Promise.all([
      prisma.activityLog.findMany({
        where: {
          employeeId,
        },
        skip,
        take: limit,
        include: {
          performedBy: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.activityLog.count({
        where: { employeeId },
      }),
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return NextResponse.json({
      success: true,
      data: activityLogs,
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
    console.error('Error fetching activity log:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch activity log',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
