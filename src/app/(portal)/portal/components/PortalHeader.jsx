/**
 * Portal Header
 *
 * Simple header for the portal with logo, user info, and sign out.
 */

'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePortal, usePortalUser } from '@/app/context/PortalContext';
import { authClient } from '@/lib/auth-client';

export default function PortalHeader() {
  const router = useRouter();
  const { entityType, entityData, portalConfig } = usePortal();
  const user = usePortalUser();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push('/portal');
  };

  if (!entityData) return null;

  // Get status config for color
  const statusMessage = portalConfig?.statusMessages?.[entityData.status] || entityData.status;

  // Dynamic title based on entity type
  const getPortalTitle = () => {
    const entityTypeMap = {
      employees: 'Employee Portal',
      drivers: 'Driver Portal',
      clients: 'Client Portal',
      suppliers: 'Supplier Portal',
    };
    return entityTypeMap[entityType] || 'Portal';
  };

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">{getPortalTitle()}</h1>
            {user.fullName && (
              <p className="text-sm text-muted-foreground">
                Welcome, {user.fullName}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Status:</span>
              <Badge variant="outline">
                {entityData.status.replace(/_/g, ' ').toUpperCase()}
              </Badge>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
