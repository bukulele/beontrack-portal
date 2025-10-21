"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { Box } from "@mui/material";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/components/sidebar/AppSidebar";
import UniversalCard from "@/app/components/universal-card/UniversalCard";
import { getEntityConfig, isValidEntityType } from "@/config/entities";
import CustomToolbar from "@/app/components/table/CustomToolbar";

// Context providers
import { SettingsProvider } from "@/app/context/SettingsContext";
import { InfoCardProvider } from "@/app/context/InfoCardContext";
import { CreateObjectProvider } from "@/app/context/CreateObjectContext";
import { DriverProvider } from "@/app/context/DriverContext";
import { TruckProvider } from "@/app/context/TruckContext";
import { EmployeeProvider } from "@/app/context/EmployeeContext";
import { EquipmentProvider } from "@/app/context/EquipmentContext";
import { IncidentProvider } from "@/app/context/IncidentContext";
import { ViolationProvider } from "@/app/context/ViolationContext";
import { WCBProvider } from "@/app/context/WCBContext";
import { TrucksDriversProvider } from "@/app/context/TrucksDriversContext";
import { IncidentsListProvider } from "@/app/context/IncidentsListContext";
import { ViolationsListProvider } from "@/app/context/ViolationsListContext";

/**
 * Unified Table Page
 *
 * Modern configuration-driven table page that handles ALL entity types via URL parameter.
 * Replaces 7+ separate entity pages with a single unified implementation.
 *
 * Usage:
 * - /table?entity=drivers
 * - /table?entity=trucks
 * - /table?entity=employees
 * - /table?entity=equipment
 * - /table?entity=incidents
 * - /table?entity=violations
 * - /table?entity=wcb
 *
 * Features:
 * - Configuration-driven (no hard-coded entity logic)
 * - Seamless entity switching (no page reload)
 * - UniversalCard integration
 * - MUI DataGrid for tables
 * - shadcn/ui Dialog for cards
 */

// Context provider wrapper component
function EntityContextWrapper({ entityType, entityId, children }) {
  // Determine which context provider(s) to use based on entity type
  const ContextProvider = {
    drivers: DriverProvider,
    trucks: TruckProvider,
    employees: EmployeeProvider,
    equipment: EquipmentProvider,
    incidents: IncidentProvider,
    violations: ViolationProvider,
    wcb: WCBProvider,
  }[entityType];

  if (!ContextProvider) {
    return <>{children}</>;
  }

  // Special case: drivers need additional context providers
  if (entityType === "drivers") {
    return (
      <IncidentsListProvider>
        <ViolationsListProvider>
          <TrucksDriversProvider>
            <DriverProvider userId={entityId}>{children}</DriverProvider>
          </TrucksDriversProvider>
        </ViolationsListProvider>
      </IncidentsListProvider>
    );
  }

  // Standard entity providers use the same prop name pattern
  const idProp = {
    trucks: "truckId",
    employees: "employeeId",
    equipment: "equipmentId",
    incidents: "incidentId",
    violations: "violationId",
    wcb: "wcbId",
  }[entityType];

  return <ContextProvider {...{ [idProp]: entityId }}>{children}</ContextProvider>;
}

function TablePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const entityType = searchParams.get("entity") || "drivers";

  // Validate and get entity configuration
  const isValid = isValidEntityType(entityType);
  const entityConfig = getEntityConfig(entityType);

  // State
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [cardOpen, setCardOpen] = useState(false);

  // Handle redirect on mount if no entity param
  useEffect(() => {
    const currentEntity = searchParams.get("entity");

    if (!currentEntity) {
      // No entity param - check localStorage or use default
      const lastVisitedTable = localStorage.getItem("lastVisitedTable") || "drivers";
      router.replace(`/table?entity=${lastVisitedTable}`);
    } else {
      // Save current entity to localStorage
      localStorage.setItem("lastVisitedTable", currentEntity);
    }
  }, [searchParams, router]);

  // Fetch data when entity type changes
  useEffect(() => {
    fetchData();
  }, [entityType]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(entityConfig.apiEndpoint);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error(`Failed to fetch ${entityType}:`, error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (params) => {
    setSelectedId(params.row[entityConfig.idField]);
    setCardOpen(true);
  };

  const handleCloseCard = () => {
    setCardOpen(false);
    setSelectedId(null);
    // Removed auto-refresh - user can manually refresh via toolbar
  };

  // Map table columns to DataGrid format
  const columns = entityConfig.columns.map((col) => ({
    field: col.field,
    headerName: col.headerName,
    width: col.width || 150,
    valueGetter: col.valueGetter || undefined,
    flex: col.flex || undefined,
  }));

  // Show error if invalid entity type
  if (!isValid) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Invalid Entity Type</CardTitle>
          </CardHeader>
          <CardContent>
            <p>The entity type &quot;{entityType}&quot; is not valid.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Valid types: drivers, trucks, employees, equipment, incidents, violations, wcb
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      {/* Sidebar Trigger (Keyboard shortcut: Cmd+B / Ctrl+B) */}
      <div className="fixed top-4 left-4 z-50">
        <SidebarTrigger />
      </div>

      <SidebarInset>
        {/* Full-height flex container */}
        <Box sx={{ height: "100vh", width: "100%", display: "flex", flexDirection: "column", p: 1 }}>
          {/* Data Table with double-box pattern for 100% height */}
          <Box sx={{ flex: 1, position: "relative" }}>
            <Box sx={{ position: "absolute", inset: 0 }}>
              <DataGridPro
                rows={data}
                columns={columns}
                loading={loading}
                onRowClick={handleRowClick}
                pageSizeOptions={[10, 25, 50, 100]}
                initialState={{
                  pagination: { paginationModel: { pageSize: 100 } },
                }}
                density="compact"
                disableRowSelectionOnClick
                headerFilters
                slots={{
                  toolbar: CustomToolbar,
                }}
                slotProps={{
                  toolbar: {
                    onRefresh: fetchData,
                    onAdd: null, // TODO: Add create functionality per entity type
                  },
                }}
                sx={{
                  border: "none",
                  "& .MuiDataGrid-cell:focus": { outline: "none" },
                  "& .MuiDataGrid-row:hover": {
                    cursor: "pointer",
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
      </SidebarInset>

      {/* Universal Card Dialog */}
      {selectedId && (
        <Dialog open={cardOpen} onOpenChange={handleCloseCard}>
          <DialogContent className="max-w-[1100px] p-0 gap-0 border-0 shadow-none bg-transparent [&>button]:hidden">
            <VisuallyHidden.Root>
              <DialogTitle>{entityConfig.dialogTitle}</DialogTitle>
            </VisuallyHidden.Root>
            <SettingsProvider>
              <InfoCardProvider>
                <CreateObjectProvider>
                  <EntityContextWrapper entityType={entityType} entityId={selectedId}>
                    <UniversalCard config={entityConfig.cardConfig} />
                  </EntityContextWrapper>
                </CreateObjectProvider>
              </InfoCardProvider>
            </SettingsProvider>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

function UnifiedTablePage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <Suspense fallback={<div className="min-h-screen bg-slate-50 p-8">Loading...</div>}>
        <TablePageContent />
      </Suspense>
    </SidebarProvider>
  );
}

export default UnifiedTablePage;
