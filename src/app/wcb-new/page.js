"use client";

import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WCBProvider } from "@/app/context/WCBContext";
import { InfoCardProvider } from "@/app/context/InfoCardContext";
import { CreateObjectProvider } from "@/app/context/CreateObjectContext";
import { SettingsProvider } from "@/app/context/SettingsContext";
import { HiredEmployeesProvider } from "@/app/context/HiredEmployeesContext";
import { TrucksDriversProvider } from "@/app/context/TrucksDriversContext";
import UniversalCard from "@/app/components/universal-card/UniversalCard";
import { WCB_TABLE } from "@/data/tables/wcb";
import { WCB_CARD_CONFIG } from "@/config/cards/wcbCard.config";

/**
 * WCB Claims List Page - New version with UniversalCard
 *
 * Phase 5B: Testing WCBCard configuration
 */
function WCBNewPage() {
  const [wcbClaims, setWCBClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWCBId, setSelectedWCBId] = useState(null);
  const [cardOpen, setCardOpen] = useState(false);

  // Fetch WCB claims data
  useEffect(() => {
    fetchWCBClaims();
  }, []);

  const fetchWCBClaims = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/get-wcb");
      const data = await response.json();
      setWCBClaims(data);
    } catch (error) {
      console.error("Failed to fetch WCB claims:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle row click
  const handleRowClick = (params) => {
    setSelectedWCBId(params.row.id);
    setCardOpen(true);
  };

  // Close card modal
  const handleCloseCard = () => {
    setCardOpen(false);
    setSelectedWCBId(null);
    // Reload WCB list when card closes (in case data changed)
    fetchWCBClaims();
  };

  // Transform columns for MUI DataGrid
  const columns = WCB_TABLE.map((col) => ({
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
              WCB Claims - New Universal Card System
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Testing Phase 5B: WCBCard configuration with 1 tab (General Info only)
            </p>
          </CardHeader>
        </Card>

        {/* DataGrid */}
        <Card>
          <CardContent className="p-0">
            <div style={{ height: 600, width: "100%" }}>
              <DataGrid
                rows={wcbClaims}
                columns={columns}
                loading={loading}
                onRowClick={handleRowClick}
                pageSizeOptions={[10, 25, 50, 100]}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 100 },
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
      {selectedWCBId && (
        <Dialog open={cardOpen} onOpenChange={handleCloseCard}>
          <DialogContent className="max-w-[1100px] p-0 gap-0 border-0 shadow-none bg-transparent [&>button]:hidden">
            <VisuallyHidden.Root>
              <DialogTitle>WCB Claim Details</DialogTitle>
            </VisuallyHidden.Root>
            <SettingsProvider>
              <InfoCardProvider>
                <CreateObjectProvider>
                  <HiredEmployeesProvider>
                    <TrucksDriversProvider>
                      <WCBProvider wcbId={selectedWCBId}>
                        <UniversalCard config={WCB_CARD_CONFIG} />
                      </WCBProvider>
                    </TrucksDriversProvider>
                  </HiredEmployeesProvider>
                </CreateObjectProvider>
              </InfoCardProvider>
            </SettingsProvider>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default WCBNewPage;
