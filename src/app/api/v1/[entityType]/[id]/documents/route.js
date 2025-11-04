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
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { saveUploadedFile } from '@/lib/fileUpload';

// Supported entity types
const VALID_ENTITY_TYPES = ['employees', 'trucks', 'drivers', 'equipment'];

// Map entity types to Prisma models (for validation)
const ENTITY_MODELS = {
  employees: 'officeEmployee',
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
    // Authenticate user
    // TEMPORARILY DISABLED FOR TESTING
    // const session = await getServerSession(authOptions);
    // if (!session?.user) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }

    // Next.js 16: params is now a Promise
    const { entityType, id } = await params;

    // Validate entity type
    if (!VALID_ENTITY_TYPES.includes(entityType)) {
      return NextResponse.json(
        { error: `Invalid entity type: ${entityType}` },
        { status: 400 }
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
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        reviewedBy: {
          select: {
            id: true,
            username: true,
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
    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Next.js 16: params is now a Promise
    const { entityType, id } = await params;

    // Validate entity type
    if (!VALID_ENTITY_TYPES.includes(entityType)) {
      return NextResponse.json(
        { error: `Invalid entity type: ${entityType}` },
        { status: 400 }
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

    // WORKAROUND: Find or create user for document ownership
    // TODO: Proper fix needed:
    //   1. Add user.id to session in auth callback
    //   2. OR make uploadedById optional in schema
    //   3. OR fail if user not found (proper production approach)
    // Current: Auto-create user for development (NOT production-ready)
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      console.warn('[DEV WORKAROUND] Auto-creating user for:', session.user.email);
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          username: session.user.email.split('@')[0],
          passwordHash: '', // Empty for OAuth users
          firstName: session.user.name?.split(' ')[0] || '',
          lastName: session.user.name?.split(' ').slice(1).join(' ') || '',
        },
      });
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
