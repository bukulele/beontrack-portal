/**
 * Employee Status Settings API
 *
 * GET /api/v1/status-settings/employee
 *
 * Returns employee status configuration in legacy format for compatibility with SettingsContext
 * Reads from database (status_configs and status_transitions tables)
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/v1/status-settings/employee
 * Returns status colors and transitions for employee entity type
 */
export async function GET() {
  try {
    // Fetch status configs with transitions (no caching to avoid stale data)
    const statusConfigs = await prisma.statusConfig.findMany({
      where: {
        entityType: 'employees',
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

    // Transform to legacy format expected by SettingsContext
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
    console.error('Error fetching employee status settings:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch employee status settings',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
