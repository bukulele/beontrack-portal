# Role System Documentation

## Quick Reference: Test User Credentials

**All passwords: `demo1234`**

| Role | Email | Department | Employee ID |
|------|-------|------------|-------------|
| Administrator | admin@example.com | Administration | ADM-001 |
| Production Manager | production.manager@example.com | Assembly | PM-001 |
| Production Worker | production.worker@example.com | Assembly | PW-001 |
| Quality Control | quality.control@example.com | QA | QC-001 |
| Maintenance | maintenance@example.com | Maintenance | MT-001 |
| Human Resources | hr@example.com | Administration | HR-001 |
| Finance | finance@example.com | Administration | FIN-001 |
| Safety & Compliance | safety@example.com | Administration | SAF-001 |

---

## Role Descriptions

### 1. Administrator (`admin`)
**Full system access with superuser privileges**
- Access: Everything (bypasses all permission checks)
- Use Case: IT staff, system managers

### 2. Production Manager (`productionManager`)
**Oversees production operations, equipment, and production employees**
- Access: Production employees (full CRUD), Equipment (full CRUD), Time tracking approvals
- Use Case: Factory floor managers, production supervisors

### 3. Production Worker (`productionWorker`)
**Factory floor workers with limited self-service access**
- Access: Own employee record only (read-only, limited fields)
- Use Case: Assembly line workers, machine operators
- ABAC Condition: `userId: { eq: '${user.id}' }` (own records only)

### 4. Quality Control (`qualityControl`)
**Manages quality assurance, inspections, and supplier quality issues**
- Access: Quality issues (full CRUD), Inspection reports (full CRUD), Incidents (read)
- Use Case: QA inspectors, quality managers

### 5. Maintenance (`maintenance`)
**Manages equipment maintenance, repairs, and service orders**
- Access: Equipment (full CRUD), Service orders (full CRUD), Suppliers (read-only for parts)
- Use Case: Maintenance technicians, facility managers

### 6. Human Resources (`humanResources`)
**Manages employee lifecycle, recruiting, onboarding, and compliance**
- Access: All employees (full CRUD), Recruiting (full CRUD), Documents (review/approve), WCB claims
- Use Case: HR managers, recruiters, benefits administrators

### 7. Finance (`finance`)
**Manages payroll, invoicing, payments, and financial reporting**
- Access: Employees (read/update payroll fields only), Time tracking (approve hours), Invoices, Payments
- Use Case: Payroll clerks, accountants, finance managers
- Field Restrictions: Limited to payroll-relevant fields

### 8. Safety & Compliance (`safetyCompliance`)
**Manages workplace safety, incidents, violations, and regulatory compliance**
- Access: Incidents (full CRUD), WCB claims (full CRUD), Safety training records, Expiring documents
- Use Case: Safety officers, compliance managers

---

## Employee Status Workflow

### Recruiting Phase
- `new` - Initial applicant status
- `under_review` - Reviewing application
- `application_on_hold` - Paused review
- `rejected` - Application rejected

### Transition Phase
- `offer_accepted` - Offer accepted, ready for onboarding

### Employment Phase
- `trainee` - Training period
- `active` - Fully active employee
- `resigned` - Employee resigned

### Leave Phase
- `vacation` - On vacation
- `on_leave` - Other leave
- `wcb` - Workers compensation leave

### Separation Phase
- `terminated` - Terminated
- `suspended` - Suspended

---

## Employee Card Tabs

### Tab Visibility by Employee Status

| Tab | Visible For Statuses |
|-----|---------------------|
| **Employee Card** (General Info) | All statuses |
| **Pre-Hiring** | `new`, `under_review`, `application_on_hold`, `rejected`, `offer_accepted` |
| **Onboarding** | `offer_accepted`, `trainee`, `active` |
| **Notes** | All statuses |
| **Time Card** | `trainee`, `active`, `vacation`, `on_leave`, `wcb`, `suspended` |

### Tab Visibility by User Role

| Tab | Required Roles |
|-----|---------------|
| **Employee Card** | All roles |
| **Pre-Hiring** | `admin`, `humanResources` |
| **Onboarding** | `admin`, `humanResources` |
| **Notes** | All roles |
| **Time Card** | `admin`, `humanResources`, `finance`, `productionManager` |

---

## Permission Matrix

### Administrator
- **View**: All employees, all tabs
- **Edit**: ✅ Yes, all fields
- **Delete**: ✅ Yes
- **Change Status**: ✅ Yes
- **Tabs**: All tabs visible

### Human Resources
- **View**: All employees, all tabs
- **Edit**: ✅ Yes, all fields
- **Delete**: ✅ Yes
- **Change Status**: ✅ Yes
- **Tabs**: All tabs visible

### Production Manager
- **View**: All employees
- **Edit**: ✅ Yes, all fields
- **Delete**: ✅ Yes
- **Change Status**: ✅ Yes
- **Tabs**: General Info, Notes, Time Card (Pre-Hiring and Onboarding hidden)

### Finance
- **View**: All employees
- **Edit**: ✅ Yes (limited to payroll fields)
- **Delete**: ❌ No
- **Change Status**: ✅ Yes
- **Tabs**: General Info, Notes, Time Card
- **Allowed Fields**: firstName, lastName, email, phoneNumber, employeeId, hireDate, department, jobTitle, status, employmentType
- **Denied Fields**: terminationDate, reasonForLeaving, remarksComments, statusNote

### Production Worker
- **View**: Own employee record only
- **Edit**: ❌ No
- **Delete**: ❌ No
- **Change Status**: ❌ No
- **Tabs**: General Info, Notes (Time Card, Pre-Hiring, Onboarding hidden)
- **Visible Fields**: firstName, lastName, email, phoneNumber, employeeId, status, department, jobTitle, hireDate
- **ABAC Condition**: `{ userId: { eq: '${user.id}' } }`

### Quality Control
- **View**: All employees
- **Edit**: ❌ No
- **Delete**: ❌ No
- **Change Status**: ❌ No
- **Tabs**: General Info, Notes
- **Visible Fields**: firstName, lastName, email, phoneNumber, employeeId, department, status, jobTitle

### Maintenance
- **View**: All employees
- **Edit**: ❌ No
- **Delete**: ❌ No
- **Change Status**: ❌ No
- **Tabs**: General Info, Notes
- **Visible Fields**: firstName, lastName, employeeId, department, phoneNumber (very limited)

### Safety & Compliance
- **View**: All employees
- **Edit**: ❌ No
- **Delete**: ❌ No
- **Change Status**: ❌ No
- **Tabs**: General Info, Notes
- **Visible Fields**: firstName, lastName, email, phoneNumber, employeeId, department, status, jobTitle, hireDate

---

## Checklist-Gated Status Transitions

### Pre-Hiring Checklist
**Gates**: `under_review` → `offer_accepted`

**Required Items**:
- Resume/CV ✅ Required
- Government ID ✅ Required
- Background Check Consent ✅ Required
- Activity History (last 10 years) ✅ Required (validated for gaps)
- Work Authorization (optional)
- Immigration Documents (optional)
- Education Verification (optional)
- Professional Certifications (optional)

### Onboarding Checklist
**Gates**: `offer_accepted` → `trainee` or `offer_accepted` → `active`

**Required Data Fields**:
- Hire Date ✅ Required
- Job Title ✅ Required
- Department ✅ Required
- Employment Type ✅ Required
- Employee ID ✅ Required

**Required Documents**:
- Employment Contract ✅ Required
- SIN/SSN ✅ Required
- Direct Deposit ✅ Required
- Tax Forms ✅ Required
- Company Policies (optional)
- Confidentiality Agreement (optional)
- Benefits Enrollment (optional)
- Safety Training (optional)

---

## Menu Section Visibility

### Employees Section
**Roles**: `admin`, `humanResources`, `finance`, `productionManager`, `safetyCompliance`

### Equipment Section
**Roles**: `admin`, `maintenance`, `productionManager`, `qualityControl`

### Suppliers Section
**Roles**: `admin`, `maintenance`, `finance`, `qualityControl`

### Customers Section
**Roles**: `admin`, `productionManager`, `finance`

---

## ABAC (Attribute-Based Access Control) Examples

### Record-Level Access (Production Worker)
```javascript
{
  role: 'productionWorker',
  entityType: 'employees',
  actions: ['read'],
  conditions: {
    userId: { eq: '${user.id}' }  // Own record only
  }
}
```

### Field-Level Access (Finance)
```javascript
{
  role: 'finance',
  entityType: 'employees',
  actions: ['read', 'update'],
  fields: {
    allowed: ['firstName', 'lastName', 'email', 'employeeId', 'hireDate'],
    denied: ['terminationDate', 'reasonForLeaving', 'remarksComments']
  }
}
```

### Status-Based Access (Human Resources)
```javascript
{
  role: 'humanResources',
  entityType: 'employees',
  actions: ['create', 'read', 'update'],
  conditions: {
    status: { 
      in: ['new', 'under_review', 'offer_accepted', 'trainee'] 
    }
  }
}
```

---

## Testing Guide

### Test Scenarios

#### 1. Tab Visibility
- Login as `hr@example.com` → Should see all 5 tabs
- Login as `production.manager@example.com` → Should see General Info, Notes, Time Card (3 tabs)
- Login as `production.worker@example.com` → Should see General Info, Notes (2 tabs)

#### 2. Status-Based Tab Visibility
- Create employee with status `new` → Pre-Hiring tab visible
- Change status to `offer_accepted` → Both Pre-Hiring and Onboarding tabs visible
- Change status to `active` → Only Onboarding tab visible (Pre-Hiring hidden)
- Change status to `trainee` → Time Card tab appears

#### 3. Edit Permissions
- Login as `hr@example.com` → Edit button visible ✅
- Login as `quality.control@example.com` → Edit button hidden ❌

#### 4. Status Change Permissions
- Login as `hr@example.com` → Status badge clickable ✅
- Login as `production.worker@example.com` → Status badge disabled ❌
- Login as `finance@example.com` → Status badge clickable ✅

#### 5. File Upload/Delete Permissions
- Login as `hr@example.com` → Upload/Delete buttons visible ✅
- Login as `maintenance@example.com` → Upload/Delete buttons hidden ❌

---

## Summary Table: Role Access at a Glance

| Role | Tabs Visible | Can Edit | Can Delete | Can Change Status | Time Card Access |
|------|-------------|----------|------------|-------------------|------------------|
| **admin** | All 5 tabs | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **humanResources** | All 5 tabs | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **productionManager** | 3 tabs | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **finance** | 3 tabs | ✅ Yes (limited) | ❌ No | ✅ Yes | ✅ Yes |
| **productionWorker** | 2 tabs | ❌ No | ❌ No | ❌ No | ❌ No |
| **qualityControl** | 2 tabs | ❌ No | ❌ No | ❌ No | ❌ No |
| **maintenance** | 2 tabs | ❌ No | ❌ No | ❌ No | ❌ No |
| **safetyCompliance** | 2 tabs | ❌ No | ❌ No | ❌ No | ❌ No |

---

**Last Updated**: 2025-11-22
**Database**: PostgreSQL via Prisma ORM
**Auth System**: Better Auth with email/password
**Permission Model**: ABAC (Attribute-Based Access Control) with entity/action/field/record levels
