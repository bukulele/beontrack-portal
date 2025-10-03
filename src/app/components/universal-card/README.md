# Universal Card System - Foundation

## Overview

The Universal Card system replaces all entity-specific card components (DriverCard, TruckCard, etc.) with a single configuration-driven component.

## Components

### UniversalCard

Main card component that renders based on configuration.

**Location**: `/src/app/components/universal-card/UniversalCard.jsx`

**Usage**:
```jsx
import UniversalCard from "@/app/components/universal-card/UniversalCard";
import { getCardConfig } from "@/config/cards";

const config = getCardConfig("truck");

<UniversalCard config={config} />
```

**Props**:
- `config` (Object, required) - Card configuration object

**Features**:
- Fixed height (95vh) with scrollable content
- Tab navigation using shadcn Tabs
- Configuration-driven tab rendering
- Responsive layout

## Utilities

### Context Composer

Dynamically wraps components with multiple context providers.

**Location**: `/src/lib/utils/contextComposer.js`

**Functions**:

#### `wrapWithContexts(contexts, children)`
Wraps a component with multiple context providers.

```jsx
wrapWithContexts(
  [
    { Provider: DriverProvider, props: { userId: 123 } },
    { Provider: IncidentsListProvider, props: {} }
  ],
  <CardContent />
)
```

#### `withContexts(Component, contexts)`
Higher-order component wrapper.

```jsx
const WrappedCard = withContexts(UniversalCard, [
  { Provider: DriverProvider, props: { userId: 123 } }
]);
```

#### `createContextsFromConfig(config, contextRegistry)`
Creates context array from card configuration.

```jsx
const contexts = createContextsFromConfig(cardConfig, CONTEXT_PROVIDERS);
```

## Configuration System

### Schema

Defines and validates card configurations.

**Location**: `/src/config/cards/schema.js`

**Exports**:
- `TAB_TYPES` - Valid tab type constants
- `ENTITY_TYPES` - Valid entity type constants
- `validateCardConfig(config)` - Validates a configuration object
- `createDefaultConfig(entityType)` - Creates default configuration
- `EXAMPLE_CONFIG` - Example configuration for reference

**Configuration Structure**:
```js
{
  entity: {
    type: "truck",                    // Entity type
    contextProvider: "TruckProvider", // Context provider name
    idField: "truckId",               // ID field name
    contexts: [                       // Additional contexts
      {
        providerName: "TruckProvider",
        props: {}
      }
    ]
  },
  tabs: [
    {
      id: "general",                  // Unique tab ID
      label: "Truck Card",            // Display label
      type: "general-info",           // Tab type
      config: {                       // Tab-specific config
        sections: [],
        fileSections: []
      }
    }
  ],
  defaultTab: "general",              // Default tab to open
  width: "w-[1024px]"                 // Card width (Tailwind class)
}
```

### Configuration Loader

Manages card configurations.

**Location**: `/src/config/cards/index.js`

**Functions**:

#### `getCardConfig(entityType)`
Gets a card configuration by entity type.

```jsx
const config = getCardConfig("truck");
```

#### `registerCardConfig(entityType, config)`
Registers a new card configuration.

```jsx
registerCardConfig("truck", truckCardConfig);
```

#### `hasCardConfig(entityType)`
Checks if configuration exists.

```jsx
if (hasCardConfig("truck")) {
  // ...
}
```

## Component Registry

Maps string names to React components for dynamic rendering.

**Location**: `/src/lib/componentRegistry.js`

**Exports**:
- `CONTEXT_PROVIDERS` - Map of context provider names to components
- `TAB_COMPONENTS` - Map of tab types to components
- `getContextProvider(name)` - Gets a context provider by name
- `getTabComponent(type)` - Gets a tab component by type
- `registerContextProvider(name, Provider)` - Registers new provider
- `registerTabComponent(type, Component)` - Registers new tab component

**Usage**:
```jsx
import { getContextProvider, getTabComponent } from "@/lib/componentRegistry";

const Provider = getContextProvider("TruckProvider");
const TabComponent = getTabComponent("general-info");
```

## Test Harness

Interactive testing page for UniversalCard.

**Location**: `/src/app/test-universal-card/page.js`

**Access**: Navigate to `/test-universal-card` in browser

**Features**:
- JSON configuration editor
- Live validation
- Real-time preview
- Error display
- Quick reference documentation

## Creating a New Card Configuration

### Step 1: Create Configuration File

Create a new file in `/src/config/cards/`:

```js
// /src/config/cards/truckCard.config.js

export const truckCardConfig = {
  entity: {
    type: "truck",
    contextProvider: "TruckProvider",
    idField: "truckId",
    contexts: [
      {
        providerName: "TruckProvider",
        props: {}
      }
    ]
  },
  tabs: [
    {
      id: "general",
      label: "Truck Card",
      type: "general-info",
      config: {
        // Tab-specific configuration
      }
    }
  ],
  defaultTab: "general",
  width: "w-[1024px]"
};
```

### Step 2: Register Configuration

Import and register in `/src/config/cards/index.js`:

```js
import { truckCardConfig } from "./truckCard.config";

const configs = {
  truck: truckCardConfig,
  // ... other configs
};
```

### Step 3: Use in Application

```jsx
import UniversalCard from "@/app/components/universal-card/UniversalCard";
import { getCardConfig } from "@/config/cards";
import { wrapWithContexts, createContextsFromConfig } from "@/lib/utils/contextComposer";
import { CONTEXT_PROVIDERS } from "@/lib/componentRegistry";

function TruckCardPage({ truckId }) {
  const config = getCardConfig("truck");
  const contexts = createContextsFromConfig(config, CONTEXT_PROVIDERS);

  // Update context props with actual IDs
  const updatedContexts = contexts.map(ctx => ({
    ...ctx,
    props: { ...ctx.props, truckId }
  }));

  return wrapWithContexts(
    updatedContexts,
    <UniversalCard config={config} />
  );
}
```

## Development Workflow

### 1. Build Tab Components

Create tab components for each tab type (general-info, checklist, log, etc.) in `/src/app/components/tabs/`.

### 2. Register Tab Components

Add to `/src/lib/componentRegistry.js`:

```js
import { GeneralInfoTab } from "@/app/components/tabs/general-info/GeneralInfoTab";

export const TAB_COMPONENTS = {
  "general-info": GeneralInfoTab,
  // ... more tabs
};
```

### 3. Test with Test Harness

Use `/test-universal-card` to test your configurations.

### 4. Create Card Configurations

Create configuration files for each entity type.

### 5. Integrate into Application

Replace old card components with UniversalCard.

## Architecture Decisions

### Why Configuration-Driven?

- **Single Source of Truth**: One component for all cards
- **Scalability**: Add new cards in minutes
- **Maintainability**: Bug fixes apply to all cards
- **Consistency**: All cards behave identically
- **Testability**: Test once, applies everywhere

### Why shadcn/ui?

- Modern, accessible components
- Customizable with Tailwind
- Great documentation
- Active maintenance
- No runtime overhead (copy/paste components)

### Why Fixed Height?

- Consistent UX across all cards
- Predictable layout
- Better scrolling behavior
- Prevents layout shifts

### Why Context Composition?

- Dynamic provider nesting
- Configuration-driven
- Flexible for any entity type
- Maintains React context patterns

## Next Steps

1. ✅ Phase 1 Complete: Foundation built
2. 🔜 Phase 2: Build FileUploader component
3. 🔜 Phase 3: Build ChecklistTab component (most critical)
4. 🔜 Phase 4: Build GeneralInfoTab component
5. 🔜 Phases 5-10: Complete all tab types and migrate

## Troubleshooting

### Configuration Validation Errors

Use the test harness at `/test-universal-card` to validate your configuration. It will show specific validation errors.

### Context Provider Not Found

Ensure the provider is registered in `/src/lib/componentRegistry.js`:

```js
export const CONTEXT_PROVIDERS = {
  TruckProvider,  // Add your provider here
};
```

### Tab Component Not Rendering

1. Check if tab component is registered in `TAB_COMPONENTS`
2. Verify tab `type` matches registered key
3. Check browser console for errors

### Styling Issues

- Ensure Tailwind classes are correct
- Check shadcn/ui component documentation
- Use browser DevTools to inspect

## Support

- **Implementation Plan**: `/UNIVERSAL_CARD_IMPLEMENTATION_PLAN.md`
- **Test Harness**: `/test-universal-card`
- **Configuration Schema**: `/src/config/cards/schema.js`
- **Example Config**: See `EXAMPLE_CONFIG` in schema.js
