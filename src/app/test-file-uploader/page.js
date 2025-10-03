"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FileUploader from '@/app/components/file-uploader/FileUploader';
import { getUploaderForDocumentType } from '@/config/file-uploader/clientUploaders';

/**
 * Test page for FileUploader component
 *
 * Demonstrates different uploader configurations
 */
export default function TestFileUploaderPage() {
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const [currentConfig, setCurrentConfig] = useState(null);

  const openUploader = (documentType, entityType = 'driver') => {
    const config = getUploaderForDocumentType(documentType, entityType);
    setCurrentConfig(config);
    setUploaderOpen(true);
  };

  const testUploaders = [
    {
      name: 'Driver License',
      documentType: 'licenses',
      entityType: 'driver',
      description: 'Upload with front/back images, dates, number, province',
    },
    {
      name: 'SIN',
      documentType: 'sin',
      entityType: 'driver',
      description: 'Upload with 9-digit validation and formatting',
    },
    {
      name: 'License Plate',
      documentType: 'truck_license_plates',
      entityType: 'truck',
      description: 'No file upload, just plate number and expiry',
    },
    {
      name: 'Tax Papers',
      documentType: 'tax_papers',
      entityType: 'driver',
      description: 'Document with issue date and comment',
    },
    {
      name: 'Immigration Doc',
      documentType: 'immigration_doc',
      entityType: 'driver',
      description: 'Document with expiry date',
    },
    {
      name: 'Other Documents',
      documentType: 'other_documents',
      entityType: 'driver',
      description: 'Simple document with optional comment',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            File Uploader Test Page
          </h1>
          <p className="text-slate-600 mt-2">
            Test different uploader configurations with various field types
          </p>
        </div>

        {/* Test Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testUploaders.map((uploader) => (
            <Card key={uploader.documentType} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{uploader.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-slate-600">
                  {uploader.description}
                </p>
                <Button
                  onClick={() => openUploader(uploader.documentType, uploader.entityType)}
                  className="w-full"
                >
                  Test Upload
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <Card>
          <CardHeader>
            <CardTitle>Two-Layer Architecture</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">
                Layer 1: Universal (Client-Agnostic)
              </h3>
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                <li><code className="bg-slate-100 px-1 py-0.5 rounded">/config/file-uploader/fieldTypes.js</code> - Field type registry</li>
                <li><code className="bg-slate-100 px-1 py-0.5 rounded">/config/file-uploader/uploaderSchema.js</code> - Config schema</li>
                <li><code className="bg-slate-100 px-1 py-0.5 rounded">/config/file-uploader/index.js</code> - Universal loader</li>
                <li><code className="bg-slate-100 px-1 py-0.5 rounded">/lib/fileProcessing.js</code> - File utilities</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">
                Layer 2: Client-Specific (Customizable)
              </h3>
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                <li><code className="bg-slate-100 px-1 py-0.5 rounded">/config/clientData.js</code> - Options & validation rules</li>
                <li><code className="bg-slate-100 px-1 py-0.5 rounded">/config/file-uploader/clientUploaders.js</code> - Document mappings</li>
                <li><code className="bg-slate-100 px-1 py-0.5 rounded">/config/file-uploader/uploaders/*.uploader.js</code> - Specific configs</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">
                Components
              </h3>
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                <li><code className="bg-slate-100 px-1 py-0.5 rounded">FileUploader.jsx</code> - Main uploader component</li>
                <li><code className="bg-slate-100 px-1 py-0.5 rounded">FieldRenderer.jsx</code> - Dynamic field rendering</li>
                <li><code className="bg-slate-100 px-1 py-0.5 rounded">FileInput.jsx</code> - File input with drag & drop</li>
                <li><code className="bg-slate-100 px-1 py-0.5 rounded">FilePreview.jsx</code> - File preview with remove</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Current Config Display */}
        {currentConfig && (
          <Card>
            <CardHeader>
              <CardTitle>Current Uploader Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-slate-100 p-4 rounded overflow-auto max-h-96">
                {JSON.stringify(currentConfig, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>

      {/* FileUploader Dialog */}
      <FileUploader
        config={currentConfig}
        open={uploaderOpen}
        onClose={() => setUploaderOpen(false)}
        onSuccess={(data) => {
          console.log('Upload success:', data);
          alert('File uploaded successfully!');
        }}
        onError={(error) => {
          console.error('Upload error:', error);
          alert('Upload failed: ' + error);
        }}
        entityData={{
          entityType: currentConfig?.entityType || 'driver',
          entityId: 123, // Test ID
        }}
      />
    </div>
  );
}
