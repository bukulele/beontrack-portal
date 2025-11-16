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
  const { entityData, portalConfig } = usePortal();
  const user = usePortalUser();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push('/portal');
  };

  if (!entityData) return null;

  // Get status config for color
  const statusMessage = portalConfig?.statusMessages?.[entityData.status] || entityData.status;

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Applicant Portal</h1>
            {user.fullName && (
              <p className="text-sm text-muted-foreground">
                Welcome, {user.fullName}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <Badge variant="outline" className="mb-1">
                {entityData.status.replace(/_/g, ' ').toUpperCase()}
              </Badge>
              <p className="text-xs text-muted-foreground">
                ID: {entityData.employeeId}
              </p>
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

        {statusMessage && (
          <div className="mt-3 p-3 bg-muted rounded-md">
            <p className="text-sm">{statusMessage}</p>
          </div>
        )}
      </div>
    </header>
  );
}
