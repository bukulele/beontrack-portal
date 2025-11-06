"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/lib/permissions/hooks";
import { getVisibleMenuSections } from "@/config/menu.config";
import * as LucideIcons from "lucide-react";

/**
 * App Sidebar Component
 *
 * Modern sidebar using shadcn/ui Sidebar component.
 * Features:
 * - Configuration-driven (uses menu.config.js)
 * - URL-based navigation (integrates with unified table page)
 * - Role-based visibility
 * - Keyboard shortcuts (Cmd+B / Ctrl+B) - built into shadcn Sidebar
 * - State persistence - built into shadcn Sidebar
 * - Grouped sections
 * - Active state highlighting
 */

export function AppSidebar({ reportIsLoading, reportDataSet }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { user, roles } = useCurrentUser();

  // Get visible menu sections based on user roles
  const visibleSections = getVisibleMenuSections(roles);

  // Check if a menu item is active
  const isActive = (route) => {
    if (route.startsWith("/table?entity=")) {
      const entity = route.split("entity=")[1];
      const currentEntity = searchParams.get("entity") || "drivers"; // Default entity is "drivers"
      return pathname === "/table" && currentEntity === entity;
    }
    return pathname === route;
  };

  // Get Lucide icon component by name
  const getIcon = (iconName) => {
    const Icon = LucideIcons[iconName];
    return Icon || LucideIcons.Circle;
  };

  return (
    <Sidebar>
      {/* Header with Logo */}
      <SidebarHeader className="border-b">
        <div className="flex items-center justify-center p-4">
          <Link href="/" className="block">
            <Image
              src="/logo.png"
              alt="4Tracks Logo"
              width={280}
              height={65}
              className="w-auto h-auto max-w-full"
              priority
            />
          </Link>
        </div>
      </SidebarHeader>

      {/* Main Content */}
      <SidebarContent>
        {visibleSections.map((section) => (
          <SidebarGroup key={section.id}>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarMenu>
              {section.items.map((item) => {
                const Icon = getIcon(item.icon);
                const active = isActive(item.route);

                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link href={item.route}>
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                        {/* Indicator for Drivers Analysis */}
                        {item.hasIndicator && reportDataSet && !reportIsLoading && (
                          <LucideIcons.Circle className="ml-auto h-2 w-2 fill-green-400 text-green-400" />
                        )}
                        {/* Loading indicator */}
                        {item.hasIndicator && reportIsLoading && (
                          <LucideIcons.Loader2 className="ml-auto h-4 w-4 animate-spin" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer with User Info */}
      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-between gap-2 px-2 py-2">
              <span className="text-xs text-muted-foreground truncate flex-1">
                {user?.username || user?.email || "User"}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={async () => {
                  await signOut();
                  router.push('/login');
                  router.refresh();
                }}
                className="shrink-0 h-8 w-8"
                title="Sign Out"
              >
                <LucideIcons.LogOut className="h-4 w-4" />
              </Button>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
