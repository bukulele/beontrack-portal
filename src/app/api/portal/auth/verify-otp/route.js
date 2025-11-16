/**
 * Portal Auth API - Verify OTP
 *
 * Verifies the OTP code and creates an employee record if it doesn't exist.
 * Links the User account (created by Better Auth) to a new OfficeEmployee record.
 */

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and verification code are required' },
        { status: 400 }
      );
    }

    // MOCK MODE: Accept 123456 as valid OTP
    const isValidOTP = otp === '123456';

    if (!isValidOTP) {
      return NextResponse.json(
        { error: 'Invalid verification code. Please try again.' },
        { status: 401 }
      );
    }

    // Find or create User account (Better Auth should have created it during send-otp)
    let user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // If user doesn't exist, create one
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          username: email.split('@')[0],
          emailVerified: true,
          isActive: true,
          isStaff: false,
          isSuperuser: false,
        },
      });
    } else {
      // Mark email as verified
      user = await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: true },
      });
    }

    // Check if employee record already exists
    let employee = await prisma.officeEmployee.findFirst({
      where: {
        email: email.toLowerCase(),
        isDeleted: false,
      },
    });

    // If no employee exists, create one
    if (!employee) {
      // Generate unique employee ID
      const lastEmployee = await prisma.officeEmployee.findFirst({
        where: {
          employeeId: {
            startsWith: 'APP',
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      const lastNumber = lastEmployee
        ? parseInt(lastEmployee.employeeId.replace('APP', ''))
        : 0;
      const newEmployeeId = `APP${String(lastNumber + 1).padStart(3, '0')}`;

      employee = await prisma.officeEmployee.create({
        data: {
          employeeId: newEmployeeId,
          firstName: '',
          lastName: '',
          email: email.toLowerCase(),
          status: 'new',
          portalAccessEnabled: true,
          allowApplicationEdit: true,
          userId: user.id, // Link to User account
          createdById: user.id,
          updatedById: user.id,
        },
      });

      console.log(`✅ Created new employee record: ${employee.employeeId} for ${email}`);
    }

    // Create a session for the user
    const session = await auth.api.signInEmail({
      body: {
        email: email.toLowerCase(),
        password: '', // Not used for OTP auth
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Verification successful',
      user: {
        id: user.id,
        email: user.email,
      },
      employee: {
        id: employee.id,
        employeeId: employee.employeeId,
        status: employee.status,
        allowApplicationEdit: employee.allowApplicationEdit,
      },
    });

  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { error: 'Verification failed. Please try again.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
