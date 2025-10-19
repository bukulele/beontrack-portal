/**
 * Client-Specific Uploader Configurations
 *
 * This file contains client-specific uploader configurations and mappings.
 * This is the file to modify for different clients.
 */

import { registerUploaderConfig, getUploaderConfig } from './index';
import { licensesUploaderConfig } from './uploaders/licenses.uploader';
import { sinUploaderConfig } from './uploaders/sin.uploader';
import { licensePlateUploaderConfig } from './uploaders/licensePlate.uploader';
import {
  documentsUploaderConfig,
  documentsWithIssueDateConfig,
  documentsWithExpiryDateConfig,
} from './uploaders/documents.uploader';
import { photosUploaderConfig } from './uploaders/photos.uploader';

/**
 * Register all client-specific uploader configurations
 * This runs on app initialization
 */
export function registerClientUploaders() {
  registerUploaderConfig('licenses', licensesUploaderConfig);
  registerUploaderConfig('sin', sinUploaderConfig);
  registerUploaderConfig('license_plate', licensePlateUploaderConfig);
  registerUploaderConfig('documents', documentsUploaderConfig);
  registerUploaderConfig('documents_with_issue_date', documentsWithIssueDateConfig);
  registerUploaderConfig('documents_with_expiry_date', documentsWithExpiryDateConfig);
  registerUploaderConfig('photos', photosUploaderConfig);
}

/**
 * Document Type to Uploader Config Mapping
 *
 * Maps specific document types to their uploader configurations.
 * Based on the document type analysis from the implementation plan.
 */
export const DOCUMENT_TYPE_MAPPING = {
  // Files with issue date
  road_tests: 'documents_with_issue_date',
  tax_papers: 'documents_with_issue_date',
  driver_statements: 'documents_with_issue_date',
  abstracts: 'documents_with_issue_date',
  lcv_certificates: 'documents_with_issue_date',
  good_to_go_cards: 'documents_with_issue_date',
  certificates_of_violations: 'documents_with_issue_date',
  truck_bill_of_sales: 'documents_with_issue_date',
  equipment_bill_of_sales: 'documents_with_issue_date',

  // Files with expiry date
  immigration_doc: 'documents_with_expiry_date',
  pdic_certificates: 'documents_with_expiry_date',
  tdg_cards: 'documents_with_expiry_date',
  lcv_licenses: 'documents_with_expiry_date',
  truck_safety_docs: 'documents_with_expiry_date',
  equipment_safety_docs: 'documents_with_expiry_date',
  truck_registration_docs: 'documents_with_expiry_date',
  equipment_registration_docs: 'documents_with_expiry_date',

  // Files with comment
  log_books: 'documents',
  other_documents: 'documents',
  truck_other_documents: 'documents',
  equipment_other_documents: 'documents',
  claim_documents: 'documents',
  violation_documents: 'documents',
  inspection_documents: 'documents',
  ticket_documents: 'documents',
  id_documents: 'documents',
  wcbclaim_documents: 'documents',

  // Special cases with unique fields
  licenses: 'licenses',
  sin: 'sin',
  truck_license_plates: 'license_plate',
  equipment_license_plates: 'license_plate',
};

/**
 * Creates an uploader config for a specific document type
 *
 * @param {string} documentType - Document type key (e.g., 'licenses', 'sin', 'abstracts')
 * @param {string} entityType - Entity type ('driver', 'truck', etc.)
 * @returns {Object} Uploader configuration
 */
export function getUploaderForDocumentType(documentType, entityType) {
  const baseConfigId = DOCUMENT_TYPE_MAPPING[documentType] || 'documents';

  return getUploaderConfig(baseConfigId, {
    entityType,
    endpointIdentifier: documentType,
  });
}

/**
 * Gets uploader config for a checklist item
 *
 * @param {string} checklistKey - Checklist item key
 * @param {string} entityType - Entity type
 * @returns {Object} Uploader configuration
 */
export function getUploaderForChecklistItem(checklistKey, entityType) {
  return getUploaderForDocumentType(checklistKey, entityType);
}

// Auto-register on import
registerClientUploaders();
