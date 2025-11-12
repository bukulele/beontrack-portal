-- CreateEnum
CREATE TYPE "TimeEntryType" AS ENUM ('regular_work', 'overtime', 'sick_leave', 'vacation', 'personal_leave', 'unpaid_leave', 'holiday', 'bereavement', 'jury_duty', 'training', 'other');

-- CreateEnum
CREATE TYPE "EntrySource" AS ENUM ('mobile_app', 'web_portal', 'time_clock_kiosk', 'admin_manual', 'system_import', 'api');

-- CreateEnum
CREATE TYPE "TimeEntryStatus" AS ENUM ('draft', 'submitted', 'approved', 'rejected', 'locked', 'disputed');

-- CreateEnum
CREATE TYPE "BreakType" AS ENUM ('meal_break', 'rest_break', 'coffee_break', 'other');

-- CreateEnum
CREATE TYPE "AmendmentType" AS ENUM ('time_correction', 'type_change', 'break_adjustment', 'admin_override', 'system_correction');

-- CreateEnum
CREATE TYPE "ApprovalDecision" AS ENUM ('approved', 'rejected', 'needs_correction', 'escalated');

-- CreateEnum
CREATE TYPE "AdjustmentType" AS ENUM ('manual_correction', 'comp_time', 'pto_adjustment', 'holiday_pay', 'bonus_hours', 'penalty_deduction', 'other');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EntityType" ADD VALUE 'time_entries';
ALTER TYPE "EntityType" ADD VALUE 'adjustments';

-- AlterTable
ALTER TABLE "office_employees" ADD COLUMN     "can_checkin_remotely" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "time_entries" (
    "id" UUID NOT NULL,
    "entity_type" VARCHAR(50) NOT NULL,
    "entity_id" UUID NOT NULL,
    "clock_in_time" TIMESTAMPTZ(6) NOT NULL,
    "clock_out_time" TIMESTAMPTZ(6),
    "timezone" VARCHAR(50) NOT NULL,
    "clock_in_location" JSONB,
    "clock_out_location" JSONB,
    "entry_type" "TimeEntryType" NOT NULL,
    "entry_source" "EntrySource" NOT NULL,
    "work_type" VARCHAR(50),
    "project_id" UUID,
    "department_code" VARCHAR(50),
    "cost_center" VARCHAR(50),
    "status" "TimeEntryStatus" NOT NULL DEFAULT 'draft',
    "total_minutes" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "created_by_id" UUID NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "time_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "time_breaks" (
    "id" UUID NOT NULL,
    "time_entry_id" UUID NOT NULL,
    "start_time" TIMESTAMPTZ(6) NOT NULL,
    "end_time" TIMESTAMPTZ(6),
    "break_type" "BreakType" NOT NULL,
    "is_paid" BOOLEAN NOT NULL DEFAULT false,
    "is_auto_deducted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "created_by_id" UUID NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "time_breaks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "time_amendments" (
    "id" UUID NOT NULL,
    "time_entry_id" UUID NOT NULL,
    "amendment_type" "AmendmentType" NOT NULL,
    "field_changed" VARCHAR(50),
    "old_value" TEXT,
    "new_value" TEXT,
    "reason" TEXT NOT NULL,
    "requires_approval" BOOLEAN NOT NULL DEFAULT true,
    "is_approved" BOOLEAN,
    "approved_by_id" UUID,
    "approved_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" UUID NOT NULL,

    CONSTRAINT "time_amendments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "time_approvals" (
    "id" UUID NOT NULL,
    "time_entry_id" UUID NOT NULL,
    "approvalLevel" INTEGER NOT NULL,
    "approver_role" VARCHAR(50) NOT NULL,
    "decision" "ApprovalDecision" NOT NULL,
    "comments" TEXT,
    "decided_at" TIMESTAMPTZ(6) NOT NULL,
    "decided_by_id" UUID NOT NULL,

    CONSTRAINT "time_approvals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hours_adjustments" (
    "id" UUID NOT NULL,
    "entity_type" VARCHAR(50) NOT NULL,
    "entity_id" UUID NOT NULL,
    "pay_period_start" DATE NOT NULL,
    "pay_period_end" DATE NOT NULL,
    "adjustment_type" "AdjustmentType" NOT NULL,
    "hours" DOUBLE PRECISION NOT NULL,
    "reason" TEXT NOT NULL,
    "reference_number" VARCHAR(100),
    "is_approved" BOOLEAN NOT NULL DEFAULT false,
    "approved_by_id" UUID,
    "approved_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "created_by_id" UUID NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "hours_adjustments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_rules" (
    "id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "jurisdiction" VARCHAR(100) NOT NULL,
    "effective_date" DATE NOT NULL,
    "expiry_date" DATE,
    "overtime_rules" JSONB NOT NULL,
    "break_rules" JSONB NOT NULL,
    "weekly_hour_limits" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "work_rules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "time_entries_entity_type_entity_id_clock_in_time_idx" ON "time_entries"("entity_type", "entity_id", "clock_in_time");

-- CreateIndex
CREATE INDEX "time_entries_status_clock_in_time_idx" ON "time_entries"("status", "clock_in_time");

-- CreateIndex
CREATE INDEX "time_entries_clock_in_time_idx" ON "time_entries"("clock_in_time");

-- CreateIndex
CREATE INDEX "time_breaks_time_entry_id_idx" ON "time_breaks"("time_entry_id");

-- CreateIndex
CREATE INDEX "time_amendments_time_entry_id_created_at_idx" ON "time_amendments"("time_entry_id", "created_at");

-- CreateIndex
CREATE INDEX "time_amendments_is_approved_created_at_idx" ON "time_amendments"("is_approved", "created_at");

-- CreateIndex
CREATE INDEX "time_approvals_time_entry_id_idx" ON "time_approvals"("time_entry_id");

-- CreateIndex
CREATE INDEX "time_approvals_decided_by_id_idx" ON "time_approvals"("decided_by_id");

-- CreateIndex
CREATE INDEX "time_approvals_decision_idx" ON "time_approvals"("decision");

-- CreateIndex
CREATE INDEX "hours_adjustments_entity_type_entity_id_pay_period_start_idx" ON "hours_adjustments"("entity_type", "entity_id", "pay_period_start");

-- CreateIndex
CREATE INDEX "hours_adjustments_pay_period_start_idx" ON "hours_adjustments"("pay_period_start");

-- CreateIndex
CREATE INDEX "work_rules_jurisdiction_effective_date_idx" ON "work_rules"("jurisdiction", "effective_date");

-- AddForeignKey
ALTER TABLE "time_entries" ADD CONSTRAINT "time_entries_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_breaks" ADD CONSTRAINT "time_breaks_time_entry_id_fkey" FOREIGN KEY ("time_entry_id") REFERENCES "time_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_breaks" ADD CONSTRAINT "time_breaks_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_amendments" ADD CONSTRAINT "time_amendments_time_entry_id_fkey" FOREIGN KEY ("time_entry_id") REFERENCES "time_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_amendments" ADD CONSTRAINT "time_amendments_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_amendments" ADD CONSTRAINT "time_amendments_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_approvals" ADD CONSTRAINT "time_approvals_time_entry_id_fkey" FOREIGN KEY ("time_entry_id") REFERENCES "time_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_approvals" ADD CONSTRAINT "time_approvals_decided_by_id_fkey" FOREIGN KEY ("decided_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hours_adjustments" ADD CONSTRAINT "hours_adjustments_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hours_adjustments" ADD CONSTRAINT "hours_adjustments_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
