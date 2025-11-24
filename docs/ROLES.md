# Role Management System

## Overview

This application uses a modern database-driven ABAC (Attribute-Based Access Control) permission system with 8 manufacturing-focused roles. All permissions are managed through the database `Permission` table and checked via React hooks and server-side validation.

## Manufacturing Roles

### 1. Admin
- **Description**: System administrator with full access to all features and settings
- **Access Level**: Complete unrestricted access (superuser)
- **Typical Users**: System administrators, IT staff
- **Employee ID Pattern**: ADM-XXX

### 2. Production Manager
- **Description**: Oversees production operations, equipment, and production employees
- **Access Level**: Read-only access to office employees (general info, no documents)
- **Typical Users**: Production supervisors, plant managers
- **Employee ID Pattern**: PM-XXX

### 3. Production Worker
- **Description**: Factory floor workers with limited self-service access
- **Access Level**: No access to office employees system
- **Typical Users**: Assembly line operators, machine operators
- **Employee ID Pattern**: PW-XXX

### 4. Quality Control
- **Description**: Manages quality assurance, inspections, and supplier quality issues
- **Access Level**: Read-only access to office employees (general info, no documents)
- **Typical Users**: QA inspectors, quality engineers
- **Employee ID Pattern**: QC-XXX

### 5. Maintenance
- **Description**: Manages equipment maintenance, repairs, and service orders
- **Access Level**: No access to office employees system
- **Typical Users**: Maintenance technicians, equipment specialists
- **Employee ID Pattern**: MT-XXX

### 6. Human Resources
- **Description**: Manages employee lifecycle, recruiting, onboarding, and compliance
- **Access Level**: Full CRUD on employees and time entries
- **Typical Users**: HR managers, recruiters, onboarding specialists
- **Employee ID Pattern**: HR-XXX

### 7. Finance
- **Description**: Manages payroll, invoicing, payments, and financial reporting
- **Access Level**: Read-only employees (with documents), Read/Update time entries, Full CRUD on adjustments
- **Typical Users**: Payroll specialists, accountants, finance controllers
- **Employee ID Pattern**: FIN-XXX

### 8. Safety & Compliance
- **Description**: Manages workplace safety, incidents, violations, and regulatory compliance
- **Access Level**: Full access except delete - can create, view all, edit checklists/notes, manage documents
- **Typical Users**: Safety officers, compliance managers
- **Employee ID Pattern**: SAF-XXX

## Permission Matrix

### Entity CRUD Permissions

| Role | Employees CRUD | Time Entries | Adjustments |
|------|----------------|--------------|-------------|
| Admin | Full CRUD | Full CRUD | Full CRUD |
| Production Manager | Read only | - | - |
| Production Worker | No access | - | - |
| Quality Control | Read only | - | - |
| Maintenance | No access | - | - |
| Human Resources | Full CRUD | Full CRUD | Full CRUD |
| Finance | Read only | Read, Update | Full CRUD |
| Safety & Compliance | Create, Read, Update (no delete) | - | - |

### Document Permissions

| Role | View | Upload | Edit | Delete |
|------|------|--------|------|--------|
| Admin | ✓ | ✓ | ✓ | ✓ |
| Production Manager | ✗ | ✗ | ✗ | ✗ |
| Production Worker | ✗ | ✗ | ✗ | ✗ |
| Quality Control | ✗ | ✗ | ✗ | ✗ |
| Maintenance | ✗ | ✗ | ✗ | ✗ |
| Human Resources | ✓ | ✓ | ✓ | ✓ |
| Finance | ✓ | ✗ | ✗ | ✗ |
| Safety & Compliance | ✓ | ✓ | ✓ | ✓ |

### Tab-Level Access (Employee Card Tabs)

Employee cards have 5 tabs: General Info, Pre-Hiring, Onboarding, Notes, Time Card

| Role | General Info | Pre-Hiring | Onboarding | Notes | Time Card |
|------|--------------|------------|------------|-------|-----------|
| Admin | ✓ | ✓ | ✓ | ✓ | ✓ |
| Production Manager | ✓ (no docs) | ✗ | ✗ | ✗ | ✗ |
| Production Worker | ✗ | ✗ | ✗ | ✗ | ✗ |
| Quality Control | ✓ (no docs) | ✗ | ✗ | ✗ | ✗ |
| Maintenance | ✗ | ✗ | ✗ | ✗ | ✗ |
| Human Resources | ✓ | ✓ | ✓ | ✓ | ✓ |
| Finance | ✓ (with docs) | ✗ | ✗ | ✗ | ✓ |
| Safety & Compliance | ✓ | ✓ | ✓ | ✓ | ✓ |

**Notes**:
- Production Manager & Quality Control see General Info tab but document sections are hidden
- Finance sees document sections in read-only mode
- Pre-Hiring and Onboarding tabs require document management permissions (view + upload)

### Field-Level Permissions

All roles with employee access have full field access (null in database = all fields). No field-level restrictions are currently applied.

## Test User Credentials

All test users share the same password: `demo1234`

| Email | Role | Department | Location |
|-------|------|------------|----------|
| admin@example.com | Admin | Administration | Head Office |
| production.manager@example.com | Production Manager | Assembly | Factory Floor A |
| production.worker@example.com | Production Worker | Assembly | Factory Floor A |
| quality.control@example.com | Quality Control | QA | Quality Lab |
| maintenance@example.com | Maintenance | Maintenance | Maintenance Shop |
| hr@example.com | Human Resources | Administration | Head Office |
| finance@example.com | Finance | Administration | Head Office |
| safety@example.com | Safety & Compliance | Administration | Head Office |

## Technical Implementation

### Database Schema

The permission system uses three main tables:

```sql
-- Role definitions
model Role {
  id          String   @id @default(uuid())
  name        String   @unique
  description String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

-- User-to-Role mapping (many-to-many)
model UserRole {
  userId    String
  roleId    String
  createdAt DateTime @default(now())
}

-- Role permissions with ABAC support
model Permission {
  id         String   @id @default(uuid())
  roleId     String
  entityType String   // e.g., 'employees', 'time_entries'
  actions    String[] // ['create', 'read', 'update', 'delete']
  fields     Json?    // Field-level restrictions
  conditions Json?    // ABAC conditions
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

### Permission Checking

**Client-side hooks** (from `@/lib/permissions/hooks`):
```javascript
import { usePermission, useCurrentUser, useRole } from '@/lib/permissions/hooks';

// Check single permission
const canEdit = usePermission('employees', 'update');

// Check role membership
const isAdmin = useRole('admin');
const isHRorFinance = useRole(['humanResources', 'finance']);

// Get current user with roles
const { user, roles, permissions } = useCurrentUser();
```

**Server-side validation**:
```javascript
import { PermissionChecker } from '@/lib/permissions/permission-checker';

const checker = new PermissionChecker(session);
const canUpdate = await checker.can('employees', 'update', employeeId);
```

### Menu Visibility

Menu items use role arrays for navigation visibility only (not for entity CRUD):

```javascript
// From menu.config.js
{
  id: "employees-office",
  label: "Office Employees",
  icon: "UserTie",
  route: "/table?entity=employees",
  roles: [
    "admin",
    "humanResources",
    "productionManager",
    "qualityControl",
    "finance",
    "safetyCompliance"
  ]
}

// Superuser bypass
export const getVisibleMenuSections = (userRoles, isSuperuser = false) => {
  if (isSuperuser) {
    return MENU_SECTIONS; // See everything
  }
  // ... filter by role arrays
};
```

## Data Seeding

All roles, permissions, and test users are seeded automatically via:

```bash
npm run db:seed
# or
npx prisma migrate reset  # Includes seeding
```

Seed script location: `/prisma/seed.js`

## Key Principles

1. **Single Source of Truth**: Database Permission table is the ONLY system for entity CRUD permissions
2. **Superuser Bypass**: `isSuperuser` flag grants unrestricted access without permission checks
3. **Menu vs Entity Permissions**: Menu uses role arrays for visibility; entity operations use database permissions
4. **Field-Level Control**: Permissions can restrict access to specific fields via JSON configuration
5. **ABAC Support**: Conditions allow attribute-based filtering (e.g., own department, own records)
6. **No Legacy Code**: All transportation-specific roles removed in favor of manufacturing focus

## Migration Notes

Previous system had 9 transportation roles (payroll, safety, dispatch, recruiting, planner, shop, hr). All legacy roles and configuration-based permission checks have been removed. The new system uses 8 manufacturing roles with a clean database-driven architecture following CLAUDE.md documentation.
