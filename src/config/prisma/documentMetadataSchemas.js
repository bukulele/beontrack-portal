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
      { name: 'number', type: 'text', label: 'ID Number', placeholder: 'Enter ID number' },
      { name: 'issueDate', type: 'date', label: 'Issue Date' },
      { name: 'expiryDate', type: 'date', label: 'Expiry Date' },
      { name: 'comment', type: 'textarea', label: 'Comment', placeholder: 'Additional notes' },
    ],
    work_authorization: [
      { name: 'number', type: 'text', label: 'Authorization Number', placeholder: 'Enter authorization number' },
      { name: 'issueDate', type: 'date', label: 'Issue Date' },
      { name: 'expiryDate', type: 'date', label: 'Expiry Date' },
      { name: 'comment', type: 'textarea', label: 'Comment', placeholder: 'Additional notes' },
    ],
    sin_ssn: [
      { name: 'number', type: 'text', label: 'SIN/SSN', placeholder: '9 digits', pattern: '^\\d{9}$' },
      { name: 'comment', type: 'textarea', label: 'Comment', placeholder: 'Additional notes' },
    ],

    // Banking & Tax
    direct_deposit: [
      { name: 'accountNumber', type: 'text', label: 'Account Number (last 4 digits)', placeholder: 'Last 4 digits only' },
      { name: 'bankName', type: 'text', label: 'Bank Name', placeholder: 'Name of financial institution' },
      { name: 'comment', type: 'textarea', label: 'Comment', placeholder: 'Additional notes' },
    ],
    tax_forms: [
      { name: 'taxYear', type: 'text', label: 'Tax Year', placeholder: 'YYYY' },
      { name: 'formType', type: 'text', label: 'Form Type', placeholder: 'e.g., W-4, T4, etc.' },
      { name: 'issueDate', type: 'date', label: 'Issue Date' },
      { name: 'comment', type: 'textarea', label: 'Comment', placeholder: 'Additional notes' },
    ],

    // Hiring Documents
    employment_application: [
      { name: 'applicationDate', type: 'date', label: 'Application Date' },
      { name: 'positionApplied', type: 'text', label: 'Position Applied For', placeholder: 'Job title' },
      { name: 'comment', type: 'textarea', label: 'Comment', placeholder: 'Additional notes' },
    ],
    resume: [
      { name: 'comment', type: 'textarea', label: 'Comment', placeholder: 'Additional notes' },
    ],
    background_check_consent: [
      { name: 'consentDate', type: 'date', label: 'Consent Date' },
      { name: 'comment', type: 'textarea', label: 'Comment', placeholder: 'Additional notes' },
    ],
    emergency_contact: [
      { name: 'contactName', type: 'text', label: 'Contact Name', placeholder: 'Full name' },
      { name: 'relationship', type: 'text', label: 'Relationship', placeholder: 'e.g., Spouse, Parent' },
      { name: 'phoneNumber', type: 'text', label: 'Phone Number', placeholder: 'Contact phone' },
      { name: 'comment', type: 'textarea', label: 'Comment', placeholder: 'Additional notes' },
    ],

    // Employment Contract & Policies
    employment_contract: [
      { name: 'contractDate', type: 'date', label: 'Contract Date' },
      { name: 'startDate', type: 'date', label: 'Start Date' },
      { name: 'endDate', type: 'date', label: 'End Date (if applicable)' },
      { name: 'comment', type: 'textarea', label: 'Comment', placeholder: 'Additional notes' },
    ],
    company_policies: [
      { name: 'policyName', type: 'text', label: 'Policy Name', placeholder: 'e.g., Code of Conduct' },
      { name: 'version', type: 'text', label: 'Version', placeholder: 'Policy version' },
      { name: 'acknowledgementDate', type: 'date', label: 'Acknowledgement Date' },
      { name: 'comment', type: 'textarea', label: 'Comment', placeholder: 'Additional notes' },
    ],
    confidentiality_agreement: [
      { name: 'agreementDate', type: 'date', label: 'Agreement Date' },
      { name: 'expiryDate', type: 'date', label: 'Expiry Date (if applicable)' },
      { name: 'comment', type: 'textarea', label: 'Comment', placeholder: 'Additional notes' },
    ],
    benefits_enrollment: [
      { name: 'enrollmentDate', type: 'date', label: 'Enrollment Date' },
      { name: 'planType', type: 'text', label: 'Plan Type', placeholder: 'e.g., Health, Dental' },
      { name: 'effectiveDate', type: 'date', label: 'Effective Date' },
      { name: 'comment', type: 'textarea', label: 'Comment', placeholder: 'Additional notes' },
    ],

    // Certifications & Qualifications
    professional_certifications: [
      { name: 'certificationName', type: 'text', label: 'Certification Name', placeholder: 'e.g., PMP, CPA' },
      { name: 'certificationNumber', type: 'text', label: 'Certification Number' },
      { name: 'issueDate', type: 'date', label: 'Issue Date' },
      { name: 'expiryDate', type: 'date', label: 'Expiry Date' },
      { name: 'issuingAuthority', type: 'text', label: 'Issuing Authority', placeholder: 'Organization' },
      { name: 'comment', type: 'textarea', label: 'Comment', placeholder: 'Additional notes' },
    ],
    education_verification: [
      { name: 'institution', type: 'text', label: 'Institution', placeholder: 'University/College name' },
      { name: 'degree', type: 'text', label: 'Degree/Diploma', placeholder: 'e.g., Bachelor of Science' },
      { name: 'graduationDate', type: 'date', label: 'Graduation Date' },
      { name: 'comment', type: 'textarea', label: 'Comment', placeholder: 'Additional notes' },
    ],
    safety_training: [
      { name: 'trainingName', type: 'text', label: 'Training Name', placeholder: 'e.g., WHMIS, First Aid' },
      { name: 'completionDate', type: 'date', label: 'Completion Date' },
      { name: 'expiryDate', type: 'date', label: 'Expiry Date' },
      { name: 'certificationNumber', type: 'text', label: 'Certification Number' },
      { name: 'comment', type: 'textarea', label: 'Comment', placeholder: 'Additional notes' },
    ],

    // Other
    immigration_documents: [
      { name: 'documentName', type: 'text', label: 'Document Name', placeholder: 'e.g., Work Permit, Visa' },
      { name: 'number', type: 'text', label: 'Document Number' },
      { name: 'issueDate', type: 'date', label: 'Issue Date' },
      { name: 'expiryDate', type: 'date', label: 'Expiry Date' },
      { name: 'country', type: 'text', label: 'Issuing Country' },
      { name: 'comment', type: 'textarea', label: 'Comment', placeholder: 'Additional notes' },
    ],
    other_documents: [
      { name: 'documentName', type: 'text', label: 'Document Name', placeholder: 'Brief description' },
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
    { value: 'emergency_contact', label: 'Emergency Contact Form' },

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
