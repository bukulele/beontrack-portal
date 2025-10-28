/**
 * Prisma Seed Script
 *
 * Seeds the database with initial data for development.
 * Auto-runs after: npx prisma migrate reset
 * Manual run: npm run db:seed
 */

const { PrismaClient } = require('../src/generated/prisma');

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

  // Create admin user
  console.log('👤 Creating admin user...');
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      username: 'admin',
      passwordHash: '', // Empty for OAuth users in development
      firstName: 'Admin',
      lastName: 'User',
      isActive: true,
      isStaff: true,
      isSuperuser: true,
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
      employeeId: employee1.id,
      actionType: 'created',
      fieldName: 'status',
      newValue: 'active',
      performedById: adminUser.id,
    },
  });

  await prisma.activityLog.create({
    data: {
      employeeId: employee2.id,
      actionType: 'created',
      fieldName: 'status',
      newValue: 'trainee',
      performedById: adminUser.id,
    },
  });

  await prisma.activityLog.create({
    data: {
      employeeId: employee3.id,
      actionType: 'created',
      fieldName: 'status',
      newValue: 'under_review',
      performedById: adminUser.id,
    },
  });
  console.log('   ✓ Created activity logs');

  console.log('');
  console.log('✅ Database seeding completed successfully!');
  console.log('');
  console.log('📊 Summary:');
  console.log(`   - Users: 1 (admin)`);
  console.log(`   - Employees: 3 (1 active, 1 trainee, 1 under_review)`);
  console.log(`   - Activity Logs: 3`);
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
