/**
 * Time Entries API - Next.js 16
 *
 * GET  /api/v1/{entityType}/{id}/time-entries - List time entries for entity
 * POST /api/v1/{entityType}/{id}/time-entries - Create new time entry
 *
 * Supports: employees, drivers, contractors
 * Universal time tracking with timezone and GPS support
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
 * GET /api/v1/{entityType}/{id}/time-entries
 * List time entries for an entity with optional filters
 *
 * Query params:
 * - year: Filter by year (e.g., 2025)
 * - startDate: Filter by start date (YYYY-MM-DD)
 * - endDate: Filter by end date (YYYY-MM-DD)
 * - status: Filter by status (draft, submitted, approved, etc.)
 */
export async function GET(request, { params }) {
  try {
    // Next.js 16: params is now a Promise
    const { entityType, id } = await params;

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
    const year = searchParams.get('year');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const status = searchParams.get('status');

    // Build where clause
    const whereClause = {
      entityType,
      entityId: id,
      isDeleted: false,
    };

    // Add date filters
    if (year) {
      const yearInt = parseInt(year);
      whereClause.clockInTime = {
        gte: new Date(`${yearInt}-01-01T00:00:00Z`),
        lt: new Date(`${yearInt + 1}-01-01T00:00:00Z`),
      };
    } else if (startDate && endDate) {
      whereClause.clockInTime = {
        gte: new Date(`${startDate}T00:00:00Z`),
        lte: new Date(`${endDate}T23:59:59Z`),
      };
    } else if (startDate) {
      whereClause.clockInTime = {
        gte: new Date(`${startDate}T00:00:00Z`),
      };
    } else if (endDate) {
      whereClause.clockInTime = {
        lte: new Date(`${endDate}T23:59:59Z`),
      };
    }

    // Add status filter
    if (status) {
      whereClause.status = status;
    }

    // Fetch time entries
    const timeEntries = await prisma.timeEntry.findMany({
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
        breaks: {
          where: { isDeleted: false },
          orderBy: { startTime: 'asc' },
        },
        amendments: {
          orderBy: { createdAt: 'desc' },
          take: 5, // Last 5 amendments
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
      orderBy: {
        clockInTime: 'desc',
      },
    });

    return createSuccessResponse(timeEntries, {
      count: timeEntries.length,
    });

  } catch (error) {
    console.error('Error fetching time entries:', error);
    return createErrorResponse(500, 'Internal Server Error', 'Failed to fetch time entries', error.message);
  }
}

/**
 * POST /api/v1/{entityType}/{id}/time-entries
 * Create a new time entry
 *
 * Body (JSON or FormData):
 * - clockInTime: ISO 8601 timestamp (required)
 * - clockOutTime: ISO 8601 timestamp (optional)
 * - timezone: IANA timezone string (required)
 * - entryType: TimeEntryType enum (default: regular_work)
 * - entrySource: EntrySource enum (default: web_portal)
 * - clockInLocation: JSON object { lat, lon, address, ipAddress, deviceId }
 * - clockOutLocation: JSON object { lat, lon, address, ipAddress, deviceId }
 * - workType: string (optional)
 * - projectId: UUID (optional)
 * - departmentCode: string (optional)
 * - costCenter: string (optional)
 */
export async function POST(request, { params }) {
  try {
    // Next.js 16: params is now a Promise
    const { entityType, id } = await params;

    // Validate entity type
    if (!VALID_ENTITY_TYPES.includes(entityType)) {
      return createErrorResponse(400, 'Bad Request', `Invalid entity type: ${entityType}`);
    }

    // Authorize request - check if user can 'create' time entries for this entity type
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

    // Parse request body (handle both JSON and FormData)
    let data;
    const contentType = request.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      data = await request.json();
    } else if (contentType?.includes('multipart/form-data') || contentType?.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      data = {};
      for (const [key, value] of formData.entries()) {
        // Parse JSON fields
        if (key === 'clockInLocation' || key === 'clockOutLocation') {
          try {
            data[key] = JSON.parse(value);
          } catch {
            data[key] = null;
          }
        } else {
          data[key] = value;
        }
      }
    } else {
      data = await request.json();
    }

    // Validate required fields
    if (!data.clockInTime) {
      return createErrorResponse(400, 'Validation Error', 'Clock-in time is required');
    }

    if (!data.timezone) {
      return createErrorResponse(400, 'Validation Error', 'Timezone is required');
    }

    // Validate clock-out time if provided
    if (data.clockOutTime) {
      const clockIn = new Date(data.clockInTime);
      const clockOut = new Date(data.clockOutTime);

      if (clockOut <= clockIn) {
        return createErrorResponse(400, 'Validation Error', 'Clock-out time must be after clock-in time');
      }
    }

    // Calculate total minutes if clock-out provided
    let totalMinutes = null;
    if (data.clockOutTime) {
      const clockIn = new Date(data.clockInTime);
      const clockOut = new Date(data.clockOutTime);
      totalMinutes = Math.round((clockOut - clockIn) / 60000); // Convert ms to minutes
    }

    // Create time entry
    const timeEntry = await prisma.timeEntry.create({
      data: {
        entityType,
        entityId: id,
        clockInTime: new Date(data.clockInTime),
        clockOutTime: data.clockOutTime ? new Date(data.clockOutTime) : null,
        timezone: data.timezone,
        clockInLocation: data.clockInLocation || null,
        clockOutLocation: data.clockOutLocation || null,
        entryType: data.entryType || 'regular_work',
        entrySource: data.entrySource || 'web_portal',
        workType: data.workType || null,
        projectId: data.projectId || null,
        departmentCode: data.departmentCode || null,
        costCenter: data.costCenter || null,
        status: 'draft',
        totalMinutes,
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

    // Auto-create break if configured
    if (data.autoBreakDeduction && totalMinutes && totalMinutes >= 300) {
      // If shift >= 5 hours, auto-deduct 30-minute meal break
      await prisma.timeBreak.create({
        data: {
          timeEntryId: timeEntry.id,
          startTime: new Date(data.clockInTime), // Placeholder
          endTime: new Date(new Date(data.clockInTime).getTime() + 30 * 60000), // 30 min later
          breakType: 'meal_break',
          isPaid: false,
          isAutoDeducted: true,
          createdById: user.id,
        },
      });
    }

    return createSuccessResponse(timeEntry, {
      message: 'Time entry created successfully',
    }, 201);

  } catch (error) {
    console.error('Error creating time entry:', error);
    return createErrorResponse(500, 'Internal Server Error', 'Failed to create time entry', error.message);
  }
}
