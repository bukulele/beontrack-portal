/**
 * WCB Claims Status Settings API
 *
 * GET /api/v1/status-settings/wcb_claims
 *
 * Returns WCB claim status configuration for SettingsContext
 * Reads from database (status_configs and status_transitions tables)
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/v1/status-settings/wcb_claims
 * Returns status colors and transitions for wcb_claims entity type
 */
export async function GET() {
  try {
    // Fetch status configs with transitions (no caching to avoid stale data)
    const statusConfigs = await prisma.statusConfig.findMany({
      where: {
        entityType: 'wcb_claims',
      },
      include: {
        transitionsFrom: {
          include: {
            toStatus: {
              select: {
                statusCode: true,
              },
            },
          },
        },
      },
      orderBy: {
        sortOrder: 'asc',
      },
    });

    // Transform to format expected by SettingsContext
    const status_colors = statusConfigs.map(config => ({
      status: config.statusCode,
      color: config.color,
    }));

    const status_transitions = [];
    statusConfigs.forEach(config => {
      config.transitionsFrom.forEach(transition => {
        status_transitions.push({
          status_from: config.statusCode,
          status_to: transition.toStatus.statusCode,
        });
      });
    });

    const response = {
      status_colors,
      status_transitions,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching WCB claims status settings:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch WCB claims status settings',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
