import React, { useState, useEffect } from "react";
import DashboardBays from "../dashboardBays/DashboardBays";
import DashboardTechs from "../dashboardTechs/DashboardTechs";
import DashboardClock from "../dashboardClock/DashboardClock";
import DashboardStatusComponent from "../dashboardStatusComponent/DashboardStatusComponent";

function DashboardSideSwitcher() {
  const [showDiv1, setShowDiv1] = useState(true);

  useEffect(() => {
    // Update the dashboard switching logic
    const interval = setInterval(
      () => {
        setShowDiv1((prevShowDiv1) => !prevShowDiv1);
      },
      showDiv1 ? 10000 : 20000
    );

    return () => clearInterval(interval);
  }, [showDiv1]);

  return (
    <div className="flex flex-col h-full items-center p-2 gap-3">
      <DashboardClock />
      <DashboardStatusComponent />
      {showDiv1 ? <DashboardBays /> : <DashboardTechs />}
    </div>
  );
}

export default DashboardSideSwitcher;
