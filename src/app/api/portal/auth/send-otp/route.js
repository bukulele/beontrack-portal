/**
 * Portal Auth API - Send OTP
 *
 * Sends OTP code to applicant's email for passwordless authentication.
 * If the email doesn't exist, creates a User account (for OTP auth) but NOT an employee record.
 * Employee record is created later when applicant completes the application.
 */

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { PrismaClient } from '@/generated/prisma';
import { checkRateLimit } from '@/lib/rateLimit';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Rate limiting: 5 OTP requests per 15 minutes per email
    const rateLimitResult = checkRateLimit(email.toLowerCase(), 'OTP_SEND');
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: `Too many OTP requests. Please try again in ${rateLimitResult.retryAfter} seconds.`,
          retryAfter: rateLimitResult.retryAfter,
        },
        { status: 429 } // Too Many Requests
      );
    }

    // Check if email already exists (prevent duplicates)
    const existingEmployee = await prisma.officeEmployee.findFirst({
      where: {
        email: email.toLowerCase(),
        isDeleted: false,
      },
    });

    if (existingEmployee) {
      return NextResponse.json(
        {
          error: 'This email is already registered. Please contact HR if you need assistance.',
          code: 'EMAIL_EXISTS'
        },
        { status: 409 }
      );
    }

    // Send OTP using Better Auth's email OTP system
    // Better Auth will automatically create a User account if it doesn't exist
    const otpResult = await auth.api.sendVerificationOTP({
      body: {
        email: email.toLowerCase(),
        type: 'email-verification',
      },
    });

    console.log('📧 OTP sent to:', email);
    console.log('📧 Use code: 123456 (mock mode)');

    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your email. Please check your inbox.',
      // In mock mode, expose the OTP for development
      ...(process.env.NODE_ENV === 'development' && {
        mockOTP: '123456',
      }),
    });

  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { error: 'Failed to send verification code. Please try again.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
