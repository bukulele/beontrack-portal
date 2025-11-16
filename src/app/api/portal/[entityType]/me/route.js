/**
 * Portal "Me" API
 *
 * Returns the current user's entity data (employee, client, supplier, etc.)
 * based on their session.
 */

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

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

      return NextResponse.json(employee);
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
  } finally {
    await prisma.$disconnect();
  }
}
