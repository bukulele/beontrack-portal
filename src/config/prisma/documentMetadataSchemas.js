/**
 * Document Metadata Field Schemas
 * Defines metadata fields for each DocumentType enum value from Prisma schema
 *
 * Based on PRISMA_MIGRATION_PLAN.md - 18 DocumentType values
 * Metadata stored in flexible JSONB column
 */

/**
 * Get metadata field definitions for a specific document type (GENERIC - entity-aware)
 * @param {string} documentType - DocumentType enum value from Prisma schema
 * @param {string} entityType - Entity type (employee, truck, driver, equipment)
 * @returns {Array} Array of field definitions for file upload forms
 */
export function getMetadataFields(documentType, entityType) {
  // For now, only employees schemas exist
  // Future: Add schemas.trucks, schemas.drivers, schemas.equipment
  if (entityType !== 'employees') {
    console.warn(`No metadata schemas defined for entityType: ${entityType}`);
    return [];
  }
  const schemas = {
    // Identity & Work Authorization
    government_id: [
      { name: 'number', type: 'text', label: 'ID Number', placeholder: 'Enter ID number', required: true },
      { name: 'issueDate', type: 'date', label: 'Issue Date', dateRange: { start: 1950, end: 'current' }, required: true },
      { name: 'expiryDate', type: 'date', label: 'Expiry Date', dateRange: { start: 'current', end: 2100 }, required: true },
      { name: 'comment', type: 'textarea', label: 'Comment', placeholder: 'Additional notes' },
    ],
    work_authorization: [
      { name: 'number', type: 'text', label: 'Authorization Number', placeholder: 'Enter authorization number', required: true },
      { name: 'issueDate', type: 'date', label: 'Issue Date', dateRange: { start: 1950, end: 'current' }, required: true },
      { name: 'expiryDate', type: 'date', label: 'Expiry Date', dateRange: { start: 'current', end: 2100 }, required: true },
      { name: 'comment', type: 'textarea', label: 'Comment', placeholder: 'Additional notes' },
    ],
    sin_ssn: [
      { name: 'number', type: 'text', label: 'SIN/SSN', placeholder: '9 digits', pattern: '^\\d{9}$', required: true },
      { name: 'comment', type: 'textarea', label: 'Comment', placeholder: 'Additional notes' },
    ],

    // Banking & Tax
    direct_deposit: [
      { name: 'accountNumber', type: 'text', label: 'Account Number (last 4 digits)', placeholder: 'Last 4 digits only', required: true },
      { name: 'bankName', type: 'text', label: 'Bank Name', placeholder: 'Name of financial institution', required: true },
      { name: 'comment', type: 'textarea', label: 'Comment', placeholder: 'Additional notes' },
    ],
    tax_forms: [
      { name: 'taxYear', type: 'text', label: 'Tax Year', placeholder: 'YYYY', required: true },
      { name: 'formType', type: 'text', label: 'Form Type', placeholder: 'e.g., W-4, T4, etc.', required: true },
      { name: 'issueDate', type: 'date', label: 'Issue Date', dateRange: { start: 1950, end: 'current' }, required: true },
      { name: 'comment', type: 'textarea', label: 'Comment', placeholder: 'Additional notes' },
    ],

    // Hiring Documents
    employment_application: [
      { name: 'applicationDate', type: 'date', label: 'Application Date', dateRange: { start: 1950, end: 'current' }, required: true },
      { name: 'positionApplied', type: 'text', label: 'Position Applied For', placeholder: 'Job title', required: true },
      { name: 'comment', type: 'textarea', label: 'Comment', placeholder: 'Additional notes' },
    ],
    resume: [
      { name: 'comment', type: 'textarea', label: 'Comment', placeholder: 'Additional notes' },
    ],
    background_check_consent: [
      { name: 'consentDate', type: 'date', label: 'Consent Date', dateRange: { start: 1950, end: 'current' }, required: true },
      { name: 'comment', type: 'textarea', label: 'Comment', placeholder: 'Additional notes' },
    ],

    // Employment Contract & Policies
    employment_contract: [
      { name: 'contractDate', type: 'date', label: 'Contract Date', dateRange: { start: 1950, end: 'current' }, required: true },
      { name: 'startDate', type: 'date', label: 'Start Date', dateRange: { start: 1950, end: 'current+5' }, required: true },
      { name: 'endDate', type: 'date', label: 'End Date (if applicable)', dateRange: { start: 'current', end: 2100 } },
      { name: 'comment', type: 'textarea', label: 'Comment', placeholder: 'Additional notes' },
    ],
    company_policies: [
      { name: 'policyName', type: 'text', label: 'Policy Name', placeholder: 'e.g., Code of Conduct', required: true },
      { name: 'version', type: 'text', label: 'Version', placeholder: 'Policy version', required: true },
      { name: 'acknowledgementDate', type: 'date', label: 'Acknowledgement Date', dateRange: { start: 1950, end: 'current' }, required: true },
      { name: 'comment', type: 'textarea', label: 'Comment', placeholder: 'Additional notes' },
    ],
    confidentiality_agreement: [
      { name: 'agreementDate', type: 'date', label: 'Agreement Date', dateRange: { start: 1950, end: 'current' }, required: true },
      { name: 'expiryDate', type: 'date', label: 'Expiry Date (if applicable)', dateRange: { start: 'current', end: 2100 } },
      { name: 'comment', type: 'textarea', label: 'Comment', placeholder: 'Additional notes' },
    ],
    benefits_enrollment: [
      { name: 'enrollmentDate', type: 'date', label: 'Enrollment Date', dateRange: { start: 1950, end: 'current' }, required: true },
      { name: 'planType', type: 'text', label: 'Plan Type', placeholder: 'e.g., Health, Dental', required: true },
      { name: 'effectiveDate', type: 'date', label: 'Effective Date', dateRange: { start: 1950, end: 'current+5' }, required: true },
      { name: 'comment', type: 'textarea', label: 'Comment', placeholder: 'Additional notes' },
    ],

    // Certifications & Qualifications
    professional_certifications: [
      { name: 'certificationName', type: 'text', label: 'Certification Name', placeholder: 'e.g., PMP, CPA', required: true },
      { name: 'certificationNumber', type: 'text', label: 'Certification Number', required: true },
      { name: 'issueDate', type: 'date', label: 'Issue Date', dateRange: { start: 1950, end: 'current' }, required: true },
      { name: 'expiryDate', type: 'date', label: 'Expiry Date', dateRange: { start: 'current', end: 2100 }, required: true },
      { name: 'issuingAuthority', type: 'text', label: 'Issuing Authority', placeholder: 'Organization', required: true },
      { name: 'comment', type: 'textarea', label: 'Comment', placeholder: 'Additional notes' },
    ],
    education_verification: [
      { name: 'institution', type: 'text', label: 'Institution', placeholder: 'University/College name', required: true },
      { name: 'degree', type: 'text', label: 'Degree/Diploma', placeholder: 'e.g., Bachelor of Science', required: true },
      { name: 'graduationDate', type: 'date', label: 'Graduation Date', dateRange: { start: 1950, end: 'current' }, required: true },
      { name: 'comment', type: 'textarea', label: 'Comment', placeholder: 'Additional notes' },
    ],
    safety_training: [
      { name: 'trainingName', type: 'text', label: 'Training Name', placeholder: 'e.g., WHMIS, First Aid', required: true },
      { name: 'completionDate', type: 'date', label: 'Completion Date', dateRange: { start: 1950, end: 'current' }, required: true },
      { name: 'expiryDate', type: 'date', label: 'Expiry Date', dateRange: { start: 'current', end: 2100 }, required: true },
      { name: 'certificationNumber', type: 'text', label: 'Certification Number', required: true },
      { name: 'comment', type: 'textarea', label: 'Comment', placeholder: 'Additional notes' },
    ],

    // Other
    immigration_documents: [
      { name: 'documentName', type: 'text', label: 'Document Name', placeholder: 'e.g., Work Permit, Visa', required: true },
      { name: 'number', type: 'text', label: 'Document Number', required: true },
      { name: 'issueDate', type: 'date', label: 'Issue Date', dateRange: { start: 1950, end: 'current' }, required: true },
      { name: 'expiryDate', type: 'date', label: 'Expiry Date', dateRange: { start: 'current', end: 2100 }, required: true },
      { name: 'country', type: 'text', label: 'Issuing Country', required: true },
      { name: 'comment', type: 'textarea', label: 'Comment', placeholder: 'Additional notes' },
    ],
    other_documents: [
      { name: 'documentName', type: 'text', label: 'Document Name', placeholder: 'Brief description', required: true },
      { name: 'comment', type: 'textarea', label: 'Comment', placeholder: 'Additional notes' },
    ],
  };

  return schemas[documentType] || schemas.other_documents;
}

/**
 * Get all document types with their display labels
 * @returns {Array} Array of { value, label } objects
 */
export function getAllDocumentTypes() {
  return [
    // Identity & Work Authorization
    { value: 'government_id', label: 'Government ID' },
    { value: 'work_authorization', label: 'Work Authorization' },
    { value: 'sin_ssn', label: 'SIN/SSN' },

    // Banking & Tax
    { value: 'direct_deposit', label: 'Direct Deposit (Void Cheque)' },
    { value: 'tax_forms', label: 'Tax Forms' },

    // Hiring Documents
    { value: 'employment_application', label: 'Employment Application' },
    { value: 'resume', label: 'Resume/CV' },
    { value: 'background_check_consent', label: 'Background Check Consent' },

    // Employment Contract & Policies
    { value: 'employment_contract', label: 'Employment Contract' },
    { value: 'company_policies', label: 'Company Policies' },
    { value: 'confidentiality_agreement', label: 'Confidentiality Agreement' },
    { value: 'benefits_enrollment', label: 'Benefits Enrollment' },

    // Certifications & Qualifications
    { value: 'professional_certifications', label: 'Professional Certifications' },
    { value: 'education_verification', label: 'Education Verification' },
    { value: 'safety_training', label: 'Safety Training Certificates' },

    // Other
    { value: 'immigration_documents', label: 'Immigration Documents' },
    { value: 'other_documents', label: 'Other Documents' },
  ];
}

/**
 * Get label for a document type
 * @param {string} documentType - DocumentType enum value
 * @returns {string} Display label
 */
export function getDocumentTypeLabel(documentType) {
  const types = getAllDocumentTypes();
  const found = types.find(t => t.value === documentType);
  return found ? found.label : documentType;
}
