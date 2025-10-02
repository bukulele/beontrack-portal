"use client";

import React from "react";
import {
  GridToolbarQuickFilter,
  GridToolbarFilterButton,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { IconButton, Box, Tooltip, Button } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DownloadIcon from "@mui/icons-material/Download";

const CustomToolbar = ({ onRefresh, uploadSeals }) => {
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
      <GridToolbarExport
        slotProps={{
          button: {
            sx: customStyle,
            // startIcon: null,
          },
        }}
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
        {/* Download seals.csv button */}
        <Tooltip title="Download Example Seals File">
          <Button
            sx={{ ...customStyle }}
            component="a"
            href="/seals.csv"
            download
          >
            <DownloadIcon />
            Download Example Seals.csv
          </Button>
        </Tooltip>
        <Tooltip title="Upload Seals File">
          <IconButton onClick={uploadSeals} sx={{ ...customStyle }}>
            <UploadFileIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Refresh table data">
          <IconButton onClick={onRefresh} sx={{ ...customStyle }}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        <GridToolbarQuickFilter />
      </Box>
    </GridToolbarContainer>
  );
};

export default CustomToolbar;
