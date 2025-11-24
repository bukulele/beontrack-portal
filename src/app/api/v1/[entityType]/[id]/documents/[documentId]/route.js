/**
 * Generic Document Operations API - Next.js 16
 *
 * PATCH /api/v1/{entityType}/{id}/documents/{documentId} - Update document review status
 * DELETE /api/v1/{entityType}/{id}/documents/{documentId} - Soft delete a document
 *
 * Supports: employees, trucks, drivers, equipment
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { authorizeRequest, authorizeRecordAccess } from '@/lib/api-auth';

const VALID_ENTITY_TYPES = ['employees', 'trucks', 'drivers', 'equipment'];

/**
 * PATCH /api/v1/{entityType}/{id}/documents/{documentId}
 * Update document review status
 */
export async function PATCH(request, { params }) {
  try {
    // Next.js 16: params is now a Promise
    const { entityType, id, documentId } = await params;

    // Validate entity type
    if (!VALID_ENTITY_TYPES.includes(entityType)) {
      return NextResponse.json(
        { error: `Invalid entity type: ${entityType}` },
        { status: 400 }
      );
    }

    // Authorization: Check if user has document_edit permission
    const authResult = await authorizeRequest(request, entityType, 'document_edit');
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: authResult.error || 'Unauthorized - you do not have permission to edit documents' },
        { status: authResult.status || 401 }
      );
    }

    // Check record-level access (ABAC conditions)
    const recordAuthResult = await authorizeRecordAccess(
      authResult.session,
      entityType,
      'document_edit',
      id
    );
    if (!recordAuthResult.authorized) {
      return NextResponse.json(
        { error: recordAuthResult.error || 'Access denied to edit documents for this record' },
        { status: 403 }
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

    // Get user from session (already validated by authorization)
    const user = await prisma.user.findUnique({
      where: { email: authResult.session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Track old values for activity log
    const oldWasReviewed = document.wasReviewed;
    const oldMetadata = document.metadata || {};

    // Update document
    const updateData = {};

    // Update review status
    if ('wasReviewed' in body) {
      updateData.wasReviewed = body.wasReviewed;
      updateData.reviewedById = user.id;
      updateData.reviewedAt = new Date();
    }

    // Update metadata (merge with existing)
    if ('metadata' in body) {
      updateData.metadata = {
        ...oldMetadata,
        ...body.metadata,
      };
    }

    const updatedDocument = await prisma.document.update({
      where: { id: documentId },
      data: updateData,
      include: {
        reviewedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Create activity log for review status change
    if ('wasReviewed' in body) {
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
    }

    // Create activity log for metadata changes
    if ('metadata' in body) {
      await prisma.activityLog.create({
        data: {
          entityType,
          entityId: id,
          actionType: 'document_metadata_updated',
          fieldName: document.documentType,
          oldValue: JSON.stringify(oldMetadata),
          newValue: JSON.stringify(updatedDocument.metadata),
          performedById: user.id,
        },
      });
    }

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
    // Next.js 16: params is now a Promise
    const { entityType, id, documentId } = await params;

    // Validate entity type
    if (!VALID_ENTITY_TYPES.includes(entityType)) {
      return NextResponse.json(
        { error: `Invalid entity type: ${entityType}` },
        { status: 400 }
      );
    }

    // Authorization: Check if user has document_delete permission
    const authResult = await authorizeRequest(request, entityType, 'document_delete');
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: authResult.error || 'Unauthorized - you do not have permission to delete documents' },
        { status: authResult.status || 401 }
      );
    }

    // Check record-level access (ABAC conditions)
    const recordAuthResult = await authorizeRecordAccess(
      authResult.session,
      entityType,
      'document_delete',
      id
    );
    if (!recordAuthResult.authorized) {
      return NextResponse.json(
        { error: recordAuthResult.error || 'Access denied to delete documents for this record' },
        { status: 403 }
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

    // Get user from session (already validated by authorization)
    const user = await prisma.user.findUnique({
      where: { email: authResult.session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
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
