-- CreateEnum
CREATE TYPE "EmployeeStatus" AS ENUM ('new', 'under_review', 'application_on_hold', 'rejected', 'offer_accepted', 'trainee', 'active', 'resigned', 'vacation', 'on_leave', 'wcb', 'terminated', 'suspended');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('full_time', 'part_time', 'contract');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('government_id', 'work_authorization', 'sin_ssn', 'direct_deposit', 'tax_forms', 'resume', 'background_check_consent', 'employment_contract', 'company_policies', 'confidentiality_agreement', 'benefits_enrollment', 'professional_certifications', 'education_verification', 'safety_training', 'immigration_documents', 'other_documents', 'profile_photo');

-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('employees', 'time_entries', 'adjustments');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('employment', 'education', 'unemployment', 'self_employed', 'military_service', 'other');

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

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "password_hash" VARCHAR(255),
    "first_name" VARCHAR(150),
    "last_name" VARCHAR(150),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_staff" BOOLEAN NOT NULL DEFAULT false,
    "is_superuser" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "department" VARCHAR(100),
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "location" VARCHAR(100),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "office_employees" (
    "id" UUID NOT NULL,
    "employee_id" VARCHAR(50),
    "first_name" VARCHAR(100),
    "last_name" VARCHAR(100),
    "email" VARCHAR(254),
    "phone_number" VARCHAR(20),
    "emergency_contact_name" VARCHAR(200),
    "emergency_contact_phone" VARCHAR(20),
    "address_line1" VARCHAR(255),
    "address_line2" VARCHAR(255),
    "city" VARCHAR(100),
    "state_province" VARCHAR(100),
    "postal_code" VARCHAR(20),
    "country" VARCHAR(100),
    "hire_date" DATE,
    "termination_date" DATE,
    "job_title" VARCHAR(100),
    "department" VARCHAR(100),
    "employment_type" "EmploymentType",
    "office_location" VARCHAR(100),
    "date_of_birth" DATE,
    "status" "EmployeeStatus" NOT NULL DEFAULT 'new',
    "profile_photo_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "created_by_id" UUID NOT NULL,
    "updated_by_id" UUID NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMPTZ(6),
    "date_of_leaving" DATE,
    "reason_for_leaving" TEXT,
    "remarks_comments" TEXT,
    "status_note" TEXT,
    "can_checkin_remotely" BOOLEAN NOT NULL DEFAULT false,
    "portal_access_enabled" BOOLEAN NOT NULL DEFAULT true,
    "allow_application_edit" BOOLEAN NOT NULL DEFAULT true,
    "user_id" UUID,
    "signature" TEXT,
    "signature_date" TIMESTAMPTZ(6),

    CONSTRAINT "office_employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" UUID NOT NULL,
    "document_type" "DocumentType" NOT NULL,
    "file_path" VARCHAR(500) NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "mime_type" VARCHAR(100) NOT NULL,
    "file_size" INTEGER NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "metadata" JSONB,
    "was_reviewed" BOOLEAN NOT NULL DEFAULT false,
    "reviewed_by_id" UUID,
    "reviewed_at" TIMESTAMPTZ(6),
    "uploaded_by_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMPTZ(6),
    "entity_type" VARCHAR(50) NOT NULL,
    "entity_id" UUID NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_history" (
    "id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "activity_type" "ActivityType" NOT NULL,
    "description" TEXT,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "till_now" BOOLEAN NOT NULL DEFAULT false,
    "organization_name" VARCHAR(255),
    "role_or_position" VARCHAR(255),
    "location" VARCHAR(255),
    "email_address" VARCHAR(254),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMPTZ(6),
    "reviewed_at" TIMESTAMPTZ(6),
    "reviewed_by_id" UUID,
    "was_reviewed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "activity_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_logs" (
    "id" UUID NOT NULL,
    "action_type" VARCHAR(50) NOT NULL,
    "field_name" VARCHAR(100),
    "old_value" TEXT,
    "new_value" TEXT,
    "performed_by_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "entity_type" VARCHAR(50) NOT NULL,
    "entity_id" UUID NOT NULL,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "status_configs" (
    "id" UUID NOT NULL,
    "entity_type" "EntityType" NOT NULL,
    "status_code" VARCHAR(50) NOT NULL,
    "status_label" VARCHAR(100) NOT NULL,
    "color" VARCHAR(7) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "status_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "status_transitions" (
    "id" UUID NOT NULL,
    "from_status_id" UUID NOT NULL,
    "to_status_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "status_transitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "entity_type" VARCHAR(50) NOT NULL,
    "actions" VARCHAR(20)[],
    "fields" JSONB,
    "conditions" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "account_id" VARCHAR(255) NOT NULL,
    "provider_id" VARCHAR(100) NOT NULL,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "access_token_expires_at" TIMESTAMPTZ(6),
    "refresh_token_expires_at" TIMESTAMPTZ(6),
    "scope" TEXT,
    "id_token" TEXT,
    "password" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verifications" (
    "id" UUID NOT NULL,
    "identifier" VARCHAR(255) NOT NULL,
    "value" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "verifications_pkey" PRIMARY KEY ("id")
);

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
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "office_employees_employee_id_key" ON "office_employees"("employee_id");

-- CreateIndex
CREATE INDEX "documents_entity_type_entity_id_idx" ON "documents"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "documents_document_type_idx" ON "documents"("document_type");

-- CreateIndex
CREATE INDEX "activity_history_employee_id_idx" ON "activity_history"("employee_id");

-- CreateIndex
CREATE INDEX "activity_history_start_date_end_date_idx" ON "activity_history"("start_date", "end_date");

-- CreateIndex
CREATE INDEX "activity_logs_entity_type_entity_id_idx" ON "activity_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "status_configs_entity_type_idx" ON "status_configs"("entity_type");

-- CreateIndex
CREATE UNIQUE INDEX "status_configs_entity_type_status_code_key" ON "status_configs"("entity_type", "status_code");

-- CreateIndex
CREATE INDEX "status_transitions_from_status_id_idx" ON "status_transitions"("from_status_id");

-- CreateIndex
CREATE UNIQUE INDEX "status_transitions_from_status_id_to_status_id_key" ON "status_transitions"("from_status_id", "to_status_id");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE INDEX "user_roles_user_id_idx" ON "user_roles"("user_id");

-- CreateIndex
CREATE INDEX "user_roles_role_id_idx" ON "user_roles"("role_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_user_id_role_id_key" ON "user_roles"("user_id", "role_id");

-- CreateIndex
CREATE INDEX "permissions_role_id_idx" ON "permissions"("role_id");

-- CreateIndex
CREATE INDEX "permissions_entity_type_idx" ON "permissions"("entity_type");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE INDEX "sessions_token_idx" ON "sessions"("token");

-- CreateIndex
CREATE INDEX "sessions_expires_at_idx" ON "sessions"("expires_at");

-- CreateIndex
CREATE INDEX "accounts_user_id_idx" ON "accounts"("user_id");

-- CreateIndex
CREATE INDEX "accounts_provider_id_idx" ON "accounts"("provider_id");

-- CreateIndex
CREATE INDEX "verifications_identifier_idx" ON "verifications"("identifier");

-- CreateIndex
CREATE INDEX "verifications_expires_at_idx" ON "verifications"("expires_at");

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
ALTER TABLE "office_employees" ADD CONSTRAINT "office_employees_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "office_employees" ADD CONSTRAINT "office_employees_profile_photo_id_fkey" FOREIGN KEY ("profile_photo_id") REFERENCES "documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "office_employees" ADD CONSTRAINT "office_employees_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "office_employees" ADD CONSTRAINT "office_employees_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_reviewed_by_id_fkey" FOREIGN KEY ("reviewed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_uploaded_by_id_fkey" FOREIGN KEY ("uploaded_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_history" ADD CONSTRAINT "activity_history_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "office_employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_history" ADD CONSTRAINT "activity_history_reviewed_by_id_fkey" FOREIGN KEY ("reviewed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_performed_by_id_fkey" FOREIGN KEY ("performed_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "status_transitions" ADD CONSTRAINT "status_transitions_from_status_id_fkey" FOREIGN KEY ("from_status_id") REFERENCES "status_configs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "status_transitions" ADD CONSTRAINT "status_transitions_to_status_id_fkey" FOREIGN KEY ("to_status_id") REFERENCES "status_configs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_entries" ADD CONSTRAINT "time_entries_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_breaks" ADD CONSTRAINT "time_breaks_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_breaks" ADD CONSTRAINT "time_breaks_time_entry_id_fkey" FOREIGN KEY ("time_entry_id") REFERENCES "time_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_amendments" ADD CONSTRAINT "time_amendments_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_amendments" ADD CONSTRAINT "time_amendments_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_amendments" ADD CONSTRAINT "time_amendments_time_entry_id_fkey" FOREIGN KEY ("time_entry_id") REFERENCES "time_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_approvals" ADD CONSTRAINT "time_approvals_decided_by_id_fkey" FOREIGN KEY ("decided_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_approvals" ADD CONSTRAINT "time_approvals_time_entry_id_fkey" FOREIGN KEY ("time_entry_id") REFERENCES "time_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hours_adjustments" ADD CONSTRAINT "hours_adjustments_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hours_adjustments" ADD CONSTRAINT "hours_adjustments_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
