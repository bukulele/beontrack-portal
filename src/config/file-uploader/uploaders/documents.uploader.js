/**
 * Generic Documents Uploader Configuration
 *
 * Used for uploading general documents with optional comment
 * Examples: tax_papers, driver_statements, other_documents, etc.
 */

import { UPLOAD_MODES } from '../uploaderSchema';

export const documentsUploaderConfig = {
  id: 'documents',
  mode: UPLOAD_MODES.IMMEDIATE,
  apiEndpoint: '/api/update-file',
  entityType: null, // Can be any entity type
  endpointIdentifier: null, // Will be set dynamically

  fields: [
    {
      name: 'file',
      type: 'file',
      label: 'Document',
      required: true,
      validation: {
        accept: 'image/*,application/pdf',
        maxSize: 10 * 1024 * 1024,
      },
    },
    {
      name: 'comment',
      type: 'textarea',
      label: 'Comment',
      required: false,
      props: {
        rows: 3,
        placeholder: 'Add any notes or comments about this document...',
      },
    },
  ],
};

/**
 * Documents with Issue Date
 * Examples: road_tests, tax_papers, driver_statements, abstracts
 */
export const documentsWithIssueDateConfig = {
  id: 'documents_with_issue_date',
  mode: UPLOAD_MODES.IMMEDIATE,
  apiEndpoint: '/api/update-file',
  entityType: null,
  endpointIdentifier: null,

  fields: [
    {
      name: 'file',
      type: 'file',
      label: 'Document',
      required: true,
      validation: {
        accept: 'image/*,application/pdf',
        maxSize: 10 * 1024 * 1024,
      },
    },
    {
      name: 'issue_date',
      type: 'date',
      label: 'Issue Date',
      required: true,
    },
    {
      name: 'comment',
      type: 'textarea',
      label: 'Comment',
      required: false,
      props: {
        rows: 3,
      },
    },
  ],
};

/**
 * Documents with Expiry Date
 * Examples: immigration_doc, pdic_certificates, tdg_cards
 */
export const documentsWithExpiryDateConfig = {
  id: 'documents_with_expiry_date',
  mode: UPLOAD_MODES.IMMEDIATE,
  apiEndpoint: '/api/update-file',
  entityType: null,
  endpointIdentifier: null,

  fields: [
    {
      name: 'file',
      type: 'file',
      label: 'Document',
      required: true,
      validation: {
        accept: 'image/*,application/pdf',
        maxSize: 10 * 1024 * 1024,
      },
    },
    {
      name: 'expiry_date',
      type: 'date',
      label: 'Expiry Date',
      required: true,
    },
  ],
};
