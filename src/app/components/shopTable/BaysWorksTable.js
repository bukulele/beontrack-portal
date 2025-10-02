import { BAYS_WORKS_COLUMNS } from "@/app/assets/shopTableData";
import React, { useContext } from "react";
import { BaysWorksContext } from "@/app/context/BaysWorksContext";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

function BaysWorksGrid() {
  const { shopData, mechanicsData } = useContext(BaysWorksContext);

  if (!shopData || !mechanicsData) return;

  const statusOrder = {
    IN_PROGRESS: 1,
    PENDING: 2,
    COMPLETED: 3,
  };

  const sortedShopData = shopData.sort((a, b) => {
    const statusA = statusOrder[a.status] || 999;
    const statusB = statusOrder[b.status] || 999;
    if (statusA < statusB) return -1;
    if (statusA > statusB) return 1;
    const timeA = new Date(a.time_in).getTime();
    const timeB = new Date(b.time_in).getTime();
    return timeB - timeA;
  });

  const formatCellValue = (value, column) => {
    if (!value) return;

    switch (column.type) {
      case "time-date":
        return moment(value).format("HH:mm, DD MMM");
      case "status":
        return (
          <FontAwesomeIcon icon={faCircle} className={column.scheme[value]} />
        );
      case "enum":
        return `${mechanicsData[value].first_name} ${mechanicsData[value].last_name}`;
      case "text":
        return <p className="overflow-hidden text-ellipsis">{value}</p>;
      default:
        return value;
    }
  };

  return (
    <div className="flex-auto w-full overflow-y-auto">
      <div className="grid grid-cols-[auto_min-content_minmax(auto,_300px)_min-content_100px_auto_auto_auto_auto] min-[3840px]:grid-cols-[auto_min-content_minmax(auto,_500px)_min-content_100px_auto_auto_auto_auto]">
        {/* Header Row */}
        {BAYS_WORKS_COLUMNS.map((column) => (
          <div
            key={column.accessor}
            className="px-1 py-3 min-[3840px]:py-6 min-[3840px]:text-4xl text-sm bg-gray-50 dark:bg-gray-700 text-center font-bold text-black dark:text-white uppercase tracking-wider"
          >
            {column.header}
          </div>
        ))}

        {/* Data Rows */}
        {sortedShopData.map((row, rowIndex) =>
          BAYS_WORKS_COLUMNS.map((column) => {
            const isEtaExpired =
              row.status === "IN_PROGRESS" &&
              Date.now() > Date.parse(row.eta) &&
              column.accessor === "eta";

            return (
              <div
                key={`${rowIndex}-${column.accessor}`}
                className={`px-1 min-[3840px]:py-4 min-[3840px]:text-4xl text-sm py-2 text-center whitespace-nowrap ${
                  isEtaExpired
                    ? "text-red-500 font-bold"
                    : "text-black dark:text-white"
                } ${
                  rowIndex % 2 === 0
                    ? "bg-white dark:bg-gray-900"
                    : "bg-gray-100 dark:bg-gray-800"
                }`}
              >
                {formatCellValue(row[column.accessor], column)}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default BaysWorksGrid;
