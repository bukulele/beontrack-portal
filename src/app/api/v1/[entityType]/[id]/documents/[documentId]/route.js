/**
 * Generic Document Operations API - Next.js 16
 *
 * PATCH /api/v1/{entityType}/{id}/documents/{documentId} - Update document review status
 * DELETE /api/v1/{entityType}/{id}/documents/{documentId} - Soft delete a document
 *
 * Supports: employees, trucks, drivers, equipment
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

const VALID_ENTITY_TYPES = ['employees', 'trucks', 'drivers', 'equipment'];

/**
 * PATCH /api/v1/{entityType}/{id}/documents/{documentId}
 * Update document review status
 */
export async function PATCH(request, { params }) {
  try {
    // Authenticate user (TEMPORARILY DISABLED FOR TESTING)
    // const session = await getServerSession(authOptions);
    // if (!session?.user) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }

    // Next.js 16: params is now a Promise
    const { entityType, id, documentId } = await params;

    // Validate entity type
    if (!VALID_ENTITY_TYPES.includes(entityType)) {
      return NextResponse.json(
        { error: `Invalid entity type: ${entityType}` },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Verify document exists and belongs to this entity
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document || document.isDeleted) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    if (document.entityType !== entityType || document.entityId !== id) {
      return NextResponse.json(
        { error: 'Document does not belong to this entity' },
        { status: 403 }
      );
    }

    // Find or create user for testing
    let user = await prisma.user.findUnique({
      where: { email: 'admin@example.com' },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'admin@example.com',
          username: 'admin',
          passwordHash: '',
          firstName: 'Admin',
          lastName: 'User',
        },
      });
    }

    // Track old value for activity log
    const oldWasReviewed = document.wasReviewed;

    // Update document
    const updateData = {};
    if ('wasReviewed' in body) {
      updateData.wasReviewed = body.wasReviewed;
      updateData.reviewedById = user.id;
      updateData.reviewedAt = new Date();
    }

    const updatedDocument = await prisma.document.update({
      where: { id: documentId },
      data: updateData,
      include: {
        reviewedBy: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Create activity log
    await prisma.activityLog.create({
      data: {
        entityType,
        entityId: id,
        actionType: 'document_reviewed',
        fieldName: document.documentType,
        oldValue: oldWasReviewed ? 'true' : 'false',
        newValue: updatedDocument.wasReviewed ? 'true' : 'false',
        performedById: user.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: updatedDocument,
        message: 'Document review status updated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json(
      {
        error: 'Failed to update document',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/{entityType}/{id}/documents/{documentId}
 * Soft delete a document
 */
export async function DELETE(request, { params }) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Next.js 16: params is now a Promise
    const { entityType, id, documentId } = await params;

    // Validate entity type
    if (!VALID_ENTITY_TYPES.includes(entityType)) {
      return NextResponse.json(
        { error: `Invalid entity type: ${entityType}` },
        { status: 400 }
      );
    }

    // Verify document exists and belongs to this entity
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document || document.isDeleted) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    if (document.entityType !== entityType || document.entityId !== id) {
      return NextResponse.json(
        { error: 'Document does not belong to this entity' },
        { status: 403 }
      );
    }

    // Find or create user (same workaround as upload)
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      console.warn('[DEV WORKAROUND] Auto-creating user for:', session.user.email);
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          username: session.user.email.split('@')[0],
          passwordHash: '',
          firstName: session.user.name?.split(' ')[0] || '',
          lastName: session.user.name?.split(' ').slice(1).join(' ') || '',
        },
      });
    }

    // Soft delete the document
    await prisma.document.update({
      where: { id: documentId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    // Create activity log
    await prisma.activityLog.create({
      data: {
        entityType,
        entityId: id,
        actionType: 'document_deleted',
        fieldName: document.documentType,
        oldValue: document.fileName,
        performedById: user.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Document deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete document',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
