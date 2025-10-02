import React, { useContext } from "react";
import { BaysWorksContext } from "../../context/BaysWorksContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import formatTime from "@/app/functions/formatTime";

function DashboardTechs() {
  const { mechanicsData } = useContext(BaysWorksContext);

  const renderBlocks = () => {
    const blocks = Object.values(mechanicsData)
      .filter((mechanic) => mechanic.in_office)
      .map((data, i) => {
        return (
          <React.Fragment key={`tech_${i}`}>
            <div
              className={`font-semibold min-[3840px]:text-4xl min-[3840px]:py-2 ${
                i % 2 === 0
                  ? "bg-gray-100 dark:bg-gray-800"
                  : "bg-white dark:bg-gray-900"
              } text-black dark:text-white`}
            >
              {`${data.first_name} ${data.last_name}`}
            </div>
            <div
              className={`pl-2 ${
                i % 2 === 0
                  ? "bg-gray-100 dark:bg-gray-800"
                  : "bg-white dark:bg-gray-900"
              }`}
            >
              <FontAwesomeIcon
                icon={faCircle}
                className={`min-[3840px]:text-4xl min-[3840px]:py-2 ${
                  data.on_lunch ? "text-red-500" : "text-green-500"
                }`}
              />
            </div>
            <div
              className={`pl-2 min-[3840px]:text-4xl min-[3840px]:py-2 ${
                i % 2 === 0
                  ? "bg-gray-100 dark:bg-gray-800"
                  : "bg-white dark:bg-gray-900"
              } text-black dark:text-white`}
            >
              {formatTime(data.total_lunch_time)}
            </div>
          </React.Fragment>
        );
      });
    return blocks;
  };

  if (!mechanicsData) return;

  return (
    <div className="flex flex-col gap-2 min-[3840px]:w-[50rem] w-96">
      <p className="text-black dark:text-white font-bold text-center min-[3840px]:text-5xl text-2xl">
        Tech on Floor
      </p>
      <div className="grid grid-cols-[3fr_50px_1fr] w-full">
        {renderBlocks()}
      </div>
    </div>
  );
}

export default DashboardTechs;
