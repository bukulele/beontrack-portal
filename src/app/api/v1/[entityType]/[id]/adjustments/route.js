/**
 * Hours Adjustments API - Next.js 16
 *
 * GET  /api/v1/{entityType}/{id}/adjustments - List adjustments for entity
 * POST /api/v1/{entityType}/{id}/adjustments - Create new adjustment
 *
 * Manual hours adjustments for corrections, comp time, PTO, etc.
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
 * GET /api/v1/{entityType}/{id}/adjustments
 * List hours adjustments for an entity
 *
 * Query params:
 * - payPeriodStart: Filter by pay period start date (YYYY-MM-DD)
 * - startDate: Filter by range start
 * - endDate: Filter by range end
 */
export async function GET(request, { params }) {
  try {
    // Next.js 16: params is now a Promise
    const { entityType, id } = await params;

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

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const payPeriodStart = searchParams.get('payPeriodStart');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build where clause
    const whereClause = {
      entityType,
      entityId: id,
      isDeleted: false,
    };

    // Add date filters
    if (payPeriodStart) {
      whereClause.payPeriodStart = new Date(payPeriodStart);
    } else if (startDate && endDate) {
      whereClause.payPeriodStart = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    // Fetch adjustments
    const adjustments = await prisma.hoursAdjustment.findMany({
      where: whereClause,
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    return createSuccessResponse(adjustments, {
      count: adjustments.length,
    });

  } catch (error) {
    console.error('Error fetching adjustments:', error);
    return createErrorResponse(500, 'Internal Server Error', 'Failed to fetch adjustments', error.message);
  }
}

/**
 * POST /api/v1/{entityType}/{id}/adjustments
 * Create a new hours adjustment
 *
 * Body (JSON):
 * - payPeriodStart: Date (required) - YYYY-MM-DD
 * - payPeriodEnd: Date (required) - YYYY-MM-DD
 * - hours: Float (required) - Can be positive or negative
 * - reason: String (required)
 * - adjustmentType: AdjustmentType enum (required)
 * - referenceNumber: String (optional)
 */
export async function POST(request, { params }) {
  try {
    // Next.js 16: params is now a Promise
    const { entityType, id } = await params;

    // Validate entity type
    if (!VALID_ENTITY_TYPES.includes(entityType)) {
      return createErrorResponse(400, 'Bad Request', `Invalid entity type: ${entityType}`);
    }

    // Authorize request - typically only payroll/admin can create adjustments
    const authResult = await authorizeRequest(request, entityType, 'create');
    if (authResult.error) {
      return authResult.response;
    }

    const { checker, user } = authResult;
    const modelName = ENTITY_MODELS[entityType];

    // Verify entity exists and user has access
    const entity = await prisma[modelName].findUnique({
      where: { id, isDeleted: false },
    });

    const recordAuth = await authorizeRecordAccess(checker, 'create', entityType, entity);
    if (recordAuth.error) {
      return recordAuth.response;
    }

    // Parse request body
    const data = await request.json();

    // Validate required fields
    if (!data.payPeriodStart) {
      return createErrorResponse(400, 'Validation Error', 'Pay period start is required');
    }

    if (!data.payPeriodEnd) {
      return createErrorResponse(400, 'Validation Error', 'Pay period end is required');
    }

    if (data.hours === undefined || data.hours === null) {
      return createErrorResponse(400, 'Validation Error', 'Hours value is required');
    }

    if (!data.reason) {
      return createErrorResponse(400, 'Validation Error', 'Reason is required');
    }

    if (!data.adjustmentType) {
      return createErrorResponse(400, 'Validation Error', 'Adjustment type is required');
    }

    // Validate hours is a number
    const hours = parseFloat(data.hours);
    if (isNaN(hours)) {
      return createErrorResponse(400, 'Validation Error', 'Hours must be a valid number');
    }

    // Create adjustment
    const adjustment = await prisma.hoursAdjustment.create({
      data: {
        entityType,
        entityId: id,
        payPeriodStart: new Date(data.payPeriodStart),
        payPeriodEnd: new Date(data.payPeriodEnd),
        hours,
        reason: data.reason,
        adjustmentType: data.adjustmentType,
        referenceNumber: data.referenceNumber || null,
        isApproved: false, // Requires approval
        createdById: user.id,
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
      },
    });

    return createSuccessResponse(adjustment, {
      message: 'Hours adjustment created successfully',
    }, 201);

  } catch (error) {
    console.error('Error creating adjustment:', error);
    return createErrorResponse(500, 'Internal Server Error', 'Failed to create adjustment', error.message);
  }
}
