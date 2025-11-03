/*
  Make Documents and ActivityLogs generic (support any entity type)

  Strategy:
  1. Add new columns with default values
  2. Backfill from employee_id
  3. Make columns NOT NULL
  4. Add indexes
*/

-- Step 1: Add new columns with temporary defaults
ALTER TABLE "documents"
  ADD COLUMN "entity_type" VARCHAR(50) DEFAULT 'employee',
  ADD COLUMN "entity_id" UUID;

ALTER TABLE "activity_logs"
  ADD COLUMN "entity_type" VARCHAR(50) DEFAULT 'employee',
  ADD COLUMN "entity_id" UUID;

-- Step 2: Backfill entity_id from employee_id for existing rows
UPDATE "documents" SET "entity_id" = "employee_id" WHERE "employee_id" IS NOT NULL;
UPDATE "activity_logs" SET "entity_id" = "employee_id" WHERE "employee_id" IS NOT NULL;

-- Step 3: Remove default and make NOT NULL (now that data is backfilled)
ALTER TABLE "documents"
  ALTER COLUMN "entity_type" DROP DEFAULT,
  ALTER COLUMN "entity_type" SET NOT NULL,
  ALTER COLUMN "entity_id" SET NOT NULL,
  ALTER COLUMN "employee_id" DROP NOT NULL;

ALTER TABLE "activity_logs"
  ALTER COLUMN "entity_type" DROP DEFAULT,
  ALTER COLUMN "entity_type" SET NOT NULL,
  ALTER COLUMN "entity_id" SET NOT NULL,
  ALTER COLUMN "employee_id" DROP NOT NULL;

-- Step 4: Create indexes
CREATE INDEX "documents_entity_type_entity_id_idx" ON "documents"("entity_type", "entity_id");
CREATE INDEX "documents_document_type_idx" ON "documents"("document_type");
CREATE INDEX "activity_logs_entity_type_entity_id_idx" ON "activity_logs"("entity_type", "entity_id");
