# Universal Info Card System - Complete Implementation Plan

**Project**: 4Tracks Office Management System - Card System Refactoring
**Started**: 2025-10-02
**Status**: 🟡 In Progress - Phase 0 (Planning Complete)
**Completion**: 0% (0/11 phases)

---

## 📊 Project Overview

### Goal
Replace all 8 existing card types with a single, configuration-driven Universal Card System built from scratch using modern component libraries.

### Approach
- ✅ **Build from zero** - No reuse of custom components
- ✅ **Modern stack** - shadcn/ui + MUI DataGrid/DatePicker + Tailwind
- ✅ **Configuration-driven** - Each card defined by a config file
- ✅ **Incremental** - Build tab-by-tab, test thoroughly
- ✅ **100% feature parity** - All functionality preserved

### Cards to Replace
1. **DriverCard** (10 tabs) - Most complex
2. **TruckCard** (2 tabs) - Test card
3. **EquipmentCard** (2 tabs)
4. **EmployeeCard** (4 tabs)
5. **IncidentCard** (5 tabs)
6. **ViolationCard** (4 tabs)
7. **WCBCard** (1 tab)
8. **DriverReportCard** (1 tab)

---

## 🔍 Deep Component Analysis

### 1. Checklist System Analysis

#### Current Implementation Components
- `CheckListField.js` (722 lines) - Main checklist item component
- `CheckListFieldFrame.js` (19 lines) - UI wrapper
- `DriverChecklist.js` - Driver-specific checklist
- `TruckChecklist.js` - Truck-specific checklist
- `EquipmentChecklist.js` - Equipment-specific checklist
- `EmployeeChecklist.js` - Employee-specific checklist

#### Checklist Item Types (3 distinct types)

**Type 1: File-Based Items** (Most common)
- Upload files with metadata
- Fields vary by document type (12+ combinations):
  - `issueDate` - licenses, abstracts, certificates, road_tests, tax_papers, driver_statements
  - `expiryDate` - immigration_doc, pdic_certificates, licenses, tdg_cards, good_to_go_cards, lcv_licenses, truck_safety_docs, equipment_safety_docs, truck_registration_docs, equipment_registration_docs
  - `comment` - log_books, tax_papers, driver_statements, other_documents, truck_other_documents, equipment_other_documents, certificates_of_violations, claim_documents, violation_documents, inspection_documents, ticket_documents, id_documents
  - `number` (SIN only) - sin (must be 9 digits, formatted)
  - `file2` - licenses (front + back)
  - `numberAny` - licenses (dl_number), incorp_docs, gst_docs
  - `dLProvince` - licenses (Canadian province dropdown)
  - `dateOfReview` - annual_performance_reviews
  - `dateOfCompletion` - winter_courses
  - `company` - reference_checks
  - `textField` - truck_license_plates, equipment_license_plates (plate_number)
  - `fileOff` - truck_license_plates, equipment_license_plates (no file upload)

**Type 2: Data-Only Items** (No file upload)
- `activity_history` - Employment history with gap detection
- `driver_background` - Background information
- `truck_license_plates` - Plate numbers with expiry
- `equipment_license_plates` - Plate numbers with expiry
- `driver_rates` - Special rate display (no upload)

**Type 3: Rate Items** (Special handling)
- `driver_rates` - Display only, uses UpdateRatesContainer
- Shows: ca_single, ca_team, us_team, city, lcv_single, lcv_team

#### Critical Functionality Requirements

**1. Checkmark System** 🔴 CRITICAL
```js
// API: PATCH to apiRoute
{
  endpointIdentifier: 'licenses',
  id: 123,
  was_reviewed: true/false,  // Toggle
  last_reviewed_by: 'John Doe',
  changed_by: 'John Doe'
}
```
- Checkbox icon (checked/unchecked)
- Updates `was_reviewed` field
- Displays `last_reviewed_by` name
- Disabled if no file uploaded

**2. File Upload System** 🔴 CRITICAL
```js
// API: POST to apiRoute
FormData {
  [dataType]: driverId,  // 'driver', 'truck', 'equipment', 'employee'
  endpointIdentifier: 'licenses',
  file: File (compressed),
  file2: File (optional),
  // + conditional fields based on document type
  last_changed_by: 'John Doe',
  updated_by: 'John Doe'
}
```
- Opens FileLoaderSm modal
- Compresses images automatically
- Converts HEIC → JPEG
- Validates required fields
- Shows success message

**3. Edit File** 🟡 IMPORTANT
- Available for specific document types only:
  - road_tests, log_books, sin, immigration_doc, incorp_docs, gst_docs
  - pdic_certificates, tax_papers, driver_statements, other_documents
  - licenses, abstracts, tdg_cards, good_to_go_cards
  - lcv_certificates, lcv_licenses, certificates_of_violations
  - annual_performance_reviews, winter_courses, reference_checks, activity_history
- Opens CreateObject modal with existing data
- Resets `was_reviewed` to false on edit
- Role-based access (safety, admin, recruiting for type 1 checklists)

**4. Delete File** 🟡 IMPORTANT
```js
// API: DELETE to apiRoute
{
  endpointIdentifier: 'licenses',
  id: 123,
  changed_by: 'John Doe',
  username: 'John Doe'
}
```
- Confirmation modal
- Cannot delete: activity_history, driver_rates, driver_background

**5. View Files Modal** 🟡 IMPORTANT
- Shows all versions sorted by date/id (newest first)
- Displays filename or metadata (dl_number, number, comment, company)
- Shows dates (issue_date, expiry_date, date_of_review, date_of_completion)
- Links to file download
- Role-based filtering (e.g., rates only for payroll/HR)

**6. Activity History Special Features** 🟢 NICE-TO-HAVE
- Gap detection (checks for employment gaps > X years)
- Shows warning icon if gaps exist
- Tooltip shows gap details
- Special edit modal (ActivityHistoryContainer)

**7. Visual Indicators**
- Red solid circle (⚫) - Required, missing
- Red hollow circle (○) - Optional, missing
- No indicator - File exists
- Exclamation icon (❗) - Activity history gaps

**8. Progress Tracking**
- "All Checked" indicator when all items reviewed
- Message display when complete
- Some checklists have custom completion logic

#### Configuration Schema for Checklist Items

```js
{
  key: 'licenses',  // Unique identifier
  label: 'Driver Licenses',  // Display name
  optional: false,  // Required vs optional indicator

  // Item type determines behavior
  itemType: 'file' | 'data' | 'rate',

  // File upload configuration (for itemType: 'file')
  fileUpload: {
    accept: 'image/*,application/pdf',
    allowMultiple: false,  // or true for file2
    immediate: true,  // Upload immediately vs form attachment
    fields: [
      { type: 'issueDate', required: true },
      { type: 'expiryDate', required: true },
      { type: 'dl_number', label: 'License Number', required: true },
      { type: 'dl_province', options: 'CANADIAN_PROVINCES', required: true },
      { type: 'file2', label: 'Back of License', required: false }
    ]
  },

  // Actions configuration
  actions: {
    checkable: true,  // Show checkbox
    editable: true,   // Show edit button (role-based)
    deletable: true   // Show delete button
  },

  // Role restrictions
  roles: {
    view: ['all'],
    edit: ['safety', 'admin', 'recruiting'],  // checklistType dependent
    delete: ['safety', 'admin']
  },

  // Special behaviors
  special: {
    activityHistory: false,  // Enable gap detection
    ratesDisplay: false,     // Use UpdateRatesContainer
    customValidator: null    // Custom validation function
  }
}
```

---

### 2. File Loader System Analysis

#### Current Implementations (4 variants)

**FileLoaderSm.js** (369 lines) - Most common
- **Mode**: Immediate upload
- **Files**: Single or dual (file + file2)
- **Usage**: Checklist items, card file sections
- **Features**: All 12+ conditional fields

**FileLoader.js** (368 lines) - Form attachment
- **Mode**: Attach to form, submit later
- **Files**: Single or dual
- **Usage**: Create object forms
- **Features**: All conditional fields + warning state

**FileLoaderMultiple.js** (129 lines) - Bulk upload
- **Mode**: Immediate upload
- **Files**: Multiple files at once
- **Usage**: Adding multiple documents simultaneously
- **Features**: Compression for all files

**FileLoaderMultipleM.js** - Variant (not analyzed in detail)

#### File Processing Pipeline

**1. File Selection**
```js
handleFileChange(event) {
  const file = event.target.files[0];

  // Step 1: HEIC conversion (if needed)
  if (file.type === 'image/heic' || file.type === 'image/heif') {
    processedFile = await convertHeicToJpeg(file);
  }

  // Step 2: Image compression
  if (file.type.startsWith('image/')) {
    processedFile = await compressFile(processedFile);
  }

  // Step 3: Store in state
  setFile(processedFile);
}
```

**2. Upload Process**
```js
// Build FormData
const data = new FormData();
data.append(dataType, entityId);  // 'driver', 'truck', etc.
data.append('endpointIdentifier', keyName);
data.append('file', file);
data.append('last_changed_by', username);
data.append('updated_by', username);

// Add conditional fields
if (issueDateOn) data.append('issue_date', fileIssueDate);
if (expiryDateOn) data.append('expiry_date', fileExpiryDate);
// ... 10+ more conditional fields

// POST to API
fetch(apiRoute, { method: 'POST', body: data });
```

**3. Validation Logic**
```js
// Submit button disabled unless all required fields filled
submitAvailable = true;

if (issueDateOn && !fileIssueDate) submitAvailable = false;
if (expiryDateOn && !fileExpiryDate) submitAvailable = false;
if (!fileOff && !file) submitAvailable = false;
// ... check all conditional fields

// Special cases
if (keyName === 'sin' && number.length !== 9) submitAvailable = false;
```

#### Conditional Field System (12+ field types)

| Field Type | Trigger Keys | Component | Validation |
|------------|--------------|-----------|------------|
| `issueDate` | road_tests, tax_papers, driver_statements, licenses, abstracts, lcv_certificates, good_to_go_cards, certificates_of_violations, truck_bill_of_sales, equipment_bill_of_sales | MUI DatePicker | Required if on |
| `expiryDate` | immigration_doc, pdic_certificates, licenses, tdg_cards, good_to_go_cards, lcv_licenses, truck_safety_docs, equipment_safety_docs, truck_registration_docs, equipment_registration_docs | MUI DatePicker | Required if on |
| `comment` | log_books, tax_papers, driver_statements, other_documents, truck_other_documents, equipment_other_documents, certificates_of_violations, claim_documents, violation_documents, inspection_documents, ticket_documents, id_documents, wcbclaim_documents | TextInput | Required if on |
| `number` (SIN) | sin | NumericInput (formatted, max 9) | Must be 9 digits |
| `file` | All except fileOff items | File input | Required unless fileOff |
| `file2` | licenses | File input (2nd file) | Optional |
| `numberAny` | licenses (dl_number), incorp_docs, gst_docs | TextInput | Required if on |
| `dLProvince` | licenses | OptionsSelector (CANADIAN_PROVINCES) | Required if on |
| `dateOfReview` | annual_performance_reviews | MUI DatePicker | Required if on, stored as issue_date |
| `dateOfCompletion` | winter_courses | MUI DatePicker | Required if on, stored as issue_date |
| `company` | reference_checks | TextInput | Required if on |
| `textField` | truck_license_plates, equipment_license_plates | TextInput (plate_number) | Required if on |
| `fileOff` | truck_license_plates, equipment_license_plates | N/A - removes file input | N/A |

#### Configuration Schema for File Uploader

```js
{
  // Upload mode
  mode: 'immediate' | 'form-attached',

  // Entity context
  entityType: 'driver' | 'truck' | 'equipment' | 'employee' | 'incident' | 'violation' | 'wcb',
  entityId: 123,

  // File constraints
  accept: 'image/*,application/pdf',
  multiple: false,

  // Field configuration (array of field configs)
  fields: [
    { type: 'issueDate', required: true, label: 'Issue Date' },
    { type: 'expiryDate', required: true, label: 'Expiry Date' },
    { type: 'comment', required: false, label: 'Comment' },
    // ... more fields
  ],

  // API configuration
  apiRoute: '/api/update-file',
  endpointIdentifier: 'licenses',  // The document type

  // Callbacks
  onSuccess: (response) => {},
  onError: (error) => {},

  // Processing options
  compression: {
    enabled: true,
    maxWidth: 1920,
    maxHeight: 1920,
    quality: 0.8
  },

  heicConversion: {
    enabled: true
  }
}
```

#### New Universal FileUploader Component Spec

**Component**: `/components/file-loader/FileUploader.jsx`

**Props**:
```typescript
interface FileUploaderProps {
  config: FileUploaderConfig;
  onClose: () => void;
  open: boolean;
}
```

**Features**:
- Single component handles all 4 current variants
- Configuration-driven field rendering
- Automatic file processing (HEIC, compression)
- Validation state management
- Success/error handling
- Both immediate and form-attached modes

**Sub-components**:
```
FileUploader/
├── FileUploader.jsx         # Main component (shadcn Dialog)
├── FileInput.jsx            # File input with drag & drop
├── ConditionalFields.jsx    # Renders fields based on config
├── FilePreview.jsx          # Shows uploaded files
├── ValidationMessage.jsx    # Error/warning display
└── ProgressIndicator.jsx    # Upload progress
```

---

### 3. Log System Analysis

#### Current Implementations (2 patterns)

**Pattern 1: MUI DataGrid** (DriverLogComponent.js - 171 lines)
- Uses `@mui/x-data-grid-pro`
- Column definitions from `/data/tables/drivers.js` (DRIVER_LOG_COLUMNS)
- Compact density
- Disabled column menu, footer hidden
- Auto-height with flex-grow container

**Pattern 2: Virtual Scroll** (EmployeeLogComponent.js - 255 lines)
- Uses `@tanstack/react-virtual`
- Custom virtualized rows
- Estimated row height: 35px
- Manual column headers
- Absolute positioning for performance

#### Common Features

**1. Editable Fields Section** (Top of tab)
- 4 editable fields:
  - `status_note` - TextareaInput
  - `remarks_comments` - TextareaInput
  - `reason_for_leaving` - TextareaInput
  - `date_of_leaving` - DateInput
- Save button appears when value differs from server
- Individual save per field

**2. Change Log Display**
- Columns: Field Name, Old Value, New Value, Changed By, Timestamp
- Sorted by ID desc (newest first)
- Fetched from dedicated API endpoint:
  - Driver: `/api/get-driver-log/{id}`
  - Employee: `/api/get-employee-log/{id}`
  - Incident: `/api/get-incident-log/{id}` (assumed)
  - Violation: `/api/get-violation-log/{id}` (assumed)

**3. Save Logic**
```js
// PATCH to /api/upload-{entity}-data/{id}
FormData {
  [fieldKey]: newValue,
  changed_by: username
}
```

#### Configuration Schema for Log Tab

```js
{
  type: 'log',

  // Editable fields at top
  editableFields: [
    {
      key: 'status_note',
      label: 'Status Note',
      type: 'textarea',
      style: 'compact'
    },
    {
      key: 'remarks_comments',
      label: 'Remarks',
      type: 'textarea',
      style: 'compact'
    },
    {
      key: 'reason_for_leaving',
      label: 'Reason For Leaving',
      type: 'textarea',
      style: 'compact'
    },
    {
      key: 'date_of_leaving',
      label: 'Leaving Date',
      type: 'date',
      style: 'minimalistic'
    }
  ],

  // Change log configuration
  changeLog: {
    apiEndpoint: '/api/get-driver-log',
    updateEndpoint: '/api/upload-driver-data',

    // Display mode
    displayMode: 'datagrid' | 'virtual',  // Auto-select based on data size?

    columns: [
      { field: 'field_name', headerName: 'Field Name', width: 200 },
      { field: 'old_value', headerName: 'Old Value', width: 150 },
      { field: 'new_value', headerName: 'New Value', width: 150 },
      { field: 'changed_by', headerName: 'Changed By', width: 200 },
      { field: 'timestamp', headerName: 'Timestamp', width: 180,
        valueFormatter: (value) => moment(value).format('DD MMM YYYY, hh:mm') }
    ]
  }
}
```

#### New Universal LogTab Component Spec

**Component**: `/components/tabs/log/LogTab.jsx`

**Sub-components**:
```
LogTab/
├── LogTab.jsx               # Main container
├── EditableFields.jsx       # Top editable section
├── EditableField.jsx        # Single field with save button
├── LogTable.jsx             # DataGrid wrapper
└── LogTableVirtual.jsx      # Virtual scroll alternative
```

---

### 4. General Info Tab Analysis

#### Current Pattern

Each entity has 3 components:
1. **{Entity}CardInfo.js** - Main info display with actions (200-600 lines)
2. **{Entity}CardData.js** - Layout wrapper with file sections (50-100 lines)
3. **{Entity}CardFiles.js** - Collapsible file groups (100-200 lines)

#### Key Components Used

**InfoCardField.js** (19 lines) - Simple display
```js
<InfoCardField
  label="Driver ID"
  value="12345"
  side={<Button ... />}  // Optional action buttons
  valueType="date_time"  // Optional date formatting
/>
```

**InfoCardFieldFile.js** (507 lines) - File row with actions
- Display file name/metadata
- Upload button (opens FileLoaderSm)
- Delete button (opens confirmation modal)
- View all versions modal
- Missing indicator (red circle)
- Role-based button visibility

**{Entity}CardFiles.js** - Collapsible sections
- Uses `framer-motion` for expand/collapse
- Groups related documents
- Shows latest dates
- Modal for viewing all versions
- Role-based filtering (e.g., payroll rates)

#### Common Features

**1. Field Display**
- Label + value pairs
- Border-bottom separator
- Optional side buttons
- Date formatting (moment.js)
- Status badges with colors
- Clickable values (phone, email, copy)

**2. Inline Editing**
- Click edit icon
- Fields become editable
- Save/Cancel buttons appear
- Validation
- PATCH to API

**3. Action Buttons**
- Copy data (phone, email, postal code)
- Call phone number
- Send email
- Open related cards
- Upload photo
- Edit/Delete entity

**4. Status Management**
- Dropdown to change status
- Conditional modals (e.g., leaving date for terminated)
- Background color based on status
- Status note field
- Update message system

**5. File Sections**
- Grouped by category (Docs & Dates, Hiring Docs, Payroll Docs)
- Collapsible with expand/collapse animation
- Latest date display
- Upload/View/Delete actions
- Role-based visibility

#### Configuration Schema for General Info Tab

```js
{
  type: 'general-info',

  // Field sections
  sections: [
    {
      title: 'Basic Information',
      collapsible: false,
      fields: [
        {
          key: 'unit_number',
          label: 'Unit #',
          type: 'text',
          editable: true,
          required: true,
          width: 'full' | 'half' | 'third'
        },
        {
          key: 'status',
          label: 'Status',
          type: 'badge',
          editable: true,
          colorMap: {
            AC: 'green',
            IN: 'yellow',
            RE: 'red'
          },
          onChange: (newValue) => {
            // Custom logic for status changes
          }
        },
        {
          key: 'phone',
          label: 'Phone',
          type: 'phone',
          editable: true,
          actions: ['call', 'copy']
        },
        {
          key: 'email',
          label: 'Email',
          type: 'email',
          editable: true,
          actions: ['send', 'copy']
        }
      ]
    }
  ],

  // File sections
  fileSections: [
    {
      title: 'Docs & Dates',
      collapsible: true,
      defaultOpen: false,
      groups: [
        {
          key: 'truck_license_plates',
          label: 'License Plate',
          hasExpiry: true,
          showLatestDate: true,
          actions: ['upload', 'view', 'delete']
        }
      ]
    }
  ],

  // Action buttons (top/bottom)
  actions: {
    top: [
      { type: 'edit', label: 'Edit', icon: 'faPenToSquare' },
      { type: 'delete', label: 'Delete', icon: 'faTrashCan', confirm: true }
    ],
    bottom: []
  },

  // API configuration
  api: {
    updateEndpoint: '/api/upload-truck-data',
    deleteEndpoint: '/api/delete-truck'
  },

  // Role restrictions
  roles: {
    view: ['all'],
    edit: ['safety', 'admin'],
    delete: ['admin']
  }
}
```

#### New Universal GeneralInfoTab Component Spec

**Component**: `/components/tabs/general-info/GeneralInfoTab.jsx`

**Sub-components**:
```
GeneralInfoTab/
├── GeneralInfoTab.jsx       # Main container
├── InfoSection.jsx          # Field group section (shadcn Card)
├── InfoField.jsx            # Single field display/edit
├── InfoFieldEditable.jsx    # Editable field with save/cancel
├── StatusBadge.jsx          # Colored status indicator (shadcn Badge)
├── FileSection.jsx          # Collapsible file group (shadcn Accordion)
├── FileRow.jsx              # Single file item with actions
├── ActionButtons.jsx        # Top/bottom action bar
└── FieldActions.jsx         # Field-specific actions (call, email, copy)
```

---

### 5. List Tab Analysis

#### Current Pattern

Related entity lists displayed in DataGrid:
- **TrucksList** - Driver's trucks
- **DriversList** - O/O driver's child drivers
- **IncidentsList** - Driver's incidents
- **ViolationsList** - Driver's violations

#### Implementation

Uses MUI DataGrid with existing table column definitions:
```js
// Example: TrucksList
<DataGrid
  rows={trucks}
  columns={TRUCKS_COLUMNS}  // From /data/tables/trucks.js
  onRowClick={(params) => handleOpenTruckCard(params.row.id)}
  density="compact"
  disableRowSelectionOnClick
  disableColumnMenu
/>
```

#### Features

**1. Data Fetching**
- From context provider (e.g., TrucksDriversProvider)
- Filtered by parent entity (e.g., driver_id)
- Auto-refresh on context update

**2. Row Click**
- Opens related card modal
- Uses `handleCardDataSet(id, type)` from InfoCardContext
- Navigation between cards

**3. Conditional Display**
- Tab only visible if data exists
- Role-based visibility
- Empty state handling

#### Configuration Schema for List Tab

```js
{
  type: 'list',

  // Entity configuration
  entityType: 'trucks',  // Determines columns to use

  // Data source
  dataSource: {
    context: 'TrucksDriversContext',
    dataKey: 'trucks',  // Key in context data
    filterBy: {
      field: 'driver_id',
      value: '{parentEntityId}'  // Interpolated
    }
  },

  // Table configuration
  table: {
    columns: 'TRUCKS_COLUMNS',  // Reference to column definition
    density: 'compact',
    onRowClick: {
      action: 'openCard',
      cardType: 'truck',
      idField: 'id'
    }
  },

  // Visibility
  visibility: {
    condition: (data) => data.length > 0,
    roles: ['safety', 'admin', 'planner']
  },

  // Empty state
  emptyState: {
    message: 'No trucks assigned',
    icon: 'faTruck'
  }
}
```

#### New Universal ListTab Component Spec

**Component**: `/components/tabs/list/ListTab.jsx`

**Sub-components**:
```
ListTab/
├── ListTab.jsx              # Main container
├── EntityDataGrid.jsx       # MUI DataGrid wrapper
└── EmptyState.jsx           # No data message
```

**Very simple implementation** - mostly wrapper around MUI DataGrid.

---

### 6. Time Card Tab Analysis

#### Current Pattern

Two implementations:
- **DriverTimeCard** - Driver time tracking
- **EmployeeTimeCard** - Employee time tracking

#### Features (Not fully analyzed - need deeper dive)

- Date range selection
- Time entries display
- Hours calculation
- Export functionality

#### Configuration Schema (Preliminary)

```js
{
  type: 'timecard',

  // Date range configuration
  dateRange: {
    defaultRange: 'currentMonth',
    allowCustom: true
  },

  // Data source
  apiEndpoint: '/api/get-timecard',

  // Display
  columns: [...],  // Time entry columns
  summaryFields: ['total_hours', 'regular_hours', 'overtime_hours'],

  // Export
  exportOptions: {
    formats: ['csv', 'pdf'],
    endpoint: '/api/export-timecard'
  }
}
```

**⚠️ Need to analyze these components in depth before implementation.**

---

### 7. Custom Tab Types Analysis

#### Incident Card - Claims Tabs

**3 claim types:**
- MPI Claims (Manitoba Public Insurance)
- Loblaw Claims
- T/P Info (Third Party)

**Component**: `ClaimDetails.js`

**Features**:
- Display existing claims (filtered by type)
- Add new claim button
- Edit existing claim
- Delete claim (with confirmation)
- Each claim has fields + file checklist
- Uses CreateObject modal system

**Configuration**:
```js
{
  type: 'custom-claims',

  claimType: 'MPI' | 'LL' | 'TP',

  fieldsTemplate: 'MPI_CLAIMS_TEMPLATE_SETTINGS',
  filesTemplate: 'INCIDENT_CHECKLIST',

  api: {
    listEndpoint: '/api/get-claims',
    createEndpoint: '/api/create-claim',
    updateEndpoint: '/api/update-claim',
    deleteEndpoint: '/api/get-claims'  // DELETE method
  },

  objectType: 'claim_mpi' | 'claim_ll' | 'claim_tp'
}
```

#### Violation Card - Details Tabs

**2 detail types:**
- Inspection
- Tickets

**Component**: `ViolationDetails.js`

**Features**:
- Similar to ClaimDetails
- Multiple inspections/tickets per violation
- Add/Edit/Delete functionality
- Uses CreateObject modal

**Configuration**:
```js
{
  type: 'custom-violation-details',

  detailsType: 'inspection' | 'ticket',

  fieldsTemplate: 'INSPECTION_TEMPLATE_SETTINGS' | 'TICKET_TEMPLATE_SETTINGS',
  filesTemplate: 'VIOLATIONS_CHECKLIST',

  api: {
    deleteApi: '/api/get-inspections' | '/api/get-tickets'
  },

  objectType: 'inspection' | 'ticket'
}
```

#### Driver Card - Seals Tab

**Component**: `SealsComponent`

**Features**: (Need to analyze)
- Seal tracking
- Issuance/return
- History

**⚠️ Need to analyze in depth.**

---

## 🏗️ Implementation Phases

### Phase 0: Planning ✅ COMPLETE

**Status**: ✅ Done
**Duration**: 1 day
**Completion**: 100%

**Deliverables**:
- ✅ Deep component analysis
- ✅ Configuration schema design
- ✅ Implementation plan document
- ✅ Todo list created

---

### Phase 1: Foundation (Week 1-2)

**Status**: ✅ Complete
**Duration**: 2 weeks
**Completion**: 100%

**Goal**: Build core infrastructure without any tab content.

#### Tasks

**1.1 Create UniversalCard Component** (2 days)
- File: `/src/app/components/universal-card/UniversalCard.jsx`
- Fixed width container (w-[1024px])
- Dynamic height based on card type
- Tab navigation using shadcn Tabs component
- Tab content area with loading states

**1.2 Build Context Composition Utility** (2 days)
- File: `/src/app/lib/utils/contextComposer.js`
- Function to nest multiple context providers dynamically
- Example:
  ```js
  wrapWithContexts(
    [
      { Component: DriverProvider, props: { userId: 123 } },
      { Component: IncidentsListProvider, props: {} }
    ],
    <CardContent />
  )
  ```

**1.3 Create Configuration System** (2 days)
- File: `/src/config/cards/schema.js` - Schema definition
- File: `/src/config/cards/index.js` - Config loader
- Validation function for configs
- TypeScript types (optional, for documentation)

**1.4 Build Component Registry** (1 day)
- File: `/src/lib/componentRegistry.js`
- Map string names to React components
- Example: `'ChecklistTab' -> <ChecklistTab />`
- Dynamic import support

**1.5 Create Test Harness** (2 days)
- File: `/src/app/test-universal-card/page.js`
- Standalone page for testing UniversalCard
- Config editor (JSON textarea)
- Live preview
- Error display

**1.6 Documentation** (1 day)
- File: `/src/components/universal-card/README.md`
- Usage guide
- Configuration examples
- API reference

**Deliverables**:
- [x] UniversalCard shell component
- [x] Context composition utility
- [x] Configuration system
- [x] Component registry
- [x] Test harness page
- [x] Documentation

**Success Criteria**:
- ✅ UniversalCard renders with mock config
- ✅ Tabs switch correctly
- ✅ Context providers wrap correctly
- ✅ Config validation works
- ✅ Test page functional

---

### Phase 2: File Loader System (Week 3)

**Status**: ✅ Complete
**Duration**: 1 week
**Completion**: 100%

**Goal**: Build universal file uploader - foundation for everything.

**Architecture**: Two-layer configuration system (Universal + Client-Specific)

#### Tasks

**2.1 Create Two-Layer Configuration System** ✅
- Layer 1 (Universal):
  - `/src/config/file-uploader/fieldTypes.js` - Field type registry (10 types)
  - `/src/config/file-uploader/uploaderSchema.js` - Config schema & validation
  - `/src/config/file-uploader/index.js` - Universal loader
- Layer 2 (Client-Specific):
  - `/src/config/clientData.js` - Option lists & validation rules
  - `/src/config/file-uploader/clientUploaders.js` - Document type mappings
  - `/src/config/file-uploader/uploaders/*.uploader.js` - Specific configs

**2.2 Build FileUploader Component** ✅
- `/src/app/components/file-uploader/FileUploader.jsx` - Main component
- shadcn Dialog wrapper
- Configuration-driven field rendering
- Immediate upload mode
- Validation state management

**2.3 Build Field Components** ✅
- `/src/app/components/file-uploader/FieldRenderer.jsx` - Dynamic field rendering
- `/src/app/components/file-uploader/FileInput.jsx` - File input with drag & drop
- `/src/app/components/file-uploader/FilePreview.jsx` - File preview with remove
- Supports: text, number, date, select, textarea, checkbox, file

**2.4 File Processing Utilities** ✅
- `/src/lib/fileProcessing.js` - File utilities
- Reuses existing tested functions (compressFile, convertHeicToJpeg)
- Image compression
- HEIC → JPEG conversion
- File validation (size, type)

**2.5 Create Example Uploader Configs** ✅
- `licenses.uploader.js` - Driver license (complex: 6 fields)
- `sin.uploader.js` - SIN with 9-digit validation
- `licensePlate.uploader.js` - Plate number (no file upload)
- `documents.uploader.js` - Generic documents (3 variants)

**2.6 Build Test Page** ✅
- `/src/app/test-file-uploader/page.js`
- Tests 6 different configurations
- Shows config JSON
- Demonstrates architecture

**Deliverables**:
- [x] Two-layer configuration system
- [x] FileUploader component
- [x] FieldRenderer component
- [x] FileInput component
- [x] FilePreview component
- [x] File processing utilities
- [x] Example uploader configs
- [x] Test page with 6 examples

**Success Criteria**:
- ✅ Upload file immediately (POST to API)
- ✅ All 10+ field types work
- ✅ Compression works (reuses existing code)
- ✅ HEIC conversion works (reuses existing code)
- ✅ Validation prevents invalid submissions
- ✅ Universal/Client separation achieved
- ✅ Easy to customize per client

**Test Scenarios Completed**:
1. ✅ Upload license (6 fields: front/back files, dates, number, province)
2. ✅ Upload SIN (9-digit validation with formatting)
3. ✅ Upload license plate (no file, just plate number + expiry)
4. ✅ Upload tax papers (file + issue date + comment)
5. ✅ Upload immigration doc (file + expiry date)
6. ✅ Upload other documents (file + optional comment)

---

### Phase 3: Checklist Tab Type (Week 4-5) ⭐ MOST CRITICAL

**Status**: 🔴 Not Started
**Duration**: 2 weeks
**Completion**: 0%

**Goal**: Build the most complex tab type with full functionality.

#### Tasks

**3.1 Create ChecklistTab Container** (2 days)
- File: `/src/app/components/tabs/checklist/ChecklistTab.jsx`
- Render checklist items from config
- Progress tracking
- "All Checked" indicator
- Layout with proper spacing

**3.2 Build ChecklistItem Component** (4 days) - **MOST COMPLEX**
- File: `/src/app/components/tabs/checklist/ChecklistItem.jsx`
- Three variants:
  - FileBasedItem - Upload files with metadata
  - DataOnlyItem - Display data, no upload
  - RateItem - Special rate display
- Action buttons:
  - Upload (opens FileUploader)
  - Edit (opens edit modal)
  - Delete (opens confirmation)
  - Checkmark (toggle was_reviewed)
  - View (opens modal with all versions)
- Missing indicators (red circles)
- Last reviewed by display

**3.3 Build Checkmark System** (1 day)
- API integration for checkmark toggle
- PATCH request to update was_reviewed
- Optimistic UI updates
- Error handling

**3.4 Create View Files Modal** (1 day)
- File: `/src/app/components/tabs/checklist/ViewFilesModal.jsx`
- shadcn Dialog
- List all versions (sorted newest first)
- Show metadata (dates, numbers, comments)
- Links to download files
- Role-based filtering

**3.5 Create Activity History Modal** (2 days)
- File: `/src/app/components/tabs/checklist/ActivityHistoryModal.jsx`
- Special modal for activity_history items
- Gap detection logic
- Warning display if gaps found
- Edit functionality

**3.6 Build Progress Component** (1 day)
- File: `/src/app/components/tabs/checklist/ChecklistProgress.jsx`
- shadcn Progress bar
- Percentage complete
- Item counts (checked/total)
- "All Complete" message

**3.7 Integration Testing** (2 days)
- Test with TruckChecklist config (simplest)
- Test with DriverChecklist config (most complex)
- All CRUD operations
- All field combinations
- Role-based access
- Error scenarios

**Deliverables**:
- [ ] ChecklistTab container
- [ ] ChecklistItem (3 variants)
- [ ] Checkmark system
- [ ] ViewFilesModal
- [ ] ActivityHistoryModal
- [ ] ChecklistProgress
- [ ] TruckChecklist config
- [ ] DriverChecklist config (2 checklists)
- [ ] Test results document

**Success Criteria**:
- All checklist items render correctly
- Upload files with all field combinations
- Checkmark toggles work
- Edit/Delete work
- View modal shows all versions
- Progress tracking accurate
- Activity history gap detection works
- TruckCard checklist tab fully functional

**Test Scenarios**:
1. Upload license (most complex - 7 fields)
2. Upload SIN (formatted number, validation)
3. Upload license plate (no file, text field)
4. Toggle checkmark
5. Edit existing document
6. Delete document (with confirmation)
7. View all versions in modal
8. Activity history with gaps
9. Progress bar updates
10. Role-based button visibility

---

### Phase 4: General Info Tab Type (Week 6-7)

**Status**: 🔴 Not Started
**Duration**: 2 weeks
**Completion**: 0%

**Goal**: Build entity details display with inline editing.

#### Tasks

**4.1 Create GeneralInfoTab Container** (1 day)
- File: `/src/app/components/tabs/general-info/GeneralInfoTab.jsx`
- Scroll container
- Section layout
- Action buttons area

**4.2 Build InfoSection Component** (1 day)
- File: `/src/app/components/tabs/general-info/InfoSection.jsx`
- shadcn Card wrapper
- Section title
- Field grid layout
- Collapsible option

**4.3 Build InfoField Component** (3 days)
- File: `/src/app/components/tabs/general-info/InfoField.jsx`
- Display mode: label + value
- Edit mode: label + input + save/cancel
- Field types:
  - text, number, email, phone, url
  - date, datetime
  - select, multi-select
  - textarea
  - badge (status)
  - boolean (switch)
- Action buttons (call, email, copy)
- Validation

**4.4 Build StatusBadge Component** (1 day)
- File: `/src/app/components/tabs/general-info/StatusBadge.jsx`
- shadcn Badge with color mapping
- Editable (dropdown to change)
- Conditional modals on change (e.g., leaving date)
- Status-based background color

**4.5 Build FileSection Component** (2 days)
- File: `/src/app/components/tabs/general-info/FileSection.jsx`
- shadcn Accordion (collapsible)
- File groups inside
- Latest date display
- Expand/collapse animation

**4.6 Build FileRow Component** (2 days)
- File: `/src/app/components/tabs/general-info/FileRow.jsx`
- Display file metadata
- Action buttons: Upload, View, Delete
- Missing indicator
- Click to view all versions

**4.7 Build ActionButtons Component** (1 day)
- File: `/src/app/components/tabs/general-info/ActionButtons.jsx`
- Top/bottom action bar
- Configurable buttons
- Role-based visibility
- Confirmation modals for destructive actions

**4.8 Integration Testing** (2 days)
- Test with TruckCard general tab
- All field types
- Inline editing
- File sections
- Action buttons
- Role-based access

**Deliverables**:
- [ ] GeneralInfoTab container
- [ ] InfoSection component
- [ ] InfoField (all types)
- [ ] StatusBadge
- [ ] FileSection
- [ ] FileRow
- [ ] ActionButtons
- [ ] TruckCard general-info config
- [ ] Test results document

**Success Criteria**:
- All field types display correctly
- Inline editing works
- Status badge changes trigger modals
- File sections collapsible
- File actions work (upload, view, delete)
- Action buttons appear based on roles
- TruckCard main tab fully functional

**Test Scenarios**:
1. Display all field types
2. Edit text field, save
3. Edit select field, save
4. Change status (triggers modal)
5. Copy phone number
6. Call phone number
7. Send email
8. Expand/collapse file section
9. Upload file to section
10. View all file versions
11. Delete file
12. Role-based button visibility

---

### Phase 5: Log Tab Type (Week 8)

**Status**: 🔴 Not Started
**Duration**: 1 week
**Completion**: 0%

**Goal**: Build activity history and notes tab.

#### Tasks

**5.1 Create LogTab Container** (1 day)
- File: `/src/app/components/tabs/log/LogTab.jsx`
- Editable fields section at top
- Change log table below
- Layout with flex

**5.2 Build EditableFields Component** (2 days)
- File: `/src/app/components/tabs/log/EditableFields.jsx`
- Render configured fields
- Textarea for text fields (shadcn Textarea)
- Date picker for date fields (MUI DatePicker)
- Save button appears on change
- Individual save per field

**5.3 Build LogTable Component** (2 days)
- File: `/src/app/components/tabs/log/LogTable.jsx`
- MUI DataGrid wrapper
- Column configuration from config
- Compact density
- Auto-height
- Date formatting

**5.4 Integration Testing** (1 day)
- Test with DriverCard Notes tab
- Test with EmployeeCard Notes tab
- Edit fields, save
- View change history
- Sorting, filtering

**Deliverables**:
- [ ] LogTab container
- [ ] EditableFields component
- [ ] LogTable component
- [ ] DriverCard log config
- [ ] EmployeeCard log config
- [ ] Test results document

**Success Criteria**:
- Editable fields display correctly
- Save button appears on change
- Individual field save works
- Change log loads from API
- Table displays correctly
- Date formatting correct
- DriverCard Notes tab fully functional

**Test Scenarios**:
1. Display editable fields
2. Edit status_note, save
3. Edit remarks, save
4. Edit leaving date, save
5. View change history
6. Sort by timestamp
7. Filter by field name

---

### Phase 6: List Tab Type (Week 9)

**Status**: 🔴 Not Started
**Duration**: 1 week
**Completion**: 0%

**Goal**: Build related entities list display.

#### Tasks

**6.1 Create ListTab Container** (1 day)
- File: `/src/app/components/tabs/list/ListTab.jsx`
- Fetch data from context
- Filter by parent entity
- Error handling
- Empty state

**6.2 Build EntityDataGrid Component** (2 days)
- File: `/src/app/components/tabs/list/EntityDataGrid.jsx`
- MUI DataGrid wrapper
- Column definitions from config
- Row click to open card
- Density, styling
- Loading state

**6.3 Build EmptyState Component** (1 day)
- File: `/src/app/components/tabs/list/EmptyState.jsx`
- Icon + message
- shadcn Card
- Centered layout

**6.4 Integration Testing** (2 days)
- Test with DriverCard Trucks tab
- Test with DriverCard O/O Drivers tab
- Test with DriverCard Incidents tab
- Test with DriverCard Violations tab
- Row click opens correct card
- Empty state displays

**Deliverables**:
- [ ] ListTab container
- [ ] EntityDataGrid component
- [ ] EmptyState component
- [ ] List tab configs (4 types)
- [ ] Test results document

**Success Criteria**:
- Data loads from context
- Table displays correctly
- Row click opens card
- Empty state shows when no data
- All 4 list tabs in DriverCard functional

**Test Scenarios**:
1. DriverCard Trucks tab with data
2. DriverCard Trucks tab empty
3. Click truck row, opens TruckCard
4. DriverCard O/O Drivers tab
5. Click driver row, opens DriverCard
6. DriverCard Incidents tab
7. Click incident row, opens IncidentCard
8. DriverCard Violations tab
9. Click violation row, opens ViolationCard

---

### Phase 7: Time Card Tab Type (Week 10)

**Status**: 🔴 Not Started
**Duration**: 1 week
**Completion**: 0%

**Goal**: Build time tracking interface.

**⚠️ NEED TO ANALYZE EXISTING COMPONENTS FIRST**

#### Preliminary Tasks

**7.1 Analyze Existing Components** (1 day)
- Read DriverTimeCard.js fully
- Read EmployeeTimeCard.js fully
- Document all features
- Document API endpoints
- Create detailed spec

**7.2-7.7 TBD** (Based on analysis)

**Deliverables**:
- [ ] Analysis document
- [ ] TimeCardTab components
- [ ] Test results

---

### Phase 8: Custom Tab Types (Week 11)

**Status**: 🔴 Not Started
**Duration**: 1 week
**Completion**: 0%

**Goal**: Build specialized tabs.

**⚠️ NEED TO ANALYZE EXISTING COMPONENTS FIRST**

#### Preliminary Tasks

**8.1 Analyze Existing Components** (2 days)
- Read ClaimDetails.js fully
- Read ViolationDetails.js fully
- Read SealsComponent.js fully
- Document all features
- Create detailed specs

**8.2-8.7 TBD** (Based on analysis)

**Deliverables**:
- [ ] Analysis documents
- [ ] ClaimsTab component
- [ ] ViolationDetailsTab component
- [ ] SealsTab component
- [ ] Test results

---

### Phase 9: Create Card Configurations (Week 12)

**Status**: 🔴 Not Started
**Duration**: 1 week
**Completion**: 0%

**Goal**: Write config files for all 8 cards.

#### Tasks

**9.1 TruckCard Config** (1 day)
- File: `/src/config/cards/truckCard.config.js`
- 2 tabs: General Info, Checklist
- Test with actual data
- Verify all features work

**9.2 EquipmentCard Config** (1 day)
- File: `/src/config/cards/equipmentCard.config.js`
- Similar to TruckCard
- Test with actual data

**9.3 EmployeeCard Config** (1 day)
- File: `/src/config/cards/employeeCard.config.js`
- 4 tabs: General Info, Checklist, Notes, Time Card
- Test with actual data

**9.4 WCBCard Config** (1 day)
- File: `/src/config/cards/wcbCard.config.js`
- 1 tab: General Info
- Test with actual data

**9.5 DriverReportCard Config** (1 day)
- File: `/src/config/cards/driverReportCard.config.js`
- 1 tab: General Info
- Test with actual data

**9.6 ViolationCard Config** (1 day)
- File: `/src/config/cards/violationCard.config.js`
- 4 tabs: General Info, Inspection, Tickets, Log
- Test with actual data

**9.7 IncidentCard Config** (1 day)
- File: `/src/config/cards/incidentCard.config.js`
- 5 tabs: General Info, MPI Claims, Loblaw Claims, T/P Info, Log
- Test with actual data

**9.8 DriverCard Config** (2 days) - **MOST COMPLEX**
- File: `/src/config/cards/driverCard.config.js`
- 10 tabs: General Info, 2 Checklists, Notes, Trucks, O/O Drivers, Incidents, Violations, Time Card, Seals
- Test with actual data
- All features must work

**Deliverables**:
- [ ] 8 card configuration files
- [ ] All cards tested with actual data
- [ ] Configuration documentation

**Success Criteria**:
- All 8 cards render correctly
- All tabs functional
- All features working
- No regressions

---

### Phase 10: Testing & Migration (Week 13-14)

**Status**: 🔴 Not Started
**Duration**: 2 weeks
**Completion**: 0%

**Goal**: Full testing and migration to production.

#### Tasks

**10.1 Unit Testing** (2 days)
- Write tests for each tab type
- Test all components
- Test file processing
- Test validation
- Test API integration

**10.2 Integration Testing** (2 days)
- Test complete card flows
- Test card-to-card navigation
- Test context interactions
- Test all 8 user roles
- Test error scenarios

**10.3 Performance Testing** (1 day)
- Large data sets
- Multiple cards open
- File upload performance
- Memory leaks
- Bundle size analysis

**10.4 Accessibility Testing** (1 day)
- Keyboard navigation
- Screen reader compatibility
- Focus management
- ARIA labels
- Color contrast

**10.5 Migration Plan** (1 day)
- Create migration checklist
- Define rollback procedure
- Set up feature flag
- Communication plan

**10.6 Parallel Deployment** (3 days)
- Deploy UniversalCard alongside old cards
- Use feature flag to toggle
- Monitor errors
- Gather feedback
- Fix bugs

**10.7 Full Migration** (2 days)
- Enable UniversalCard for all users
- Monitor closely
- Quick response to issues

**10.8 Cleanup** (2 days)
- Delete old card components
- Delete old file loader components
- Delete old checklist components
- Delete old log components
- Update imports throughout codebase
- Update documentation

**Deliverables**:
- [ ] Test suite
- [ ] Test results document
- [ ] Performance report
- [ ] Accessibility report
- [ ] Migration checklist
- [ ] Rollback procedure
- [ ] Old components deleted
- [ ] Updated documentation

**Success Criteria**:
- All tests pass
- Performance equal or better
- Accessibility compliant
- Zero regressions
- All old components removed
- Clean codebase

**Components to Delete**:
```
/components/driverCard/
/components/truckCard/
/components/equipmentCard/
/components/employeeCard/
/components/incidentCard/
/components/violationCard/
/components/wcbCard/
/components/driverReportCard/

/components/driverCardInfo/
/components/truckCardInfo/
/components/equipmentCardInfo/
/components/employeeCardInfo/
/components/incidentCardInfo/
/components/violationCardInfo/
/components/wcbCardInfo/
/components/driverReportCardInfo/

/components/driverCardData/
/components/truckCardData/
/components/equipmentCardData/
/components/employeeCardData/
/components/incidentCardData/
/components/violationCardData/
/components/wcbCardData/
/components/driverReportCardData/

/components/driverCardFiles/
/components/truckCardFiles/
/components/equipmentCardFiles/
/components/employeeCardFiles/

/components/checklistField/
/components/checklist/

/components/fileLoader/FileLoader.js
/components/fileLoader/FileLoaderSm.js
/components/fileLoader/FileLoaderMultiple.js
/components/fileLoader/FileLoaderMultipleM.js

/components/logComponent/DriverLogComponent.js
/components/logComponent/EmployeeLogComponent.js
/components/logComponent/IncidentLogComponent.js
/components/logComponent/ViolationLogComponent.js

/components/infoCardField/InfoCardField.js
/components/infoCardField/InfoCardFieldFile.js

/components/infoCardTabs/InfoCardTabs.js (replaced by shadcn Tabs)
```

**Estimated LOC Reduction**: ~15,000 lines → ~5,000 lines

---

## 📊 Progress Tracking

### Overall Completion: 20%

| Phase | Status | Completion | Duration | Start Date | End Date |
|-------|--------|------------|----------|------------|----------|
| 0. Planning | ✅ Done | 100% | 1 day | 2025-10-02 | 2025-10-02 |
| 1. Foundation | ✅ Done | 100% | 2 weeks | 2025-10-02 | 2025-10-03 |
| 2. File Loader | ✅ Done | 100% | 1 week | 2025-10-03 | 2025-10-03 |
| 3. Checklist Tab | 🔴 Not Started | 0% | 2 weeks | TBD | TBD |
| 4. General Info Tab | 🔴 Not Started | 0% | 2 weeks | TBD | TBD |
| 5. Log Tab | 🔴 Not Started | 0% | 1 week | TBD | TBD |
| 6. List Tab | 🔴 Not Started | 0% | 1 week | TBD | TBD |
| 7. Time Card Tab | 🔴 Not Started | 0% | 1 week | TBD | TBD |
| 8. Custom Tabs | 🔴 Not Started | 0% | 1 week | TBD | TBD |
| 9. Configurations | 🔴 Not Started | 0% | 1 week | TBD | TBD |
| 10. Testing & Migration | 🔴 Not Started | 0% | 2 weeks | TBD | TBD |

### Key Milestones

- [x] **M1**: Foundation complete, UniversalCard renders
- [x] **M2**: FileUploader complete, all field types working
- [ ] **M3**: ChecklistTab complete, TruckCard checklist functional
- [ ] **M4**: GeneralInfoTab complete, TruckCard main tab functional
- [ ] **M5**: TruckCard 100% functional (first complete card)
- [ ] **M6**: All tab types complete
- [ ] **M7**: All 8 card configs complete
- [ ] **M8**: All tests passing
- [ ] **M9**: Production deployment
- [ ] **M10**: Old components deleted, project complete

---

## 📚 Reference Documentation

### Technology Stack

**UI Components**:
- [shadcn/ui](https://ui.shadcn.com/) - Primary UI library
  - Button, Input, Select, Textarea, Dialog, Card, Badge, Tabs, Separator, ScrollArea, Checkbox, Switch, Progress, Accordion
- [MUI](https://mui.com/) - Limited use
  - DataGrid (x-data-grid-pro)
  - DatePicker (LocalizationProvider, DatePicker)
- [Radix UI](https://www.radix-ui.com/) - Via shadcn primitives
- [Tailwind CSS](https://tailwindcss.com/) - Styling

**Other Libraries**:
- React 18
- Next.js 14
- moment-timezone - Date formatting
- framer-motion - Animations (optional, only if needed)
- heic2any - HEIC conversion
- browser-image-compression - Image compression
- copy-to-clipboard - Copy functionality

### API Endpoints

**File Management**:
- `POST /api/update-file` - Upload file with metadata
- `PATCH /api/update-file` - Update file metadata (checkmark, etc.)
- `DELETE /api/update-file` - Delete file

**Entity-Specific**:
- `GET /api/get-driver-log/{id}` - Fetch driver change log
- `GET /api/get-employee-log/{id}` - Fetch employee change log
- `PATCH /api/upload-driver-data/{id}` - Update driver data
- `PATCH /api/upload-truck-data/{id}` - Update truck data
- `PATCH /api/upload-equipment-data/{id}` - Update equipment data
- `PATCH /api/upload-employee-data/{id}` - Update employee data
- (... more endpoints as needed)

**Claims & Details**:
- `GET /api/get-claims` - Fetch claims
- `POST /api/get-claims` - Create claim
- `DELETE /api/get-claims` - Delete claim
- `GET /api/get-inspections` - Fetch inspections
- `DELETE /api/get-inspections` - Delete inspection
- `GET /api/get-tickets` - Fetch tickets
- `DELETE /api/get-tickets` - Delete ticket

### Configuration Schema Reference

#### UniversalCard Config

```typescript
interface UniversalCardConfig {
  // Entity metadata
  entity: {
    type: 'driver' | 'truck' | 'equipment' | 'employee' | 'incident' | 'violation' | 'wcb' | 'driverReport';
    contextProvider: string;  // Provider component name
    idField: string;  // ID prop name (e.g., 'userId', 'truckId')
  };

  // Tabs configuration
  tabs: TabConfig[];

  // Default settings
  defaultTab: string;  // Tab ID to open by default
  initialTab?: string;  // Tab to open (from props, overrides default)

  // Styling
  width: string;  // Tailwind class (e.g., 'w-[1024px]')
  height: string;  // Tailwind class (e.g., 'h-[98vh]')
}

interface TabConfig {
  id: string;  // Unique tab identifier
  label: string;  // Display label
  type: TabType;  // Tab type (determines which component to use)
  config: TabTypeConfig;  // Type-specific configuration
  visibility?: VisibilityConfig;  // Optional visibility rules
}

type TabType =
  | 'general-info'
  | 'checklist'
  | 'log'
  | 'list'
  | 'timecard'
  | 'custom-claims'
  | 'custom-violation-details'
  | 'custom-seals';

interface VisibilityConfig {
  condition?: (data: any) => boolean;  // Dynamic visibility
  roles?: string[];  // Role-based visibility
}
```

#### Tab Type Configs

See detailed schemas in component analysis sections above.

---

## 🎯 Success Metrics

### Code Quality
- ✅ **LOC Reduction**: 15,000 → 5,000 lines (67% reduction)
- ✅ **Component Count**: 50+ → ~20 components (60% reduction)
- ✅ **File Count**: 100+ → ~40 files (60% reduction)
- ✅ **Code Duplication**: Near zero (configuration-driven)

### Functionality
- ✅ **Feature Parity**: 100% - All features preserved
- ✅ **API Compatibility**: 100% - No API changes
- ✅ **Role-Based Access**: 100% - All 8 roles work identically
- ✅ **Regressions**: Zero - No loss of functionality

### Performance
- ✅ **Load Time**: Equal or better
- ✅ **Bundle Size**: Smaller (less code)
- ✅ **Memory Usage**: Equal or better
- ✅ **Render Performance**: Equal or better

### Maintainability
- ✅ **Add New Card**: 30 minutes (just config file)
- ✅ **Add New Tab Type**: 1-2 days (reusable for all cards)
- ✅ **Modify Tab Behavior**: Minutes (edit config)
- ✅ **Bug Fixes**: Single location (affects all cards)

### Developer Experience
- ✅ **Learning Curve**: Moderate (config-based, good docs)
- ✅ **Debugging**: Easier (single component to debug)
- ✅ **Testing**: Easier (test once, applies to all)
- ✅ **Documentation**: Comprehensive (this document + inline)

---

## 🚨 Risks & Mitigation

### Risk 1: Complexity Underestimation
**Impact**: High
**Probability**: Medium
**Mitigation**:
- Incremental implementation (tab-by-tab)
- Test each phase thoroughly before moving on
- Keep old components until full validation
- Feature flag for gradual rollout

### Risk 2: API Changes Required
**Impact**: High
**Probability**: Low
**Mitigation**:
- Deep analysis before implementation (✅ done)
- No API changes identified so far
- Maintain exact API contracts
- Adapter layer if needed

### Risk 3: Performance Degradation
**Impact**: Medium
**Probability**: Low
**Mitigation**:
- Performance testing in Phase 10
- Lazy loading of tab content
- Memoization where appropriate
- Bundle size monitoring

### Risk 4: Configuration Complexity
**Impact**: Medium
**Probability**: Medium
**Mitigation**:
- Comprehensive documentation
- Config validation
- TypeScript types
- Example configs for each card type
- Test harness for config editing

### Risk 5: Scope Creep
**Impact**: Medium
**Probability**: High
**Mitigation**:
- Strict adherence to plan
- "No new features" rule
- Regular scope review
- Phase-based approval gates

---

## 📝 Notes & Decisions

### Decision Log

**D1**: Use shadcn/ui instead of keeping custom components
- **Rationale**: Modern, accessible, well-documented, actively maintained
- **Trade-off**: Learning curve, but better long-term maintainability

**D2**: Keep MUI DataGrid and DatePicker
- **Rationale**: Excellent components, no need to rebuild
- **Trade-off**: Dual library dependency, but minimal

**D3**: Configuration-driven architecture
- **Rationale**: Maximum scalability, minimal code duplication
- **Trade-off**: Complexity in config schema, but worth it

**D4**: Build from zero instead of refactoring
- **Rationale**: Clean slate, modern patterns, no technical debt
- **Trade-off**: More upfront work, but cleaner result

**D5**: Incremental implementation (tab-by-tab)
- **Rationale**: Lower risk, testable at each stage
- **Trade-off**: Longer timeline, but safer

**D6**: Start with TruckCard (simplest)
- **Rationale**: Quick validation of architecture
- **Trade-off**: DriverCard (most complex) comes later, but better to iron out issues first

### Open Questions

**Q1**: Should we use TypeScript for config files?
- **Status**: TBD
- **Options**: Yes (type safety) vs No (simpler, existing codebase is JS)
- **Decision**: Decide in Phase 1

**Q2**: Should we add Storybook for component development?
- **Status**: TBD
- **Options**: Yes (better dev experience) vs No (adds complexity)
- **Decision**: Decide in Phase 1

**Q3**: How to handle card-to-card navigation?
- **Status**: TBD
- **Analysis Needed**: Deep dive into InfoCardContext
- **Decision**: Decide in Phase 1

**Q4**: Should we add animation library (framer-motion)?
- **Status**: TBD
- **Options**: Yes (smooth animations) vs CSS only (lighter)
- **Decision**: Decide in Phase 4 (when building collapsible sections)

---

## 🔄 Change Log

| Date | Phase | Change | Reason |
|------|-------|--------|--------|
| 2025-10-02 | 0 | Document created | Planning phase |

---

## 📞 Contact & Support

**Project Lead**: Claude (AI Assistant)
**Developer**: Nikita Sazonov
**Documentation**: This file (`UNIVERSAL_CARD_IMPLEMENTATION_PLAN.md`)
**Progress Tracking**: This file + Todo list

---

**Last Updated**: 2025-10-02
**Version**: 1.0
**Status**: 🟡 In Progress - Phase 0 Complete
