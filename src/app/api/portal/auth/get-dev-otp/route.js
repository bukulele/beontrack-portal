/**
 * Development OTP Retrieval API
 *
 * ONLY FOR DEVELOPMENT - Returns the mock OTP for testing purposes.
 * This endpoint should be disabled in production.
 */

import { NextResponse } from 'next/server';
import { devOTPStorage } from '@/lib/auth';

export async function POST(request) {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'This endpoint is only available in development mode' },
      { status: 403 }
    );
  }

  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const otpData = devOTPStorage.get(email.toLowerCase());

    if (!otpData) {
      return NextResponse.json(
        { error: 'No OTP found for this email' },
        { status: 404 }
      );
    }

    // Check if expired
    if (Date.now() > otpData.expiresAt) {
      devOTPStorage.delete(email.toLowerCase());
      return NextResponse.json(
        { error: 'OTP has expired' },
        { status: 410 }
      );
    }

    return NextResponse.json({ otp: otpData.otp });
  } catch (error) {
    console.error('Error retrieving dev OTP:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve OTP' },
      { status: 500 }
    );
  }
}
