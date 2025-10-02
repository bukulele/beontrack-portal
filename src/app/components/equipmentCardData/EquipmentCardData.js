import EquipmentCardInfo from "../equipmentCardInfo/EquipmentCardInfo";
import EquipmentCardFiles from "../equipmentCardFiles/EquipmentCardFiles";

function EquipmentCardData() {
  const dnd = {
    equipment_license_plates: {
      name: "License Plate",
      key: "equipment_license_plates",
    },
    equipment_safety_docs: {
      name: "Safety",
      key: "equipment_safety_docs",
    },
    equipment_registration_docs: {
      name: "Registration",
      key: "equipment_registration_docs",
    },
    equipment_bill_of_sales: {
      name: "Bill of Sales",
      key: "equipment_bill_of_sales",
    },
    equipment_other_documents: {
      name: "Other Docs",
      key: "equipment_other_documents",
    },
  };

  return (
    <div className="overflow-y-scroll flex-auto px-5 pb-5">
      <EquipmentCardInfo />
      <div className="flex w-full mt-3 gap-3">
        <EquipmentCardFiles fields={dnd} header={"Docs & Dates"} />
      </div>
    </div>
  );
}

export default EquipmentCardData;
