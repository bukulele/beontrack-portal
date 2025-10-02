import { ROUTES_CHOICES } from "@/app/assets/tableData";
import { Button, Tooltip } from "@mui/material";

function RoutesFiltersComponent({
  setQuickFilter,
  filterModelValues,
  buttonStyle,
}) {
  return (
    <div className="flex flex-col gap-0.5 text-slate-700 pl-4">
      <div className="flex flex-wrap gap-2 items-center">
        {Object.entries(ROUTES_CHOICES).map(([key, route], index) => {
          return (
            <Tooltip title={route} key={`${route}_${index}`}>
              <Button
                onClick={() => setQuickFilter(key)}
                sx={{
                  ...buttonStyle,
                  minWidth: 0,
                  backgroundColor:
                    filterModelValues === key ? "#b92531" : "rgb(214 211 209)",
                  color: filterModelValues === key ? "white" : "black",
                }}
              >
                {route}
              </Button>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}

export default RoutesFiltersComponent;
