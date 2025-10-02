import {
  TABLE_STATUS_FILTERS,
  STATUS_CHOICES,
  TRUCK_STATUS_CHOICES,
  EQUIPMENT_STATUS_CHOICES,
  REPORTS_TYPES,
} from "@/app/assets/tableData";
import { Button, Tooltip } from "@mui/material";

function StatusFiltersComponent({
  menuPointChosen,
  tableType,
  setQuickFilter,
  filterModelValues,
  buttonStyle,
}) {
  return (
    TABLE_STATUS_FILTERS[menuPointChosen] && (
      <div className="flex flex-col flex-auto gap-0.5 text-slate-700 pl-4">
        <p className="text-xs font-bold">Status filter:</p>
        <div className="flex flex-wrap gap-2 items-center">
          {TABLE_STATUS_FILTERS[menuPointChosen].map((status, index) => {
            let tooltipContent = "";

            if (tableType === "driver" || tableType === "employee") {
              tooltipContent = STATUS_CHOICES[status];
            } else if (tableType === "truck") {
              tooltipContent = TRUCK_STATUS_CHOICES[status];
            } else if (tableType === "equipment") {
              tooltipContent = EQUIPMENT_STATUS_CHOICES[status];
            } else if (tableType === "driver_reports") {
              tooltipContent = REPORTS_TYPES[status];
            }

            return (
              <Tooltip title={tooltipContent} key={`${status}_${index}`}>
                <Button
                  onClick={() => setQuickFilter(tooltipContent)}
                  sx={{
                    ...buttonStyle,
                    minWidth: 0,
                    lineHeight: 1,
                    backgroundColor: filterModelValues.some(
                      (item) =>
                        item.value === tooltipContent &&
                        item.operator === "equals"
                    )
                      ? "#b92531"
                      : "rgb(214 211 209)",
                    color: filterModelValues.some(
                      (item) =>
                        item.value === tooltipContent &&
                        item.operator === "equals"
                    )
                      ? "white"
                      : "black",
                  }}
                >
                  {status}
                </Button>
              </Tooltip>
            );
          })}
        </div>
      </div>
    )
  );
}

export default StatusFiltersComponent;
