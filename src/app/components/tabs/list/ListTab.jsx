"use client";

import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import ListRow from "./ListRow";

/**
 * Universal List Tab Component
 *
 * Displays related entities in a simple scrollable list.
 * Uses configuration-driven rendering with rowRenderer functions.
 *
 * Supports 3 data source types:
 * 1. Direct: Array directly in parent entity (trucks, child_drivers)
 * 2. Referenced: IDs lookup from list context (equipment)
 * 3. Multi-referenced: Separate main/co arrays (incidents, violations)
 *
 * @param {Object} config - List tab configuration
 * @param {Object} context - Parent entity context (e.g., DriverContext)
 * @param {Object} additionalContexts - Additional contexts (e.g., IncidentsListContext)
 * @param {Function} onEntityClick - Callback when a list item is clicked (entityId, entityType)
 */
function ListTab({ config, context, additionalContexts = {}, onEntityClick }) {

  // Get parent entity data
  const parentEntityData = context[config.parentDataKey];

  // Get related entities data based on dataSource type
  const relatedEntitiesData = useMemo(() => {
    if (!parentEntityData) return [];

    const { dataSource } = config;

    if (dataSource.type === 'direct') {
      // Data is directly in parent entity (e.g., trucks array, child_drivers array)
      return parentEntityData[dataSource.field] || [];
    }

    if (dataSource.type === 'referenced') {
      // Data is referenced by IDs, need to lookup from list context
      const listContext = additionalContexts[dataSource.listContextKey];
      if (!listContext) return [];

      const entityIds = parentEntityData[dataSource.idsField] || [];
      return entityIds
        .map(id => listContext[id])
        .filter(Boolean);
    }

    if (dataSource.type === 'multi-referenced') {
      // Special case: incidents/violations with main_driver and co_driver arrays
      const listContext = additionalContexts[dataSource.listContextKey];
      if (!listContext) return [];

      const mainIds = parentEntityData[dataSource.mainIdsField] || [];
      const coIds = parentEntityData[dataSource.coIdsField] || [];

      // Combine and mark with role
      const mainEntities = mainIds.map(id => ({
        ...listContext[id],
        _role: 'main',
      }));
      const coEntities = coIds.map(id => ({
        ...listContext[id],
        _role: 'co',
      }));

      return [...mainEntities, ...coEntities].filter(entity => entity.id);
    }

    return [];
  }, [parentEntityData, config.dataSource, additionalContexts]);

  // Sort entities if sort function provided
  const sortedEntities = useMemo(() => {
    if (!config.sortFn) return relatedEntitiesData;
    return [...relatedEntitiesData].sort(config.sortFn);
  }, [relatedEntitiesData, config.sortFn]);

  // Handle row click - open related card
  const handleRowClick = (entity) => {
    if (onEntityClick) {
      onEntityClick(entity.id, config.relatedEntityType);
    }
  };

  if (!parentEntityData) {
    return (
      <div className="flex items-center justify-center h-full p-5 text-gray-500">
        Loading...
      </div>
    );
  }

  if (sortedEntities.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-5">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center text-gray-500">
            {config.emptyMessage || 'No items found'}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto p-5">
      {sortedEntities.map((entity, index) => (
        <ListRow
          key={entity.id || index}
          primary={config.rowRenderer.primary(entity)}
          secondary={config.rowRenderer.secondary?.(entity)}
          metadata={config.rowRenderer.metadata?.(entity)}
          badge={config.rowRenderer.badge?.(entity)}
          role={config.rowRenderer.roleIcon ? entity._role : null}
          onClick={() => handleRowClick(entity)}
          index={index}
        />
      ))}
    </div>
  );
}

export default ListTab;
