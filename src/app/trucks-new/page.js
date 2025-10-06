"use client";

import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TruckProvider } from "@/app/context/TruckContext";
import { InfoCardProvider } from "@/app/context/InfoCardContext";
import { CreateObjectProvider } from "@/app/context/CreateObjectContext";
import { SettingsProvider } from "@/app/context/SettingsContext";
import UniversalCard from "@/app/components/universal-card/UniversalCard";
import { TRUCKS_TABLE_FIELDS } from "@/data/tables/trucks";
import { TRUCK_CARD_CONFIG } from "@/config/cards/truckCard.config";

/**
 * Trucks List Page - New version with UniversalCard
 *
 * Modern trucks list using MUI DataGrid with UniversalCard for details.
 * This is a test page for Phase 3 (ChecklistTab) integration.
 */
function TrucksNewPage() {
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTruckId, setSelectedTruckId] = useState(null);
  const [cardOpen, setCardOpen] = useState(false);

  // Fetch trucks data
  useEffect(() => {
    fetchTrucks();
  }, []);

  const fetchTrucks = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/get-trucks");
      const data = await response.json();
      setTrucks(data);
    } catch (error) {
      console.error("Failed to fetch trucks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle row click
  const handleRowClick = (params) => {
    setSelectedTruckId(params.row.id);
    setCardOpen(true);
  };

  // Close card modal
  const handleCloseCard = () => {
    setCardOpen(false);
    setSelectedTruckId(null);
    // Reload trucks list when card closes (in case data changed)
    fetchTrucks();
  };

  // Transform columns for MUI DataGrid
  const columns = TRUCKS_TABLE_FIELDS.map((col) => ({
    field: col.field,
    headerName: col.headerName,
    width: col.width || 150,
    valueGetter: col.valueGetter || undefined,
  }));

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">
              Trucks - New Universal Card System
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Testing Phase 3: ChecklistTab with file upload, checkmark, and view files
            </p>
          </CardHeader>
        </Card>

        {/* DataGrid */}
        <Card>
          <CardContent className="p-0">
            <div style={{ height: 600, width: "100%" }}>
              <DataGrid
                rows={trucks}
                columns={columns}
                loading={loading}
                onRowClick={handleRowClick}
                pageSizeOptions={[10, 25, 50, 100]}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 25 },
                  },
                }}
                density="compact"
                disableRowSelectionOnClick
                sx={{
                  border: 0,
                  "& .MuiDataGrid-cell:focus": {
                    outline: "none",
                  },
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

      {/* Universal Card Modal */}
      {selectedTruckId && (
        <Dialog open={cardOpen} onOpenChange={handleCloseCard}>
          <DialogContent className="max-w-[1100px] p-0 gap-0 border-0 shadow-none bg-transparent [&>button]:hidden">
            <VisuallyHidden.Root>
              <DialogTitle>Truck Details</DialogTitle>
            </VisuallyHidden.Root>
            <SettingsProvider>
              <InfoCardProvider>
                <CreateObjectProvider>
                  <TruckProvider truckId={selectedTruckId}>
                    <UniversalCard config={TRUCK_CARD_CONFIG} />
                  </TruckProvider>
                </CreateObjectProvider>
              </InfoCardProvider>
            </SettingsProvider>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default TrucksNewPage;
