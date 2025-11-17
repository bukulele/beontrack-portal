/**
 * Portal OTP Verification Endpoint
 *
 * Handles portal-specific post-auth logic after OTP verification.
 * Creates employee record for portal users after they successfully sign in.
 * This is the ONLY place where employee records are auto-created during authentication.
 * Admin users logging in via /auth/sign-in do NOT trigger employee creation.
 */

import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma/index.js';
import { getSession } from '@/lib/auth.js';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check session to verify user is authenticated
    const sessionData = await getSession(request.headers);

    if (!sessionData || !sessionData.session || !sessionData.user) {
      return NextResponse.json(
        { error: 'Unauthorized - please sign in first' },
        { status: 401 }
      );
    }

    const { session, user } = sessionData;

    if (user.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json(
        { error: 'Email mismatch - please sign in with the correct email' },
        { status: 401 }
      );
    }

    // Check if user has an employee record
    const userWithEmployee = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        employeePortalLink: true,
      },
    });

    if (!userWithEmployee) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 500 }
      );
    }

    // Create employee record if it doesn't exist
    // This is the ONLY auto-creation point for portal applicants
    if (!userWithEmployee.employeePortalLink || userWithEmployee.employeePortalLink.length === 0) {
      console.log(`📝 Creating employee record for portal user: ${email}`);

      await prisma.officeEmployee.create({
        data: {
          employeeId: null, // Nullable for portal applicants
          firstName: userWithEmployee.firstName || '',
          lastName: userWithEmployee.lastName || '',
          email: email.toLowerCase(),
          status: 'new', // New applicant status
          portalAccessEnabled: true,
          allowApplicationEdit: true,
          userId: userWithEmployee.id,
          createdById: userWithEmployee.id,
          updatedById: userWithEmployee.id,
        },
      });

      console.log(`✅ Employee record created for: ${email}`);
    } else {
      console.log(`ℹ️  Employee record already exists for: ${email}`);
    }

    // Return success
    return NextResponse.json({
      success: true,
      user: user,
    });

  } catch (error) {
    console.error('Portal post-auth error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to complete portal sign-in' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
