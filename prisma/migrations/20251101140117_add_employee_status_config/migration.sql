-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('employees');

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

-- CreateIndex
CREATE INDEX "status_configs_entity_type_idx" ON "status_configs"("entity_type");

-- CreateIndex
CREATE UNIQUE INDEX "status_configs_entity_type_status_code_key" ON "status_configs"("entity_type", "status_code");

-- CreateIndex
CREATE INDEX "status_transitions_from_status_id_idx" ON "status_transitions"("from_status_id");

-- CreateIndex
CREATE UNIQUE INDEX "status_transitions_from_status_id_to_status_id_key" ON "status_transitions"("from_status_id", "to_status_id");

-- AddForeignKey
ALTER TABLE "status_transitions" ADD CONSTRAINT "status_transitions_from_status_id_fkey" FOREIGN KEY ("from_status_id") REFERENCES "status_configs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "status_transitions" ADD CONSTRAINT "status_transitions_to_status_id_fkey" FOREIGN KEY ("to_status_id") REFERENCES "status_configs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
