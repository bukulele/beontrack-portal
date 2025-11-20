/**
 * Check if user exists by email
 * Used in portal sign-in flow to determine if we need to collect name fields
 */

import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma/index.js';

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

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true, email: true },
    });

    return NextResponse.json({
      exists: !!user,
    });
  } catch (error) {
    console.error('Error checking user existence:', error);
    return NextResponse.json(
      { error: 'Failed to check user' },
      { status: 500 }
    );
  }
}
