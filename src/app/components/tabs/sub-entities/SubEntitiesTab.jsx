"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import EntityGroup from "./EntityGroup";
import EntityFormDialog from "./EntityFormDialog";

/**
 * SubEntitiesTab - Universal tab for managing parent-child entity relationships
 *
 * Displays a collection of child entities (e.g., claims, inspections, tickets),
 * each with data fields and file uploads. Supports CRUD operations via dialogs.
 *
 * **Reuses modern components**:
 * - CompactDataRow for data fields
 * - CompactFileRow for file uploads
 * - EntityFormDialog for add/edit
 * - AlertDialog for delete confirmation
 *
 * **Context is provided by UniversalCard** - no dynamic context selection needed!
 *
 * @param {Object} config - Tab configuration
 * @param {Object} contextData - Entity data from context (provided by UniversalCard)
 * @param {Function} loadData - Reload entity data function
 * @param {number} entityId - Parent entity ID
 */
function SubEntitiesTab({ config, contextData, loadData, entityId }) {
  const [entities, setEntities] = useState([]);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
  const [selectedEntity, setSelectedEntity] = useState(null);

  // Filter and extract child entities
  useEffect(() => {
    if (!contextData) return;

    // Get child entities array
    const childrenArray = contextData[config.childrenKey] || [];

    // Apply filter if configured
    let filteredEntities = childrenArray;
    if (config.filterBy) {
      const { field, value } = config.filterBy;
      filteredEntities = childrenArray.filter((item) => item[field] === value);
    }

    setEntities(filteredEntities);
  }, [contextData, config.childrenKey, config.filterBy]);

  // Execute special behavior if configured
  useEffect(() => {
    if (config.specialBehavior && contextData) {
      config.specialBehavior({
        contextData,
        entities,
        setFormDialogOpen,
        setFormMode,
        setSelectedEntity,
      });
    }
  }, [contextData, entities, config.specialBehavior]);

  // Handle add button click
  const handleAdd = () => {
    setFormMode('add');
    setSelectedEntity(null);
    setFormDialogOpen(true);
  };

  // Check if add button should be shown
  const showAddButton =
    !config.crud?.addButtonCondition ||
    config.crud.addButtonCondition(entities, contextData);

  return (
    <div className="flex flex-col h-full">
      {/* Add button */}
      {showAddButton && (
        <div className="p-3 border-b">
          <Button onClick={handleAdd}>
            {config.labels?.addButton || 'ADD'}
          </Button>
        </div>
      )}

      {/* Entities list */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {entities.map((entity, index) => (
            <EntityGroup
              key={entity.id}
              entity={entity}
              config={config}
              index={index}
              contextData={contextData}
              loadData={loadData}
              entityId={entityId}
              onEdit={() => {
                setFormMode('edit');
                setSelectedEntity(entity);
                setFormDialogOpen(true);
              }}
            />
          ))}
        </div>
      </ScrollArea>

      {/* Form dialog */}
      {config.form && (
        <EntityFormDialog
          open={formDialogOpen}
          mode={formMode}
          entity={selectedEntity}
          config={config.form}
          parentData={contextData}
          onSuccess={loadData}
          onCancel={() => setFormDialogOpen(false)}
        />
      )}
    </div>
  );
}

export default SubEntitiesTab;
