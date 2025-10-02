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
- **UI Components**: Material-UI (MUI), Radix UI components
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
- **Card System**: Detailed info cards for each entity (driver cards, truck cards, etc.) with tabbed interfaces
- **Checklist System**: Pre-hiring and post-hiring checklists for drivers and employees
- **File Management**: Document upload/download with compression and preview
- **Reporting**: PDF generation, payroll reports, seals reports
- **Time Tracking**: Employee timecards and attendance management
- **Real-time Updates**: Live shop dashboard for bay management

#### File Organization
- `src/app/`: Next.js app router pages and layouts
- `src/app/api/`: API routes (80+ endpoints)
- `src/app/components/`: Reusable UI components (70+ components)
- `src/app/context/`: React contexts for state management
- `src/app/functions/`: Utility functions
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
