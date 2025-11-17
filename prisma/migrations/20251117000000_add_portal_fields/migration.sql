-- Add portal access fields to office_employees table
ALTER TABLE "office_employees" ADD COLUMN IF NOT EXISTS "portal_access_enabled" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "office_employees" ADD COLUMN IF NOT EXISTS "allow_application_edit" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "office_employees" ADD COLUMN IF NOT EXISTS "user_id" UUID;

-- Make employee_id nullable for portal applicants
ALTER TABLE "office_employees" ALTER COLUMN "employee_id" DROP NOT NULL;

-- Add review fields to activity_history table
ALTER TABLE "activity_history" ADD COLUMN IF NOT EXISTS "reviewed_at" TIMESTAMPTZ(6);
ALTER TABLE "activity_history" ADD COLUMN IF NOT EXISTS "reviewed_by_id" UUID;
ALTER TABLE "activity_history" ADD COLUMN IF NOT EXISTS "was_reviewed" BOOLEAN NOT NULL DEFAULT false;

-- Add foreign key constraints
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'office_employees_user_id_fkey'
  ) THEN
    ALTER TABLE "office_employees" ADD CONSTRAINT "office_employees_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'activity_history_reviewed_by_id_fkey'
  ) THEN
    ALTER TABLE "activity_history" ADD CONSTRAINT "activity_history_reviewed_by_id_fkey"
    FOREIGN KEY ("reviewed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;

  -- Fix createdById and updatedById constraints to use CASCADE instead of SET NULL
  -- These were created by earlier migrations with wrong behavior
  ALTER TABLE "office_employees" DROP CONSTRAINT IF EXISTS "office_employees_created_by_id_fkey";
  ALTER TABLE "office_employees" ADD CONSTRAINT "office_employees_created_by_id_fkey"
    FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

  ALTER TABLE "office_employees" DROP CONSTRAINT IF EXISTS "office_employees_updated_by_id_fkey";
  ALTER TABLE "office_employees" ADD CONSTRAINT "office_employees_updated_by_id_fkey"
    FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
END$$;
