/**
 * Portal Navigation
 *
 * Configuration-driven navigation tabs for the portal.
 * Shows different tabs based on applicant's current status.
 */

'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePortal } from '@/app/context/PortalContext';

export default function PortalNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { portalConfig, entityData, loading } = usePortal();

  if (loading || !portalConfig || !entityData) {
    return null;
  }

  const currentStatus = entityData.status;

  // Filter navigation items based on current status
  const visibleNavItems = portalConfig.navigationItems?.filter(item => {
    if (item.statuses.includes('all')) return true;
    return item.statuses.includes(currentStatus);
  }) || [];

  if (visibleNavItems.length === 0) {
    return null;
  }

  // Determine active tab from current pathname
  const activeTab = visibleNavItems.find(item =>
    pathname.startsWith(item.route)
  )?.key || visibleNavItems[0]?.key;

  const handleTabChange = (tabKey) => {
    const navItem = visibleNavItems.find(item => item.key === tabKey);
    if (navItem) {
      router.push(navItem.route);
    }
  };

  return (
    <div className="border-b bg-background">
      <div className="container mx-auto px-4">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="h-12">
            {visibleNavItems.map(item => (
              <TabsTrigger
                key={item.key}
                value={item.key}
                className="px-6"
              >
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
