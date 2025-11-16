/**
 * Portal Context
 *
 * Provides portal-specific state and configuration to all portal pages.
 * Manages entity data, portal config, and edit permissions.
 */

'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getPortalConfig } from '@/config/portal/portalConfigs';

const PortalContext = createContext(null);

export function PortalProvider({ children, entityType = 'employees' }) {
  const [entityData, setEntityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state management
  const [formChanges, setFormChanges] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load portal configuration from JavaScript config files
  const portalConfig = getPortalConfig(entityType);

  // Load current user's entity data (employee record)
  useEffect(() => {
    async function loadEntityData() {
      try {
        // Fetch current user's employee data
        const response = await fetch(`/api/portal/${entityType}/me`);
        if (!response.ok) throw new Error('Failed to load your data');

        const data = await response.json();
        setEntityData(data);
      } catch (err) {
        console.error('Error loading entity data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadEntityData();
  }, [entityType]);

  const reloadEntityData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/portal/${entityType}/me`);
      if (!response.ok) throw new Error('Failed to reload data');

      const data = await response.json();
      setEntityData(data);
      // Clear form changes after reload
      setFormChanges({});
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error('Error reloading entity data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update a single field value
  const updateField = (key, value) => {
    setFormChanges(prev => ({
      ...prev,
      [key]: value,
    }));
    setHasUnsavedChanges(true);
  };

  // Save all form changes
  const saveChanges = async () => {
    if (!entityData?.id) {
      throw new Error('No entity data to save');
    }

    try {
      setLoading(true);

      // Merge form changes with current entity data
      const dataToSave = {
        ...entityData,
        ...formChanges,
      };

      const response = await fetch(`/api/v1/${entityType}/${entityData.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      });

      if (!response.ok) {
        throw new Error('Failed to save changes');
      }

      // Reload data to get updated values
      await reloadEntityData();

      return { success: true };
    } catch (err) {
      console.error('Error saving changes:', err);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Reset unsaved changes
  const resetChanges = () => {
    setFormChanges({});
    setHasUnsavedChanges(false);
  };

  // Get current field value (from changes or entity data)
  const getFieldValue = (key) => {
    return formChanges.hasOwnProperty(key) ? formChanges[key] : entityData?.[key];
  };

  const value = {
    entityType,
    entityId: entityData?.id,
    entityData,
    portalConfig,
    loading,
    error,
    reloadEntityData,
    // Permissions
    canEdit: entityData?.allowApplicationEdit ?? false,
    portalAccessEnabled: entityData?.portalAccessEnabled ?? false,
    // Form state management
    formChanges,
    hasUnsavedChanges,
    updateField,
    saveChanges,
    resetChanges,
    getFieldValue,
  };

  return (
    <PortalContext.Provider value={value}>
      {children}
    </PortalContext.Provider>
  );
}

/**
 * Hook to access portal context
 */
export function usePortal() {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within PortalProvider');
  }
  return context;
}

/**
 * Hook to check if user can edit their application
 */
export function usePortalEditAccess() {
  const { canEdit, entityData } = usePortal();

  return {
    canEdit,
    isBlocked: !canEdit,
    status: entityData?.status,
    reason: !canEdit ? 'Your application is currently locked. Contact HR if you need to make changes.' : null,
  };
}

/**
 * Hook to get current user info
 */
export function usePortalUser() {
  const { entityData } = usePortal();

  return {
    id: entityData?.id,
    employeeId: entityData?.employeeId,
    firstName: entityData?.firstName,
    lastName: entityData?.lastName,
    email: entityData?.email,
    status: entityData?.status,
    fullName: entityData?.firstName && entityData?.lastName
      ? `${entityData.firstName} ${entityData.lastName}`
      : entityData?.email,
  };
}
