"use client";

import React, { useState, useEffect, Suspense } from "react";

// Force dynamic rendering for this page (required for useSearchParams in Next.js 16)
export const dynamic = 'force-dynamic';
import { useSearchParams, useRouter } from "next/navigation";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { Box } from "@mui/material";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/components/sidebar/AppSidebar";
import UniversalCard from "@/app/components/universal-card/UniversalCard";
import { EntityCreateDialog } from "@/app/components/entity-create-dialog/EntityCreateDialog";
import { getEntityConfig, isValidEntityType } from "@/config/entities";
import CustomToolbar from "@/app/components/table/CustomToolbar";
import { usePermissions } from "@/lib/permissions/hooks";

// Context providers
import { SettingsProvider } from "@/app/context/SettingsContext";
import { EmployeeProvider } from "@/app/context/EmployeeContext";

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
    employees: EmployeeProvider,
  }[entityType];

  if (!ContextProvider) {
    return <>{children}</>;
  }

  // Standard entity providers use the same prop name pattern
  const idProp = {
    employees: "employeeId",
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

  // Get permissions for this entity
  const permissions = usePermissions(entityType);

  // State
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [cardOpen, setCardOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // CRITICAL: Check if user has permission to access this page
  const hasAccess = permissions.canRead || permissions.isSuperuser;

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
      setData(result.data);
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

  const handleOpenCreateDialog = () => {
    setCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false);
  };

  const handleCreateSuccess = () => {
    // Refresh the table after successful creation
    fetchData();
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

  // Show access denied if user doesn't have permission (after loading completes)
  if (!loading && !hasAccess) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You do not have permission to view {entityType}.
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
                rows={data || []}
                columns={columns}
                loading={loading}
                onRowClick={handleRowClick}
                pageSizeOptions={[10, 25, 50, 100]}
                initialState={{
                  pagination: { paginationModel: { pageSize: 100 } },
                }}
                disableRowSelectionOnClick
                headerFilters
                sortingOrder={["asc", "desc"]}
                rowHeight={30}
                slots={{
                  toolbar: CustomToolbar,
                }}
                slotProps={{
                  toolbar: {
                    onRefresh: fetchData,
                    onAdd: (permissions.canCreate && entityConfig.createFormConfig) ? handleOpenCreateDialog : null,
                    entityType: entityType,
                  },
                  headerFilterCell: {
                    InputComponentProps: {
                      variant: 'outlined',
                      size: 'small',
                      sx: {
                        '& .MuiInputBase-input': {
                          padding: '4px 8px',
                        },
                        '& .MuiInputLabel-root': {
                          transform: 'translate(14px, 5px) scale(1)',
                        },
                        '& .MuiInputLabel-shrink': {
                          transform: 'translate(14px, -9px) scale(0.75)',
                        },
                      },
                    },
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
              <EntityContextWrapper entityType={entityType} entityId={selectedId}>
                <UniversalCard config={entityConfig.cardConfig} />
              </EntityContextWrapper>
            </SettingsProvider>
          </DialogContent>
        </Dialog>
      )}

      {/* Entity Create Dialog */}
      {entityConfig.createFormConfig && (
        <EntityCreateDialog
          open={createDialogOpen}
          onClose={handleCloseCreateDialog}
          entityType={entityType}
          formConfig={entityConfig.createFormConfig}
          onSuccess={handleCreateSuccess}
        />
      )}
    </>
  );
}

export default function UnifiedTablePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 p-8">Loading...</div>}>
      <SidebarProvider>
        <AppSidebar />
        <TablePageContent />
      </SidebarProvider>
    </Suspense>
  );
}
