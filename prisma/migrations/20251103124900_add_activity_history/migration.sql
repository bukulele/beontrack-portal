-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('employment', 'education', 'unemployment', 'self_employed', 'military_service', 'other');

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

    CONSTRAINT "activity_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "activity_history_employee_id_idx" ON "activity_history"("employee_id");

-- CreateIndex
CREATE INDEX "activity_history_start_date_end_date_idx" ON "activity_history"("start_date", "end_date");

-- AddForeignKey
ALTER TABLE "activity_history" ADD CONSTRAINT "activity_history_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "office_employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
