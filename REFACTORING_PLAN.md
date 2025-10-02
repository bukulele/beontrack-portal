# 4Tracks Office Management System - Refactoring Plan

## Overview
Strategic refactoring to transform the 4Tracks office management system into a polished, production-ready product with modern UI/UX, organized codebase, and standardized component library.

**Core Principle:** Only bug fixes - no functionality changes unless critical.

## Phase 1: Visual Design System & Component Library

### 1.1 Component Library Selection & Setup
**Decision: shadcn/ui + Radix UI (already partially installed)**
- Leverage existing Radix primitives (@radix-ui/react-icons, slider, switch)
- Add missing shadcn/ui components for complete coverage
- Keep MUI components where they excel (DataGrid, DatePicker)
- Install: Button, Input, Select, Textarea, Dialog, Card, Badge, etc.

**Design System Foundation:**
- Define color palette (replace #b92531 brand red with modern scheme)
- Establish spacing scale (consistent with Tailwind)
- Typography system (font sizes, weights, line heights)
- Shadow/elevation system
- Border radius standards

### 1.2 Custom Component Migration Priority
**Phase 1A - Core Form Components:**
- `Button.js` → shadcn Button (consolidate 8+ variants into semantic variants)
- `TextInput.js` → shadcn Input
- `OptionsSelector.js` → shadcn Select
- `TextareaInput.js` → shadcn Textarea
- `NumericInput.js` → shadcn Input with number type

**Phase 1B - Specialized Inputs:**
- `DateInput.js` → Keep MUI DatePicker, update styling
- `PhoneNumberInput.js` → shadcn Input + custom formatting
- `PostalCodeInput.js` → shadcn Input + custom formatting
- `EmailInput.js` → shadcn Input + validation
- `RadioOptionsSelector.js` → shadcn RadioGroup
- `SwitchableComponent.js` → Use existing Radix Switch

**Phase 1C - Complex Components:**
- `ModalContainer.js` + variants → shadcn Dialog (unified system)
- `Pagination.js` → shadcn Pagination
- `FileLoader.js` / `FileLoaderSm.js` → Modern file upload component

### 1.3 Visual Design Refresh
**Navigation:**
- Redesign `Menu.js` - modern sidebar with better collapsed state
- Smooth animations for menu transitions
- Better iconography and spacing

**Dashboard:**
- Refresh dashboard tiles (DashboardContainer)
- Modern card design with shadows
- Better data visualization

**Tables:**
- Keep MUI DataGrid (already good)
- Modernize custom toolbars
- Better row hover states and selection

**Color & Theme:**
- New color palette (primary, secondary, accent, semantic colors)
- Update warning indicators (yellow-row, red-row classes)
- Consistent focus/hover states
- Dark mode refinement

**Loading States:**
- Replace `ThreeDotsLoader` with skeleton screens
- Better loading transitions

## Phase 2: Code Organization & Architecture

### 2.1 File Structure Reorganization
**NEW Structure:**
```
src/
├── app/
│   ├── (main)/              # Main app routes
│   │   ├── table/
│   │   ├── driver-card/
│   │   └── employee-card/
│   ├── (dashboard)/         # Dashboard routes
│   │   └── shop-dashboard/
│   ├── api/                 # Keep as-is (80+ endpoints)
│   └── layout.js
├── components/
│   ├── ui/                  # shadcn components
│   ├── forms/               # Form-specific components
│   ├── tables/              # Table components
│   ├── cards/               # Entity card components
│   ├── modals/              # Modal components
│   └── layout/              # Layout components (Menu, Navbar)
├── config/
│   ├── constants.js         # App-wide constants
│   ├── roles.js            # Role definitions & mappings
│   └── table-configs/      # Table configurations
├── data/
│   ├── tables/             # All _unstable table definitions (KEEP THESE)
│   │   ├── drivers.js      # Renamed from driversTable_unstable.js
│   │   ├── trucks.js
│   │   ├── equipment.js
│   │   ├── incidents.js
│   │   ├── violations.js
│   │   ├── fuel-reports.js
│   │   ├── wcb.js
│   │   └── employees.js
│   └── templates/          # Card/form templates from assets/
├── lib/
│   ├── utils/              # All utility functions
│   └── hooks/              # Custom React hooks
└── middleware.js           # Keep as-is
└── apiMappingMiddleware.js # Keep as-is
```

### 2.2 Cleanup Actions
**DELETE Legacy Files:**
- Remove all non-`_unstable` table files (driversTable.js, trucksTable.js, etc.)
- Remove `/table-old/page.js`
- Remove old `TableContainer.js` component
- Remove unused assets

**KEEP & RENAME:**
- All `*_unstable.js` files → rename to remove `_unstable` suffix
- `TableView_unstable` → rename to `TableView` or `DataTable`

**Consolidate Assets:**
- Move `/assets/*.js` to appropriate locations in `/data/` or `/config/`
- Organize by domain (drivers, trucks, equipment, etc.)

### 2.3 Context Consolidation
**Current:** 21 context files
**Action:** Review and consolidate where possible
- Keep domain-specific contexts (DriverContext, TruckContext, etc.)
- Consider combining smaller contexts
- Document context hierarchy

## Phase 3: Component Refactoring

### 3.1 Modal System Unification
**Current:** 5 different modal containers
**New:** Single shadcn Dialog-based system with variants
- `<Dialog variant="form">` - Form modals
- `<Dialog variant="info">` - Information displays
- `<Dialog variant="card">` - Entity cards (Driver, Truck, etc.)
- `<Dialog variant="map">` - Map displays
- Consistent animations and backdrops

### 3.2 Card Components Standardization
**Entity Cards (keep functionality, refresh UI):**
- DriverCard, TruckCard, EquipmentCard, EmployeeCard
- IncidentCard, ViolationCard, WCBCard, DriverReportCard
- Unified tab system (InfoCardTabs)
- Consistent layout and spacing
- Modern card design with better shadows

### 3.3 Checklist Components
**Standardize 3 checklist implementations:**
- EmployeeChecklist
- TruckChecklist
- EquipmentChecklist (if exists)
- Create shared ChecklistField component
- Unified validation and state management

### 3.4 Table System
**Keep MUI DataGrid** for main tables (already excellent)
**Standardize:**
- Table toolbar components (CustomToolbar, CustomToolbarPayrollReport, etc.)
- Filter components (StatusFiltersComponent, RoutesFiltersComponent)
- Export/CSV functionality
- Column definitions in `/data/tables/`

### 3.5 Log Components
**Consolidate 3 implementations:**
- DriverLogComponent
- EmployeeLogComponent
- IncidentLogComponent
- ViolationLogComponent
- Create unified LogView component

## Phase 4: Implementation Strategy

### 4.1 Execution Timeline (8 weeks)
**Week 1-2: Foundation** ✅
- [x] Install shadcn/ui components
- [x] ~~Define design system~~ (Using library defaults)
- [x] Create new `/components/ui/` structure
- [x] Set up new folder structure
- [x] Migrate table files to `/data/tables/`
- [x] Update all imports
- [x] Delete legacy files

**Week 3: Core Component Migration** (In Progress)
- [x] Migrate Button component (5 files updated)
- [ ] Migrate Input component (15 files - in progress)
- [ ] Migrate Select/OptionsSelector (52 files - pending)
- [ ] Migrate Textarea component (28 files - pending)
- [x] Test build after each migration

**Week 4: File Reorganization**
- [ ] Rename `_unstable` files
- [ ] Delete legacy files
- [ ] Move assets to new structure
- [ ] Update all imports

**Week 5: Form Components**
- [ ] Migrate specialized inputs
- [ ] Update checklist components
- [ ] Refresh card components

**Week 6: Navigation & Layout**
- [ ] Redesign Menu/sidebar
- [ ] Update dashboard
- [ ] Improve responsive layouts

**Week 7: Modal & Dialog System**
- [ ] Implement unified modal system
- [ ] Migrate all modal usage
- [ ] Test thoroughly

**Week 8: Polish & Documentation**
- [ ] Final visual tweaks
- [ ] Performance check
- [ ] Update documentation
- [ ] Create migration guide

### 4.2 Migration Approach
**Parallel Development:**
- Create new components alongside old ones
- Use feature flag pattern if needed
- Migrate page by page (start with less critical)
- Keep old components until fully migrated

**Testing Strategy:**
- Test each migrated component with all 8 user roles
- No functionality changes (visual only)
- Maintain all API contracts
- Role-based access control stays identical

### 4.3 Risk Mitigation
- Keep old components until migration complete
- Git branch strategy (feature branches per phase)
- Can rollback any phase independently
- Thorough testing before deletion

## Deliverables

1. **Design System Documentation** - Colors, typography, spacing, components
2. **Refactored Codebase** - Clean structure, modern components
3. **Migration Guide** - How to use new components
4. **Component Storybook** (optional) - Visual component library
5. **Updated CLAUDE.md** - New architecture documentation
6. **REFACTORING_PLAN.md** - This plan saved for reference and tracking

## Non-Goals (Explicitly Out of Scope)

- Backend/API changes (keep all 80+ endpoints as-is)
- Database modifications
- New features or functionality
- TypeScript migration (future consideration)
- Performance optimization (unless critical bug found)
- Authentication/authorization changes
- Role system modifications

## Success Criteria

✅ Fresh, modern, clean, intuitive visual design
✅ All utility data organized in logical locations
✅ Standardized component library (shadcn/ui)
✅ No regressions in functionality
✅ All 8 user roles work identically
✅ Improved developer experience (easier to find/modify code)
✅ Can pause and resume work at any phase boundary

## Progress Tracking

### Current Phase: Week 3 - Core Component Migration
### Completion: 20%

**Last Updated:** 2025-10-02
**Next Milestone:** Complete Input/Select/Textarea Migration

### Completed Milestones:
✅ **Week 1-2 Foundation** (Completed 2025-10-02)
- Installed shadcn/ui with 11 core components
- Created folder structure: `/data/tables/`, `/lib/utils/`, `/lib/hooks/`, `/config/`
- Migrated all table definitions from `_unstable` files
- Updated all imports to use new paths
- Deleted legacy files (old table files, table-old page)
- Build verified successful

🔄 **Week 3 - In Progress** (Started 2025-10-02)
- ✅ Button component wrapper created (ALL 56 files now use shadcn internally)
- ⏳ Input/Select/Textarea migration (95 files total - pending)

### Component Migration Status:
- ✅ **Button** - **Complete with Wrapper Approach**
  - Created wrapper component that accepts old API (content, fn, style, etc.)
  - Internally uses shadcn Button with proper variant/size mapping
  - All 56 files work without changes
  - Can gradually migrate to direct shadcn usage later
- ⏳ **TextInput** - Pending (15 files, some with custom logic)
- ⏳ **OptionsSelector** - Pending (52 files)
- ⏳ **TextareaInput** - Pending (28 files)
- 📝 **Other components** - To be assessed

### Button Wrapper Details:
The wrapper component (`/src/app/components/button/Button.js`):
- Accepts old props: `content`, `fn`, `style`, `highlighted`, `tooltipContent`, etc.
- Maps to shadcn props: `children`, `onClick`, `variant`, `size`
- Handles 10 different style variants (classicButton, iconButton, menuPoint, etc.)
- Maintains full backward compatibility
- Allows gradual migration when ready
