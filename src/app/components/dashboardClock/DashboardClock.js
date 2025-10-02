import React, { useEffect, useState } from "react";
import moment from "moment-timezone";

function DashboardClock() {
  const [currentTime, setCurrentTime] = useState(null);

  useEffect(() => {
    // Update the time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(moment());
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  if (!currentTime) return;

  return (
    <div className="min-[3840px]:text-5xl min-[3840px]:py-6 text-xl font-bold text-gray-700 dark:text-gray-300">
      {currentTime.format("MMM Do YYYY, HH:mm")}
    </div>
  );
}

export default DashboardClock;
