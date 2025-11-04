# Prisma Backend Migration - Implementation Plan

**Project Start Date**: 2025-01-26
**Status**: 🚧 In Progress
**Current Phase**: Phase 4.5 - Universal API Migration (Completed)
**Next Phase**: Phase 5 - Frontend Integration

---

## 🎯 PROJECT OVERVIEW

**Goal**: Create a production-ready Prisma backend for local development with:
- ✅ Real PostgreSQL database with persistent data
- ✅ Actual file uploads (not mocked)
- ✅ Clean REST API architecture
- ✅ Easy Django migration path
- ✅ Multi-customer scalable design

**Approach**: Build new API alongside existing Django-connected code, allowing gradual frontend migration.

---

## 📋 IMPLEMENTATION PHASES

### **PHASE 0: Next.js Update** ⚠️ PREREQUISITE
**Duration**: 1-2 days
**Status**: ✅ Completed
**Started**: 2025-01-26
**Completed**: 2025-01-26

**Tasks**:
- [x] Create feature branch: `git checkout -b upgrade-nextjs-15`
- [x] Update dependencies: `npm install next@latest react@latest react-dom@latest eslint@latest eslint-config-next@latest`
- [x] Review breaking changes documentation
- [x] Test build: `npm run build`
- [x] Test dev server: `npm run dev`
- [x] Fix breaking changes:
  - [x] Updated `images.domains` → `images.remotePatterns` in next.config.mjs
  - [x] Renamed `src/middleware.js` → `src/proxy.js`
  - [x] Fixed Suspense boundary in `/table` page for `useSearchParams()`
- [x] Commit: "Upgrade to Next.js 16 and add Prisma migration plan"
- [x] Merge to main

**Deliverable**: ✅ Next.js 16.0.0 running (React 19.2.0, ESLint 9)

**Django Migration Impact**: ✅ None (framework update only)

---

### **PHASE 1: Infrastructure Setup**
**Duration**: 1 day
**Status**: ✅ Completed
**Started**: 2025-01-26
**Completed**: 2025-01-26

**Tasks**:
- [x] Install PostgreSQL 16 via Homebrew: `brew install postgresql@16`
- [x] Start PostgreSQL service: `brew services start postgresql@16`
- [x] Create development database: `createdb bot_demo_dev`
- [x] Install Prisma: `npm install -D prisma --legacy-peer-deps`
- [x] Install Prisma Client: `npm install @prisma/client --legacy-peer-deps`
- [x] Initialize Prisma: `npx prisma init`
- [x] Configure `.env.local` with DATABASE_URL: `postgresql://nikita_sazonov@localhost:5432/bot_demo_dev`
- [x] Create Prisma client singleton: `src/lib/prisma.js`
- [x] Create upload directory structure: `mkdir -p uploads/{employees,trucks,drivers}`
- [x] Test database connection: ✅ Connected successfully

**Deliverable**: ✅ PostgreSQL 16.10 running locally, Prisma 6.x installed

**Notes**:
- Used local PostgreSQL via Homebrew instead of Docker (Docker not available)
- PostgreSQL runs as background service and starts automatically on system boot
- Database persists in `/opt/homebrew/var/postgresql@16`

**Django Migration Impact**: ✅ None (Django will use same PostgreSQL)

---

### **PHASE 2: Base Schema Design** 🔑 CRITICAL
**Duration**: 2-3 days
**Status**: ✅ Completed
**Started**: 2025-10-27
**Completed**: 2025-10-27

**IMPORTANT CONTEXT**:
- ⚠️ The existing Django system is **LEGACY** and highly customized for 4Tracks Ltd (transportation company)
- 🎯 This phase creates a **NEW, STANDARDIZED** schema for a general-purpose ERP product
- 🎯 Target markets: Production companies, logistics companies, service companies, government structures
- 📋 **Scope**: Office employees only (production/driver-specific features deferred to future phases)

**Tasks**:
- [x] Design base Prisma schema in `prisma/schema.prisma`
- [x] Implement User model (Django-compatible)
- [x] Implement EmployeeStatus enum (13 statuses - simplified from legacy 13)
- [x] Implement OfficeEmployee model (standardized fields, NOT legacy 4Tracks-specific)
- [x] Implement DocumentType enum (18 comprehensive document types for North American hiring)
- [x] Implement ReviewStatus enum (3 values: pending, approved, rejected)
- [x] Implement EmploymentType enum (3 values: full_time, part_time, contract)
- [x] Implement Document model (universal file tracking, replaces legacy EmployeeDocument)
- [x] Implement ActivityLog model (audit trail)
- [x] Run migration: `npx prisma migrate dev --name init_standardized_schema`
- [x] Generate Prisma Client: `npx prisma generate`
- [x] Verify in Prisma Studio: `npx prisma studio`

**Schema Details**:

**EmployeeStatus Enum (13 values)**:
- Recruiting: `new`, `application_received`, `under_review`, `application_on_hold`, `rejected`
- Employment: `trainee`, `active`, `resigned`
- Leave: `vacation`, `on_leave`, `wcb` (workers' compensation)
- Separation: `terminated`, `suspended`

**DocumentType Enum (18 values)**:
- Identity & Work Auth (3): `government_id`, `work_authorization`, `sin_ssn`
- Banking & Tax (2): `direct_deposit`, `tax_forms`
- Hiring Docs (4): `employment_application`, `resume`, `background_check_consent`, `emergency_contact`
- Contracts & Policies (4): `employment_contract`, `company_policies`, `confidentiality_agreement`, `benefits_enrollment`
- Certifications (3): `professional_certifications`, `education_verification`, `safety_training`
- Other (2): `immigration_documents`, `other_documents`

**Document Checklist Organization (Phase 4)**:
- **Pre-Hiring Checklist** (7 docs): `resume`, `government_id`, `work_authorization`, `immigration_documents`, `education_verification`, `professional_certifications`, `background_check_consent`
  - Purpose: Applicant uploads before offer acceptance
  - Used by: Recruiting/HR for candidate evaluation
- **Onboarding Checklist** (9 docs): `employment_contract`, `company_policies`, `confidentiality_agreement`, `sin_ssn`, `direct_deposit`, `tax_forms`, `benefits_enrollment`, `safety_training`, `other_documents`
  - Purpose: Employee completes after joining company
  - Used by: Payroll/HR for employee setup
- **Not used as document types in checklists**:
  - `employment_application` - Not a separate document (the pre-hiring checklist itself is the application)
  - `emergency_contact` - Not a document (data fields in OfficeEmployee: emergencyContactName, emergencyContactPhone)

**OfficeEmployee Model (standardized fields)**:
- Identity: employee_id, first_name, last_name
- Contact: email, phone_number, emergency_contact_name, emergency_contact_phone
- Address: address_line1, address_line2, city, state_province, postal_code, country
- Employment: hire_date, termination_date, job_title, department, employment_type (enum), office_location, date_of_birth
- Status: status (enum)
- Photo: profile_photo_id (FK to Document)
- Audit: created_at, updated_at, created_by, updated_by, is_deleted, deleted_at

**Key Design Decisions**:
- ✅ UUID primary keys (Django-compatible)
- ✅ snake_case column names with @map()
- ✅ Explicit PostgreSQL types (@db.VarChar, @db.Timestamptz)
- ✅ Audit trail fields (created_at, updated_at, created_by, updated_by)
- ✅ Soft delete pattern (is_deleted, deleted_at)
- ✅ Generic/Standardized: NO client-specific fields (no "terminal", "card_number", "immigration_status" from legacy)
- ✅ Country-agnostic: Generic document types, companies can customize labels later
- ✅ Simple status workflow: 13 practical statuses, not a "game" with excessive micro-states

**Deliverable**: ✅ Database schema created, empty tables ready, standardized for multi-client ERP

**Django Migration Impact**: ✅ **EASY** - Standard Django patterns used

**Pause Point**: ✋ Review schema before proceeding

---

### **PHASE 3: File Upload System** 📁 REAL FILES
**Duration**: 2 days
**Status**: ✅ Completed
**Started**: 2025-10-28
**Completed**: 2025-10-28

**Tasks**:
- [x] Create file upload utilities: `src/lib/fileUpload.js`
  - [x] `saveUploadedFile()` function
  - [x] `deleteFile()` function
  - [x] `getFilePath()` function
  - [x] File validation functions
- [x] Create document upload API: `src/app/api/v1/employees/[id]/documents/route.js`
  - [x] GET endpoint (list documents with relations)
  - [x] POST endpoint (upload document with metadata)
  - [x] Next.js 16 async params pattern
  - [x] NextAuth authentication integration
- [x] Create file download API: `src/app/api/v1/files/[...path]/route.js`
  - [x] GET endpoint (stream file with proper headers)
  - [x] Security: Directory traversal prevention
  - [x] MIME type detection
- [x] Create seed script: `prisma/seed.js`
  - [x] Check if database is empty
  - [x] Create 1 admin user + 3 sample employees
  - [x] NO mock files (as planned)
  - [x] CommonJS compatible
- [x] Update `package.json` with prisma.seed configuration
  - [x] Added db:studio, db:migrate, db:seed, db:reset scripts
  - [x] Configured prisma.seed for auto-run on reset
- [x] Update .gitignore for uploads directory
  - [x] Ignore uploaded files but keep structure with .gitkeep
- [x] Test database seeding: Successful
- [x] API endpoints ready for testing with frontend/Postman

**Implementation Details**:
- **File Structure**: Hybrid approach `uploads/employees/{uuid}/{docType}/{timestamp}_{filename}`
- **Next.js 16 Features**: Async params, NextResponse, native FormData handling
- **Authentication**: getServerSession(authOptions) integration
- **Error Handling**: Proper HTTP status codes with development-mode details
- **Activity Logging**: Automatic logging of document uploads

**Deliverable**: ✅ Can upload and download real files via REST API

**Django Migration Impact**: ✅ Same file structure Django will use

**Pause Point**: ✋ Ready for Phase 4 or frontend integration testing

---

### **PHASE 4: REST API Implementation** 🌐 NEW ARCHITECTURE
**Duration**: 2-3 days
**Status**: ✅ Completed
**Started**: 2025-10-31
**Completed**: 2025-10-31

**Tasks**:
- [x] Create API specification document: `docs/API_SPECIFICATION.md`
- [x] Implement Employees API routes (6 new endpoints):
  - [x] GET /api/v1/employees (list with filtering, pagination, sorting)
  - [x] POST /api/v1/employees (create with auto User creation)
  - [x] GET /api/v1/employees/:id (single with documents, activityLogs relations)
  - [x] PATCH /api/v1/employees/:id (update with automatic field-level change tracking)
  - [x] DELETE /api/v1/employees/:id (soft delete)
  - [x] GET /api/v1/employees/:id/activity (paginated activity log)
  - [x] GET /api/v1/employees/:id/documents (reused from Phase 3)
  - [x] POST /api/v1/employees/:id/documents (reused from Phase 3)
- [x] Create API helpers: `src/lib/apiHelpers.js`
- [x] Create document metadata schemas: `src/config/prisma/documentMetadataSchemas.js` (18 DocumentTypes with field definitions)
- [x] Update entity config to use `/api/v1/employees`
- [x] Update general info config (removed legacy fields, uses camelCase, 26 OfficeEmployee fields)
- [x] Create two checklist configs:
  - [x] `src/config/checklists/employeePreHiringChecklist.config.js` (7 docs)
  - [x] `src/config/checklists/employeeOnboardingChecklist.config.js` (9 docs)
- [x] Update employee card config (5 tabs: general-info, pre-hiring, onboarding, notes, timecard)
- [x] Fix UPLOAD_MODES hardcoding in CompactFileRow.jsx
- [ ] Test all endpoints with Postman (deferred to Phase 5)

**Implementation Details**:
- **camelCase API**: Frontend uses camelCase, Prisma @map() auto-transforms to/from snake_case DB
- **Django migration**: Use djangorestframework-camel-case for same API contract
- **Emergency contact**: Data fields in OfficeEmployee model (emergencyContactName, emergencyContactPhone), not document
- **Document checklists**: Split into pre-hiring (applicant uploads) vs onboarding (company docs post-acceptance)
- **Activity logging**: Automatic field-level change tracking in PATCH endpoint
- **File uploads**: Uses UPLOAD_MODES.IMMEDIATE from uploaderSchema.js

**Files Created (12)**:
1. `src/app/api/v1/employees/route.js` - List & Create
2. `src/app/api/v1/employees/[id]/route.js` - Detail, Update, Delete
3. `src/app/api/v1/employees/[id]/activity/route.js` - Activity log
4. `src/lib/apiHelpers.js` - API utilities
5. `src/config/prisma/documentMetadataSchemas.js` - Metadata field schemas
6. `src/config/checklists/employeePreHiringChecklist.config.js` - Pre-hiring checklist
7. `src/config/checklists/employeeOnboardingChecklist.config.js` - Onboarding checklist
8. `docs/API_SPECIFICATION.md` - Complete API documentation

**Files Modified (5)**:
1. `src/config/entities/index.js` - Updated API endpoint
2. `src/config/cards/employeeGeneralInfo.config.js` - Removed legacy, added camelCase
3. `src/config/cards/employeeCard.config.js` - Added both checklist tabs
4. `src/app/components/tabs/checklist/CompactFileRow.jsx` - Fixed UPLOAD_MODES
5. `PRISMA_MIGRATION_PLAN.md` - Updated schema details and Phase 4 status

**Deliverable**: ✅ Full CRUD API for Office Employees + Frontend configs ready

**Django Migration Impact**: ✅ **DOCUMENTED** - Complete API spec with camelCase examples

**Pause Point**: ✋ Ready for Phase 5 - Frontend integration and testing

---

### **PHASE 4.5: Universal API Migration** 🔄 ARCHITECTURE IMPROVEMENT
**Duration**: 1 day
**Status**: ✅ Completed
**Started**: 2025-11-04
**Completed**: 2025-11-04

**IMPORTANT CONTEXT**:
- Migrated from entity-specific endpoints `/api/v1/employees` to universal pattern `/api/v1/[entityType]`
- **NO backward compatibility** - complete migration with database reset
- All entity types now use **plural form** (e.g., `employees`, `trucks`, `drivers`)

**Tasks**:
- [x] Update Prisma schema to remove specific foreign keys
  - [x] Remove `employeeId` from Document model
  - [x] Remove `employeeId` from ActivityLog model
  - [x] Change EntityType enum from `'employee'` to `'employees'` (plural)
  - [x] Run migration: `npx prisma migrate dev --name remove_employee_fk`
- [x] Update all API routes to use universal pattern
  - [x] Update VALID_ENTITY_TYPES to use plural forms
  - [x] Update ENTITY_MODELS mappings
  - [x] Remove backward compatibility code
- [x] Update status settings endpoint
  - [x] Change query from `'employee'` to `'employees'`
- [x] Update file serving endpoint
  - [x] Disable authentication for testing
- [x] Update configuration files
  - [x] Fix photo URL construction (strip `uploads/` prefix)
  - [x] Update entity configs to use plural entity types
- [x] Reset database and reseed with new data
  - [x] Update seed script to use `'employees'` entity type
  - [x] Restore status configuration seeding
- [x] Test photo upload and display functionality

**Implementation Details**:
- **Generic Database Pattern**: Uses `entityType + entityId` instead of specific foreign keys
- **Dynamic Routing**: Single set of API routes handles all entity types
- **Scalability**: Easy to add new entity types (trucks, drivers, equipment)
- **File Structure**: `uploads/{entityType}/{uuid}/{documentType}/{filename}`
- **Status Management**: Database-driven with 13 statuses and 21 transitions

**Files Modified (8)**:
1. `prisma/schema.prisma` - Removed employeeId foreign keys
2. `prisma/migrations/.../migration.sql` - Updated EntityType enum
3. `prisma/seed.js` - Updated to use 'employees'
4. `src/app/api/v1/[entityType]/[id]/documents/route.js` - Plural entity types
5. `src/app/api/v1/files/[...path]/route.js` - Disabled auth
6. `src/app/api/v1/status-settings/employee/route.js` - Query 'employees'
7. `src/config/cards/employeeGeneralInfo.config.js` - Fixed photo URL
8. `CLAUDE.md` - Documented migration

**Deliverable**: ✅ Universal API architecture fully functional, photo upload working

**Django Migration Impact**: ✅ **IMPROVED** - Same universal pattern for Django

**Pause Point**: ✋ Ready for Phase 5 - Frontend integration with other entity types

---

### **PHASE 5: Frontend Integration** 🎨 UI CONNECTION
**Duration**: 2-3 days
**Status**: ⬜ Not Started
**Started**: -
**Completed**: -

**Tasks**:
- [ ] Create React hooks: `src/hooks/useEmployees.js`
  - [ ] `useEmployees(filters)` hook
  - [ ] `useEmployee(id)` hook
  - [ ] `useEmployeeDocuments(id)` hook
- [ ] Update Office Employees table page
  - [ ] Connect to /api/v1/employees
  - [ ] Test filtering
  - [ ] Test pagination
- [ ] Update Employee card component
  - [ ] Connect to /api/v1/employees/:id
  - [ ] Test document uploads
  - [ ] Verify activity logs display
- [ ] Update/create file upload component
  - [ ] Connect to new API endpoint
  - [ ] Test with real PDF files
  - [ ] Test with image files
- [ ] End-to-end testing
  - [ ] Create new employee
  - [ ] Upload documents
  - [ ] Edit employee
  - [ ] View activity log

**Deliverable**: ✅ Frontend fully functional with Prisma backend

**Django Migration Impact**: ✅ None (UI uses abstracted API)

**Pause Point**: ✋ Verify all UI features work

---

### **PHASE 6: Documentation for Django Partner** 📄 HANDOFF
**Duration**: 1 day
**Status**: ⬜ Not Started
**Started**: -
**Completed**: -

**Tasks**:
- [ ] Complete API specification: `API_SPECIFICATION.md`
  - [ ] Add request/response examples
  - [ ] Document all error codes
  - [ ] Add authentication flow
- [ ] Create Django migration guide: `DJANGO_MIGRATION_GUIDE.md`
  - [ ] Prisma → Django model mappings
  - [ ] Field type conversion table
  - [ ] Example Django model code for OfficeEmployee
  - [ ] Example Django view code for endpoints
- [ ] Export SQL schema:
  ```bash
  npx prisma migrate diff \
    --from-empty \
    --to-schema-datamodel prisma/schema.prisma \
    --script > schema.sql
  ```
- [ ] Update this plan document with completion dates
- [ ] Create handoff meeting notes

**Deliverable**: ✅ Complete documentation package for Django developer

**Django Migration Impact**: ✅ **READY** - Partner has everything needed

---

## 📁 FILE STRUCTURE

```
bot-demo/
├── uploads/                           # REAL files (gitignored)
│   ├── employees/
│   │   └── {uuid}/
│   │       └── {documentType}_{timestamp}.pdf
│   ├── trucks/
│   └── drivers/
├── prisma/
│   ├── schema.prisma                  # Main schema
│   ├── seed.js                        # Optional initial data
│   ├── migrations/                    # Auto-generated
│   └── schema.sql                     # Exported for Django
├── src/
│   ├── lib/
│   │   ├── prisma.js                  # Prisma client singleton
│   │   └── fileUpload.js              # File handling utilities
│   ├── hooks/
│   │   └── useEmployees.js            # React data hooks
│   └── app/
│       └── api/
│           └── v1/                    # New REST API
│               ├── employees/
│               │   ├── route.js       # GET, POST
│               │   └── [id]/
│               │       ├── route.js   # GET, PATCH, DELETE
│               │       ├── documents/route.js
│               │       └── activity/route.js
│               └── files/
│                   └── [...path]/route.js
├── docs/
│   ├── API_SPECIFICATION.md           # For Django partner
│   ├── DJANGO_MIGRATION_GUIDE.md      # Migration guide
│   └── PRISMA_MIGRATION_PLAN.md       # This document
└── package.json                       # Updated scripts
```

---

## 🛠️ NPM SCRIPTS

```json
{
  "scripts": {
    "dev": "next dev -p 3002",
    "build": "next build",
    "db:studio": "npx prisma studio",
    "db:migrate": "npx prisma migrate dev",
    "db:seed": "npx prisma db seed",
    "db:reset": "npx prisma migrate reset"
  },
  "prisma": {
    "seed": "node prisma/seed.js"
  }
}
```

---

## 📊 PROGRESS TRACKING

| Phase | Status | Started | Completed | Duration |
|-------|--------|---------|-----------|----------|
| Phase 0: Next.js Update | ✅ Completed | 2025-01-26 | 2025-01-26 | ~2 hours |
| Phase 1: Infrastructure | ✅ Completed | 2025-01-26 | 2025-01-26 | ~1 hour |
| Phase 2: Schema Design | ✅ Completed | 2025-10-27 | 2025-10-27 | ~1.5 hours |
| Phase 3: File Uploads | ✅ Completed | 2025-10-28 | 2025-10-28 | ~2 hours |
| Phase 4: REST API | ✅ Completed | 2025-10-31 | 2025-10-31 | ~3 hours |
| Phase 4.5: Universal API Migration | ✅ Completed | 2025-11-04 | 2025-11-04 | ~3 hours |
| Phase 5: Frontend | ⬜ Not Started | - | - | - |
| Phase 6: Documentation | ⬜ Not Started | - | - | - |

**Legend**: ⬜ Not Started | 🚧 In Progress | ✅ Completed

---

## 🔄 DAILY WORKFLOW

**Starting Work**
```bash
# Ensure PostgreSQL is running
docker start bot-demo-dev

# Start dev server
npm run dev

# Open Prisma Studio (optional)
npm run db:studio
```

**Adding Data**
1. Open UI at http://localhost:3002
2. Create employees through UI
3. Upload real documents (PDF, images)
4. Data persists in PostgreSQL
5. Files saved to `uploads/`

**Viewing Data**
```bash
npm run db:studio
# Browse database at http://localhost:5555
```

**Schema Changes**
```bash
# Edit prisma/schema.prisma
npx prisma migrate dev --name description_of_change
npx prisma generate
```

---

## 📝 DECISION LOG

| Date | Decision | Rationale | Impact |
|------|----------|-----------|--------|
| 2025-01-26 | Use PostgreSQL | Matches Django default | Easy migration |
| 2025-01-26 | New REST API (/api/v1) | Clean architecture | Partner must match spec |
| 2025-01-26 | Real file uploads | Production-like dev environment | Test with actual data |
| 2025-01-26 | No TypeScript | Faster initial development | Less type safety |
| 2025-01-26 | Prisma Studio for admin | Built-in, free | Less features than Django admin |
| 2025-01-26 | Separate document tables | Better type safety | More normalized |
| 2025-01-26 | Start with Office Employees | Simplest entity | Validates entire workflow |
| 2025-01-26 | Homebrew PostgreSQL instead of Docker | Docker not available | Local install, auto-starts |
| 2025-11-04 | Universal API with [entityType] pattern | Scalability, maintainability | Easier to add new entities |
| 2025-11-04 | Plural entity type naming | Standard REST convention | More intuitive API |
| 2025-11-04 | Generic entityType+entityId pattern | Avoid entity-specific foreign keys | Simpler schema, better flexibility |
| 2025-11-04 | No backward compatibility | Clean migration | Database reset required |

---

## 🚨 DJANGO MIGRATION READINESS CHECKLIST

- [x] Same PostgreSQL database (bot_demo_dev on localhost:5432)
- [ ] Django-standard naming (snake_case)
- [ ] Standard field types
- [ ] UUID primary keys
- [ ] Complete API documentation
- [ ] Clear endpoint contracts
- [ ] SQL schema exported
- [ ] Example Django code provided
- [ ] File storage structure documented

---

## ✅ SUCCESS CRITERIA

- [x] PostgreSQL persistent across restarts (auto-starts via brew services)
- [ ] Can create employees via UI
- [ ] Can upload real PDF/image files
- [ ] Files downloadable/viewable
- [ ] Data survives app restarts
- [ ] Prisma Studio usable as admin
- [ ] Clean REST API functional
- [ ] Complete Django documentation
- [x] Can pause/resume at any phase (PRISMA_MIGRATION_PLAN.md tracks progress)

---

## 📞 CONTACTS & RESOURCES

- **Frontend Developer**: (You)
- **Backend Partner**: (Your Django developer)
- **Prisma Docs**: https://www.prisma.io/docs
- **Next.js 15 Docs**: https://nextjs.org/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs

---

## 🔄 CHANGE LOG

| Date | Change | Phase | Notes |
|------|--------|-------|-------|
| 2025-01-26 | Plan created | Setup | Initial plan approved |
| 2025-11-04 | Universal API migration completed | Phase 4.5 | Migrated to [entityType] pattern with plural naming |
| 2025-11-04 | Documentation updated | Phase 4.5 | Updated CLAUDE.md and PRISMA_MIGRATION_PLAN.md |

---

**Last Updated**: 2025-11-04
**Next Review Date**: Before Phase 5 (Frontend integration with other entities)
