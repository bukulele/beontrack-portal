"use client";

import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DriverProvider } from "@/app/context/DriverContext";
import { InfoCardProvider } from "@/app/context/InfoCardContext";
import { CreateObjectProvider } from "@/app/context/CreateObjectContext";
import { SettingsProvider } from "@/app/context/SettingsContext";
import { TrucksDriversProvider } from "@/app/context/TrucksDriversContext";
import { IncidentsListProvider } from "@/app/context/IncidentsListContext";
import { ViolationsListProvider } from "@/app/context/ViolationsListContext";
import UniversalCard from "@/app/components/universal-card/UniversalCard";
import { DRIVERS_TABLE_FIELDS_SAFETY } from "@/data/tables/drivers";
import { DRIVER_CARD_CONFIG } from "@/config/cards/driverCard.config";

function DriversNewPage() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const [cardOpen, setCardOpen] = useState(false);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/get-drivers-safety");
      const data = await response.json();
      setDrivers(data);
    } catch (error) {
      console.error("Failed to fetch drivers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (params) => {
    setSelectedDriverId(params.row.id);
    setCardOpen(true);
  };

  const handleCloseCard = () => {
    setCardOpen(false);
    setSelectedDriverId(null);
    fetchDrivers();
  };

  const columns = DRIVERS_TABLE_FIELDS_SAFETY.map((col) => ({
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
            <CardTitle className="text-2xl">
              Drivers - New Universal Card System
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Testing Phase 5B: DriverCard with 3 tabs (General + 2 Checklists)
              - MOST COMPLEX
            </p>
          </CardHeader>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div style={{ height: 600, width: "100%" }}>
              <DataGrid
                rows={drivers}
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

      {selectedDriverId && (
        <Dialog open={cardOpen} onOpenChange={handleCloseCard}>
          <DialogContent className="max-w-[1100px] p-0 gap-0 border-0 shadow-none bg-transparent [&>button]:hidden">
            <VisuallyHidden.Root>
              <DialogTitle>Driver Details</DialogTitle>
            </VisuallyHidden.Root>
            <SettingsProvider>
              <InfoCardProvider>
                <CreateObjectProvider>
                  <IncidentsListProvider>
                    <ViolationsListProvider>
                      <TrucksDriversProvider>
                        <DriverProvider userId={selectedDriverId}>
                          <UniversalCard config={DRIVER_CARD_CONFIG} />
                        </DriverProvider>
                      </TrucksDriversProvider>
                    </ViolationsListProvider>
                  </IncidentsListProvider>
                </CreateObjectProvider>
              </InfoCardProvider>
            </SettingsProvider>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default DriversNewPage;
