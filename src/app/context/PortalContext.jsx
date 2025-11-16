/**
 * Portal Context
 *
 * Provides portal-specific state and configuration to all portal pages.
 * Manages entity data, portal config, and edit permissions.
 */

'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const PortalContext = createContext(null);

export function PortalProvider({ children, entityType = 'employees' }) {
  const [entityData, setEntityData] = useState(null);
  const [portalConfig, setPortalConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load portal configuration
  useEffect(() => {
    async function loadPortalConfig() {
      try {
        // Fetch portal config from database
        const response = await fetch(`/api/portal/config/${entityType}`);
        if (!response.ok) throw new Error('Failed to load portal configuration');

        const config = await response.json();
        setPortalConfig(config);
      } catch (err) {
        console.error('Error loading portal config:', err);
        setError(err.message);
      }
    }

    loadPortalConfig();
  }, [entityType]);

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
    } catch (err) {
      console.error('Error reloading entity data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
