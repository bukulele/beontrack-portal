/**
 * Menu Configuration
 *
 * Modern configuration-driven menu system for sidebar navigation.
 * Each menu item supports:
 * - URL-based navigation (integrates with unified table page)
 * - Role-based visibility
 * - Icons (Lucide React)
 * - Grouping into sections
 */

/**
 * Menu sections and items configuration
 *
 * Route patterns:
 * - Entity tables: /table?entity={entityType}
 * - Special pages: Direct routes
 */
export const MENU_SECTIONS = [
  {
    id: "entities",
    label: "Entities",
    items: [
      {
        id: "recruiting",
        label: "Recruiting",
        icon: "Paperclip",
        route: "/table?entity=recruiting",
        roles: [
          "PORTAL_PAYROLL",
          "PORTAL_RECRUITING",
          "PORTAL_SAFETY",
          "PORTAL_HR"
        ]
      },
      {
        id: "drivers",
        label: "Drivers",
        icon: "IdCard",
        route: "/table?entity=drivers",
        roles: [
          "PORTAL_DISPATCH",
          "PORTAL_PLANNER",
          "PORTAL_PAYROLL",
          "PORTAL_RECRUITING",
          "PORTAL_SAFETY",
          "PORTAL_SHOP",
          "PORTAL_HR"
        ]
      },
      {
        id: "trucks",
        label: "Trucks",
        icon: "Truck",
        route: "/table?entity=trucks",
        roles: [
          "PORTAL_SAFETY",
          "PORTAL_SHOP",
          "PORTAL_PLANNER"
        ]
      },
      {
        id: "equipment",
        label: "Equipment",
        icon: "Container",
        route: "/table?entity=equipment",
        roles: [
          "PORTAL_SAFETY",
          "PORTAL_SHOP"
        ]
      },
      {
        id: "employees",
        label: "Office Employees",
        icon: "UserTie",
        route: "/table?entity=employees",
        roles: [
          "PORTAL_PAYROLL",
          "PORTAL_PAYROLL_MANAGER",
          "PORTAL_ADMIN",
          "PORTAL_HR"
        ]
      },
    ]
  },
  {
    id: "safety",
    label: "Safety",
    items: [
      {
        id: "driver-reports",
        label: "Driver Reports",
        icon: "Flag",
        route: "/table?entity=driver-reports",
        roles: [
          "PORTAL_SAFETY",
          "PORTAL_SHOP"
        ]
      },
      {
        id: "incidents",
        label: "Accidents",
        icon: "CarBurst",
        route: "/table?entity=incidents",
        roles: [
          "PORTAL_SAFETY"
        ]
      },
      {
        id: "violations",
        label: "Tickets/Inspections",
        icon: "ClipboardList",
        route: "/table?entity=violations",
        roles: [
          "PORTAL_SAFETY"
        ]
      },
      {
        id: "wcb",
        label: "WCB Claims",
        icon: "FileWarning",
        route: "/table?entity=wcb",
        roles: [
          "PORTAL_SAFETY"
        ]
      },
      {
        id: "expiring-docs",
        label: "Expiring Driver Docs",
        icon: "CalendarX",
        route: "/expiring-driver-docs",
        roles: [
          "PORTAL_SAFETY"
        ]
      },
    ]
  },
  {
    id: "reports",
    label: "Reports & Analysis",
    items: [
      {
        id: "drivers-analysis",
        label: "Drivers Analysis",
        icon: "Microscope",
        route: "/all-drivers-data",
        roles: [
          "PORTAL_PAYROLL",
          "PORTAL_RECRUITING",
          "PORTAL_SAFETY",
          "PORTAL_HR"
        ],
        hasIndicator: true, // Shows green dot when data is loaded
      },
      {
        id: "seals-report",
        label: "Seals Report",
        icon: "Tag",
        route: "/seals-report",
        roles: [
          "PORTAL_ADMIN",
          "PORTAL_PLANNER",
          "PORTAL_SAFETY"
        ]
      },
      {
        id: "fuel-reports",
        label: "Fuel Reports",
        icon: "Fuel",
        route: "/fuel-report",
        roles: [
          "PORTAL_SAFETY"
        ]
      },
    ]
  },
  {
    id: "operations",
    label: "Operations",
    items: [
      {
        id: "availability",
        label: "Availability Sheet",
        icon: "Users",
        route: "/dispatch-availability",
        roles: [
          "PORTAL_ADMIN",
          "PORTAL_PLANNER",
          "PORTAL_SAFETY"
        ]
      },
    ]
  },
];

/**
 * Role ID mapping - maps role names to actual Azure AD role IDs from environment
 * This needs to be a static object because Next.js replaces process.env at build time
 */
const ROLE_IDS = {
  PORTAL_DISPATCH: process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_DISPATCH,
  PORTAL_SAFETY: process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_SAFETY,
  PORTAL_RECRUITING: process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_RECRUITING,
  PORTAL_PAYROLL: process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PAYROLL,
  PORTAL_PAYROLL_MANAGER: process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PAYROLL_MANAGER,
  PORTAL_PLANNER: process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PLANNER,
  PORTAL_SHOP: process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_SHOP,
  PORTAL_ADMIN: process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_ADMIN,
  PORTAL_HR: process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_HR,
};

/**
 * Get menu items visible to user based on their roles
 * @param {string[]} userRoles - Array of user role IDs (from Azure AD)
 * @returns {object[]} Filtered menu sections with visible items
 */
export const getVisibleMenuSections = (userRoles) => {
  if (!userRoles || userRoles.length === 0) {
    return [];
  }

  return MENU_SECTIONS.map(section => ({
    ...section,
    items: section.items.filter(item => {
      // Check if user has any of the required roles
      return item.roles.some(requiredRole => {
        const roleId = ROLE_IDS[requiredRole];
        return roleId && userRoles.includes(roleId);
      });
    })
  })).filter(section => section.items.length > 0); // Remove empty sections
};

/**
 * Icon name mapping for Lucide React
 * Maps simplified icon names to actual Lucide icon names
 */
export const ICON_MAP = {
  "Paperclip": "Paperclip",
  "IdCard": "IdCard",
  "Truck": "Truck",
  "Container": "Container",
  "UserTie": "UserTie",
  "Flag": "Flag",
  "CarBurst": "CarCrash", // Lucide uses CarCrash
  "ClipboardList": "ClipboardList",
  "FileWarning": "FileWarning",
  "CalendarX": "CalendarX",
  "Microscope": "Microscope",
  "Tag": "Tag",
  "Fuel": "Fuel",
  "Users": "Users",
};
