import React, { useState, useContext, useEffect } from "react";
import { BaysWorksContext } from "../../context/BaysWorksContext";

function DashboardBays() {
  const BAYS = [10, 11, 12, 13, 1, 2, 3, 4];
  const BAYS_PAIRS = [
    [10, 1],
    [11, 2],
    [12, 3],
    [13, 4],
  ];

  const [columns, setColumns] = useState([]);
  const { shopData, mechanicsData } = useContext(BaysWorksContext);

  const renderBlocks = () => {
    let blocks = {};

    for (let i of BAYS) {
      blocks[i] = {
        bay: i,
        isRed: false,
      };
    }

    for (let i of BAYS) {
      const bayData = shopData.find((data) => {
        return data.bay == i;
      });

      if (!bayData) continue;

      blocks[i].isRed = bayData.status === "IN_PROGRESS";
      blocks[i].unit = bayData.unit;
      blocks[i].mechanic = bayData.mechanic;

      if (bayData && bayData.trailer) {
        const pairedBays = BAYS_PAIRS.find(
          (arr) => arr[0] == bayData.bay || arr[1] == bayData.bay
        );
        let i;

        if (pairedBays[0] == bayData.bay) {
          i = pairedBays[1];
        } else {
          i = pairedBays[0];
        }
        blocks[i].isRed = true;
        blocks[i].unit = bayData.unit;
        blocks[i].mechanic = bayData.mechanic;
      }
    }
    return Object.values(blocks).map((block) => (
      <div
        key={`bay_${block.bay}`}
        className={`flex flex-col w-full h-36 min-[3840px]:h-52 min-[3840px]:text-4xl border rounded p-2 border-slate-700
          ${
            block.isRed
              ? "bg-red-300 dark:bg-red-700"
              : "bg-white dark:bg-gray-800"
          } 
          text-black dark:text-white`}
      >
        <p className="font-semibold">Bay {block.bay}</p>
        <p>{block?.unit}</p>
        {block && block.mechanic && mechanicsData[block.mechanic] && (
          <p>{`${mechanicsData[block.mechanic].first_name} ${
            mechanicsData[block.mechanic].last_name
          }`}</p>
        )}
      </div>
    ));
  };

  useEffect(() => {
    if (!shopData || !mechanicsData) return;

    const blocks = renderBlocks();

    setColumns([blocks.slice(4, 8), blocks.slice(0, 4)]);
  }, [shopData, mechanicsData]);

  return (
    <div className={`flex gap-2 min-[3840px]:w-[50rem] w-96`}>
      <div className="flex w-1/2 gap-2 flex-col">{columns[0]}</div>
      <div className="flex w-1/2 gap-2 flex-col">{columns[1]}</div>
    </div>
  );
}

export default DashboardBays;
