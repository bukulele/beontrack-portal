"use client";

import { useEffect, useState, useRef } from "react";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { Box } from "@mui/material";
import CustomToolbar from "./CustomToolbar";
import { useInfoCard } from "@/app/context/InfoCardContext";
import InfoCardModalContainer from "../modalContainer/InfoCardModalContainer";
import CreateObjectModalContainer from "../modalContainer/CreateObjectModalContainer";
import copy from "copy-to-clipboard";
import { useCreateObject } from "@/app/context/CreateObjectContext";
import useUserRoles from "@/app/functions/useUserRoles";
import ModalContainer from "../modalContainer/ModalContainer";
import FuelReportComponent from "../fuelReportComponent/FuelReportComponent";
import { TABLES_PRE_FILTERS } from "@/app/assets/tableData";
import PayrollReportComponent from "../payrollReportComponent/PayrollReportComponent";
import getGlobalSortComparator from "@/app/functions/getGlobalSortComparator";

export default function TableView({
  data = [],
  columns,
  handleRefresh,
  tableType,
  menuPointChosen,
  goToTable,
  goToTableLinks,
  reportIsLoading,
}) {
  const [showCopyDataWindow, setShowCopyDataWindow] = useState(false);
  const [uploadFuelReportModal, setUploadFuelReportModal] = useState(false);
  const [showPayrollReport, setShowPayrollReport] = useState(false);
  const [filterModel, setFilterModel] = useState(
    TABLES_PRE_FILTERS[menuPointChosen] || TABLES_PRE_FILTERS.default_filters
  );

  const timeoutRef = useRef(null);

  const modifiedColumns = columns.map((col) => {
    let renderCell;
    const isBoolean = col?.type === "boolean";

    if (col.renderCell) {
      renderCell = col.renderCell;
    } else if (!isBoolean) {
      renderCell = (params) => {
        const isCopyable = col.copyable;
        const isInteractive = col.modalType || isCopyable;
        let displayValue = params.value;

        return (
          <span
            style={{
              cursor: isCopyable ? "copy" : "default",
              textDecoration: isInteractive ? "underline dotted" : "none",
              // color: isBoolean && !params.value ? "red" : "",
            }}
          >
            {displayValue}
          </span>
        );
      };
    }

    return {
      ...col,
      // getSortComparator: getGlobalSortComparator,
      sortComparator: col.sortComparator ?? getGlobalSortComparator,
      ...(renderCell && { renderCell }),
    };
  });

  const { handleCardDataSet, setInfoCardModalIsOpen } = useInfoCard();

  const userRoles = useUserRoles();

  const showAddButton = () => {
    return (
      (tableType === "driver" &&
        menuPointChosen === "recruiting" &&
        (userRoles.includes(process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_SAFETY) ||
          userRoles.includes(
            process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_ADMIN
          ))) ||
      tableType === "truck" ||
      tableType === "equipment" ||
      tableType === "incident" ||
      tableType === "violation" ||
      tableType === "employee" ||
      tableType === "wcb"
    );
  };

  const showPayrollReportButton = () => {
    return (
      tableType === "employee" &&
      menuPointChosen === "office_employees" &&
      userRoles.includes(
        process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PAYROLL_MANAGER
      )
    );
  };

  const showFuelReportButtons = () => {
    return tableType === "fuel-report";
  };

  const {
    setCreateObjectModalIsOpen,
    setObjectType,
    setAfterCreateCallback,
    handleCreateObjectModalClose,
  } = useCreateObject();

  const handleCopyCellData = (data) => {
    clearTimeout(timeoutRef.current);
    setShowCopyDataWindow(true);
    copy(data);
    timeoutRef.current = setTimeout(() => {
      setShowCopyDataWindow(false);
    }, 3000);
  };

  const handleCellClick = (params) => {
    const { row, colDef } = params;
    const modalType = colDef.modalType; // Type of the entity (e.g., "driver")
    const accessKey = colDef.accessKey;
    const isCopyable = colDef.copyable;

    if (isCopyable) {
      handleCopyCellData(params.value);
      return;
    }

    if (modalType) {
      handleCardDataSet(row[accessKey], modalType);
      setInfoCardModalIsOpen(true);
    }
  };

  const afterObjectCreateCallback = () => {
    handleCreateObjectModalClose();
    handleRefresh();
  };

  const handleOpenCreateModal = () => {
    setAfterCreateCallback(() => afterObjectCreateCallback);
    setObjectType(tableType);
    setCreateObjectModalIsOpen(true);
  };

  const handlePreFilter = (status) => {
    // If clicking the same filter again, clear it
    if (
      filterModel.items.length &&
      filterModel.items.some(
        (item) => item.value === status && item.operator === "equals"
      )
    ) {
      setFilterModel(
        TABLES_PRE_FILTERS[menuPointChosen] ||
          TABLES_PRE_FILTERS.default_filters
      );
    } else {
      setFilterModel({
        items: [
          {
            id: 1,
            field: "status",
            operator: "equals",
            value: status,
          },
        ],
      });
    }
  };

  const handleOpenPayrollReport = () => {
    setShowPayrollReport(true);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return showPayrollReport ? (
    <>
      <PayrollReportComponent onClose={() => setShowPayrollReport(false)} />
      <CreateObjectModalContainer />
    </>
  ) : (
    <Box
      sx={{
        height: "100%",
        width: "100%",
      }}
    >
      {/* <QuickFilterButtons
        filterModel={filterModel}
        setFilterModel={setFilterModel}
      /> */}
      <DataGridPro
        disableRowSelectionOnClick
        rowHeight={30}
        rows={data}
        columns={modifiedColumns}
        onCellClick={handleCellClick}
        headerFilters
        sortingOrder={["asc", "desc"]} // Sorting options
        filterModel={filterModel}
        onFilterModelChange={(newModel) => {
          setFilterModel(newModel);
        }}
        initialState={{
          sorting: {
            sortModel: [
              {
                field:
                  columns.find((col) => col.defaultSort)?.field ||
                  columns[0].field,
                sort: columns.find((col) => col.defaultSort)?.sort || "asc",
              },
            ],
          },
          // pagination: { paginationModel: { pageSize: 30, page: 0 } },
          columns: {
            columnVisibilityModel: columns.reduce((acc, col) => {
              acc[col.field] = !col.hide;
              return acc;
            }, {}),
          },
        }}
        slots={{
          toolbar: CustomToolbar, // Enable the built-in toolbar
        }}
        slotProps={{
          toolbar: {
            menuPointChosen,
            tableType,
            preFilteredValues: filterModel.items,
            handlePreFilter,
            reportIsLoading,
            uploadFuelReport: showFuelReportButtons()
              ? () => setUploadFuelReportModal(true)
              : null,
            onAdd: showAddButton() ? handleOpenCreateModal : null,
            onPayrollReport: showPayrollReportButton()
              ? handleOpenPayrollReport
              : null,
            onRefresh: handleRefresh,
            showQuickFilter: true, // Enable the quick filter input
            goToTable,
            goToTableLinks,
            csvOptions: {
              fileName: "table_data", // Set the name for the exported CSV file
              utf8WithBom: true, // Include UTF-8 BOM for better CSV compatibility
            },
          },
        }}
        sx={{
          "& .MuiDataGrid-scrollbar": {
            zIndex: "auto !important",
          },
          border: "none",
          ".MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold !important",
          },
          "& .MuiDataGrid-cell": {
            borderRight: "1px dotted #a0a8ae", // Adjust color and thickness as needed
          },
          "& .MuiDataGrid-cell:last-of-type": {
            borderRight: "none", // Removes border on the last column
          },
        }}
      />
      <ModalContainer modalIsOpen={uploadFuelReportModal}>
        <FuelReportComponent
          loadData={handleRefresh}
          closeModal={() => setUploadFuelReportModal(false)}
        />
      </ModalContainer>
      <InfoCardModalContainer />
      <CreateObjectModalContainer />
      {showCopyDataWindow && (
        <div
          style={{
            position: "absolute",
            top: "5px",
            right: "5px",
            backgroundColor: "#f0f0f0",
            padding: "10px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
            borderRadius: "4px",
          }}
        >
          Data copied to clipboard
        </div>
      )}
    </Box>
  );
}
