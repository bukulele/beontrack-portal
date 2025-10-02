import TruckCardInfo from "../truckCardInfo/TruckCardInfo";
import TruckCardFiles from "../truckCardFiles/TruckCardFiles";

function TruckCardData() {
  const dnd = {
    truck_license_plates: {
      name: "License Plate",
      key: "truck_license_plates",
    },
    truck_safety_docs: {
      name: "Safety",
      key: "truck_safety_docs",
    },
    truck_registration_docs: {
      name: "Registration",
      key: "truck_registration_docs",
    },
    truck_bill_of_sales: {
      name: "Bill of Sales",
      key: "truck_bill_of_sales",
    },
    truck_other_documents: {
      name: "Other Docs",
      key: "truck_other_documents",
    },
  };

  return (
    <div className="overflow-y-scroll flex-auto px-5 pb-5">
      <TruckCardInfo />
      <div className="flex w-full mt-3 gap-3">
        <TruckCardFiles fields={dnd} header={"Docs & Dates"} />
      </div>
    </div>
  );
}

export default TruckCardData;
