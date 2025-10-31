# API Specification - Office Employees

**Version:** 1.0
**Base URL:** `/api/v1`
**Date:** 2025-10-31
**Status:** Phase 4 Complete

## Overview

This document specifies the REST API for the Office Employees module, implemented with Prisma ORM and Next.js 16. The API uses **camelCase** for JSON payloads while the database uses **snake_case** (Prisma's `@map()` directive handles the transformation automatically).

### Django Migration Notes
When migrating to Django REST Framework, use the **djangorestframework-camel-case** package to maintain the same camelCase API contract:
```python
REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': (
        'djangorestframework_camel_case.render.CamelCaseJSONRenderer',
    ),
    'DEFAULT_PARSER_CLASSES': (
        'djangorestframework_camel_case.parser.CamelCaseJSONParser',
    ),
}
```

---

## Authentication

All endpoints require **NextAuth.js** authentication:
- Session-based authentication via cookies
- User must be authenticated to access any endpoint
- Returns `401 Unauthorized` if session is invalid

---

## Standard Response Format

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "error": "Error message",
  "details": "Additional error details (development mode only)"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [ /* array of items */ ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalCount": 150,
    "totalPages": 8,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

---

## Endpoints

### 1. List Employees

**GET** `/api/v1/employees`

List all employees with filtering, pagination, and sorting.

#### Query Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | `1` | Page number (1-indexed) |
| `limit` | integer | `20` | Items per page (max 100) |
| `search` | string | - | Search in firstName, lastName, email, employeeId |
| `status` | string | - | Filter by EmployeeStatus enum value |
| `department` | string | - | Filter by department (partial match) |
| `sortBy` | string | `createdAt` | Field to sort by |
| `sortOrder` | string | `desc` | Sort order (`asc` or `desc`) |

#### Response Example
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-123",
      "employeeId": "EMP001",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phoneNumber": "5551234567",
      "emergencyContactName": "Jane Doe",
      "emergencyContactPhone": "5559876543",
      "addressLine1": "123 Main St",
      "addressLine2": null,
      "city": "Toronto",
      "stateProvince": "ON",
      "postalCode": "M5V 3A8",
      "country": "Canada",
      "hireDate": "2024-01-15",
      "terminationDate": null,
      "jobTitle": "Software Engineer",
      "department": "Engineering",
      "employmentType": "full_time",
      "officeLocation": "Toronto HQ",
      "dateOfBirth": "1990-05-20",
      "status": "active",
      "profilePhoto": {
        "id": "uuid-456",
        "filePath": "uploads/employees/uuid-123/profile/photo.jpg",
        "fileName": "photo.jpg"
      },
      "createdBy": {
        "id": "uuid-789",
        "username": "admin",
        "firstName": "Admin",
        "lastName": "User"
      },
      "updatedBy": { /* same structure */ },
      "_count": {
        "documents": 12,
        "activityLogs": 45
      },
      "createdAt": "2024-01-10T10:30:00Z",
      "updatedAt": "2024-10-31T14:20:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalCount": 150,
    "totalPages": 8,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

#### Status Codes
- `200 OK` - Success
- `400 Bad Request` - Invalid pagination parameters
- `401 Unauthorized` - Not authenticated
- `500 Internal Server Error` - Server error

---

### 2. Create Employee

**POST** `/api/v1/employees`

Create a new employee record.

#### Request Body
```json
{
  "employeeId": "EMP002",
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "phoneNumber": "5551234567",
  "emergencyContactName": "John Smith",
  "emergencyContactPhone": "5559876543",
  "addressLine1": "456 Elm St",
  "city": "Vancouver",
  "stateProvince": "BC",
  "postalCode": "V6B 1A1",
  "country": "Canada",
  "hireDate": "2024-11-01",
  "jobTitle": "Product Manager",
  "department": "Product",
  "employmentType": "full_time",
  "officeLocation": "Vancouver Office",
  "dateOfBirth": "1988-03-15",
  "status": "trainee"
}
```

#### Required Fields
- `employeeId` (string, unique)
- `firstName` (string)
- `lastName` (string)

#### Optional Fields
All other fields are optional.

#### Response Example
```json
{
  "success": true,
  "data": { /* created employee object */ },
  "message": "Employee created successfully"
}
```

#### Status Codes
- `201 Created` - Employee created
- `400 Bad Request` - Missing required fields or duplicate employeeId
- `401 Unauthorized` - Not authenticated
- `500 Internal Server Error` - Server error

---

### 3. Get Single Employee

**GET** `/api/v1/employees/:id`

Get a single employee with all relations (documents, activity logs).

#### URL Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | UUID | Employee ID |

#### Response Example
```json
{
  "success": true,
  "data": {
    /* Same employee object as in list */
    "documents": [
      {
        "id": "uuid-doc-1",
        "employeeId": "uuid-123",
        "documentType": "sin_ssn",
        "filePath": "uploads/employees/uuid-123/sin_ssn/file.pdf",
        "fileName": "sin.pdf",
        "mimeType": "application/pdf",
        "fileSize": 102400,
        "version": 1,
        "metadata": {
          "number": "123456789",
          "comment": "Verified"
        },
        "reviewStatus": "approved",
        "uploadedBy": { /* user object */ },
        "reviewedBy": { /* user object */ },
        "reviewedAt": "2024-10-30T10:00:00Z",
        "createdAt": "2024-10-30T09:00:00Z",
        "updatedAt": "2024-10-30T10:00:00Z"
      }
    ],
    "activityLogs": [
      {
        "id": "uuid-log-1",
        "employeeId": "uuid-123",
        "actionType": "updated",
        "fieldName": "jobTitle",
        "oldValue": "Junior Developer",
        "newValue": "Software Engineer",
        "performedBy": { /* user object */ },
        "createdAt": "2024-10-31T14:20:00Z"
      }
    ]
  }
}
```

#### Status Codes
- `200 OK` - Success
- `401 Unauthorized` - Not authenticated
- `404 Not Found` - Employee not found or soft-deleted
- `500 Internal Server Error` - Server error

---

### 4. Update Employee

**PATCH** `/api/v1/employees/:id`

Update employee fields with automatic field-level change tracking.

#### URL Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | UUID | Employee ID |

#### Request Body
```json
{
  "jobTitle": "Senior Software Engineer",
  "department": "Engineering",
  "status": "active"
}
```

All fields are optional. Only provided fields will be updated.

#### Response Example
```json
{
  "success": true,
  "data": { /* updated employee object */ },
  "message": "Employee updated successfully",
  "changesCount": 3
}
```

#### Notes
- Automatically creates ActivityLog entries for each changed field
- Updates `updatedAt` and `updatedById`
- Validates `employeeId` uniqueness if changed

#### Status Codes
- `200 OK` - Success
- `400 Bad Request` - employeeId conflict
- `401 Unauthorized` - Not authenticated
- `404 Not Found` - Employee not found
- `500 Internal Server Error` - Server error

---

### 5. Delete Employee

**DELETE** `/api/v1/employees/:id`

Soft delete an employee (sets `isDeleted=true`, `deletedAt=now()`).

#### URL Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | UUID | Employee ID |

#### Response Example
```json
{
  "success": true,
  "message": "Employee deleted successfully"
}
```

#### Notes
- Soft delete only (data remains in database)
- Creates ActivityLog entry with action_type="deleted"
- Deleted employees excluded from list queries

#### Status Codes
- `204 No Content` - Success
- `401 Unauthorized` - Not authenticated
- `404 Not Found` - Employee not found
- `500 Internal Server Error` - Server error

---

### 6. Get Employee Activity Log

**GET** `/api/v1/employees/:id/activity`

Get paginated activity log for an employee.

#### URL Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | UUID | Employee ID |

#### Query Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | `1` | Page number |
| `limit` | integer | `50` | Items per page (max 200) |

#### Response Example
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-log-1",
      "employeeId": "uuid-123",
      "actionType": "created",
      "fieldName": null,
      "oldValue": null,
      "newValue": "John Doe",
      "performedBy": {
        "id": "uuid-789",
        "username": "admin",
        "firstName": "Admin",
        "lastName": "User",
        "email": "admin@example.com"
      },
      "createdAt": "2024-01-10T10:30:00Z"
    },
    {
      "id": "uuid-log-2",
      "actionType": "updated",
      "fieldName": "status",
      "oldValue": "trainee",
      "newValue": "active",
      "performedBy": { /* user object */ },
      "createdAt": "2024-02-15T11:00:00Z"
    },
    {
      "id": "uuid-log-3",
      "actionType": "document_uploaded",
      "fieldName": "documents",
      "oldValue": null,
      "newValue": "sin_ssn: sin.pdf",
      "performedBy": { /* user object */ },
      "createdAt": "2024-03-01T09:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "totalCount": 45,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

#### Status Codes
- `200 OK` - Success
- `400 Bad Request` - Invalid pagination
- `401 Unauthorized` - Not authenticated
- `404 Not Found` - Employee not found
- `500 Internal Server Error` - Server error

---

### 7. List Employee Documents

**GET** `/api/v1/employees/:id/documents`

List all documents for an employee (implemented in Phase 3).

#### URL Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | UUID | Employee ID |

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `documentType` | string | Filter by DocumentType enum value |

#### Response Example
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-doc-1",
      "employeeId": "uuid-123",
      "documentType": "sin_ssn",
      "filePath": "uploads/employees/uuid-123/sin_ssn/1698765432_sin.pdf",
      "fileName": "sin.pdf",
      "mimeType": "application/pdf",
      "fileSize": 102400,
      "version": 1,
      "metadata": {
        "number": "123456789"
      },
      "reviewStatus": "pending",
      "uploadedBy": {
        "id": "uuid-user",
        "username": "john.doe",
        "firstName": "John",
        "lastName": "Doe"
      },
      "reviewedBy": null,
      "reviewedAt": null,
      "createdAt": "2024-10-30T09:00:00Z",
      "updatedAt": "2024-10-30T09:00:00Z"
    }
  ],
  "count": 12
}
```

#### Status Codes
- `200 OK` - Success
- `401 Unauthorized` - Not authenticated
- `500 Internal Server Error` - Server error

---

### 8. Upload Employee Document

**POST** `/api/v1/employees/:id/documents`

Upload a document for an employee (implemented in Phase 3).

#### URL Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | UUID | Employee ID |

#### Request (FormData)
```
file: File (required)
documentType: string (required) - DocumentType enum value
metadata: JSON string (optional) - Document metadata
```

#### Request Example
```javascript
const formData = new FormData();
formData.append('file', fileObject);
formData.append('documentType', 'sin_ssn');
formData.append('metadata', JSON.stringify({
  number: '123456789',
  comment: 'Verified by HR'
}));
```

#### Response Example
```json
{
  "success": true,
  "data": { /* created document object */ },
  "message": "Document uploaded successfully"
}
```

#### Notes
- Max file size: 10MB
- Allowed types: images, PDFs, Word documents
- File stored at: `uploads/employees/{uuid}/{documentType}/{timestamp}_{filename}`
- Creates ActivityLog entry
- Auto-creates User if session user not in database

#### Status Codes
- `201 Created` - Document uploaded
- `400 Bad Request` - Missing file/documentType, invalid file type/size
- `401 Unauthorized` - Not authenticated
- `404 Not Found` - Employee not found
- `500 Internal Server Error` - Server error

---

## Data Models

### EmployeeStatus Enum (13 values)
```typescript
type EmployeeStatus =
  // Recruiting
  | "new"
  | "application_received"
  | "under_review"
  | "application_on_hold"
  | "rejected"
  // Employment
  | "trainee"
  | "active"
  | "resigned"
  // Leave
  | "vacation"
  | "on_leave"
  | "wcb"
  // Separation
  | "terminated"
  | "suspended";
```

### EmploymentType Enum (3 values)
```typescript
type EmploymentType = "full_time" | "part_time" | "contract";
```

### DocumentType Enum (18 values)
```typescript
type DocumentType =
  // Identity & Work Auth
  | "government_id"
  | "work_authorization"
  | "sin_ssn"
  // Banking & Tax
  | "direct_deposit"
  | "tax_forms"
  // Hiring Docs
  | "employment_application"
  | "resume"
  | "background_check_consent"
  | "emergency_contact"
  // Contracts & Policies
  | "employment_contract"
  | "company_policies"
  | "confidentiality_agreement"
  | "benefits_enrollment"
  // Certifications
  | "professional_certifications"
  | "education_verification"
  | "safety_training"
  // Other
  | "immigration_documents"
  | "other_documents";
```

### ReviewStatus Enum (3 values)
```typescript
type ReviewStatus = "pending" | "approved" | "rejected";
```

### Document Metadata (JSONB)

Flexible metadata stored per document type:

**sin_ssn:**
```json
{
  "number": "123456789",
  "comment": "Optional note"
}
```

**immigration_documents:**
```json
{
  "documentName": "Work Permit",
  "number": "WP123456",
  "issueDate": "2024-01-01",
  "expiryDate": "2026-01-01",
  "country": "Canada",
  "comment": "Optional note"
}
```

**professional_certifications:**
```json
{
  "certificationName": "PMP",
  "certificationNumber": "12345",
  "issueDate": "2023-06-01",
  "expiryDate": "2026-06-01",
  "issuingAuthority": "PMI",
  "comment": "Optional note"
}
```

---

## Error Codes

| Status | Error | Description |
|--------|-------|-------------|
| 400 | Bad Request | Invalid request parameters, missing required fields, validation errors |
| 401 | Unauthorized | Authentication required or session expired |
| 404 | Not Found | Resource not found or soft-deleted |
| 500 | Internal Server Error | Unexpected server error (includes details in development mode) |

---

## File Downloads

To download/view files, use:

**GET** `/api/v1/files/{filePath}`

Example: `/api/v1/files/uploads/employees/uuid-123/sin_ssn/1698765432_sin.pdf`

Returns the file with proper MIME type headers.

---

## Rate Limiting

No rate limiting currently implemented.

---

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2025-10-31 | 1.0 | Initial API specification - Phase 4 complete |

---

## Next Steps (Phase 5)

- Update EmployeeContext to use new API
- Create React hooks (useEmployees, useEmployee, useEmployeeDocuments)
- Connect frontend table and card components
- End-to-end testing
