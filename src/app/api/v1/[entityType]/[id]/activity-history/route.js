/**
 * Universal Activity History API - Next.js 16
 *
 * GET /api/v1/{entityType}/{id}/activity-history - List all activity history
 * POST /api/v1/{entityType}/{id}/activity-history - Create new activity history entry
 *
 * Note: Activity history is currently employee-specific but uses universal API pattern
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authorizeRequest, authorizeRecordAccess } from '@/lib/api-auth';

// Supported entity types (only employees have activity history for now)
const VALID_ENTITY_TYPES = ['employees'];

// Map entity types to Prisma models
const ENTITY_MODELS = {
  employees: 'officeEmployee',
};

/**
 * GET /api/v1/{entityType}/{id}/activity-history
 * Get all activity history entries for an entity
 */
export async function GET(request, { params }) {
  try {
    // Next.js 16: params is now a Promise
    const { entityType, id } = await params;

    // Validate entity type
    if (!VALID_ENTITY_TYPES.includes(entityType)) {
      return NextResponse.json(
        { error: `Invalid entity type: ${entityType}. Activity history only supports: ${VALID_ENTITY_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    // Authorization: Activity history requires read permission on parent entity
    const authResult = await authorizeRequest(request, entityType, 'read');
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: authResult.error || 'Unauthorized' },
        { status: authResult.status || 401 }
      );
    }

    // Check record-level access (ABAC conditions)
    const recordAuthResult = await authorizeRecordAccess(
      authResult.session,
      entityType,
      'read',
      id
    );
    if (!recordAuthResult.authorized) {
      return NextResponse.json(
        { error: recordAuthResult.error || 'Access denied to this record' },
        { status: 403 }
      );
    }

    const modelName = ENTITY_MODELS[entityType];

    // Verify entity exists
    const entity = await prisma[modelName].findUnique({
      where: { id },
    });

    if (!entity) {
      return NextResponse.json(
        { error: `${entityType} not found` },
        { status: 404 }
      );
    }

    // Fetch activity history (using employeeId since it's employee-specific feature)
    const activityHistory = await prisma.activityHistory.findMany({
      where: {
        employeeId: id,
        isDeleted: false,
      },
      include: {
        reviewedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: [
        { startDate: 'desc' },
        { createdAt: 'desc' },
      ],
    });

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
 * POST /api/v1/{entityType}/{id}/activity-history
 * Create new activity history entry
 */
export async function POST(request, { params }) {
  try {
    // Next.js 16: params is now a Promise
    const { entityType, id } = await params;

    // Validate entity type
    if (!VALID_ENTITY_TYPES.includes(entityType)) {
      return NextResponse.json(
        { error: `Invalid entity type: ${entityType}. Activity history only supports: ${VALID_ENTITY_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    // Authorization: Creating activity history requires update permission
    const authResult = await authorizeRequest(request, entityType, 'update');
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: authResult.error || 'Unauthorized - you do not have permission to create activity history' },
        { status: authResult.status || 401 }
      );
    }

    // Check record-level access (ABAC conditions)
    const recordAuthResult = await authorizeRecordAccess(
      authResult.session,
      entityType,
      'update',
      id
    );
    if (!recordAuthResult.authorized) {
      return NextResponse.json(
        { error: recordAuthResult.error || 'Access denied to create activity history for this record' },
        { status: 403 }
      );
    }

    const modelName = ENTITY_MODELS[entityType];

    // Verify entity exists
    const entity = await prisma[modelName].findUnique({
      where: { id },
    });

    if (!entity) {
      return NextResponse.json(
        { error: `${entityType} not found` },
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

    return NextResponse.json({
      success: true,
      data: activityHistory,
    }, { status: 201 });
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
