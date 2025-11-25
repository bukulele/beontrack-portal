-- AddForeignKey
ALTER TABLE "wcb_claims" ADD CONSTRAINT "wcb_claims_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "office_employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
