/**
 * Employees API - Next.js 16
 *
 * GET /api/v1/employees - List employees with filtering and pagination
 * POST /api/v1/employees - Create new employee
 *
 * Follows Prisma schema from PRISMA_MIGRATION_PLAN.md
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/v1/employees
 * List employees with filtering, pagination, and sorting
 */
export async function GET(request) {
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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const department = searchParams.get('department');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Validate pagination
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }

    // Build where clause
    const where = {
      isDeleted: false,
    };

    // Search filter (firstName, lastName, email, employeeId)
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { employeeId: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Status filter
    if (status) {
      where.status = status;
    }

    // Department filter
    if (department) {
      where.department = { contains: department, mode: 'insensitive' };
    }

    // Build orderBy clause
    const orderBy = {
      [sortBy]: sortOrder,
    };

    // Calculate skip
    const skip = (page - 1) * limit;

    // Execute queries in parallel
    const [employees, totalCount] = await Promise.all([
      prisma.officeEmployee.findMany({
        where,
        skip,
        take: limit,
        orderBy,
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
          _count: {
            select: {
              documents: true,
              activityLogs: true,
            },
          },
        },
      }),
      prisma.officeEmployee.count({ where }),
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return NextResponse.json({
      success: true,
      data: employees,
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
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch employees',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/employees
 * Create a new employee
 */
export async function POST(request) {
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

    // Parse request body
    const body = await request.json();

    // Validate required fields
    const { employeeId, firstName, lastName } = body;
    if (!employeeId || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields: employeeId, firstName, lastName' },
        { status: 400 }
      );
    }

    // Check if employeeId already exists
    const existingEmployee = await prisma.officeEmployee.findUnique({
      where: { employeeId },
    });

    if (existingEmployee) {
      return NextResponse.json(
        { error: 'Employee ID already exists' },
        { status: 400 }
      );
    }

    // Find or create user record for testing (normally from session)
    // TEMPORARILY USING HARDCODED EMAIL FOR TESTING
    let user = await prisma.user.findUnique({
      where: { email: 'test@example.com' },
    });

    if (!user) {
      // Create a new user if not found (for development)
      user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          username: 'testuser',
          passwordHash: '', // Empty for OAuth users
          firstName: 'Test',
          lastName: 'User',
        },
      });
    }

    // Create employee
    const employee = await prisma.officeEmployee.create({
      data: {
        employeeId,
        firstName,
        lastName,
        email: body.email || null,
        phoneNumber: body.phoneNumber || null,
        emergencyContactName: body.emergencyContactName || null,
        emergencyContactPhone: body.emergencyContactPhone || null,
        addressLine1: body.addressLine1 || null,
        addressLine2: body.addressLine2 || null,
        city: body.city || null,
        stateProvince: body.stateProvince || null,
        postalCode: body.postalCode || null,
        country: body.country || null,
        hireDate: body.hireDate ? new Date(body.hireDate) : null,
        terminationDate: body.terminationDate ? new Date(body.terminationDate) : null,
        jobTitle: body.jobTitle || null,
        department: body.department || null,
        employmentType: body.employmentType || null,
        officeLocation: body.officeLocation || null,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
        status: body.status || 'new',
        createdById: user.id,
        updatedById: user.id,
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

    // Create activity log
    await prisma.activityLog.create({
      data: {
        employeeId: employee.id,
        actionType: 'created',
        newValue: `${firstName} ${lastName}`,
        performedById: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      data: employee,
      message: 'Employee created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json(
      {
        error: 'Failed to create employee',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
