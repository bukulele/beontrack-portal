import React from "react";
import DriverCard from "../../components/driverCard/DriverCard";

function DriverCardPage({ params }) {
  return (
    <div className="flex p-1 w-full h-screen bg-white justify-center">
      <DriverCard userId={params.uid} />
    </div>
  );
}

export default DriverCardPage;
