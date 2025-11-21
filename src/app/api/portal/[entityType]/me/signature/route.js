/**
 * Portal Signature API
 *
 * POST - Saves the user's signature (base64 PNG) to their entity record
 *
 * Permission checks:
 * - User must be authenticated
 * - portalAccessEnabled must be true
 * - allowApplicationEdit must be true
 */

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request, { params }) {
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
    const { signature } = await request.json();

    if (!signature || !signature.startsWith('data:image/png;base64,')) {
      return NextResponse.json(
        { error: 'Invalid signature data. Must be a base64 PNG image.' },
        { status: 400 }
      );
    }

    // Handle employees entity type
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

      // Save signature to database
      const updatedEmployee = await prisma.officeEmployee.update({
        where: { id: employee.id },
        data: {
          signature,
          signatureDate: new Date(),
          updatedAt: new Date(),
          ...(session.user.id && { updatedById: session.user.id }),
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Signature saved successfully',
        signatureDate: updatedEmployee.signatureDate,
      });
    }

    // Add support for other entity types here
    // if (entityType === 'drivers') { ... }

    return NextResponse.json(
      { error: 'Unsupported entity type' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error saving signature:', error);
    return NextResponse.json(
      { error: 'Failed to save signature', details: error.message },
      { status: 500 }
    );
  }
}
