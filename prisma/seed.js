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

  // Check if database is already seeded
  const userCount = await prisma.user.count();
  const employeeCount = await prisma.officeEmployee.count();

  if (userCount > 0 || employeeCount > 0) {
    console.log('⚠️  Database already contains data. Skipping seed.');
    console.log(`   Users: ${userCount}, Employees: ${employeeCount}`);
    return;
  }

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

  // Create sample employees
  console.log('👥 Creating sample employees...');

  const employee1 = await prisma.officeEmployee.create({
    data: {
      employeeId: 'EMP001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '+1-555-0101',
      emergencyContactName: 'Jane Doe',
      emergencyContactPhone: '+1-555-0102',
      addressLine1: '123 Main Street',
      city: 'Vancouver',
      stateProvince: 'BC',
      postalCode: 'V6B 1A1',
      country: 'Canada',
      hireDate: new Date('2023-01-15'),
      jobTitle: 'HR Manager',
      department: 'Human Resources',
      employmentType: 'full_time',
      officeLocation: 'Vancouver Office',
      dateOfBirth: new Date('1985-05-20'),
      status: 'active',
      createdById: adminUser.id,
      updatedById: adminUser.id,
    },
  });
  console.log(`   ✓ Created employee: ${employee1.firstName} ${employee1.lastName} (${employee1.status})`);

  const employee2 = await prisma.officeEmployee.create({
    data: {
      employeeId: 'EMP002',
      firstName: 'Sarah',
      lastName: 'Smith',
      email: 'sarah.smith@example.com',
      phoneNumber: '+1-555-0103',
      emergencyContactName: 'Michael Smith',
      emergencyContactPhone: '+1-555-0104',
      addressLine1: '456 Oak Avenue',
      city: 'Toronto',
      stateProvince: 'ON',
      postalCode: 'M5H 2N2',
      country: 'Canada',
      hireDate: new Date('2024-03-01'),
      jobTitle: 'Accountant',
      department: 'Finance',
      employmentType: 'full_time',
      officeLocation: 'Toronto Office',
      dateOfBirth: new Date('1990-08-15'),
      status: 'trainee',
      createdById: adminUser.id,
      updatedById: adminUser.id,
    },
  });
  console.log(`   ✓ Created employee: ${employee2.firstName} ${employee2.lastName} (${employee2.status})`);

  const employee3 = await prisma.officeEmployee.create({
    data: {
      employeeId: 'EMP003',
      firstName: 'Michael',
      lastName: 'Johnson',
      email: 'michael.johnson@example.com',
      phoneNumber: '+1-555-0105',
      addressLine1: '789 Pine Road',
      city: 'Calgary',
      stateProvince: 'AB',
      postalCode: 'T2P 1J9',
      country: 'Canada',
      jobTitle: 'Recruitment Specialist',
      department: 'Human Resources',
      employmentType: 'part_time',
      officeLocation: 'Calgary Office',
      dateOfBirth: new Date('1992-11-30'),
      status: 'under_review',
      createdById: adminUser.id,
      updatedById: adminUser.id,
    },
  });
  console.log(`   ✓ Created employee: ${employee3.firstName} ${employee3.lastName} (${employee3.status})`);

  // Create activity logs
  console.log('📝 Creating activity logs...');
  await prisma.activityLog.create({
    data: {
      entityType: 'employees',
      entityId: employee1.id,
      actionType: 'created',
      fieldName: 'status',
      newValue: 'active',
      performedById: adminUser.id,
    },
  });

  await prisma.activityLog.create({
    data: {
      entityType: 'employees',
      entityId: employee2.id,
      actionType: 'created',
      fieldName: 'status',
      newValue: 'trainee',
      performedById: adminUser.id,
    },
  });

  await prisma.activityLog.create({
    data: {
      entityType: 'employees',
      entityId: employee3.id,
      actionType: 'created',
      fieldName: 'status',
      newValue: 'under_review',
      performedById: adminUser.id,
    },
  });
  console.log('   ✓ Created activity logs');

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

  // Create work rules for common jurisdictions
  console.log('⚖️  Creating work rules for labor law compliance...');

  const workRules = [
    {
      name: 'Ontario Labor Standards',
      jurisdiction: 'CA-ON',
      effectiveDate: new Date('2024-01-01'),
      overtimeRules: {
        dailyThreshold: 8,
        weeklyThreshold: 44,
        dailyRate: 1.5,
        weeklyRate: 1.5,
        description: 'Overtime after 44 hours per week',
      },
      breakRules: {
        mealAfterHours: 5,
        mealDuration: 30,
        mealPaid: false,
        restBreaks: [],
        description: '30-minute meal break after 5 consecutive hours',
      },
      weeklyHourLimits: {
        maxDailyHours: 13,
        maxWeeklyHours: 48,
        minRestBetweenShifts: 11,
        description: 'Maximum 13 hours per day, 48 hours per week',
      },
    },
    {
      name: 'British Columbia Employment Standards',
      jurisdiction: 'CA-BC',
      effectiveDate: new Date('2024-01-01'),
      overtimeRules: {
        dailyThreshold: 8,
        weeklyThreshold: 40,
        dailyRate: 1.5,
        weeklyRate: 1.5,
        doubleTimeAfter: 12,
        description: 'Overtime after 8 hours/day or 40 hours/week, double time after 12 hours/day',
      },
      breakRules: {
        mealAfterHours: 5,
        mealDuration: 30,
        mealPaid: false,
        restBreaks: [{ afterHours: 4, duration: 15, paid: false }],
        description: '30-minute meal break after 5 hours',
      },
      weeklyHourLimits: null,
    },
    {
      name: 'California Labor Code',
      jurisdiction: 'US-CA',
      effectiveDate: new Date('2024-01-01'),
      overtimeRules: {
        dailyThreshold: 8,
        weeklyThreshold: 40,
        dailyRate: 1.5,
        weeklyRate: 1.5,
        doubleTimeAfter: 12,
        description: 'Overtime after 8 hours/day or 40 hours/week, double time after 12 hours/day',
      },
      breakRules: {
        mealAfterHours: 5,
        mealDuration: 30,
        mealPaid: false,
        restBreaks: [
          { afterHours: 4, duration: 10, paid: true },
          { afterHours: 6, duration: 10, paid: true },
        ],
        description: '30-minute meal break after 5 hours, 10-minute paid rest breaks',
      },
      weeklyHourLimits: null,
    },
    {
      name: 'New York Labor Law',
      jurisdiction: 'US-NY',
      effectiveDate: new Date('2024-01-01'),
      overtimeRules: {
        dailyThreshold: null,
        weeklyThreshold: 40,
        dailyRate: null,
        weeklyRate: 1.5,
        description: 'Overtime after 40 hours per week',
      },
      breakRules: {
        mealAfterHours: 6,
        mealDuration: 30,
        mealPaid: false,
        restBreaks: [],
        description: '30-minute meal break for shifts over 6 hours',
      },
      weeklyHourLimits: null,
    },
  ];

  for (const ruleData of workRules) {
    await prisma.workRule.create({
      data: ruleData,
    });
    console.log(`   ✓ Created work rule: ${ruleData.name} (${ruleData.jurisdiction})`);
  }

  // Create sample time entries for employee1
  console.log('⏰ Creating sample time tracking data...');

  const today = new Date();
  const thisWeekStart = new Date(today);
  thisWeekStart.setDate(today.getDate() - today.getDay()); // Sunday

  // Create time entries for the past 5 days
  const timeEntries = [];
  for (let i = 1; i <= 5; i++) {
    const entryDate = new Date(thisWeekStart);
    entryDate.setDate(thisWeekStart.getDate() + i); // Monday-Friday

    const clockIn = new Date(entryDate);
    clockIn.setHours(9, 0, 0, 0);

    const clockOut = new Date(entryDate);
    clockOut.setHours(17, 30, 0, 0); // 8.5 hours

    const totalMinutes = Math.round((clockOut - clockIn) / 60000);

    const timeEntry = await prisma.timeEntry.create({
      data: {
        entityType: 'employees',
        entityId: employee1.id,
        clockInTime: clockIn,
        clockOutTime: clockOut,
        timezone: 'America/Vancouver',
        entryType: 'regular_work',
        entrySource: 'web_portal',
        status: i < 3 ? 'approved' : 'submitted', // First 2 approved, rest submitted
        totalMinutes,
        createdById: adminUser.id,
      },
    });

    // Auto-create meal break (30 min) for each day
    await prisma.timeBreak.create({
      data: {
        timeEntryId: timeEntry.id,
        startTime: new Date(clockIn.getTime() + 4 * 60 * 60 * 1000), // 4 hours after clock-in
        endTime: new Date(clockIn.getTime() + 4.5 * 60 * 60 * 1000), // 30 min later
        breakType: 'meal_break',
        isPaid: false,
        isAutoDeducted: true,
        createdById: adminUser.id,
      },
    });

    timeEntries.push(timeEntry);
  }
  console.log(`   ✓ Created ${timeEntries.length} time entries with breaks for ${employee1.firstName}`);

  // Create a sample hours adjustment
  const payPeriodStart = new Date(thisWeekStart);
  payPeriodStart.setDate(1); // First of month
  const payPeriodEnd = new Date(payPeriodStart);
  payPeriodEnd.setDate(15); // 15th of month

  await prisma.hoursAdjustment.create({
    data: {
      entityType: 'employees',
      entityId: employee1.id,
      payPeriodStart,
      payPeriodEnd,
      hours: 2.0,
      reason: 'Compensatory time off for weekend work',
      adjustmentType: 'comp_time',
      isApproved: true,
      approvedById: adminUser.id,
      approvedAt: new Date(),
      createdById: adminUser.id,
    },
  });
  console.log(`   ✓ Created sample hours adjustment for ${employee1.firstName}`);

  console.log('');
  console.log('✅ Database seeding completed successfully!');
  console.log('');
  console.log('📊 Summary:');
  console.log(`   - Users: 1 (admin)`);
  console.log(`   - Employees: 3 (1 active, 1 trainee, 1 under_review)`);
  console.log(`   - Activity Logs: 3`);
  console.log(`   - Status Configs: ${statusConfigs.length}`);
  console.log(`   - Status Transitions: ${transitions.length}`);
  console.log(`   - Roles: ${roles.length}`);
  console.log(`   - Permissions: ${permissions.length}`);
  console.log(`   - Work Rules: ${workRules.length} (CA-ON, CA-BC, US-CA, US-NY)`);
  console.log(`   - Time Entries: ${timeEntries.length} with breaks`);
  console.log(`   - Hours Adjustments: 1`);
  console.log('');
  console.log('🔑 Login Credentials:');
  console.log(`   - Email: admin@example.com`);
  console.log(`   - Password: admin123`);
  console.log('');
  console.log('🔍 View data in Prisma Studio: npm run db:studio');
  console.log('');
  console.log('⚠️  Note: No mock files created. Upload documents via API.');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
