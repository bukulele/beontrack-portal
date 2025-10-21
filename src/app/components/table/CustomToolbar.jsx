"use client";

import React from "react";
import {
  GridToolbarQuickFilter,
  GridToolbarFilterButton,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarExport,
} from "@mui/x-data-grid-pro";
import { IconButton, Box, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";

/**
 * Custom Toolbar for DataGridPro
 *
 * Features:
 * - Standard MUI DataGrid toolbar buttons (Filter, Columns, Export)
 * - Quick search
 * - Refresh button
 * - Optional Add button (entity-specific)
 *
 * Props:
 * @param {Function} onRefresh - Refresh table data
 * @param {Function} onAdd - Create new entity (optional)
 */
const CustomToolbar = ({ onRefresh, onAdd }) => {
  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
      <GridToolbarColumnsButton />
      <GridToolbarExport />

      <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 1 }}>
        {onAdd && (
          <Tooltip title="Create New">
            <IconButton onClick={onAdd}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="Refresh table data">
          <IconButton onClick={onRefresh}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        <GridToolbarQuickFilter />
      </Box>
    </GridToolbarContainer>
  );
};

export default CustomToolbar;
