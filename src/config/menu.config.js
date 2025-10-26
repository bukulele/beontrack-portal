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
  // ============================================
  // EMPLOYEES SECTION
  // ============================================
  {
    id: "employees",
    label: "Employees",
    items: [
      {
        id: "employees-office",
        label: "Office Employees",
        icon: "UserTie",
        route: "/table?entity=employees",
        roles: [
          "PORTAL_ADMIN",
          "PORTAL_PAYROLL",
          "PORTAL_PAYROLL_MANAGER",
          "PORTAL_HR"
        ]
      },
      {
        id: "employees-production",
        label: "Production Employees",
        icon: "IdCard",
        route: "/table?entity=drivers",
        roles: [
          "PORTAL_ADMIN",
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
        id: "employees-reports",
        label: "Reports",
        icon: "FileText",
        route: "/all-drivers-data",
        roles: [
          "PORTAL_ADMIN",
          "PORTAL_PAYROLL",
          "PORTAL_RECRUITING",
          "PORTAL_SAFETY",
          "PORTAL_HR"
        ],
        hasIndicator: true,
      },
      {
        id: "employees-expiring-docs",
        label: "Expiring Docs",
        icon: "CalendarX",
        route: "/expiring-driver-docs",
        roles: [
          "PORTAL_ADMIN",
          "PORTAL_SAFETY"
        ]
      },
      {
        id: "employees-wcb",
        label: "WCB Claims",
        icon: "FileWarning",
        route: "/table?entity=wcb",
        roles: [
          "PORTAL_ADMIN",
          "PORTAL_SAFETY"
        ]
      },
      {
        id: "employees-incidents",
        label: "Incidents",
        icon: "AlertTriangle",
        route: "/table?entity=incidents",
        roles: [
          "PORTAL_ADMIN",
          "PORTAL_SAFETY"
        ]
      },
    ]
  },

  // ============================================
  // EQUIPMENT SECTION
  // ============================================
  {
    id: "equipment",
    label: "Equipment",
    items: [
      {
        id: "equipment-production",
        label: "Production equipment",
        icon: "Truck",
        route: "/equipment-production", // Placeholder route
        roles: [
          "PORTAL_ADMIN",
          "PORTAL_SAFETY",
          "PORTAL_SHOP",
          "PORTAL_PLANNER"
        ]
      },
      {
        id: "equipment-reports",
        label: "Reports",
        icon: "FileText",
        route: "/equipment-reports", // Placeholder route
        roles: [
          "PORTAL_ADMIN",
          "PORTAL_SHOP"
        ]
      },
      {
        id: "equipment-accidents",
        label: "Accidents",
        icon: "CarCrash",
        route: "/equipment-accidents", // Placeholder route
        roles: [
          "PORTAL_ADMIN",
          "PORTAL_SAFETY",
          "PORTAL_SHOP"
        ]
      },
      {
        id: "equipment-issues",
        label: "Issues",
        icon: "AlertCircle",
        route: "/equipment-issues", // Placeholder route
        roles: [
          "PORTAL_ADMIN",
          "PORTAL_SHOP"
        ]
      },
      {
        id: "equipment-service-orders",
        label: "Service Orders",
        icon: "Wrench",
        route: "/equipment-service-orders", // Placeholder route
        roles: [
          "PORTAL_ADMIN",
          "PORTAL_SHOP"
        ]
      },
    ]
  },

  // ============================================
  // SUPPLIERS SECTION
  // ============================================
  {
    id: "suppliers",
    label: "Suppliers",
    items: [
      {
        id: "suppliers-list",
        label: "Suppliers",
        icon: "Building2",
        route: "/suppliers", // Placeholder route
        roles: [
          "PORTAL_ADMIN",
          "PORTAL_SHOP"
        ]
      },
      {
        id: "suppliers-purchase-orders",
        label: "Purchase Orders",
        icon: "ShoppingCart",
        route: "/suppliers/purchase-orders", // Placeholder route
        roles: [
          "PORTAL_ADMIN",
          "PORTAL_SHOP"
        ]
      },
      {
        id: "suppliers-deliveries",
        label: "Deliveries",
        icon: "PackageCheck",
        route: "/suppliers/deliveries", // Placeholder route
        roles: [
          "PORTAL_ADMIN",
          "PORTAL_SHOP"
        ]
      },
      {
        id: "suppliers-invoices",
        label: "Invoices",
        icon: "Receipt",
        route: "/suppliers/invoices", // Placeholder route
        roles: [
          "PORTAL_ADMIN",
          "PORTAL_PAYROLL"
        ]
      },
      {
        id: "suppliers-payments",
        label: "Payments",
        icon: "DollarSign",
        route: "/suppliers/payments", // Placeholder route
        roles: [
          "PORTAL_ADMIN",
          "PORTAL_PAYROLL"
        ]
      },
      {
        id: "suppliers-performance",
        label: "Performance Reports",
        icon: "TrendingUp",
        route: "/suppliers/performance", // Placeholder route
        roles: [
          "PORTAL_ADMIN"
        ]
      },
      {
        id: "suppliers-contracts",
        label: "Contracts",
        icon: "FileSignature",
        route: "/suppliers/contracts", // Placeholder route
        roles: [
          "PORTAL_ADMIN"
        ]
      },
      {
        id: "suppliers-quality-issues",
        label: "Quality Issues",
        icon: "AlertOctagon",
        route: "/suppliers/quality-issues", // Placeholder route
        roles: [
          "PORTAL_ADMIN",
          "PORTAL_SHOP"
        ]
      },
      {
        id: "suppliers-expiring-docs",
        label: "Expiring Docs",
        icon: "CalendarX",
        route: "/suppliers/expiring-docs", // Placeholder route
        roles: [
          "PORTAL_ADMIN"
        ]
      },
    ]
  },

  // ============================================
  // CUSTOMERS SECTION
  // ============================================
  {
    id: "customers",
    label: "Customers",
    items: [
      {
        id: "customers-list",
        label: "Customers",
        icon: "Users",
        route: "/customers", // Placeholder route
        roles: [
          "PORTAL_ADMIN",
          "PORTAL_PLANNER"
        ]
      },
      {
        id: "customers-orders",
        label: "Orders",
        icon: "Package",
        route: "/customers/orders", // Placeholder route
        roles: [
          "PORTAL_ADMIN",
          "PORTAL_PLANNER",
          "PORTAL_DISPATCH"
        ]
      },
      {
        id: "customers-claims",
        label: "Claims",
        icon: "ShieldAlert",
        route: "/customers/claims", // Placeholder route
        roles: [
          "PORTAL_ADMIN",
          "PORTAL_SAFETY"
        ]
      },
      {
        id: "customers-quotes",
        label: "Quotes",
        icon: "Calculator",
        route: "/customers/quotes", // Placeholder route
        roles: [
          "PORTAL_ADMIN",
          "PORTAL_PLANNER"
        ]
      },
      {
        id: "customers-invoices",
        label: "Invoices",
        icon: "Receipt",
        route: "/customers/invoices", // Placeholder route
        roles: [
          "PORTAL_ADMIN",
          "PORTAL_PAYROLL"
        ]
      },
    ]
  },

  // ============================================
  // LEGACY SECTION (will be removed later)
  // ============================================
  {
    id: "legacy",
    label: "Legacy",
    items: [
      {
        id: "legacy-recruiting",
        label: "Recruiting",
        icon: "Paperclip",
        route: "/table?entity=recruiting",
        roles: [
          "PORTAL_ADMIN",
          "PORTAL_PAYROLL",
          "PORTAL_RECRUITING",
          "PORTAL_SAFETY",
          "PORTAL_HR"
        ]
      },
      {
        id: "legacy-drivers",
        label: "Drivers",
        icon: "IdCard",
        route: "/table?entity=drivers",
        roles: [
          "PORTAL_ADMIN",
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
        id: "legacy-trucks",
        label: "Trucks",
        icon: "Truck",
        route: "/table?entity=trucks",
        roles: [
          "PORTAL_ADMIN",
          "PORTAL_SAFETY",
          "PORTAL_SHOP",
          "PORTAL_PLANNER"
        ]
      },
      {
        id: "legacy-equipment",
        label: "Equipment",
        icon: "Container",
        route: "/table?entity=equipment",
        roles: [
          "PORTAL_ADMIN",
          "PORTAL_SAFETY",
          "PORTAL_SHOP"
        ]
      },
      {
        id: "legacy-employees",
        label: "Office Employees",
        icon: "UserTie",
        route: "/table?entity=employees",
        roles: [
          "PORTAL_ADMIN",
          "PORTAL_PAYROLL",
          "PORTAL_PAYROLL_MANAGER",
          "PORTAL_HR"
        ]
      },
      {
        id: "legacy-driver-reports",
        label: "Driver Reports",
        icon: "Flag",
        route: "/table?entity=driver-reports",
        roles: [
          "PORTAL_ADMIN",
          "PORTAL_SAFETY",
          "PORTAL_SHOP"
        ]
      },
      {
        id: "legacy-incidents",
        label: "Accidents",
        icon: "CarBurst",
        route: "/table?entity=incidents",
        roles: [
          "PORTAL_ADMIN",
          "PORTAL_SAFETY"
        ]
      },
      {
        id: "legacy-violations",
        label: "Tickets/Inspections",
        icon: "ClipboardList",
        route: "/table?entity=violations",
        roles: [
          "PORTAL_ADMIN",
          "PORTAL_SAFETY"
        ]
      },
      {
        id: "legacy-wcb",
        label: "WCB Claims",
        icon: "FileWarning",
        route: "/table?entity=wcb",
        roles: [
          "PORTAL_ADMIN",
          "PORTAL_SAFETY"
        ]
      },
      {
        id: "legacy-expiring-docs",
        label: "Expiring Driver Docs",
        icon: "CalendarX",
        route: "/expiring-driver-docs",
        roles: [
          "PORTAL_ADMIN",
          "PORTAL_SAFETY"
        ]
      },
      {
        id: "legacy-drivers-analysis",
        label: "Drivers Analysis",
        icon: "Microscope",
        route: "/all-drivers-data",
        roles: [
          "PORTAL_ADMIN",
          "PORTAL_PAYROLL",
          "PORTAL_RECRUITING",
          "PORTAL_SAFETY",
          "PORTAL_HR"
        ],
        hasIndicator: true,
      },
      {
        id: "legacy-seals-report",
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
        id: "legacy-fuel-reports",
        label: "Fuel Reports",
        icon: "Fuel",
        route: "/fuel-report",
        roles: [
          "PORTAL_ADMIN",
          "PORTAL_SAFETY"
        ]
      },
      {
        id: "legacy-availability",
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
  // Legacy icons
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

  // New icons
  "FileText": "FileText",
  "AlertTriangle": "AlertTriangle",
  "FileBarChart": "FileBarChart",
  "CarCrash": "CarCrash",
  "AlertCircle": "AlertCircle",
  "Wrench": "Wrench",
  "Building2": "Building2",
  "ShoppingCart": "ShoppingCart",
  "PackageCheck": "PackageCheck",
  "DollarSign": "DollarSign",
  "TrendingUp": "TrendingUp",
  "FileSignature": "FileSignature",
  "AlertOctagon": "AlertOctagon",
  "CalendarClock": "CalendarClock",
  "Package": "Package",
  "ShieldAlert": "ShieldAlert",
  "Calculator": "Calculator",
  "Receipt": "Receipt",
};
