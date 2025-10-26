# Prisma Backend Migration - Implementation Plan

**Project Start Date**: 2025-01-26
**Status**: 🚧 In Progress
**Current Phase**: Phase 0 - Next.js Update

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
**Status**: ⬜ Not Started
**Started**: -
**Completed**: -

**Tasks**:
- [ ] Create feature branch: `git checkout -b upgrade-nextjs-15`
- [ ] Update dependencies: `npm install next@latest react@latest react-dom@latest eslint-config-next@latest`
- [ ] Review breaking changes documentation
- [ ] Test build: `npm run build`
- [ ] Test dev server: `npm run dev`
- [ ] Fix any breaking changes
- [ ] Commit: "Upgrade to Next.js 15"
- [ ] Merge to main

**Deliverable**: Next.js 15.2.x running

**Django Migration Impact**: ✅ None (framework update only)

---

### **PHASE 1: Infrastructure Setup**
**Duration**: 1 day
**Status**: ⬜ Not Started
**Started**: -
**Completed**: -

**Tasks**:
- [ ] Create PostgreSQL Docker container with persistent volume
- [ ] Install Prisma: `npm install prisma @prisma/client`
- [ ] Initialize Prisma: `npx prisma init`
- [ ] Configure `.env.local` with DATABASE_URL
- [ ] Update `.gitignore` (add `.env.local`, `uploads/`)
- [ ] Create Prisma client singleton: `src/lib/prisma.js`
- [ ] Create upload directory structure: `mkdir -p uploads/{employees,trucks,drivers}`
- [ ] Test database connection

**Deliverable**: ✅ PostgreSQL running with persistent storage, Prisma installed

**Django Migration Impact**: ✅ None (Django will use same PostgreSQL)

---

### **PHASE 2: Base Schema Design** 🔑 CRITICAL
**Duration**: 2-3 days
**Status**: ⬜ Not Started
**Started**: -
**Completed**: -

**Tasks**:
- [ ] Design base Prisma schema in `prisma/schema.prisma`
- [ ] Implement User model (Django-compatible)
- [ ] Implement EntityStatus enum
- [ ] Implement OfficeEmployee model
- [ ] Implement DocumentType and ReviewStatus enums
- [ ] Implement EmployeeDocument model
- [ ] Implement EmployeeActivityLog model
- [ ] Run migration: `npx prisma migrate dev --name init_office_employees`
- [ ] Generate Prisma Client: `npx prisma generate`
- [ ] Verify in Prisma Studio: `npx prisma studio`

**Key Design Decisions**:
- UUID primary keys (Django-compatible)
- snake_case column names with @map()
- Explicit PostgreSQL types (@db.VarChar, @db.Timestamptz)
- Audit trail fields (createdAt, updatedAt, createdBy, updatedBy)
- Soft delete pattern (isDeleted, deletedAt)

**Deliverable**: ✅ Database schema created, empty tables ready

**Django Migration Impact**: ✅ **EASY** - Standard Django patterns used

**Pause Point**: ✋ Review schema before proceeding

---

### **PHASE 3: File Upload System** 📁 REAL FILES
**Duration**: 2 days
**Status**: ⬜ Not Started
**Started**: -
**Completed**: -

**Tasks**:
- [ ] Create file upload utilities: `src/lib/fileUpload.js`
  - [ ] `saveUploadedFile()` function
  - [ ] `deleteFile()` function
  - [ ] `getFile()` function
- [ ] Create document upload API: `src/app/api/v1/employees/[id]/documents/route.js`
  - [ ] GET endpoint (list documents)
  - [ ] POST endpoint (upload document)
- [ ] Create file download API: `src/app/api/v1/files/[...path]/route.js`
  - [ ] GET endpoint (stream file)
- [ ] Create optional seed script: `prisma/seed.js`
  - [ ] Check if database is empty
  - [ ] Create 3 sample employees only if needed
  - [ ] NO mock files
- [ ] Update `package.json` with prisma.seed configuration
- [ ] Test file upload through API
- [ ] Test file download through API

**Deliverable**: ✅ Can upload and download real files

**Django Migration Impact**: ✅ Same file structure Django will use

**Pause Point**: ✋ Verify file upload/download works

---

### **PHASE 4: REST API Implementation** 🌐 NEW ARCHITECTURE
**Duration**: 2-3 days
**Status**: ⬜ Not Started
**Started**: -
**Completed**: -

**Tasks**:
- [ ] Create API specification document: `API_SPECIFICATION.md`
  - [ ] Base URL and versioning
  - [ ] Standard response format
  - [ ] Error format
  - [ ] Authentication requirements
- [ ] Implement Employees API routes:
  - [ ] GET /api/v1/employees (list with filtering, pagination)
  - [ ] POST /api/v1/employees (create)
  - [ ] GET /api/v1/employees/:id (single with relations)
  - [ ] PATCH /api/v1/employees/:id (update)
  - [ ] DELETE /api/v1/employees/:id (soft delete)
  - [ ] GET /api/v1/employees/:id/documents (list documents)
  - [ ] POST /api/v1/employees/:id/documents (upload - reuse from Phase 3)
  - [ ] GET /api/v1/employees/:id/activity (activity log)
- [ ] Test all endpoints with Postman/Thunder Client
- [ ] Verify pagination works
- [ ] Verify filtering works
- [ ] Verify error handling

**Deliverable**: ✅ Full CRUD API for Office Employees

**Django Migration Impact**: ✅ **DOCUMENTED** - Partner has clear spec to implement

**Pause Point**: ✋ Test all API endpoints

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
| Phase 0: Next.js Update | ⬜ Not Started | - | - | - |
| Phase 1: Infrastructure | ⬜ Not Started | - | - | - |
| Phase 2: Schema Design | ⬜ Not Started | - | - | - |
| Phase 3: File Uploads | ⬜ Not Started | - | - | - |
| Phase 4: REST API | ⬜ Not Started | - | - | - |
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

---

## 🚨 DJANGO MIGRATION READINESS CHECKLIST

- [ ] Same PostgreSQL database
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

- [ ] PostgreSQL persistent across restarts
- [ ] Can create employees via UI
- [ ] Can upload real PDF/image files
- [ ] Files downloadable/viewable
- [ ] Data survives app restarts
- [ ] Prisma Studio usable as admin
- [ ] Clean REST API functional
- [ ] Complete Django documentation
- [ ] Can pause/resume at any phase

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

---

**Last Updated**: 2025-01-26
**Next Review Date**: After Phase 0 completion
