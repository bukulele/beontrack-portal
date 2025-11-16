# Portal Admin Guide (HR Staff)

## Table of Contents
1. [Overview](#overview)
2. [Managing Applicants](#managing-applicants)
3. [Portal Access Controls](#portal-access-controls)
4. [Workflow Guide](#workflow-guide)
5. [Best Practices](#best-practices)

---

## Overview

The external portal allows applicants and employees to:
- Submit applications online
- Upload required documents
- Track application status
- View onboarding materials (post-offer)

As HR staff, you manage:
- Portal access permissions
- Application editing permissions
- Document review and approval
- Status transitions

---

## Managing Applicants

### Viewing Applicant Data

1. Navigate to `/table?entity=employees`
2. Find the applicant by name, email, or application ID
3. Click on the row to open the employee card

### Employee Card - Portal Controls

In the "Employee Card" (General Info tab), you'll see:

#### Portal Access Fields
- **Portal Access**: Enable/disable portal login
  - `Enabled`: Employee can sign in to portal
  - `Disabled`: Employee cannot access portal
- **Allow Portal Edits**: Control editing permissions
  - `Yes`: Employee can edit their information and upload documents
  - `No`: Employee can only view (read-only)
  - **Note**: Shows only when Portal Access is enabled

**Location**: These fields appear at the bottom of the field list (after Termination Date)

### Editing Portal Permissions

To change permissions:
1. Open the employee card
2. Click the **Edit** button (top right)
3. Scroll to the Portal Access section
4. Toggle the checkboxes:
   - `Portal Access Enabled`
   - `Allow Portal Edits`
5. Click **Save**

---

## Portal Access Controls

### When to Enable Portal Access
✅ New applicants (automatically enabled)
✅ Active employees who need self-service
✅ Employees updating personal info
❌ Terminated employees
❌ Rejected applicants (optional - for transparency)

### When to Allow Editing
✅ Initial application (status: new)
✅ When applicant needs to update information
✅ Active employees updating contact info
❌ After submission (unless explicit update needed)
❌ During background check
❌ For onboarding documents (HR only)

---

## Workflow Guide

### New Applicant Workflow

#### 1. Applicant Signs Up
**Automatic**:
- User account created
- Employee record created with status "new"
- Portal Access: `Enabled`
- Allow Edits: `Yes`
- Application ID assigned (e.g., APP001)

**HR Action**: None required

#### 2. Applicant Completes Application
**Applicant**:
- Fills personal information
- Uploads required documents
- Clicks "Submit Application"

**Automatic**:
- Status changes: `new` → `under_review`
- Allow Edits: `Yes` → `No` (locked)

**HR Action**: None required

#### 3. Review Application
**HR**:
1. Open employee card
2. Review "Pre-Hiring" tab
3. Check all documents
4. Review personal information
5. Check activity history

**If changes needed**:
1. Click Edit in General Info tab
2. Enable "Allow Portal Edits"
3. Save
4. Notify applicant to make changes

**After applicant updates**:
- Applicant clicks Submit again
- Application auto-locks (`Allow Edits` → `No`)

#### 4. Make Decision
**Accept**:
- Change status to `offer_accepted`
- Applicant can now see onboarding documents

**Reject**:
- Change status to `rejected`
- Optionally disable portal access

**Hold**:
- Change status to `application_on_hold`
- Add note in Status Note field

#### 5. Onboarding
**HR Uploads Onboarding Docs**:
- Go to "Onboarding" tab
- Upload: Employment Contract, Tax Forms, etc.
- Applicant sees these (read-only) in their portal

**Applicant**:
- Views onboarding documents
- Cannot upload/edit (HR managed)
- Completes any required forms offline

**Status Progression**:
- `offer_accepted` → `trainee` → `active`

---

## Document Management

### Application Documents
**Who can upload**: Applicant (when unlocked) or HR
**Who can review**: HR only
**Checklist**: Pre-Hiring tab

Documents:
- Resume/CV
- Government ID
- Work Authorization
- Immigration Documents
- Education Verification
- Professional Certifications
- Background Check Consent
- Activity History

### Onboarding Documents
**Who can upload**: HR only
**Who can review**: HR and employee (read-only)
**Checklist**: Onboarding tab

Documents:
- Employment Contract
- Company Policies
- Confidentiality Agreement
- SIN/SSN Form
- Direct Deposit Form
- Tax Forms
- Benefits Enrollment
- Safety Training Certificate

### Reviewing Documents

1. Open employee card
2. Go to Pre-Hiring or Onboarding tab
3. Click on document name to view
4. Check the review checkbox after verification
5. Status is tracked automatically

---

## Best Practices

### Security
✅ **Always lock after submission**: Ensure `Allow Edits = No` after review
✅ **Minimal access**: Only enable portal access when needed
✅ **Document verification**: Review all documents before moving to next status
✅ **Audit trail**: Activity logs track all changes
❌ Never leave editing enabled indefinitely
❌ Don't skip document review

### Communication
✅ **Notify applicants**: Tell them when you unlock for edits
✅ **Use status notes**: Add context for holds or delays
✅ **Clear instructions**: Guide applicants on what's needed
❌ Don't change status without reviewing first
❌ Don't unlock without reason

### Data Management
✅ **Regular reviews**: Check pending applications weekly
✅ **Status updates**: Keep status current
✅ **Clean data**: Verify all required fields before hiring
✅ **Activity history**: Ensure work history is complete
❌ Don't approve incomplete applications
❌ Don't skip background checks

---

## Common Scenarios

### Applicant Made a Mistake
1. Employee card → Edit
2. Enable "Allow Portal Edits"
3. Save
4. Email applicant: "Your application is now unlocked. Please update [specific fields] and resubmit."
5. After they submit, verify changes
6. Application auto-locks

### Applicant Can't Access Portal
**Check**:
- Email address is correct in employee record
- `Portal Access Enabled = Yes`
- Status is not `rejected` or `terminated`
- No rate limiting (5 OTP requests per 15 min)

**Fix**:
- Verify email in employee record
- Enable Portal Access if disabled
- Ask applicant to check spam folder
- Wait 15 minutes if rate limited

### Applicant Uploaded Wrong Document
**Option 1: HR replaces it**
1. Go to Pre-Hiring tab
2. Click Upload on the document type
3. Select correct file
4. Old version is preserved (version history)

**Option 2: Applicant replaces it**
1. Unlock editing (`Allow Portal Edits = Yes`)
2. Notify applicant
3. Applicant uploads new version
4. Locks after submission

### Moving to Onboarding
1. Verify all pre-hiring documents reviewed
2. Change status to `offer_accepted`
3. Go to Onboarding tab
4. Upload required onboarding documents
5. Notify employee to review in portal
6. After orientation: `offer_accepted` → `trainee`
7. After training: `trainee` → `active`

### Employee Needs to Update Address
1. Find employee record
2. Enable "Allow Portal Edits"
3. Notify employee
4. Employee updates via portal
5. No need to disable if active employee

---

## Rate Limits

Be aware of rate limits for applicants:

### OTP (Sign-in codes)
- **Limit**: 5 per 15 minutes per email
- **Impact**: Can't sign in if exceeded
- **Solution**: Wait 15 minutes

### Document Uploads
- **Limit**: 10 per 5 minutes per user
- **Impact**: Upload fails
- **Solution**: Wait 5 minutes

**Note**: Rate limits are per-user, not global.

---

## Troubleshooting

### "Portal Access" fields don't appear
- Employee must have `userId` set (portal account exists)
- Check if employee signed in at least once
- Fields only show for portal-enabled employees

### Can't review documents
- Check your role has permission
- Verify you're in correct tab (Pre-Hiring vs Onboarding)
- Refresh the page

### Status won't change
- Check status transition rules
- Some transitions require checklist completion
- Verify you have permission

### Documents not visible to employee
- Application docs: Always visible (if unlocked)
- Onboarding docs: Only after `offer_accepted` status
- Check status progression

---

## Portal Configuration

### Entity Types
Currently configured for:
- `employees` (Office Employees)

**Future**: clients, suppliers can have their own portals

### Portal Config Location
`/src/config/portal/employeePortal.config.js`

**Contains**:
- Personal info fields (filtered from create form)
- Application checklist reference
- Onboarding checklist reference
- Status-based section visibility
- Status messages for applicants

### Customization
To add/remove fields from portal:
1. Edit `employeePortal.config.js`
2. Modify `personalInfoFields` filter
3. Changes apply immediately

**Note**: Don't modify checklist configs - they're shared with office system.

---

## Reporting & Analytics

### Useful Queries
- Applicants by status
- Applications pending review (status: `under_review`)
- Incomplete applications (status: `new`, old dates)
- Onboarding in progress (status: `offer_accepted` or `trainee`)

### Activity Tracking
Every change is logged:
- Who made the change
- What field changed
- Old and new values
- Timestamp

**View**: Employee card → General Info → Activity Logs section

---

## Security Notes

### Data Access
- Portal users only see their own data
- HR sees all applicant data
- Permissions enforced at API level
- Field-level access control (ABAC)

### Authentication
- Passwordless (OTP-based)
- 6-digit codes via email
- Codes expire after 10 minutes
- Sessions last 7 days

### File Security
- Files stored in `/uploads/employees/{uuid}/{docType}/`
- Access controlled via API
- No direct file system access
- File serving goes through auth check

---

*Last Updated: November 2025*
*For technical implementation details, see PORTAL_IMPLEMENTATION_PLAN.md*
