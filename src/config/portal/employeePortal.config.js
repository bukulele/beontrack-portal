/**
 * Employee Portal Configuration
 *
 * Configuration for the employee applicant portal.
 * References existing configs for form fields and checklists.
 * This follows the same pattern as employeeCard.config.js
 */

import { EMPLOYEE_CREATE_FORM_CONFIG } from '@/config/forms/employeeCreateForm.config';
import { EMPLOYEE_PRE_HIRING_CHECKLIST_CONFIG } from '@/config/checklists/employeePreHiringChecklist.config';
import { EMPLOYEE_ONBOARDING_CHECKLIST_CONFIG } from '@/config/checklists/employeeOnboardingChecklist.config';
import PortalActivityHistoryModal from '@/app/(portal)/portal/components/PortalActivityHistoryModal';
import checkActivityPeriod from '@/app/functions/checkActivityPeriod';

export const EMPLOYEE_PORTAL_CONFIG = {
  entityType: 'employees',

  // Image configuration (profile photo)
  image: {
    interactive: true, // Enable interactive photo editing
    src: (entityData) => entityData.profilePhoto?.filePath
      ? `/api/v1/files/${entityData.profilePhoto.filePath.replace(/^uploads\//, '')}`
      : null,
    placeholder: {
      icon: "User", // Lucide icon name shown when no photo exists
    },
    // API endpoints for photo upload/update
    // Note: Using portal-specific endpoints that bypass ABAC for self-service updates
    uploadEndpoint: (entityId) => `/api/v1/employees/${entityId}/documents`,
    updateEndpoint: () => `/api/portal/employees/me`, // Portal self-service endpoint
    photoFieldName: "profilePhotoId",
    documentType: "profile_photo",
    alt: "Profile Photo",
    width: 200,
    height: 300,
  },

  // Personal info form - fields visible to applicants
  // Filter from EMPLOYEE_CREATE_FORM_CONFIG to show only applicant-relevant fields
  personalInfoFields: EMPLOYEE_CREATE_FORM_CONFIG.fields.filter(field => {
    // Hide HR-only fields
    const hiddenFields = ['hireDate', 'terminationDate', 'jobTitle', 'department', 'employmentType', 'officeLocation'];
    return !hiddenFields.includes(field.key);
  }),

  // Application checklist (pre-hiring documents + activity history)
  applicationChecklist: EMPLOYEE_PRE_HIRING_CHECKLIST_CONFIG,

  // Onboarding checklist (shown after offer_accepted)
  onboardingChecklist: EMPLOYEE_ONBOARDING_CHECKLIST_CONFIG,

  // Additional items for Documents tab (Activity History)
  documentTabItems: [
    {
      key: "activityHistory",
      label: "Activity History",
      optional: false,
      itemType: "modal",
      modalComponent: PortalActivityHistoryModal,

      // Custom validation function to check for gaps
      validate: (itemData) => {
        if (!itemData || !Array.isArray(itemData) || itemData.length === 0) {
          return false; // No data
        }
        const activitiesForCheck = itemData.map(a => ({
          start_date: a.startDate,
          end_date: a.tillNow ? null : a.endDate,
          till_now: a.tillNow,
        }));
        const gaps = checkActivityPeriod(activitiesForCheck, 10);
        return gaps.length === 0; // Valid if no gaps
      },
    },
  ],

  // Navigation items for portal tabs
  navigationItems: [
    {
      key: 'application',
      label: 'General data',
      route: '/portal/employees/application',
      statuses: ['new', 'under_review', 'application_on_hold', 'rejected', 'offer_accepted', 'trainee', 'active', 'vacation', 'on_leave', 'wcb', 'resigned', 'terminated', 'suspended'],
    },
    {
      key: 'documents',
      label: 'Documents',
      route: '/portal/employees/documents',
      statuses: ['new', 'under_review', 'application_on_hold', 'rejected', 'offer_accepted', 'trainee', 'active', 'vacation', 'on_leave', 'wcb', 'resigned', 'terminated', 'suspended'],
    },
  ],

  // Status-based visibility for different sections
  sections: {
    application: {
      statuses: ['new', 'under_review', 'application_on_hold'],
      label: 'Application',
    },
    onboarding: {
      statuses: ['offer_accepted', 'trainee'],
      label: 'Onboarding',
    },
    info: {
      statuses: ['trainee', 'active', 'vacation', 'on_leave', 'wcb'],
      label: 'My Info',
    },
    timecard: {
      statuses: ['active', 'vacation', 'on_leave', 'wcb'],
      label: 'Timecard',
    },
  },

  // Status messages shown to applicants
  statusMessages: {
    new: 'Complete your application and upload required documents to submit for review.',
    under_review: 'Your application is being reviewed by our team. We\'ll notify you of any updates.',
    application_on_hold: 'Your application is currently on hold. Please check the status notes for more information.',
    rejected: 'We appreciate your interest. Your application was not selected at this time.',
    offer_accepted: 'Congratulations! Please complete your onboarding documents to continue.',
    trainee: 'Welcome to the team! You\'re currently in training. Access your timecard and company info below.',
    active: 'Welcome aboard! You have full access to all portal features.',
    vacation: 'Enjoy your time off! Your timecard and info are still accessible.',
    on_leave: 'You\'re currently on leave. Your information remains accessible.',
    wcb: 'You\'re on workers\' compensation leave. Access your info and documents below.',
    resigned: 'Your employment has ended. Thank you for your service.',
    terminated: 'Your employment has ended.',
    suspended: 'Your access is temporarily suspended. Contact HR for more information.',
  },

  // Consent documents configuration
  consentDocuments: [
    {
      key: 'background_check_consent',
      title: 'Consent for Personal Investigation',
      required: true,
      appliesToStatuses: ['new'], // Only shown during application submission
      content: (entityData) => ({
        header: {
          showLogo: true,
          title: 'Consent for Personal Investigation',
        },
        body: [
          {
            type: 'applicantInfo',
            fields: [
              { label: 'Name', value: `${entityData.firstName || ''} ${entityData.lastName || ''}`.trim() },
              { label: 'Date', value: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
              { label: 'Email', value: entityData.email || '' },
            ],
          },
          {
            type: 'paragraph',
            text: 'I hereby consent to a personal investigation being carried out by 4Tracks Ltd. to verify the information provided in my employment application and to conduct background checks. I understand that this information will be used solely for the purpose of evaluating my application for employment.',
          },
          {
            type: 'paragraph',
            text: 'I have listed your company as a previous employer within the last 10 years from date of this application with 4TRACKS LTD.',
          },
          {
            type: 'paragraph',
            text: 'I authorize you to release the following information to 4TRACKS LTD. for the purpose of investigation as required by the above regulations.',
          },
          {
            type: 'paragraph',
            text: 'You are released from any and all liability which may result from furnishing such information.',
          },
        ],
      }),
    },
  ],
};

export default EMPLOYEE_PORTAL_CONFIG;
