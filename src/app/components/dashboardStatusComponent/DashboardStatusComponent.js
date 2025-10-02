import React, { useContext } from "react";
import { BaysWorksContext } from "@/app/context/BaysWorksContext";

function DashboardStatusComponent() {
  const { shopData } = useContext(BaysWorksContext);

  if (!shopData) return;

  // Helper function to check if a given date is "today"
  const isToday = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const now = new Date();
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    );
  };

  // Count of active
  const activeCount = shopData.filter(
    (item) => item.status === "IN_PROGRESS"
  ).length;

  // Count of done for today
  const doneTodayCount = shopData.filter(
    (item) => item.status === "COMPLETED" && isToday(item.time_out)
  ).length;

  return (
    <div className="p-2 bg-white dark:bg-gray-800 rounded-md shadow w-full">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-2 rounded-md bg-yellow-50 dark:bg-yellow-900">
          <p className="text-sm min-[3840px]:text-4xl min-[3840px]:mb-4 font-medium text-yellow-800 dark:text-yellow-100">
            Active
          </p>
          <p className="text-2xl min-[3840px]:text-7xl font-bold text-yellow-800 dark:text-yellow-100">
            {activeCount}
          </p>
        </div>
        <div className="p-2 rounded-md bg-green-50 dark:bg-green-900">
          <p className="text-sm min-[3840px]:text-4xl min-[3840px]:mb-4 font-medium text-green-800 dark:text-green-100">
            Done for Today
          </p>
          <p className="text-2xl min-[3840px]:text-7xl font-bold text-green-800 dark:text-green-100">
            {doneTodayCount}
          </p>
        </div>
      </div>
    </div>
  );
}

export default DashboardStatusComponent;
