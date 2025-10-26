# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` (runs on port 3002)
- **Build**: `npm run build`
- **Start production**: `npm start`
- **Lint**: `npm run lint`

## Project Architecture

This is a Next.js 14 application serving as an office management system for 4Tracks Ltd, a transportation company. The application manages drivers, trucks, equipment, employees, incidents, violations, and various administrative tasks.

### Key Technologies
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with dark mode support
- **Authentication**: NextAuth.js with Azure AD integration
- **UI Components**: shadcn/ui (Radix UI primitives), Material-UI (MUI) for legacy components
- **Data Tables**: MUI DataGrid and custom table components
- **Maps**: Leaflet with React Leaflet
- **File Handling**: Multer for uploads, image compression with Compressor.js

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
- `src/app/api/`: API routes (80+ endpoints)
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
- RESTful API design with role-based access control
- Extensive API layer with 80+ endpoints
- File upload handling with compression
- PDF generation endpoints
- Integration with external systems for data synchronization

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
