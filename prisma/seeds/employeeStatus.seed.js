/**
 * Employee Status Configuration Seed Script
 *
 * Populates status_configs and status_transitions tables
 * with employee status data based on EmployeeStatus enum
 *
 * Run with: node prisma/seeds/employeeStatus.seed.js
 */

import { PrismaClient } from '../../src/generated/prisma/index.js';

const prisma = new PrismaClient();

// Employee statuses with colors and display order
const EMPLOYEE_STATUSES = [
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

// Employee status transitions (from -> to)
const EMPLOYEE_TRANSITIONS = [
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

async function seedEmployeeStatuses() {
  console.log('🌱 Seeding employee status configurations...\n');

  try {
    // Delete existing data
    console.log('🗑️  Clearing existing data...');
    await prisma.statusTransition.deleteMany({});
    await prisma.statusConfig.deleteMany({});
    console.log('   ✓ Existing data cleared\n');

    // Seed employee statuses
    console.log('📝 Creating employee statuses...');
    const statusMap = {};

    for (const status of EMPLOYEE_STATUSES) {
      const created = await prisma.statusConfig.create({
        data: {
          entityType: 'employees',
          statusCode: status.code,
          statusLabel: status.label,
          color: status.color,
          sortOrder: status.order,
        }
      });
      statusMap[status.code] = created.id;
      console.log(`   ✓ ${status.label} (${status.code}) - ${status.color}`);
    }

    console.log(`\n✅ Created ${EMPLOYEE_STATUSES.length} employee statuses\n`);

    // Seed employee transitions
    console.log('🔀 Creating status transitions...');
    let transitionCount = 0;

    for (const [from, to] of EMPLOYEE_TRANSITIONS) {
      await prisma.statusTransition.create({
        data: {
          fromStatusId: statusMap[from],
          toStatusId: statusMap[to],
        }
      });
      console.log(`   ✓ ${from} → ${to}`);
      transitionCount++;
    }

    console.log(`\n✅ Created ${transitionCount} status transitions\n`);
    console.log('🎉 Employee status configuration seeded successfully!\n');
    console.log('💡 You can now view/edit this data with: npx prisma studio');

  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed
seedEmployeeStatuses();
