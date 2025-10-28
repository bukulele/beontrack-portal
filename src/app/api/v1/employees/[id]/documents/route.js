/**
 * Employee Documents API - Next.js 16
 *
 * POST /api/v1/employees/:id/documents - Upload a document
 * GET /api/v1/employees/:id/documents - List all documents for employee
 *
 * File Structure: uploads/employees/{uuid}/{documentType}/{timestamp}_{filename}
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { saveUploadedFile, validateFileSize, validateFileType } from '@/lib/fileUpload';

// File upload constraints
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
  'image/*',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

/**
 * GET /api/v1/employees/:id/documents
 * List all documents for an employee
 */
export async function GET(request, { params }) {
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
    const { id } = await params;

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const documentType = searchParams.get('documentType');

    // Build query filters
    const where = {
      employeeId: id,
      isDeleted: false,
    };

    if (documentType) {
      where.documentType = documentType;
    }

    // Fetch documents with relations
    const documents = await prisma.document.findMany({
      where,
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
      count: documents.length,
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch documents',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/employees/:id/documents
 * Upload a document for an employee
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
    const { id: employeeId } = await params;

    // Verify employee exists
    const employee = await prisma.officeEmployee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Parse form data (Next.js 16 native FormData handling)
    const formData = await request.formData();
    const file = formData.get('file');
    const documentType = formData.get('documentType');
    const metadataStr = formData.get('metadata');

    // Validate required fields
    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      );
    }

    if (!documentType) {
      return NextResponse.json(
        { error: 'Document type is required' },
        { status: 400 }
      );
    }

    // Validate file size
    if (!validateFileSize(file.size, MAX_FILE_SIZE)) {
      return NextResponse.json(
        { error: `File size exceeds maximum allowed size (${MAX_FILE_SIZE / (1024 * 1024)}MB)` },
        { status: 400 }
      );
    }

    // Validate file type
    if (!validateFileType(file.type, ALLOWED_FILE_TYPES)) {
      return NextResponse.json(
        { error: `File type "${file.type}" is not allowed. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    // Parse metadata (optional)
    let metadata = null;
    if (metadataStr) {
      try {
        metadata = JSON.parse(metadataStr);
      } catch (error) {
        return NextResponse.json(
          { error: 'Invalid metadata JSON' },
          { status: 400 }
        );
      }
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Save file to disk (hybrid structure: employees/{uuid}/{docType}/{timestamp}_{filename})
    const { filePath, fileName, fileSize } = await saveUploadedFile(
      buffer,
      employeeId,
      documentType,
      file.name
    );

    // Find or create user record for the session user
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      // Create a new user if not found (for development)
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

    // Create document record in database
    const document = await prisma.document.create({
      data: {
        employeeId,
        documentType,
        filePath,
        fileName,
        mimeType: file.type,
        fileSize,
        metadata,
        uploadedById: user.id,
        reviewStatus: 'pending',
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
        employeeId,
        actionType: 'document_uploaded',
        fieldName: 'documents',
        newValue: `${documentType}: ${fileName}`,
        performedById: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      data: document,
      message: 'Document uploaded successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      {
        error: 'Failed to upload document',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
