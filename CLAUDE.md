# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` (runs on port 3002)
- **Build**: `npm run build`
- **Start production**: `npm start`
- **Lint**: `npm run lint`

## Project Architecture

This is a Next.js 16 application serving as an office management system for 4Tracks Ltd, a transportation company. The application manages drivers, trucks, equipment, employees, incidents, violations, and various administrative tasks.

### Key Technologies
- **Framework**: Next.js 16 with App Router
- **Backend**: Prisma ORM with PostgreSQL database
- **Database**: PostgreSQL 16 (local via Homebrew)
- **Styling**: Tailwind CSS with dark mode support
- **Authentication**: NextAuth.js with Azure AD integration (currently disabled for testing)
- **UI Components**: shadcn/ui (Radix UI primitives), Material-UI (MUI) for legacy components
- **Data Tables**: MUI DataGrid and custom table components
- **Maps**: Leaflet with React Leaflet
- **File Handling**: Real file uploads to `uploads/` directory with server-side processing

### Application Structure

#### Authentication & Authorization
- Role-based access control with 8 distinct roles: dispatch, safety, recruiting, payroll, payrollManager, planner, shop, admin, portalHr
- API routes are secured via middleware (`src/middleware.js`) using role mappings defined in `src/apiMappingMiddleware.js`
- Azure AD integration for SSO

#### Core Entities
- **Drivers**: Full lifecycle management from recruiting to active employment
- **Trucks & Equipment**: Fleet management with status tracking
- **Employees**: Office staff management separate from drivers
- **Incidents**: Safety incident tracking and reporting
- **Violations**: Tickets and inspections management
- **WCB Claims**: Workers compensation claims

#### Key Features
- **Dashboard**: Multi-role dashboard with different views including shop dashboard for 4K displays
- **Navigation**: Modern sidebar with grouped sections and role-based visibility
  - **Employees**: Office employees, production employees (drivers), reports, expiring docs, WCB claims, incidents
  - **Equipment**: Trucks, trailers, reports, accidents, issues, service orders
  - **Suppliers**: Suppliers, purchase orders, deliveries, invoices, payments, performance reports, contracts, quality issues, expiring docs
  - **Customers**: Customers, orders, claims, quotes, invoices
  - **Legacy**: Original flat navigation structure (temporary, will be removed)
- **Card System**: Detailed info cards for each entity (driver cards, truck cards, etc.) with tabbed interfaces
  - **General Info Tab**: Read-only overview with inline field display and clickable file viewing sections
  - **Checklist Tab**: Configuration-driven checklist with compact rows for data fields and file uploads
    - Uses `CompactDataRow` for always-editable data fields with inline save/cancel
    - Uses `CompactFileRow` for file items with review checkboxes and action buttons (upload/view)
    - Uses `CompactFileViewRow` for read-only file viewing (used in General tab)
    - Grouped into Cards: "General Information" (data) and "Documents" (files)
- **File Management**: Document upload/download with compression and preview
  - Role-based permissions for view/edit/delete operations
  - Version history tracking with review status and reviewer names
- **Reporting**: PDF generation, payroll reports, seals reports
- **Time Tracking**: Employee timecards and attendance management
- **Real-time Updates**: Live shop dashboard for bay management

#### File Organization
- `src/app/`: Next.js app router pages and layouts
- `src/app/api/v1/`: Universal API routes using entity-type pattern
  - `[entityType]/route.js`: GET (list), POST (create)
  - `[entityType]/[id]/route.js`: GET (detail), PATCH (update), DELETE (soft delete)
  - `[entityType]/[id]/documents/route.js`: Document upload/list
  - `[entityType]/[id]/activity/route.js`: Activity log retrieval
  - `[entityType]/[id]/activity-history/route.js`: Activity history CRUD
  - `[entityType]/[id]/activity-history/[activityId]/route.js`: Single activity history operations
  - `files/[...path]/route.js`: File serving endpoint
  - `status-settings/employee/route.js`: Status configuration endpoint
- `src/app/components/`: Reusable UI components (70+ components)
  - `src/app/components/tabs/checklist/`: Checklist components
    - `ChecklistTab.jsx`: Main checklist container with progress tracking
    - `CompactDataRow.jsx`: Inline-editable data fields for checklists
    - `CompactFileRow.jsx`: File upload/review rows with button groups
    - `CompactFileViewRow.jsx`: Read-only clickable file rows (for General tab)
    - `ViewFilesModal.jsx`: Modal for viewing file history (supports read-only mode)
  - `src/app/components/tabs/general-info/`: General info tab components
    - `GeneralInfoTab.jsx`: Main general info container
    - `FileSectionAccordion.jsx`: File sections (supports read-only mode)
- `src/app/context/`: React contexts for state management
- `src/app/functions/`: Utility functions
- `src/config/`: Configuration files
  - `src/config/cards/`: Entity card configurations
  - `src/config/checklists/`: Checklist configurations (e.g., `truckChecklist.config.js`)
  - `src/config/forms/`: Form configurations
  - `src/config/menu.config.js`: Sidebar navigation menu configuration with role-based visibility
- `src/components/ui/`: shadcn/ui components
- `src/middleware.js`: Authentication and authorization middleware
- `src/apiMappingMiddleware.js`: Role-based API access control

#### State Management
- React Context for global state (LoaderContext, NextAuthProvider)
- MUI LocalizationProvider for date/time handling
- Session management via NextAuth

#### API Architecture
- **Universal API Pattern**: Dynamic entity-type routing using `[entityType]` parameters
  - Primary API: `/api/v1/[entityType]` (e.g., `/api/v1/employees`, `/api/v1/trucks`)
  - Entity detail: `/api/v1/[entityType]/[id]`
  - Documents: `/api/v1/[entityType]/[id]/documents`
  - Activity logs: `/api/v1/[entityType]/[id]/activity`
  - Activity history: `/api/v1/[entityType]/[id]/activity-history`
  - File serving: `/api/v1/files/[...path]`
- **Entity Type Naming**: Plural form (e.g., `employees`, `trucks`, `drivers`)
- **Database Pattern**: Generic `entityType + entityId` fields instead of specific foreign keys
- **RESTful Design**: Standard HTTP methods (GET, POST, PATCH, DELETE)
- **Authentication**: Currently disabled for testing (will be re-enabled in production)
- **File Uploads**: Real files saved to `uploads/{entityType}/{uuid}/{documentType}/{filename}`
- **Activity Tracking**: Automatic field-level change logging on updates
- **Status Management**: Database-driven status configurations with state transitions

#### Development Notes
- The application uses environment variables for Azure role IDs in the API mapping
- Supports both light and dark themes
- Responsive design with special 4K display support for shop dashboards
- Extensive logging and activity history tracking
- Multi-language date/time support with timezone handling

#### UI Component Guidelines
- **shadcn/ui components**: Primary UI library for new components
  - Avoid custom styling on shadcn components - use variants and composition instead
  - Use `variant="outline"` for buttons in button groups to provide visible borders
  - Button groups (from shadcn) handle borders and corners automatically
- **Configuration-driven approach**: Prefer configuration files over hard-coded components
  - Checklist items defined in config files (e.g., `src/config/checklists/`)
  - Card layouts defined in config files (e.g., `src/config/cards/`)
- **Compact layouts**: Prioritize space-efficient designs
  - Use minimal padding (e.g., `py-1.5 px-3` for compact rows)
  - Always-visible inputs preferred over edit-mode toggles for data fields
  - Button groups for action buttons instead of separate buttons

## Universal API Migration (Completed November 2025)

### Migration Overview
The application has been migrated from entity-specific API endpoints to a universal entity-type pattern for better scalability and maintainability.

### Key Changes
1. **API Structure**: Moved from `/api/v1/employees` to `/api/v1/[entityType]`
2. **Entity Type Naming**: All entity types use **plural form** (e.g., `employees`, `trucks`, `drivers`)
3. **Database Schema**:
   - Removed specific foreign keys like `employeeId` from Document and ActivityLog models
   - Added generic `entityType` (String) and `entityId` (UUID) fields
   - Changed EntityType enum from singular to plural: `'employees'` instead of `'employee'`
4. **Backward Compatibility**: None - full migration with database reset

### API Endpoints
All endpoints follow the universal pattern with `entityType` as a dynamic parameter:

- **Collection**: `GET/POST /api/v1/{entityType}`
- **Detail**: `GET/PATCH/DELETE /api/v1/{entityType}/{id}`
- **Documents**: `GET/POST /api/v1/{entityType}/{id}/documents`
- **Activity**: `GET /api/v1/{entityType}/{id}/activity`
- **Activity History**: `/api/v1/{entityType}/{id}/activity-history`
- **Files**: `GET /api/v1/files/{entityType}/{uuid}/{docType}/{filename}`

**Important**: File URLs strip the `uploads/` prefix since the route prepends it automatically.

### Valid Entity Types (Current)
- `employees` - Office employees (implemented)
- `trucks` - Fleet vehicles (planned)
- `drivers` - Production employees (planned)
- `equipment` - Equipment assets (planned)

### Database Schema Updates
```sql
-- EntityType enum updated to plural
CREATE TYPE "EntityType" AS ENUM ('employees');

-- Document model uses generic fields
model Document {
  entityType  String  // Generic: 'employees', 'trucks', etc.
  entityId    String  // Generic: UUID of any entity
  // No specific foreign keys like employeeId
}

-- ActivityLog model uses generic fields
model ActivityLog {
  entityType  String
  entityId    String
  // No specific foreign keys
}
```

### Status Configuration
Employee statuses are now database-driven with state transitions:
- Stored in `status_configs` table with colors and sort order
- Valid transitions defined in `status_transitions` table
- 13 employee statuses spanning recruiting, employment, leave, and separation phases
- Seeded automatically via `prisma/seed.js`

### File Storage Structure
```
uploads/
  {entityType}/           # e.g., 'employees'
    {uuid}/              # Entity UUID
      {documentType}/    # e.g., 'profile_photo', 'resume'
        {timestamp}_{filename}
```

### Configuration Updates
- **Entity configs**: Updated to use plural entity types in API endpoints
- **Photo URLs**: Strip `uploads/` prefix (e.g., `filePath.replace(/^uploads\//, '')`)
- **Validation arrays**: Use plural forms in `VALID_ENTITY_TYPES`

### Testing Notes
- Authentication is **currently disabled** for testing purposes
- Re-enable authentication before production deployment
- All endpoints tested with employees entity type
- Profile photo upload/display fully functional
