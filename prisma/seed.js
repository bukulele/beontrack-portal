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

  // If database has users already, skip seeding
  if (userCount > 0) {
    console.log('⚠️  Database already seeded. Skipping.');
    console.log(`   Users: ${userCount}`);
    return;
  }

  // Full seed if database is empty
  console.log('📦 Empty database detected. Running full seed...');
  await fullSeed();
}

async function fullSeed() {

  // Create test users for each role (demo purposes)
  console.log('👤 Creating test users...');

  const testUsers = [
    {
      email: 'admin@example.com',
      password: 'demo1234',
      firstName: 'Admin',
      lastName: 'User',
      department: 'Administration',
      location: 'Head Office',
      isSuperuser: true,
      role: 'admin',
      jobTitle: 'System Administrator',
      employeeId: 'ADM-001',
    },
    {
      email: 'production.manager@example.com',
      password: 'demo1234',
      firstName: 'Production',
      lastName: 'Manager',
      department: 'Assembly',
      location: 'Factory Floor A',
      isSuperuser: false,
      role: 'productionManager',
      jobTitle: 'Production Manager',
      employeeId: 'PM-001',
    },
    {
      email: 'production.worker@example.com',
      password: 'demo1234',
      firstName: 'Production',
      lastName: 'Worker',
      department: 'Assembly',
      location: 'Factory Floor A',
      isSuperuser: false,
      role: 'productionWorker',
      jobTitle: 'Assembly Line Operator',
      employeeId: 'PW-001',
    },
    {
      email: 'quality.control@example.com',
      password: 'demo1234',
      firstName: 'Quality',
      lastName: 'Inspector',
      department: 'QA',
      location: 'Quality Lab',
      isSuperuser: false,
      role: 'qualityControl',
      jobTitle: 'Quality Control Inspector',
      employeeId: 'QC-001',
    },
    {
      email: 'maintenance@example.com',
      password: 'demo1234',
      firstName: 'Maintenance',
      lastName: 'Technician',
      department: 'Maintenance',
      location: 'Maintenance Shop',
      isSuperuser: false,
      role: 'maintenance',
      jobTitle: 'Maintenance Technician',
      employeeId: 'MT-001',
    },
    {
      email: 'hr@example.com',
      password: 'demo1234',
      firstName: 'HR',
      lastName: 'Manager',
      department: 'Administration',
      location: 'Head Office',
      isSuperuser: false,
      role: 'humanResources',
      jobTitle: 'HR Manager',
      employeeId: 'HR-001',
    },
    {
      email: 'finance@example.com',
      password: 'demo1234',
      firstName: 'Finance',
      lastName: 'Controller',
      department: 'Administration',
      location: 'Head Office',
      isSuperuser: false,
      role: 'finance',
      jobTitle: 'Finance Controller',
      employeeId: 'FIN-001',
    },
    {
      email: 'safety@example.com',
      password: 'demo1234',
      firstName: 'Safety',
      lastName: 'Officer',
      department: 'Administration',
      location: 'Head Office',
      isSuperuser: false,
      role: 'safetyCompliance',
      jobTitle: 'Safety & Compliance Officer',
      employeeId: 'SAF-001',
    },
  ];

  const createdUsers = {};

  for (const userData of testUsers) {
    // Create user via Better Auth
    await auth.api.signUpEmail({
      body: {
        name: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
      },
    });

    // Update with additional fields
    const user = await prisma.user.update({
      where: { email: userData.email },
      data: {
        isActive: true,
        isStaff: true,
        isSuperuser: userData.isSuperuser,
        emailVerified: true,
        department: userData.department,
        location: userData.location,
      },
    });

    createdUsers[userData.role] = { user, userData };
    console.log(`   ✓ Created user: ${user.email} (${userData.role})`);
  }

  const adminUser = createdUsers.admin.user;

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
      description: 'System administrator with full access to all features and settings',
    },
    {
      name: 'productionManager',
      description: 'Production Manager - oversees production operations, equipment, and production employees',
    },
    {
      name: 'productionWorker',
      description: 'Production Worker - factory floor workers with limited self-service access',
    },
    {
      name: 'qualityControl',
      description: 'Quality Control - manages quality assurance, inspections, and supplier quality issues',
    },
    {
      name: 'maintenance',
      description: 'Maintenance - manages equipment maintenance, repairs, and service orders',
    },
    {
      name: 'humanResources',
      description: 'Human Resources - manages employee lifecycle, recruiting, onboarding, and compliance',
    },
    {
      name: 'finance',
      description: 'Finance - manages payroll, invoicing, payments, and financial reporting',
    },
    {
      name: 'safetyCompliance',
      description: 'Safety & Compliance - manages workplace safety, incidents, violations, and regulatory compliance',
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

    // Production Manager - Full access to production employees
    {
      role: 'productionManager',
      entityType: 'employees',
      actions: ['create', 'read', 'update', 'delete'],
      fields: null,
      conditions: null,
    },

    // Production Worker - Own record only (self-service)
    {
      role: 'productionWorker',
      entityType: 'employees',
      actions: ['read'],
      fields: {
        allowed: ['firstName', 'lastName', 'email', 'phoneNumber', 'employeeId', 'status', 'department', 'jobTitle', 'hireDate'],
      },
      conditions: {
        userId: { eq: '${user.id}' }, // Own record only
      },
    },

    // Quality Control - Read access to employees
    {
      role: 'qualityControl',
      entityType: 'employees',
      actions: ['read'],
      fields: {
        allowed: ['firstName', 'lastName', 'email', 'phoneNumber', 'employeeId', 'department', 'status', 'jobTitle'],
      },
      conditions: null,
    },

    // Maintenance - Limited employee info
    {
      role: 'maintenance',
      entityType: 'employees',
      actions: ['read'],
      fields: {
        allowed: ['firstName', 'lastName', 'employeeId', 'department', 'phoneNumber'],
      },
      conditions: null,
    },

    // Human Resources - Full employee management
    {
      role: 'humanResources',
      entityType: 'employees',
      actions: ['create', 'read', 'update', 'delete'],
      fields: null,
      conditions: null,
    },

    // Finance - Payroll-related fields only
    {
      role: 'finance',
      entityType: 'employees',
      actions: ['read', 'update'],
      fields: {
        allowed: ['firstName', 'lastName', 'email', 'phoneNumber', 'employeeId', 'hireDate', 'department', 'jobTitle', 'status', 'employmentType'],
        denied: ['terminationDate', 'reasonForLeaving', 'remarksComments', 'statusNote'],
      },
      conditions: null,
    },

    // Safety & Compliance - Read-only employee info
    {
      role: 'safetyCompliance',
      entityType: 'employees',
      actions: ['read'],
      fields: {
        allowed: ['firstName', 'lastName', 'email', 'phoneNumber', 'employeeId', 'department', 'status', 'jobTitle', 'hireDate'],
      },
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

  // Assign roles to all test users
  console.log('🔗 Assigning roles to test users...');
  for (const [roleName, { user }] of Object.entries(createdUsers)) {
    await prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: createdRoles[roleName].id,
      },
    });
    console.log(`   ✓ Assigned ${roleName} role to ${user.email}`);
  }

  // Create employee records for all test users
  console.log('👔 Creating employee records for test users...');
  for (const [roleName, { user, userData }] of Object.entries(createdUsers)) {
    const employee = await prisma.officeEmployee.create({
      data: {
        employeeId: userData.employeeId,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: user.email,
        phoneNumber: '+1-555-0100',
        department: userData.department,
        jobTitle: userData.jobTitle,
        officeLocation: userData.location,
        employmentType: 'full_time',
        status: 'active',
        hireDate: new Date('2024-01-01'),
        createdById: adminUser.id,
        updatedById: adminUser.id,
        userId: user.id, // Link to portal user
        portalAccessEnabled: true,
        canCheckinRemotely: ['productionWorker', 'productionManager'].includes(roleName),
      },
    });
    console.log(`   ✓ Created employee record: ${employee.employeeId} (${userData.firstName} ${userData.lastName})`);
  }

  console.log('');
  console.log('✅ Database seeding completed successfully!');
  console.log('');
  console.log('📊 Summary:');
  console.log(`   - Users: ${testUsers.length} test users`);
  console.log(`   - Employees: ${testUsers.length} employee records`);
  console.log(`   - Status Configs: ${statusConfigs.length}`);
  console.log(`   - Status Transitions: ${transitions.length}`);
  console.log(`   - Roles: ${roles.length}`);
  console.log(`   - Permissions: ${permissions.length}`);
  console.log('');
  console.log('🔑 Test User Login Credentials (all passwords: demo1234):');
  console.log('');
  testUsers.forEach(u => {
    console.log(`   ${u.jobTitle}:`);
    console.log(`   - Email: ${u.email}`);
    console.log(`   - Role: ${u.role}`);
    console.log('');
  });
  console.log('🌐 Portal Access:');
  console.log(`   - Office portal: /`);
  console.log(`   - Employee portal: /portal`);
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
