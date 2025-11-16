-- Add portal access fields to office_employees table
ALTER TABLE "office_employees" ADD COLUMN IF NOT EXISTS "portal_access_enabled" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "office_employees" ADD COLUMN IF NOT EXISTS "allow_application_edit" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "office_employees" ADD COLUMN IF NOT EXISTS "user_id" UUID;

-- Make employee_id nullable for portal applicants
ALTER TABLE "office_employees" ALTER COLUMN "employee_id" DROP NOT NULL;

-- Add foreign key constraint for portal user
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'office_employees_user_id_fkey'
  ) THEN
    ALTER TABLE "office_employees" ADD CONSTRAINT "office_employees_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END$$;
