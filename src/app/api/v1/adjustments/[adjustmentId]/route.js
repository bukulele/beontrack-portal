/**
 * Single Hours Adjustment API - Next.js 16
 *
 * DELETE /api/v1/adjustments/{adjustmentId} - Soft delete adjustment
 *
 * Note: This is a simplified route for deleting adjustments by ID directly.
 * The adjustment record contains entityType/entityId so we can authorize properly.
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  authorizeRequest,
  createErrorResponse,
  createSuccessResponse,
} from '@/lib/api-auth';

/**
 * DELETE /api/v1/adjustments/{adjustmentId}
 * Soft delete an hours adjustment
 */
export async function DELETE(request, { params }) {
  try {
    // Next.js 16: params is now a Promise
    const { adjustmentId } = await params;

    // First, fetch the adjustment to get entityType for authorization
    const adjustment = await prisma.hoursAdjustment.findUnique({
      where: {
        id: adjustmentId,
        isDeleted: false,
      },
    });

    if (!adjustment) {
      return createErrorResponse(404, 'Not Found', 'Hours adjustment not found');
    }

    // Authorize request using the entityType from the adjustment
    const authResult = await authorizeRequest(request, adjustment.entityType, 'delete');
    if (authResult.error) {
      return authResult.response;
    }

    // Soft delete the adjustment
    await prisma.hoursAdjustment.update({
      where: { id: adjustmentId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    return createSuccessResponse(null, {
      message: 'Hours adjustment deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting adjustment:', error);
    return createErrorResponse(500, 'Internal Server Error', 'Failed to delete adjustment', error.message);
  }
}
