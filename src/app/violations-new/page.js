"use client";

import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ViolationProvider } from "@/app/context/ViolationContext";
import { SettingsProvider } from "@/app/context/SettingsContext";
import { TrucksDriversProvider } from "@/app/context/TrucksDriversContext";
import UniversalCard from "@/app/components/universal-card/UniversalCard";
import { VIOLATIONS_TABLE } from "@/data/tables/violations";
import { VIOLATION_CARD_CONFIG } from "@/config/cards/violationCard.config";

function ViolationsNewPage() {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedViolationId, setSelectedViolationId] = useState(null);
  const [cardOpen, setCardOpen] = useState(false);

  useEffect(() => {
    fetchViolations();
  }, []);

  const fetchViolations = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/get-violations");
      const data = await response.json();
      setViolations(data);
    } catch (error) {
      console.error("Failed to fetch violations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (params) => {
    setSelectedViolationId(params.row.id);
    setCardOpen(true);
  };

  const handleCloseCard = () => {
    setCardOpen(false);
    setSelectedViolationId(null);
    fetchViolations();
  };

  const columns = VIOLATIONS_TABLE.map((col) => ({
    field: col.field,
    headerName: col.headerName,
    width: col.width || 150,
    valueGetter: col.valueGetter || undefined,
  }));

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Violations - New Universal Card System</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Testing Phase 5B: ViolationCard with 2 tabs (General + Checklist)
            </p>
          </CardHeader>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div style={{ height: 600, width: "100%" }}>
              <DataGrid
                rows={violations}
                columns={columns}
                loading={loading}
                onRowClick={handleRowClick}
                pageSizeOptions={[10, 25, 50, 100]}
                initialState={{
                  pagination: { paginationModel: { pageSize: 100 } },
                }}
                density="compact"
                disableRowSelectionOnClick
                sx={{
                  border: 0,
                  "& .MuiDataGrid-cell:focus": { outline: "none" },
                  "& .MuiDataGrid-row:hover": {
                    cursor: "pointer",
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedViolationId && (
        <Dialog open={cardOpen} onOpenChange={handleCloseCard}>
          <DialogContent className="max-w-[1100px] p-0 gap-0 border-0 shadow-none bg-transparent [&>button]:hidden">
            <VisuallyHidden.Root>
              <DialogTitle>Violation Details</DialogTitle>
            </VisuallyHidden.Root>
            <SettingsProvider>
              <TrucksDriversProvider>
                <ViolationProvider violationId={selectedViolationId}>
                  <UniversalCard config={VIOLATION_CARD_CONFIG} />
                </ViolationProvider>
              </TrucksDriversProvider>
            </SettingsProvider>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default ViolationsNewPage;
