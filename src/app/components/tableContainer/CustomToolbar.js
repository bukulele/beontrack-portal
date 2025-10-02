"use client";

import React from "react";
import {
  GridToolbarQuickFilter,
  GridToolbarFilterButton,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { IconButton, Box, Button, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { RotatingLines } from "react-loader-spinner";
import StatusFiltersComponent from "./StatusFiltersComponent";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const CustomToolbar = ({
  onRefresh,
  onAdd,
  uploadFuelReport,
  goToTable,
  goToTableLinks,
  reportIsLoading,
  preFilteredValues,
  handlePreFilter,
  menuPointChosen,
  tableType,
  onPayrollReport,
}) => {
  const customStyle = {
    m: 0, // Equivalent to Tailwind m-0
    p: 0.5, // Equivalent to Tailwind p-1
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
            // startIcon: null,
          },
        }}
      />
      <GridToolbarColumnsButton
        slotProps={{
          button: {
            sx: customStyle,
            // startIcon: null,
          },
        }}
      />
      <GridToolbarExport
        slotProps={{
          button: {
            sx: customStyle,
            // startIcon: null,
          },
        }}
      />
      <StatusFiltersComponent
        menuPointChosen={menuPointChosen}
        tableType={tableType}
        setQuickFilter={handlePreFilter}
        filterModelValues={preFilteredValues}
        buttonStyle={customStyle}
      />
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
        {uploadFuelReport && (
          <Tooltip title="Upload Fuel Report">
            <IconButton onClick={uploadFuelReport} sx={{ ...customStyle }}>
              <UploadFileIcon />
            </IconButton>
          </Tooltip>
        )}
        {goToTableLinks.map((links) => {
          return (
            <Button
              key={`go_to_report_${links.type}`}
              onClick={() => goToTable(links.type)}
              sx={{ ...customStyle }}
            >
              {links.name}
            </Button>
          );
        })}
        {onPayrollReport && (
          <Tooltip title="Payroll Report">
            <IconButton onClick={onPayrollReport} sx={{ ...customStyle }}>
              <CalendarMonthIcon />
            </IconButton>
          </Tooltip>
        )}
        {onAdd && (
          <Tooltip title="Create New">
            <IconButton onClick={onAdd} sx={{ ...customStyle }}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        )}
        {reportIsLoading ? (
          <RotatingLines
            visible={true}
            height="20"
            width="20"
            strokeColor="orange"
            strokeWidth="5"
            animationDuration="0.75"
            ariaLabel="rotating-lines-loading"
          />
        ) : (
          <Tooltip title="Refresh table data">
            <IconButton onClick={onRefresh} sx={{ ...customStyle }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        )}
        {/* <GridToolbarDensitySelector /> */}
        <GridToolbarQuickFilter />
      </Box>
    </GridToolbarContainer>
  );
};

export default CustomToolbar;
