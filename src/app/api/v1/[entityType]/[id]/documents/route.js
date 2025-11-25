/**
 * Generic Documents API - Next.js 16
 *
 * GET  /api/v1/{entityType}/{id}/documents - List documents for entity
 * POST /api/v1/{entityType}/{id}/documents - Upload document for entity
 *
 * Supports: employees, trucks, drivers, equipment
 * Scalable architecture - add new entity types without changing this file
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { saveUploadedFile } from '@/lib/fileUpload';
import { auth } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rateLimit';
import { authorizeRequest, authorizeRecordAccess } from '@/lib/api-auth';

// Supported entity types
const VALID_ENTITY_TYPES = ['employees', 'trucks', 'drivers', 'equipment', 'wcb_claims'];

// Map entity types to Prisma models (for validation)
const ENTITY_MODELS = {
  employees: 'officeEmployee',
  wcb_claims: 'wcbClaim',
  // trucks: 'truck',        // TODO: Add when Truck model exists
  // drivers: 'driver',      // TODO: Add when Driver model exists
  // equipment: 'equipment', // TODO: Add when Equipment model exists
};

/**
 * GET /api/v1/{entityType}/{id}/documents
 * List all documents for an entity
 */
export async function GET(request, { params }) {
  try {
    // Next.js 16: params is now a Promise
    const { entityType, id } = await params;

    // Validate entity type
    if (!VALID_ENTITY_TYPES.includes(entityType)) {
      return NextResponse.json(
        { error: `Invalid entity type: ${entityType}` },
        { status: 400 }
      );
    }

    // Authorization: Check if user has document_view permission
    const authResult = await authorizeRequest(request, entityType, 'document_view');
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: authResult.error || 'Unauthorized' },
        { status: authResult.status || 401 }
      );
    }

    // Check record-level access (ABAC conditions)
    const recordAuthResult = await authorizeRecordAccess(
      authResult.session,
      entityType,
      'document_view',
      id
    );
    if (!recordAuthResult.authorized) {
      return NextResponse.json(
        { error: recordAuthResult.error || 'Access denied to this record' },
        { status: 403 }
      );
    }

    // Optional: Filter by documentType
    const { searchParams } = new URL(request.url);
    const documentType = searchParams.get('documentType');

    // Build query
    const whereClause = {
      entityType,
      entityId: id,
      isDeleted: false,
    };

    if (documentType) {
      whereClause.documentType = documentType;
    }

    // Fetch documents
    const documents = await prisma.document.findMany({
      where: whereClause,
      include: {
        uploadedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        reviewedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: documents,
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch documents',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/{entityType}/{id}/documents
 * Upload a new document for an entity
 */
export async function POST(request, { params }) {
  try {
    // Next.js 16: params is now a Promise
    const { entityType, id } = await params;

    // Validate entity type
    if (!VALID_ENTITY_TYPES.includes(entityType)) {
      return NextResponse.json(
        { error: `Invalid entity type: ${entityType}` },
        { status: 400 }
      );
    }

    // Authorization: Check if user has document_upload permission
    const authResult = await authorizeRequest(request, entityType, 'document_upload');
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: authResult.error || 'Unauthorized - you do not have permission to upload documents' },
        { status: authResult.status || 401 }
      );
    }

    // Check record-level access (ABAC conditions)
    const recordAuthResult = await authorizeRecordAccess(
      authResult.session,
      entityType,
      'document_upload',
      id
    );
    if (!recordAuthResult.authorized) {
      return NextResponse.json(
        { error: recordAuthResult.error || 'Access denied to upload documents for this record' },
        { status: 403 }
      );
    }

    // Verify entity exists (for entities with Prisma models)
    const modelName = ENTITY_MODELS[entityType];
    if (modelName) {
      const entity = await prisma[modelName].findUnique({
        where: { id },
      });

      if (!entity) {
        return NextResponse.json(
          { error: `${entityType} not found` },
          { status: 404 }
        );
      }

      // Get session for permission checks and rate limiting
      const session = await auth.api.getSession({
        headers: request.headers,
      });

      // Rate limiting: 10 document uploads per 5 minutes per user
      if (session?.user) {
        const rateLimitResult = checkRateLimit(session.user.id, 'DOCUMENT_UPLOAD');
        if (!rateLimitResult.allowed) {
          return NextResponse.json(
            {
              error: `Too many upload requests. Please try again in ${rateLimitResult.retryAfter} seconds.`,
              retryAfter: rateLimitResult.retryAfter,
            },
            { status: 429 } // Too Many Requests
          );
        }
      }

      // Portal-specific check: If user is the employee themselves (portal access),
      // verify they have permission to upload/edit documents
      if (session?.user && entityType === 'employees' && entity.userId === session.user.id) {
        if (!entity.allowApplicationEdit) {
          return NextResponse.json(
            { error: 'Your application is currently locked for editing. Contact support if you need to upload documents.' },
            { status: 403 }
          );
        }
      }
    }

    // Parse FormData
    const formData = await request.formData();
    const file = formData.get('file');
    const documentType = formData.get('documentType');

    // Validate required fields
    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      );
    }

    if (!documentType) {
      return NextResponse.json(
        { error: 'documentType is required' },
        { status: 400 }
      );
    }

    // Validate file
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    const allowedTypes = ['image/', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats'];
    if (!allowedTypes.some(type => file.type.startsWith(type))) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: images, PDF, Word documents' },
        { status: 400 }
      );
    }

    // Convert file to buffer (file is already processed on client-side)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = file.type;

    // Save file to disk
    const { filePath, fileName, fileSize } = await saveUploadedFile(
      buffer,
      entityType,  // Generic!
      id,
      documentType,
      file.name
    );

    // Parse metadata (optional)
    let metadata = null;
    const metadataStr = formData.get('metadata');
    if (metadataStr) {
      try {
        metadata = JSON.parse(metadataStr);
      } catch (e) {
        console.error('Invalid metadata JSON:', e);
      }
    }

    // Get current user session
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Find user by email
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      );
    }

    // Create document record
    const document = await prisma.document.create({
      data: {
        entityType,
        entityId: id,
        documentType,
        filePath,
        fileName,
        mimeType,
        fileSize,
        metadata,
        uploadedById: user.id,
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
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
        actionType: 'document_uploaded',
        fieldName: documentType,
        newValue: fileName,
        performedById: user.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: document,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      {
        error: 'Failed to upload document',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
