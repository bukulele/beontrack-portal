/**
 * Employee Detail API - Next.js 16
 *
 * GET /api/v1/employees/:id - Get single employee with relations
 * PATCH /api/v1/employees/:id - Update employee
 * DELETE /api/v1/employees/:id - Soft delete employee
 *
 * Follows Prisma schema from PRISMA_MIGRATION_PLAN.md
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/v1/employees/:id
 * Get single employee with all relations
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
    const { id } = await params;

    // Fetch employee with relations
    const employee = await prisma.officeEmployee.findUnique({
      where: { id },
      include: {
        profilePhoto: {
          select: {
            id: true,
            filePath: true,
            fileName: true,
            mimeType: true,
          },
        },
        documents: {
          where: { isDeleted: false },
          include: {
            uploadedBy: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
              },
            },
            reviewedBy: {
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
        },
        activityLogs: {
          include: {
            performedBy: {
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
          take: 50, // Latest 50 activity logs
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
      },
    });

    // Check if employee exists and not soft-deleted
    if (!employee || employee.isDeleted) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: employee,
    });
  } catch (error) {
    console.error('Error fetching employee:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch employee',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/v1/employees/:id
 * Update employee with field-level change tracking
 */
export async function PATCH(request, { params }) {
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
    const { id } = await params;

    // Parse request body
    const body = await request.json();

    // Fetch current employee data for change tracking
    const currentEmployee = await prisma.officeEmployee.findUnique({
      where: { id },
    });

    if (!currentEmployee || currentEmployee.isDeleted) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Check if employeeId is being changed and if it conflicts
    if (body.employeeId && body.employeeId !== currentEmployee.employeeId) {
      const existingEmployee = await prisma.officeEmployee.findUnique({
        where: { employeeId: body.employeeId },
      });

      if (existingEmployee) {
        return NextResponse.json(
          { error: 'Employee ID already exists' },
          { status: 400 }
        );
      }
    }

    // Find or create user record for the session user
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          username: session.user.email.split('@')[0],
          passwordHash: '',
          firstName: session.user.name?.split(' ')[0] || '',
          lastName: session.user.name?.split(' ').slice(1).join(' ') || '',
        },
      });
    }

    // Prepare update data
    const updateData = {
      updatedById: user.id,
    };

    // Map of updatable fields (from Prisma schema)
    const fieldMapping = {
      employeeId: 'employeeId',
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email',
      phoneNumber: 'phoneNumber',
      emergencyContactName: 'emergencyContactName',
      emergencyContactPhone: 'emergencyContactPhone',
      addressLine1: 'addressLine1',
      addressLine2: 'addressLine2',
      city: 'city',
      stateProvince: 'stateProvince',
      postalCode: 'postalCode',
      country: 'country',
      hireDate: 'hireDate',
      terminationDate: 'terminationDate',
      jobTitle: 'jobTitle',
      department: 'department',
      employmentType: 'employmentType',
      officeLocation: 'officeLocation',
      dateOfBirth: 'dateOfBirth',
      status: 'status',
      profilePhotoId: 'profilePhotoId',
    };

    // Track changes and build update data
    const activityLogs = [];

    for (const [bodyKey, dbKey] of Object.entries(fieldMapping)) {
      if (bodyKey in body) {
        let newValue = body[bodyKey];
        let oldValue = currentEmployee[dbKey];

        // Handle date fields
        if (['hireDate', 'terminationDate', 'dateOfBirth'].includes(dbKey)) {
          newValue = newValue ? new Date(newValue) : null;
          oldValue = oldValue ? oldValue.toISOString().split('T')[0] : null;
        }

        // Only update if value changed
        if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
          updateData[dbKey] = newValue;

          // Create activity log entry
          activityLogs.push({
            employeeId: id,
            actionType: 'updated',
            fieldName: dbKey,
            oldValue: oldValue ? String(oldValue) : null,
            newValue: newValue ? String(newValue) : null,
            performedById: user.id,
          });
        }
      }
    }

    // Update employee
    const updatedEmployee = await prisma.officeEmployee.update({
      where: { id },
      data: updateData,
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
      },
    });

    // Create activity log entries
    if (activityLogs.length > 0) {
      await prisma.activityLog.createMany({
        data: activityLogs,
      });
    }

    return NextResponse.json({
      success: true,
      data: updatedEmployee,
      message: 'Employee updated successfully',
      changesCount: activityLogs.length,
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    return NextResponse.json(
      {
        error: 'Failed to update employee',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/employees/:id
 * Soft delete employee
 */
export async function DELETE(request, { params }) {
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
    const { id } = await params;

    // Check if employee exists
    const employee = await prisma.officeEmployee.findUnique({
      where: { id },
    });

    if (!employee || employee.isDeleted) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Find or create user record for the session user
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          username: session.user.email.split('@')[0],
          passwordHash: '',
          firstName: session.user.name?.split(' ')[0] || '',
          lastName: session.user.name?.split(' ').slice(1).join(' ') || '',
        },
      });
    }

    // Soft delete employee
    await prisma.officeEmployee.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    // Create activity log
    await prisma.activityLog.create({
      data: {
        employeeId: id,
        actionType: 'deleted',
        newValue: `${employee.firstName} ${employee.lastName}`,
        performedById: user.id,
      },
    });

    return NextResponse.json(
      { success: true, message: 'Employee deleted successfully' },
      { status: 204 }
    );
  } catch (error) {
    console.error('Error deleting employee:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete employee',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
