import useUserRoles from "@/app/functions/useUserRoles";
import DriverCardInfo from "../driverCardInfo/DriverCardInfo";
import DriverCardFiles from "../driverCardFiles/DriverCardFiles";

function DriverCardData() {
  const userRoles = useUserRoles();

  const dnd = [
    "licenses",
    "immigration_doc",
    "abstracts",
    "tdg_cards",
    "good_to_go_cards",
    "lcv_certificates",
    "lcv_licenses",
    "winter_courses",
    "pdic_certificates",
    "abstract_request_forms",
    "annual_performance_reviews",
    "certificates_of_violations",
  ];
  const hiringDocs = [
    "criminal_records",
    "log_books",
    "driver_memos",
    "driver_statements",
    "passports",
    "us_visas",
    "activity_history",
    "consents",
    "reference_checks",
    "mentor_forms",
    "employment_contracts",
    "driver_prescreenings",
    "gtg_quizes",
    "knowledge_tests",
    "road_tests",
    "other_documents",
  ];
  const payrollDocs = [
    "rates_ca_single",
    "rates_ca_team",
    "rates_city",
    "rates_lcv_single",
    "rates_lcv_team",
    "rates_us_team",
    "sin",
    "void_check",
    "tax_papers",
    "incorp_docs",
    "gst_docs",
  ];
  const plannerDocs = [
    "licenses",
    "passports",
    "us_visas",
    "immigration_doc",
    "lcv_licenses",
    "tdg_cards",
    "good_to_go_cards",
  ];

  return (
    <div className="overflow-y-scroll flex-auto px-5 pb-5">
      <DriverCardInfo />
      {!userRoles.includes(process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PLANNER) &&
        !userRoles.includes(
          process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_DISPATCH
        ) &&
        !userRoles.includes(process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_SHOP) && (
          <div className="flex w-full mt-3 gap-3">
            <div className="w-1/3">
              <DriverCardFiles fields={dnd} header={"Docs & Dates"} />
            </div>
            <div className="w-1/3">
              <DriverCardFiles fields={hiringDocs} header={"HR & Recruiting"} />
            </div>
            <div className="w-1/3">
              <DriverCardFiles fields={payrollDocs} header={"Payroll"} />
            </div>
          </div>
        )}
      {userRoles.includes(
        process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PLANNER
      ) && (
        <div className="flex w-full mt-3 gap-3">
          <DriverCardFiles fields={plannerDocs} header={"Driver Docs"} />
        </div>
      )}
    </div>
  );
}

export default DriverCardData;
