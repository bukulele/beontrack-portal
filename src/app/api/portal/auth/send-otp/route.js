/**
 * Portal Auth API - Send OTP
 *
 * Sends OTP code to applicant's email for passwordless authentication.
 * If the email doesn't exist, creates a User account (for OTP auth) but NOT an employee record.
 * Employee record is created later when applicant completes the application.
 */

import { NextResponse } from 'next/server';
import { auth, devOTPStorage } from '@/lib/auth';
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

    // Send OTP using Better Auth's email OTP system
    // Use 'sign-in' type instead of 'email-verification' for passwordless sign-in
    // Works for both new and existing users
    const otpResult = await auth.api.sendVerificationOTP({
      body: {
        email: email.toLowerCase(),
        type: 'sign-in',
      },
    });

    console.log('📧 OTP sent to:', email);

    // Get OTP from dev storage
    const storedOTP = devOTPStorage.get(email.toLowerCase());
    const actualOTP = storedOTP?.otp;

    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your email. Please check your inbox.',
      // In development mode, expose the actual OTP
      ...(process.env.NODE_ENV === 'development' && actualOTP && {
        mockOTP: actualOTP,
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
