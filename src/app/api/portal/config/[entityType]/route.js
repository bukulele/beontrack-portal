/**
 * Portal Config API
 *
 * Returns the portal configuration for a specific entity type.
 */

import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const { entityType} = await params;

    const config = await prisma.portalConfig.findUnique({
      where: {
        entityType,
        isActive: true,
      },
    });

    if (!config) {
      return NextResponse.json(
        { error: 'Portal not configured for this entity type' },
        { status: 404 }
      );
    }

    return NextResponse.json(config);

  } catch (error) {
    console.error('Error fetching portal config:', error);
    return NextResponse.json(
      { error: 'Failed to load portal configuration' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
