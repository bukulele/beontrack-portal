/**
 * Menu Configuration
 *
 * Modern configuration-driven menu system for sidebar navigation.
 * Each menu item supports:
 * - URL-based navigation (integrates with unified table page)
 * - Role-based visibility (uses Better Auth database roles)
 * - Icons (Lucide React)
 * - Grouping into sections
 */

/**
 * Menu sections and items configuration
 *
 * Route patterns:
 * - Entity tables: /table?entity={entityType}
 * - Special pages: Direct routes
 *
 * Role names match database roles from Better Auth:
 * - admin, payroll, payrollManager, safety, dispatch, recruiting, planner, shop, hr
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
          "admin",
          "payroll",
          "payrollManager",
          "hr"
        ]
      },
      {
        id: "employees-production",
        label: "Production Employees",
        icon: "IdCard",
        route: "/table?entity=drivers",
        roles: [
          "admin",
          "dispatch",
          "planner",
          "payroll",
          "recruiting",
          "safety",
          "shop",
          "hr"
        ]
      },
      {
        id: "employees-reports",
        label: "Reports",
        icon: "FileText",
        route: "/all-drivers-data",
        roles: [
          "admin",
          "payroll",
          "recruiting",
          "safety",
          "hr"
        ],
        hasIndicator: true,
      },
      {
        id: "employees-expiring-docs",
        label: "Expiring Docs",
        icon: "CalendarX",
        route: "/expiring-driver-docs",
        roles: [
          "admin",
          "safety"
        ]
      },
      {
        id: "employees-wcb",
        label: "WCB Claims",
        icon: "FileWarning",
        route: "/table?entity=wcb",
        roles: [
          "admin",
          "safety"
        ]
      },
      {
        id: "employees-incidents",
        label: "Incidents",
        icon: "AlertTriangle",
        route: "/table?entity=incidents",
        roles: [
          "admin",
          "safety"
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
          "admin",
          "safety",
          "shop",
          "planner"
        ]
      },
      {
        id: "equipment-reports",
        label: "Reports",
        icon: "FileText",
        route: "/equipment-reports", // Placeholder route
        roles: [
          "admin",
          "shop"
        ]
      },
      {
        id: "equipment-accidents",
        label: "Accidents",
        icon: "CarCrash",
        route: "/equipment-accidents", // Placeholder route
        roles: [
          "admin",
          "safety",
          "shop"
        ]
      },
      {
        id: "equipment-issues",
        label: "Issues",
        icon: "AlertCircle",
        route: "/equipment-issues", // Placeholder route
        roles: [
          "admin",
          "shop"
        ]
      },
      {
        id: "equipment-service-orders",
        label: "Service Orders",
        icon: "Wrench",
        route: "/equipment-service-orders", // Placeholder route
        roles: [
          "admin",
          "shop"
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
          "admin",
          "shop"
        ]
      },
      {
        id: "suppliers-purchase-orders",
        label: "Purchase Orders",
        icon: "ShoppingCart",
        route: "/suppliers/purchase-orders", // Placeholder route
        roles: [
          "admin",
          "shop"
        ]
      },
      {
        id: "suppliers-deliveries",
        label: "Deliveries",
        icon: "PackageCheck",
        route: "/suppliers/deliveries", // Placeholder route
        roles: [
          "admin",
          "shop"
        ]
      },
      {
        id: "suppliers-invoices",
        label: "Invoices",
        icon: "Receipt",
        route: "/suppliers/invoices", // Placeholder route
        roles: [
          "admin",
          "payroll"
        ]
      },
      {
        id: "suppliers-payments",
        label: "Payments",
        icon: "DollarSign",
        route: "/suppliers/payments", // Placeholder route
        roles: [
          "admin",
          "payroll"
        ]
      },
      {
        id: "suppliers-performance",
        label: "Performance Reports",
        icon: "TrendingUp",
        route: "/suppliers/performance", // Placeholder route
        roles: [
          "admin"
        ]
      },
      {
        id: "suppliers-contracts",
        label: "Contracts",
        icon: "FileSignature",
        route: "/suppliers/contracts", // Placeholder route
        roles: [
          "admin"
        ]
      },
      {
        id: "suppliers-quality-issues",
        label: "Quality Issues",
        icon: "AlertOctagon",
        route: "/suppliers/quality-issues", // Placeholder route
        roles: [
          "admin",
          "shop"
        ]
      },
      {
        id: "suppliers-expiring-docs",
        label: "Expiring Docs",
        icon: "CalendarX",
        route: "/suppliers/expiring-docs", // Placeholder route
        roles: [
          "admin"
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
          "admin",
          "planner"
        ]
      },
      {
        id: "customers-orders",
        label: "Orders",
        icon: "Package",
        route: "/customers/orders", // Placeholder route
        roles: [
          "admin",
          "planner",
          "dispatch"
        ]
      },
      {
        id: "customers-claims",
        label: "Claims",
        icon: "ShieldAlert",
        route: "/customers/claims", // Placeholder route
        roles: [
          "admin",
          "safety"
        ]
      },
      {
        id: "customers-quotes",
        label: "Quotes",
        icon: "Calculator",
        route: "/customers/quotes", // Placeholder route
        roles: [
          "admin",
          "planner"
        ]
      },
      {
        id: "customers-invoices",
        label: "Invoices",
        icon: "Receipt",
        route: "/customers/invoices", // Placeholder route
        roles: [
          "admin",
          "payroll"
        ]
      },
    ]
  },
];

/**
 * Get menu items visible to user based on their roles
 * @param {string[]} userRoles - Array of user role names from Better Auth (e.g., ['admin', 'payroll'])
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
      // Direct role name matching (no Azure AD lookup needed)
      return item.roles.some(requiredRole => userRoles.includes(requiredRole));
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
