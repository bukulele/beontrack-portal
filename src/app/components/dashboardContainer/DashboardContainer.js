import { useLoader } from "@/app/context/LoaderContext";
import React, { useEffect, useState } from "react";

function DashboardContainer({ dashboardTemplate, data, tileClick }) {
  const [panels, setPanels] = useState(null);
  const { stopLoading } = useLoader();

  useEffect(() => {
    if (!data) return;

    let panels = Object.entries(dashboardTemplate).map(
      ([key, value], index) => {
        return (
          <div
            key={`${key}_${index}`}
            className={`flex flex-col justify-center items-center gap-3 border bg-white shadow ${
              value.menuClick
                ? "cursor-pointer hover:bg-slate-100 hover:shadow"
                : ""
            }`}
            onClick={value.menuClick ? () => tileClick(value.menuClick) : null}
          >
            <p className="text-3xl font-semibold text-[#3c3c41] text-center">
              {value.name}
            </p>
            {value.multiple ? (
              value.subKeys.map((item, index) => {
                return (
                  <div key={`${item.key}_${index}`} className="flex gap-1">
                    <p className="font-extrabold text-[#3c3c41] text-center">
                      {item.name}:
                    </p>
                    <p className="font-extrabold text-[#b92531] text-center">
                      {data[item.key]}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-5xl font-extrabold text-[#b92531] text-center">
                {data[key]}
              </p>
            )}
          </div>
        );
      }
    );

    setPanels(panels);
  }, [data]);

  useEffect(() => {
    if (!panels) return;

    stopLoading();
  }, [panels]);

  return (
    <div className="w-full h-full self-stretch grid p-3 gap-3 grid-cols-3 grid-rows-4 bg-slate-50">
      {panels}
    </div>
  );
}

export default DashboardContainer;
