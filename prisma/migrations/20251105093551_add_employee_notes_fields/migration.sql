/*
  Warnings:

  - You are about to drop the column `employee_id` on the `activity_logs` table. All the data in the column will be lost.
  - You are about to drop the column `employee_id` on the `documents` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."activity_logs" DROP CONSTRAINT "activity_logs_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."documents" DROP CONSTRAINT "documents_employee_id_fkey";

-- AlterTable
ALTER TABLE "activity_logs" DROP COLUMN "employee_id";

-- AlterTable
ALTER TABLE "documents" DROP COLUMN "employee_id";

-- AlterTable
ALTER TABLE "office_employees" ADD COLUMN     "date_of_leaving" DATE,
ADD COLUMN     "reason_for_leaving" TEXT,
ADD COLUMN     "remarks_comments" TEXT,
ADD COLUMN     "status_note" TEXT;
