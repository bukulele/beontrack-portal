"use client";

import React from "react";
import EmployeeCard from "@/app/components/employeeCard/EmployeeCard";
import { InfoCardProvider } from "@/app/context/InfoCardContext";
import { SettingsProvider } from "@/app/context/SettingsContext";
import { CreateObjectProvider } from "@/app/context/CreateObjectContext";
import ThreeDotsLoader from "@/app/components/loader/ThreeDotsLoader";

function EmployeeCardPage({ params }) {
  return (
    <SettingsProvider>
      <InfoCardProvider>
        <CreateObjectProvider>
          <ThreeDotsLoader />
          <div className="flex p-1 w-full h-screen bg-white justify-center">
            <div className="border border-slate-500 rounded">
              <EmployeeCard userId={params.uid} />
            </div>
          </div>
        </CreateObjectProvider>
      </InfoCardProvider>
    </SettingsProvider>
  );
}

export default EmployeeCardPage;
