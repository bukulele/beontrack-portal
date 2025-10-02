"use client";

import React from "react";
import {
  GridToolbarQuickFilter,
  GridToolbarFilterButton,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { IconButton, Box, Tooltip, Button } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { RotatingLines } from "react-loader-spinner";
import RoutesFiltersComponent from "./RoutesFiltersComponent";
import OptionsSelector from "../optionsSelector/OptionsSelector";
import { TERMINAL_CHOICES_DISPATCH } from "@/app/assets/tableData";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import WbSunnyIcon from "@mui/icons-material/WbSunny";

const CustomToolbar = ({
  onRefresh,
  availabilitySheetDataIsLoading,
  preFilteredValues,
  handlePreFilter,
  terminalSelected,
  selectTerminal,
  filterModel,
  handleLCVFilter,
  handleDriverShiftToggle,
}) => {
  const customStyle = {
    m: 0, // Equivalent to Tailwind m-0
    p: 0.5, // Equivalent to Tailwind p-1
    fontSize: "0.875rem", // Equivalent to Tailwind text-xs
    backgroundColor: "rgb(214 211 209)", // Equivalent to Tailwind bg-stone-200
    borderRadius: "4px", // Equivalent to Tailwind rounded
    fontWeight: "normal", // Equivalent to Tailwind font-normal
    cursor: "pointer", // Equivalent to Tailwind cursor-pointer
    transition: "none",
    color: "black",
    "&:hover": {
      backgroundColor: "#b92531", // Equivalent to Tailwind hover:bg-[#b92531]
      color: "white", // Equivalent to Tailwind hover:text-white
    },
    "&:active": {
      backgroundColor: "rgb(234, 88, 12)", // Equivalent to Tailwind active:bg-orange-600
    },
  };

  return (
    <GridToolbarContainer sx={{ placeItems: "end" }}>
      <GridToolbarFilterButton
        slotProps={{
          button: {
            sx: {
              ...customStyle,
              "& .MuiBadge-badge": { backgroundColor: "#b92531" },
            },
          },
        }}
      />
      <GridToolbarColumnsButton
        slotProps={{
          button: {
            sx: customStyle,
          },
        }}
      />
      <GridToolbarExport
        slotProps={{
          button: {
            sx: customStyle,
          },
        }}
      />
      <RoutesFiltersComponent
        setQuickFilter={handlePreFilter}
        filterModelValues={preFilteredValues}
        buttonStyle={customStyle}
      />
      <Tooltip title="Show/hide LCV drivers">
        <Button
          onClick={handleLCVFilter}
          sx={{
            ...customStyle,
            minWidth: 0,
            backgroundColor: filterModel.some(
              (item) => item.field === "lcv_certified" && item.value
            )
              ? "#b92531"
              : "rgb(214 211 209)",
            color: filterModel.some(
              (item) => item.field === "lcv_certified" && item.value
            )
              ? "white"
              : "black",
            ml: 3,
          }}
        >
          LCV
        </Button>
      </Tooltip>
      <Tooltip title="Day shift drivers">
        <Button
          onClick={() => handleDriverShiftToggle("day")}
          sx={{
            ...customStyle,
            minWidth: 0,
            backgroundColor: filterModel.some(
              (f) => f.field === "night_driver" && f.value === false
            )
              ? "#b92531"
              : "rgb(214 211 209)",
            color: filterModel.some(
              (f) => f.field === "night_driver" && f.value === false
            )
              ? "white"
              : "black",
          }}
        >
          <WbSunnyIcon />
        </Button>
      </Tooltip>

      <Tooltip title="Night shift drivers">
        <Button
          onClick={() => handleDriverShiftToggle("night")}
          sx={{
            ...customStyle,
            minWidth: 0,
            backgroundColor: filterModel.some(
              (f) => f.field === "night_driver" && f.value === true
            )
              ? "#b92531"
              : "rgb(214 211 209)",
            color: filterModel.some(
              (f) => f.field === "night_driver" && f.value === true
            )
              ? "white"
              : "black",
          }}
        >
          <BedtimeIcon />
        </Button>
      </Tooltip>
      <Box
        sx={{
          m: 0,
          p: 0,
          ml: "auto",
          display: "flex",
          alignItems: "end",
          gap: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <p className="font-semibold">Terminal:</p>
          <OptionsSelector
            value={terminalSelected}
            updateState={selectTerminal}
            name={"terminal"}
            data={TERMINAL_CHOICES_DISPATCH}
            style={"small"}
            setDefault={true}
          />
        </Box>
        <Tooltip title="Load data">
          <IconButton
            onClick={onRefresh}
            sx={{
              ...customStyle,
              background: availabilitySheetDataIsLoading ? "transparent" : "",
            }}
            disabled={availabilitySheetDataIsLoading}
          >
            {availabilitySheetDataIsLoading ? (
              <RotatingLines
                visible={true}
                height="24"
                width="24"
                strokeColor="orange"
                strokeWidth="5"
                animationDuration="0.75"
                ariaLabel="rotating-lines-loading"
              />
            ) : (
              <RefreshIcon />
            )}
          </IconButton>
        </Tooltip>
        <GridToolbarQuickFilter />
      </Box>
    </GridToolbarContainer>
  );
};

export default CustomToolbar;
