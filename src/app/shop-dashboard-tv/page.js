"use client";

import DashboardSideSwitcher from "../components/dashboardSideSwitcher/DashboardSideSwitcher";
import BaysWorksTable from "../components/shopTable/BaysWorksTable";
import { BaysWorksProvider } from "../context/BaysWorksContext";
import Image from "next/image";
import DarkThemeToggle from "../components/themeToggler/DarkThemeToggle";

const ShopDashboardPageTV = () => {
  return (
    <BaysWorksProvider>
      <div className="flex flex-col gap-2 h-screen bg-white dark:bg-gray-900 float-slow">
        <div className="flex items-center bg-[#f8f8f8] dark:bg-gray-800 shadow-md">
          <div className="absolute left-0 top-0 w-full h-full">
            <DarkThemeToggle />
          </div>
          <div className="flex-auto">
            <p className="text-center font-bold min-[3840px]:text-5xl text-3xl min-[3840px]:py-4 py-2 text-black dark:text-white">
              Winnipeg Shop Dashboard
            </p>
          </div>
          <div className="flex items-center justify-center h-full max-h-16 min-[3840px]:max-h-32 w-auto">
            <Image
              src="/logo.png"
              alt="Logo"
              width={560}
              height={129}
              className="h-full object-contain"
            />
          </div>
        </div>
        <div className="flex flex-auto h-full">
          <BaysWorksTable />
          <DashboardSideSwitcher />
        </div>
      </div>
    </BaysWorksProvider>
  );
};

export default ShopDashboardPageTV;
