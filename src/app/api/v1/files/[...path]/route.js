/**
 * File Download API - Next.js 16
 *
 * GET /api/v1/files/:path - Stream a file from disk
 *
 * Example: /api/v1/files/employees/{uuid}/{docType}/{filename}
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getAbsolutePath, fileExists, getMimeTypeFromExtension } from '@/lib/fileUpload';
import { readFile } from 'fs/promises';
import path from 'path';

/**
 * GET /api/v1/files/[...path]
 * Stream a file from the uploads directory
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
    const { path: pathSegments } = await params;

    // Reconstruct the file path from segments
    // pathSegments is an array like: ['employees', 'uuid', 'docType', 'filename.pdf']
    const relativePath = path.join('uploads', ...pathSegments);

    // Security: Prevent directory traversal
    if (relativePath.includes('..')) {
      return NextResponse.json(
        { error: 'Invalid file path' },
        { status: 400 }
      );
    }

    // Check if file exists
    if (!fileExists(relativePath)) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Get absolute path
    const absolutePath = getAbsolutePath(relativePath);

    // Read file from disk
    const fileBuffer = await readFile(absolutePath);

    // Get filename for Content-Disposition header
    const filename = pathSegments[pathSegments.length - 1];

    // Determine MIME type from file extension
    const mimeType = getMimeTypeFromExtension(filename);

    // Return file as response with appropriate headers
    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `inline; filename="${filename}"`,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'private, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error streaming file:', error);
    return NextResponse.json(
      {
        error: 'Failed to retrieve file',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
