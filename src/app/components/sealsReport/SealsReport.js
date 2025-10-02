import { useMemo, useContext, useState } from "react";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { Box } from "@mui/material";
import CustomToolbar from "./CustomToolbar";
import InfoCardModalContainer from "../modalContainer/InfoCardModalContainer";
import { TrucksDriversContext } from "@/app/context/TrucksDriversContext";
import { useInfoCard } from "@/app/context/InfoCardContext";
import SealsUploader from "./SealsUploader";
import ModalContainer from "../modalContainer/ModalContainer";

function SealsReport({ data = [], columns, handleRefresh }) {
  const { hiredDriversList } = useContext(TrucksDriversContext);
  const { handleCardDataSet, setInfoCardModalIsOpen } = useInfoCard();
  const [uploadSealsModal, setUploadSealsModal] = useState(false);

  const rows = useMemo(() => {
    const base = Array.isArray(data) ? data : [];

    // Ensure each row has a stable id (you already have id, but keep a fallback)
    const baseWithId = base.map((r, idx) => ({
      id: r.id ?? `${r.seal_number ?? "sn"}-${r.date_time ?? idx}`,
      ...r,
    }));

    // If hiredDriversList not loaded yet, just show base data
    if (
      !hiredDriversList ||
      typeof hiredDriversList !== "object" ||
      !Object.keys(hiredDriversList).length
    ) {
      return baseWithId;
    }

    // Join when we have the list
    return baseWithId.map((r) => {
      const d = hiredDriversList?.[r.driver];
      return {
        ...r,
        driver_id: d?.driver_id ?? r.driver_id ?? "",
        first_name: d?.first_name ?? r.first_name ?? "",
        last_name: d?.last_name ?? r.last_name ?? "",
      };
    });
  }, [data, hiredDriversList]);

  const handleCellClick = (params) => {
    const { row, colDef } = params;
    const modalType = colDef.modalType;
    const accessKey = colDef.accessKey;

    if (modalType) {
      handleCardDataSet(row[accessKey], modalType);
      setInfoCardModalIsOpen(true);
    }
  };

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
      }}
    >
      <DataGridPro
        disableRowSelectionOnClick
        rowHeight={30}
        rows={rows ?? []}
        columns={columns}
        onCellClick={handleCellClick}
        headerFilters
        sortingOrder={["asc", "desc"]} // Sorting options
        slots={{
          toolbar: CustomToolbar, // Enable the built-in toolbar
        }}
        slotProps={{
          toolbar: {
            onRefresh: handleRefresh,
            uploadSeals: () => setUploadSealsModal(true),
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
      <ModalContainer modalIsOpen={uploadSealsModal}>
        <SealsUploader
          closeModal={() => setUploadSealsModal(false)}
          loadData={handleRefresh}
        />
      </ModalContainer>
      <InfoCardModalContainer />
    </Box>
  );
}

export default SealsReport;
