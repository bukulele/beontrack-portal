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

    // Sign in using Email OTP - this verifies the OTP and creates a session
    console.log(`🔐 Attempting to verify OTP for ${email} with code: ${otp}`);

    let signInResult;
    try {
      signInResult = await auth.api.signInEmailOTP({
        body: {
          email: email.toLowerCase(),
          otp: otp,
        },
        headers: request.headers,
      });

      console.log('✅ OTP verification successful:', signInResult);

      if (!signInResult || signInResult.error) {
        console.error('❌ OTP verification returned error:', signInResult?.error);
        return NextResponse.json(
          { error: 'Invalid verification code. Please try again.' },
          { status: 401 }
        );
      }
    } catch (otpError) {
      console.error('❌ OTP sign-in failed:', otpError);
      console.error('Error details:', {
        status: otpError.status,
        body: otpError.body,
        message: otpError.message,
      });
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
      employee = await prisma.officeEmployee.create({
        data: {
          employeeId: null, // Will be assigned by HR when reviewing application
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

      console.log(`✅ Created new employee record (no ID yet) for ${email}`);
    }

    // Session was already created by signInEmailOTP above
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
