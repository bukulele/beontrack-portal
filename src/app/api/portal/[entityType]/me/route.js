/**
 * Portal "Me" API
 *
 * GET - Returns the current user's entity data (employee, client, supplier, etc.)
 * PATCH - Updates the current user's entity data (self-service updates)
 *
 * Permission checks:
 * - User must be authenticated
 * - portalAccessEnabled must be true
 * - allowApplicationEdit must be true (for PATCH)
 */

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { fetchGroupedDocuments } from '@/lib/apiHelpers';

export async function GET(request, { params }) {
  try {
    const { entityType } = await params;

    // Get current session
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;

    // Find entity by email (for now, only employees supported)
    if (entityType === 'employees') {
      const employee = await prisma.officeEmployee.findFirst({
        where: {
          email: userEmail,
          isDeleted: false,
        },
        include: {
          profilePhoto: true,
          activityHistory: {
            where: { isDeleted: false },
            orderBy: { startDate: 'desc' },
          },
        },
      });

      if (!employee) {
        return NextResponse.json(
          { error: 'Employee record not found' },
          { status: 404 }
        );
      }

      // Fetch grouped documents for this employee
      const groupedDocuments = await fetchGroupedDocuments(entityType, employee.id);

      // Combine employee data with documents
      const employeeData = {
        ...employee,
        ...groupedDocuments, // Spread grouped documents at top level
      };

      return NextResponse.json(employeeData);
    }

    // Add support for other entity types here
    // if (entityType === 'clients') { ... }
    // if (entityType === 'suppliers') { ... }

    return NextResponse.json(
      { error: 'Unsupported entity type' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error fetching entity data:', error);
    return NextResponse.json(
      { error: 'Failed to load your data' },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const { entityType } = await params;

    // Get current session
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;

    // Parse request body
    const updates = await request.json();

    // Find entity by email
    if (entityType === 'employees') {
      const employee = await prisma.officeEmployee.findFirst({
        where: {
          email: userEmail,
          isDeleted: false,
        },
      });

      if (!employee) {
        return NextResponse.json(
          { error: 'Employee record not found' },
          { status: 404 }
        );
      }

      // Check portal access is enabled
      if (!employee.portalAccessEnabled) {
        return NextResponse.json(
          { error: 'Portal access is disabled. Contact support for assistance.' },
          { status: 403 }
        );
      }

      // Check if user is allowed to edit their application
      if (!employee.allowApplicationEdit) {
        return NextResponse.json(
          { error: 'Your application is locked. Contact support to make changes.' },
          { status: 403 }
        );
      }

      // Define which fields are allowed to be updated by portal users
      const allowedFields = [
        'firstName',
        'lastName',
        'middleName',
        'preferredName',
        'dateOfBirth',
        'gender',
        'email',
        'phoneNumber',
        'emergencyContactName',
        'emergencyContactPhone',
        'emergencyContactRelationship',
        'addressLine1',
        'addressLine2',
        'city',
        'stateProvince',
        'postalCode',
        'country',
        'status', // Allow updating status (e.g., for application submission)
        'allowApplicationEdit', // Allow locking the application after submission
      ];

      // Filter updates to only allowed fields and convert date strings to Date objects
      const filteredUpdates = {};
      for (const field of allowedFields) {
        if (updates.hasOwnProperty(field)) {
          let value = updates[field];

          // Auto-convert date strings (YYYY-MM-DD format) to Date objects
          // Prisma DateTime fields require Date objects, not strings
          if (value && typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
            value = new Date(value);
          }

          filteredUpdates[field] = value;
        }
      }

      // Add audit fields
      filteredUpdates.updatedAt = new Date();
      if (session.user.id) {
        filteredUpdates.updatedById = session.user.id;
      }

      // Update employee record
      const updatedEmployee = await prisma.officeEmployee.update({
        where: { id: employee.id },
        data: filteredUpdates,
        include: {
          profilePhoto: true,
          activityHistory: {
            where: { isDeleted: false },
            orderBy: { startDate: 'desc' },
          },
        },
      });

      // Fetch grouped documents for updated response
      const groupedDocuments = await fetchGroupedDocuments(entityType, updatedEmployee.id);

      // Combine employee data with documents
      const employeeData = {
        ...updatedEmployee,
        ...groupedDocuments,
      };

      return NextResponse.json(employeeData);
    }

    // Add support for other entity types here
    return NextResponse.json(
      { error: 'Unsupported entity type' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error updating entity data:', error);
    return NextResponse.json(
      { error: 'Failed to save changes', details: error.message },
      { status: 500 }
    );
  }
}
