/**
 * Universal Activity Log API - Next.js 16
 *
 * GET /api/v1/{entityType}/{id}/activity - Get activity log for entity
 *
 * Supports: employees (extensible to trucks, drivers, equipment)
 */

import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Supported entity types
const VALID_ENTITY_TYPES = ['employees'];

// Map entity types to Prisma models
const ENTITY_MODELS = {
  employees: 'officeEmployee',
};

/**
 * GET /api/v1/{entityType}/{id}/activity
 * Get paginated activity log for an entity
 */
export async function GET(request, { params }) {
  try {
    // Next.js 16: params is now a Promise
    const { entityType, id } = await params;

    // Authenticate user
    const session = await getSession(request.headers);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate entity type
    if (!VALID_ENTITY_TYPES.includes(entityType)) {
      return NextResponse.json(
        { error: `Invalid entity type: ${entityType}` },
        { status: 400 }
      );
    }

    const modelName = ENTITY_MODELS[entityType];

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

    // Verify entity exists
    const entity = await prisma[modelName].findUnique({
      where: { id },
    });

    if (!entity || entity.isDeleted) {
      return NextResponse.json(
        { error: `${entityType} not found` },
        { status: 404 }
      );
    }

    // Calculate skip
    const skip = (page - 1) * limit;

    // Execute queries in parallel
    const [activityLogs, totalCount] = await Promise.all([
      prisma.activityLog.findMany({
        where: {
          entityType,
          entityId: id,
        },
        skip,
        take: limit,
        include: {
          performedBy: {
            select: {
              id: true,
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
        where: {
          entityType,
          entityId: id,
        },
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
