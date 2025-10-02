import useUserRoles from "@/app/functions/useUserRoles";
import EmployeeCardInfo from "../employeeCardInfo/EmployeeCardInfo";
import EmployeeCardFiles from "../employeeCardFiles/EmployeeCardFiles";

function EmployeeCardData() {
  const userRoles = useUserRoles();

  const dnd = [
    "immigration_doc",
    "abstracts",
    "tdg_cards",
    "good_to_go_cards",
    "lcv_certificates",
    "lcv_licenses",
    "winter_courses",
    "pdic_certificates",
    "abstract_request_forms",
  ];
  const hiringDocs = [
    "id_documents",
    "criminal_records",
    "log_books",
    "annual_performance_reviews",
    "driver_memos",
    "driver_statements",
    "certificates_of_violations",
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
    "rate",
    "sin",
    "void_check",
    "tax_papers",
    "incorp_docs",
    "gst_docs",
  ];

  return (
    <div className="overflow-y-scroll flex-auto px-5 pb-5">
      <EmployeeCardInfo />
      {(userRoles.includes(process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_ADMIN) ||
        userRoles.includes(process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PAYROLL) ||
        userRoles.includes(
          process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PAYROLL_MANAGER
        ) ||
        userRoles.includes(process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_HR)) && (
        <div className="flex w-full mt-3 gap-3">
          <div className="w-1/3">
            <EmployeeCardFiles fields={dnd} header={"Docs & Dates"} />
          </div>
          <div className="w-1/3">
            <EmployeeCardFiles fields={hiringDocs} header={"HR & Recruiting"} />
          </div>
          <div className="w-1/3">
            <EmployeeCardFiles fields={payrollDocs} header={"Payroll"} />
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeCardData;
