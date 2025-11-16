# Portal User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Applicant Portal](#applicant-portal)
3. [Employee Portal](#employee-portal)
4. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Accessing the Portal

1. Navigate to `/portal` in your browser
2. Enter your email address
3. Click "Send Verification Code"
4. Check your email for a 6-digit code (or use `123456` in development)
5. Enter the code and click "Verify & Sign In"

**Note**: In development mode, the verification code is always `123456`.

### First Time Sign-In

When you sign in for the first time:
- A user account is automatically created
- You'll be assigned a unique Application ID (e.g., APP001)
- Your status will be set to "new"
- You can immediately start filling out your application

---

## Applicant Portal

### Application Page

The main application page shows:

#### 1. Status Overview Card
- **Current Status**: Badge showing your application status
- **Status Message**: Information about next steps
- **Progress Bars**:
  - Personal Information progress (fields completed)
  - Documents progress (files uploaded)
  - Overall completion percentage
- **Application Details**: ID, submission date, last updated

#### 2. Personal Information Form
Fill in all required fields:
- First Name, Last Name
- Email, Phone Number
- Address (Line 1, Line 2, City, Province, Postal Code, Country)
- Date of Birth
- Emergency Contact Name and Phone

**Tips**:
- Fields are editable inline - just click and type
- Changes save automatically when you click the save icon
- Required fields are marked

#### 3. Documents Section
Upload required documents:
- **Resume/CV** (Required)
- **Government ID** (Required)
- **Background Check Consent** (Required)
- **Work Authorization** (Optional)
- **Immigration Documents** (Optional)
- **Education Verification** (Optional)
- **Professional Certifications** (Optional)

**Uploading Documents**:
1. Click "Upload" next to the document type
2. Select file (PDF, images, or Word documents accepted)
3. Maximum file size: 10MB
4. Files are saved immediately

#### 4. Activity History
Track your work experience:
- Click "Add Activity" to add employment history
- Fill in Company Name, Position, Start/End Dates
- Mark if currently employed

### Submitting Your Application

When you're ready to submit:
1. Complete all required fields
2. Upload all required documents
3. Review your information
4. Click **"Submit Application"** at the bottom
5. Confirm the submission

**Important**: After submission:
- Your status changes to "under_review"
- Your application is **locked** - you cannot make changes
- Contact support if you need to update information
- HR must explicitly unlock your application for editing

---

## Documents Page

View and manage all your documents in one place.

### Application Documents
- Always visible
- Editable when your application is unlocked
- Read-only when locked

### Onboarding Documents
- Visible after your offer is accepted (status: offer_accepted or later)
- **Always read-only** - managed by HR only
- Includes: Employment Contract, Company Policies, Tax Forms, etc.

---

## Employee Portal (After Hiring)

Once hired, you gain access to additional features based on your employment status:

### Active Employee Features
- View all documents (application + onboarding + employee docs)
- Update personal information (with permission)
- Access timecard (future feature)
- View company policies and handbooks

---

## Status Meanings

| Status | What It Means |
|--------|---------------|
| **new** | Application in progress - complete and submit when ready |
| **under_review** | Application submitted - HR is reviewing |
| **application_on_hold** | Application paused - check status notes |
| **rejected** | Application not selected at this time |
| **offer_accepted** | Congratulations! Complete onboarding documents |
| **trainee** | In training - full access to portal |
| **active** | Fully onboarded employee |
| **vacation** | On vacation - portal still accessible |
| **on_leave** | On leave - portal still accessible |
| **wcb** | Workers' compensation leave |
| **resigned** | Employment ended (resignation) |
| **terminated** | Employment ended (termination) |
| **suspended** | Temporarily suspended |

---

## Rate Limits

To prevent abuse, the following rate limits apply:

### OTP Requests
- **Limit**: 5 verification codes per 15 minutes
- **Scope**: Per email address
- **Retry**: Wait the specified time before requesting another code

### Document Uploads
- **Limit**: 10 uploads per 5 minutes
- **Scope**: Per user
- **Retry**: Wait before uploading more documents

If you hit a rate limit, you'll see an error message with the retry time.

---

## Troubleshooting

### I didn't receive a verification code
- Check your spam/junk folder
- In development: Use code `123456`
- Wait 1 minute and request a new code
- Ensure your email address is correct

### My application is locked
- This is normal after submission
- Contact HR to request editing permission
- Check the status message for instructions

### I can't upload a document
- Check file size (max 10MB)
- Ensure file type is supported (PDF, images, Word)
- Verify your application is unlocked
- Check if you've hit the upload rate limit

### I don't see onboarding documents
- Onboarding docs appear after offer acceptance
- Check your status - must be "offer_accepted" or later
- Contact HR if you believe you should see them

### Changes aren't saving
- Ensure your application is unlocked
- Check for error messages
- Refresh the page and try again
- Contact support if issue persists

---

## Contact Support

If you need help:
- **Technical Issues**: Contact your IT department
- **Application Questions**: Contact HR
- **Document Problems**: Contact recruiting team

**Important**: Never share your verification codes with anyone.

---

## Privacy & Security

- Your data is encrypted and secure
- Only authorized HR staff can view your application
- Verification codes expire after 10 minutes
- Sessions expire after 7 days of inactivity
- Always sign out when using shared computers

---

*Last Updated: November 2025*
