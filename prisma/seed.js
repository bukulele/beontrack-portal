/**
 * Prisma Seed Script
 *
 * Seeds the database with initial data for development.
 * Auto-runs after: npx prisma migrate reset
 * Manual run: npm run db:seed
 */

const { PrismaClient } = require('../src/generated/prisma');
const { auth } = require('../src/lib/auth.js');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Check what data already exists
  const userCount = await prisma.user.count();
  const portalConfigCount = await prisma.portalConfig.count();

  // If everything is already seeded, skip
  if (userCount > 0 && portalConfigCount > 0) {
    console.log('⚠️  Database already fully seeded. Skipping.');
    console.log(`   Users: ${userCount}, Portal Configs: ${portalConfigCount}`);
    return;
  }

  // If users exist but portal config doesn't, just add portal config
  if (userCount > 0 && portalConfigCount === 0) {
    console.log('⚠️  Users exist but portal config missing. Adding portal config...');
    await createPortalConfig();
    console.log('✅ Portal configuration added successfully!');
    return;
  }

  // Full seed if database is empty
  if (userCount === 0) {
    await fullSeed();
    return;
  }
}

async function createPortalConfig() {
  const employeePortalConfig = await prisma.portalConfig.create({
    data: {
      entityType: 'employees',
      allowedStatuses: ['new', 'under_review', 'application_on_hold', 'offer_accepted', 'trainee', 'active', 'vacation', 'on_leave', 'wcb'],
      checklistRefs: {
        application: 'employeePreHiringChecklist',
        onboarding: 'employeeOnboardingChecklist',
      },
      navigationItems: [
        { key: 'application', label: 'Application', route: '/portal/employees/application', statuses: ['new', 'under_review', 'application_on_hold'] },
        { key: 'documents', label: 'Documents', route: '/portal/employees/documents', statuses: ['all'] },
        { key: 'onboarding', label: 'Onboarding', route: '/portal/employees/onboarding', statuses: ['offer_accepted', 'trainee'] },
        { key: 'info', label: 'My Info', route: '/portal/employees/info', statuses: ['trainee', 'active', 'vacation', 'on_leave', 'wcb'] },
        { key: 'timecard', label: 'Timecard', route: '/portal/employees/timecard', statuses: ['active', 'vacation', 'on_leave', 'wcb'] },
        { key: 'status', label: 'Status', route: '/portal/employees/status', statuses: ['all'] },
      ],
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
      fieldConfig: {
        visible: ['firstName', 'lastName', 'email', 'phoneNumber', 'dateOfBirth', 'addressLine1', 'addressLine2', 'city', 'stateProvince', 'postalCode', 'country', 'emergencyContactName', 'emergencyContactPhone'],
        hidden: ['hireDate', 'terminationDate', 'jobTitle', 'department', 'employmentType', 'officeLocation'],
        editableWhenNew: ['firstName', 'lastName', 'phoneNumber', 'dateOfBirth', 'addressLine1', 'addressLine2', 'city', 'stateProvince', 'postalCode', 'country', 'emergencyContactName', 'emergencyContactPhone'],
      },
      isActive: true,
    },
  });
  console.log('   ✓ Created employee portal configuration');
}

async function fullSeed() {

  // Create admin user using Better Auth API (handles password hashing and account creation)
  console.log('👤 Creating admin user...');
  const signUpResult = await auth.api.signUpEmail({
    body: {
      name: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
    },
  });

  // Update the user with additional fields
  const adminUser = await prisma.user.update({
    where: { email: 'admin@example.com' },
    data: {
      firstName: 'Admin',
      lastName: 'User',
      isActive: true,
      isStaff: true,
      isSuperuser: true,
      emailVerified: true,
      department: 'Administration',
      location: 'Vancouver Office',
    },
  });
  console.log(`   ✓ Created admin user: ${adminUser.email}`);

  // Create employee status configurations
  console.log('🎨 Creating employee status configurations...');

  const statusConfigs = [
    // Recruiting Phase
    { code: 'new', label: 'New', color: '#94A3B8', order: 1 },
    { code: 'under_review', label: 'Under Review', color: '#FBBF24', order: 2 },
    { code: 'application_on_hold', label: 'Application On Hold', color: '#F59E0B', order: 3 },
    { code: 'rejected', label: 'Rejected', color: '#EF4444', order: 4 },

    // Transition Phase
    { code: 'offer_accepted', label: 'Offer Accepted', color: '#10B981', order: 5 },

    // Employment Phase
    { code: 'trainee', label: 'Trainee', color: '#3B82F6', order: 6 },
    { code: 'active', label: 'Active', color: '#22C55E', order: 7 },
    { code: 'resigned', label: 'Resigned', color: '#64748B', order: 8 },

    // Leave Phase
    { code: 'vacation', label: 'Vacation', color: '#06B6D4', order: 9 },
    { code: 'on_leave', label: 'On Leave', color: '#8B5CF6', order: 10 },
    { code: 'wcb', label: 'WCB', color: '#EC4899', order: 11 },

    // Separation Phase
    { code: 'terminated', label: 'Terminated', color: '#DC2626', order: 12 },
    { code: 'suspended', label: 'Suspended', color: '#991B1B', order: 13 },
  ];

  const createdConfigs = {};
  for (const config of statusConfigs) {
    const statusConfig = await prisma.statusConfig.create({
      data: {
        entityType: 'employees',
        statusCode: config.code,
        statusLabel: config.label,
        color: config.color,
        sortOrder: config.order,
      },
    });
    createdConfigs[config.code] = statusConfig.id;
  }
  console.log(`   ✓ Created ${statusConfigs.length} status configurations`);

  // Create status transitions (example workflow)
  console.log('🔄 Creating status transitions...');
  const transitions = [
    // Recruiting phase transitions
    ['new', 'under_review'],
    ['new', 'rejected'],
    ['under_review', 'application_on_hold'],
    ['under_review', 'rejected'],
    ['under_review', 'offer_accepted'],
    ['application_on_hold', 'under_review'],
    ['application_on_hold', 'rejected'],

    // Transition phase
    ['offer_accepted', 'trainee'],
    ['offer_accepted', 'active'],
    ['offer_accepted', 'rejected'],

    // Employment phase transitions
    ['trainee', 'active'],
    ['trainee', 'terminated'],
    ['active', 'vacation'],
    ['active', 'on_leave'],
    ['active', 'wcb'],
    ['active', 'resigned'],
    ['active', 'suspended'],
    ['active', 'terminated'],

    // Leave phase transitions
    ['vacation', 'active'],
    ['on_leave', 'active'],
    ['on_leave', 'terminated'],
    ['wcb', 'active'],
    ['wcb', 'terminated'],
    ['suspended', 'active'],
    ['suspended', 'terminated'],
  ];

  for (const [from, to] of transitions) {
    await prisma.statusTransition.create({
      data: {
        fromStatusId: createdConfigs[from],
        toStatusId: createdConfigs[to],
      },
    });
  }
  console.log(`   ✓ Created ${transitions.length} status transitions`);

  // Create roles and permissions
  console.log('🔐 Creating authorization roles and permissions...');

  const roles = [
    {
      name: 'admin',
      description: 'Full system access - can manage all resources and settings',
    },
    {
      name: 'payroll',
      description: 'Payroll staff - can view and edit employee payroll information',
    },
    {
      name: 'payrollManager',
      description: 'Payroll manager - full payroll access including reports and approvals',
    },
    {
      name: 'safety',
      description: 'Safety department - manages incidents, violations, and safety records',
    },
    {
      name: 'dispatch',
      description: 'Dispatch team - manages schedules, assignments, and operations',
    },
    {
      name: 'recruiting',
      description: 'Recruiting team - manages applicants and hiring process',
    },
    {
      name: 'planner',
      description: 'Planning team - manages routes, schedules, and logistics',
    },
    {
      name: 'shop',
      description: 'Shop/maintenance team - manages equipment, repairs, and inventory',
    },
    {
      name: 'hr',
      description: 'HR department - manages employees, benefits, and policies',
    },
  ];

  const createdRoles = {};
  for (const roleData of roles) {
    const role = await prisma.role.create({
      data: roleData,
    });
    createdRoles[roleData.name] = role;
    console.log(`   ✓ Created role: ${roleData.name}`);
  }

  // Define permissions for each role
  const permissions = [
    // Admin - Full access to everything
    {
      role: 'admin',
      entityType: 'employees',
      actions: ['create', 'read', 'update', 'delete'],
      fields: null, // All fields
      conditions: null, // All records
    },

    // Payroll - Can view/edit employee payroll info
    {
      role: 'payroll',
      entityType: 'employees',
      actions: ['read', 'update'],
      fields: {
        allowed: ['firstName', 'lastName', 'email', 'phoneNumber', 'employeeId', 'hireDate', 'department', 'jobTitle', 'status'],
        denied: ['terminationDate', 'reasonForLeaving', 'remarksComments'],
      },
      conditions: null,
    },

    // Payroll Manager - Full payroll access
    {
      role: 'payrollManager',
      entityType: 'employees',
      actions: ['read', 'update'],
      fields: null,
      conditions: null,
    },

    // Safety - Read-only employee info
    {
      role: 'safety',
      entityType: 'employees',
      actions: ['read'],
      fields: {
        allowed: ['firstName', 'lastName', 'email', 'phoneNumber', 'employeeId', 'department', 'status'],
      },
      conditions: null,
    },

    // Dispatch - Read employee info
    {
      role: 'dispatch',
      entityType: 'employees',
      actions: ['read'],
      fields: {
        allowed: ['firstName', 'lastName', 'email', 'phoneNumber', 'employeeId', 'department', 'status', 'officeLocation'],
      },
      conditions: null,
    },

    // Recruiting - Manage applicants and recruiting phase
    {
      role: 'recruiting',
      entityType: 'employees',
      actions: ['create', 'read', 'update'],
      fields: null,
      conditions: {
        status: { in: ['new', 'under_review', 'application_on_hold', 'rejected', 'offer_accepted', 'trainee'] },
      },
    },

    // Planner - Read employee info
    {
      role: 'planner',
      entityType: 'employees',
      actions: ['read'],
      fields: {
        allowed: ['firstName', 'lastName', 'email', 'phoneNumber', 'employeeId', 'department', 'status'],
      },
      conditions: null,
    },

    // Shop - Limited employee info
    {
      role: 'shop',
      entityType: 'employees',
      actions: ['read'],
      fields: {
        allowed: ['firstName', 'lastName', 'employeeId'],
      },
      conditions: null,
    },

    // HR - Full employee management
    {
      role: 'hr',
      entityType: 'employees',
      actions: ['create', 'read', 'update', 'delete'],
      fields: null,
      conditions: null,
    },
  ];

  for (const permData of permissions) {
    await prisma.permission.create({
      data: {
        roleId: createdRoles[permData.role].id,
        entityType: permData.entityType,
        actions: permData.actions,
        fields: permData.fields,
        conditions: permData.conditions,
      },
    });
  }
  console.log(`   ✓ Created ${permissions.length} permissions`);

  // Assign admin role to admin user
  await prisma.userRole.create({
    data: {
      userId: adminUser.id,
      roleId: createdRoles.admin.id,
    },
  });
  console.log(`   ✓ Assigned admin role to admin user`);

  // Create portal configuration
  console.log('🌐 Creating portal configuration...');
  await createPortalConfig();

  console.log('');
  console.log('✅ Database seeding completed successfully!');
  console.log('');
  console.log('📊 Summary:');
  console.log(`   - Users: 1 (admin)`);
  console.log(`   - Employees: 0 (no sample data - create via portal)`);
  console.log(`   - Status Configs: ${statusConfigs.length}`);
  console.log(`   - Status Transitions: ${transitions.length}`);
  console.log(`   - Roles: ${roles.length}`);
  console.log(`   - Permissions: ${permissions.length}`);
  console.log(`   - Portal Configs: 1 (employees)`);
  console.log('');
  console.log('🔑 Admin Login Credentials:');
  console.log(`   - Email: admin@example.com`);
  console.log(`   - Password: admin123`);
  console.log('');
  console.log('🌐 Portal Access:');
  console.log(`   - Sign in at: /portal`);
  console.log(`   - New applicants will auto-create employee records`);
  console.log('');
  console.log('🔍 View data in Prisma Studio: npm run db:studio');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
