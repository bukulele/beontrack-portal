# Core Obfuscation Strategy

**Date:** 2025-11-13
**Goal:** Hide business logic from clients while allowing config customization

---

## Requirements Summary

### Main Goals
1. **Hide core business logic** - Make JavaScript code unreadable to clients
2. **Allow config customization** - Clients can modify configs without touching core code
3. **Separate deployment per client** - Each client has own project folder + database
4. **Protected core updates** - Push core updates to all clients, merge conflicts are their problem
5. **No concern about modifications** - Only care that code is unreadable, not preventing edits
6. **Keep configs as-is** - No need to convert existing JS config files to JSON

### Three Deployment Scenarios
1. **Case 1:** You deploy and manage everything for client
2. **Case 2:** Client has tech team, can modify configs and redeploy
3. **Case 3:** Client self-deploys following your instructions

---

## Chosen Architecture: NPM Package Core + JavaScript Obfuscation

### Why This Approach?
- Core code becomes unreadable through obfuscation
- Each client has separate project folder (not monorepo)
- Core distributed as NPM package (from private registry or Git)
- **Configs stay as JavaScript files** (client-editable, no conversion needed)
- Simple to implement and maintain
- No need to convert 63 config files to JSON
- All existing config functionality preserved (functions, React components, etc.)

---

## Project Structure

### Core Repository (Your Private Source)
```
office-core-source/  (Private - never shared)
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── config/
├── scripts/
│   └── build-and-obfuscate.js  ← Build script
├── package.json
└── README.md

After build → Published as NPM package (obfuscated):
@yourcompany/office-core/
├── dist/
│   ├── index.js        ← Obfuscated, unreadable
│   ├── components.js   ← Obfuscated, unreadable
│   └── lib.js          ← Obfuscated, unreadable
└── package.json
```

### Client Project Structure (One Per Client)
```
client-a-office/  (Separate Git repo)
├── package.json
│   └── "@yourcompany/office-core": "^2.3.1"  ← Core as dependency
├── .env
│   └── DATABASE_URL=postgresql://client_a_db
├── config/                    ← CLIENT CAN EDIT (Plain JavaScript)
│   ├── clientData.js          ← Readable JS with dropdowns, validation
│   ├── forms/
│   │   ├── employeeEditForm.config.js
│   │   └── truckEditForm.config.js
│   ├── checklists/
│   │   ├── employeeChecklist.config.js
│   │   └── truckChecklist.config.js
│   ├── cards/
│   │   └── employeeCard.config.js
│   └── menu.config.js         ← Navigation structure
├── public/
│   └── logo.png
├── next.config.js             ← Wrapper importing core
├── app/
│   └── layout.js              ← Imports from obfuscated core
└── README.md                  ← Client instructions
```

**Key Point:** Configs are **plain JavaScript files**, readable and editable by client. Only the core package (in `node_modules/`) is obfuscated.

---

## JavaScript Obfuscation Details

### Tool: javascript-obfuscator
**NPM Package:** `javascript-obfuscator`
**Docs:** https://github.com/javascript-obfuscator/javascript-obfuscator

### Obfuscation Settings (High Protection)
```javascript
{
  compact: true,                          // Remove whitespace
  controlFlowFlattening: true,            // Make control flow hard to follow
  controlFlowFlatteningThreshold: 1,      // Maximum obfuscation
  deadCodeInjection: true,                // Add fake code
  deadCodeInjectionThreshold: 0.4,        // 40% fake code
  debugProtection: true,                  // Crash if debugger attached
  debugProtectionInterval: 4000,          // Anti-debug checks every 4s
  disableConsoleOutput: true,             // Disable console.log
  identifierNamesGenerator: 'hexadecimal',// Use hex names (_0x4f2a)
  renameGlobals: false,                   // Keep global names
  selfDefending: true,                    // Detect tampering
  stringArray: true,                      // Extract strings to array
  stringArrayEncoding: ['rc4'],           // Encrypt strings
  stringArrayThreshold: 1,                // Move all strings
  unicodeEscapeSequence: false            // Keep Unicode readable
}
```

### Before Obfuscation (Readable)
```javascript
// src/lib/permissions/permission-checker.js
export class PermissionChecker {
  constructor(userPermissions, userAttributes) {
    this.permissions = userPermissions;
    this.attributes = userAttributes;
  }

  async canPerformAction(entityType, action, record = null) {
    const permission = this.permissions.find(
      p => p.entityType === entityType && p.actions.includes(action)
    );

    if (!permission) return false;

    if (record && permission.conditions) {
      return this.evaluateConditions(permission.conditions, record);
    }

    return true;
  }

  evaluateConditions(conditions, record) {
    // Complex business logic here
    for (const [field, operators] of Object.entries(conditions)) {
      for (const [operator, value] of Object.entries(operators)) {
        const resolvedValue = this.resolveValue(value);
        if (!this.checkOperator(record[field], operator, resolvedValue)) {
          return false;
        }
      }
    }
    return true;
  }
}
```

### After Obfuscation (Unreadable)
```javascript
const _0x4f2a=['permissions','attributes','entityType','actions','includes','find','conditions','evaluateConditions','entries','resolveValue','checkOperator'];(function(_0x5e3c7d,_0x4f2a8b){const _0x3d1f56=function(_0x2a4c8e){while(--_0x2a4c8e){_0x5e3c7d['push'](_0x5e3c7d['shift']());}};_0x3d1f56(++_0x4f2a8b);}(_0x4f2a,0x1a4));const _0x3d1f=function(_0x5e3c7d,_0x4f2a8b){_0x5e3c7d=_0x5e3c7d-0x0;let _0x3d1f56=_0x4f2a[_0x5e3c7d];return _0x3d1f56;};export class _0x2a4c8e{constructor(_0x5e3c7d,_0x4f2a8b){this[_0x3d1f('0x0')]=_0x5e3c7d;this[_0x3d1f('0x1')]=_0x4f2a8b;}async ['\x63\x61\x6e\x50\x65\x72\x66\x6f\x72\x6d\x41\x63\x74\x69\x6f\x6e'](_0x3d1f56,_0x2a4c8e,_0x5e3c7d=null){const _0x4f2a8b=this[_0x3d1f('0x0')][_0x3d1f('0x5')](_0x1a4c8e=>_0x1a4c8e[_0x3d1f('0x2')]===_0x3d1f56&&_0x1a4c8e[_0x3d1f('0x3')][_0x3d1f('0x4')](_0x2a4c8e));if(!_0x4f2a8b)return![];if(_0x5e3c7d&&_0x4f2a8b[_0x3d1f('0x6')])return this[_0x3d1f('0x7')](_0x4f2a8b[_0x3d1f('0x6')],_0x5e3c7d);return!![];}[_0x3d1f('0x7')](_0x5e3c7d,_0x4f2a8b){for(const [_0x3d1f56,_0x2a4c8e]of Object[_0x3d1f('0x8')](_0x5e3c7d)){for(const [_0x1a4c8e,_0x5e3c7d]of Object[_0x3d1f('0x8')](_0x2a4c8e)){const _0x4f2a8b=this[_0x3d1f('0x9')](_0x5e3c7d);if(!this[_0x3d1f('0xa')](_0x4f2a8b[_0x3d1f56],_0x1a4c8e,_0x4f2a8b))return![];}}return!![];}}
```

**Result:** Client sees garbled code but app works perfectly.

---

## Build & Publish Workflow

### Step 1: Build Script
Create `scripts/build-and-obfuscate.js`:

```javascript
const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔨 Building Next.js app...');
execSync('npm run build', { stdio: 'inherit' });

console.log('🔐 Obfuscating JavaScript files...');

// Obfuscate all .js files in build output
function obfuscateDirectory(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      obfuscateDirectory(filePath);
    } else if (file.endsWith('.js')) {
      const code = fs.readFileSync(filePath, 'utf8');

      const obfuscated = JavaScriptObfuscator.obfuscate(code, {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 1,
        deadCodeInjection: true,
        deadCodeInjectionThreshold: 0.4,
        debugProtection: true,
        debugProtectionInterval: 4000,
        disableConsoleOutput: true,
        identifierNamesGenerator: 'hexadecimal',
        renameGlobals: false,
        selfDefending: true,
        stringArray: true,
        stringArrayEncoding: ['rc4'],
        stringArrayThreshold: 1,
        unicodeEscapeSequence: false
      });

      fs.writeFileSync(filePath, obfuscated.getObfuscatedCode());
      console.log(`  ✅ Obfuscated: ${filePath}`);
    }
  });
}

obfuscateDirectory('.next/');

console.log('📦 Preparing package for publishing...');
fs.copySync('.next/', 'dist/.next/');
fs.copySync('package.json', 'dist/package.json');
fs.copySync('README.md', 'dist/README.md');

console.log('✅ Build complete! Ready to publish from dist/');
```

### Step 2: Add NPM Scripts
```json
// package.json
{
  "scripts": {
    "build": "next build",
    "build:obfuscate": "node scripts/build-and-obfuscate.js",
    "publish:core": "npm run build:obfuscate && cd dist && npm publish"
  },
  "devDependencies": {
    "javascript-obfuscator": "^4.0.0",
    "fs-extra": "^11.0.0"
  }
}
```

### Step 3: Publish
```bash
# In office-core-source/
npm run publish:core

# Published to NPM as @yourcompany/office-core@2.3.1 (obfuscated)
```

---

## Config Management Strategy

### Configs Stay as JavaScript Files (Simplified Approach)

**Key Decision:** Keep all 63 config files as plain JavaScript in client projects. No conversion to JSON needed.

### How It Works

**Client's Config Files (Readable JavaScript):**
```javascript
// client-a-office/config/clientData.js
export const OPTION_LISTS = {
  CANADIAN_PROVINCES: [
    { value: 'AB', label: 'Alberta' },
    { value: 'BC', label: 'British Columbia' },
    // Client can easily modify these
  ],
  TERMINALS: [
    { value: 'calgary', label: 'Calgary Terminal' },
    { value: 'edmonton', label: 'Edmonton Terminal' },
  ]
};

export const VALIDATION_RULES = {
  SIN: {
    pattern: /^\d{9}$/,
    errorMessage: 'SIN must be 9 digits'
  }
};

// Functions, React components, formatters all work as-is
export const FORMATTERS = {
  phoneNumber: (value) => value
    ? `+1 ${value.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}`
    : "N/A",
};
```

**Core Components Import Configs (Obfuscated):**
```javascript
// node_modules/@yourcompany/office-core/components/EmployeeTable.js (obfuscated)
// Client's code imports both obfuscated core and readable configs
import { EmployeeTable } from '@yourcompany/office-core/components'; // Obfuscated
import { OPTION_LISTS } from '@/config/clientData'; // Readable

export default function EmployeesPage() {
  return <EmployeeTable provinces={OPTION_LISTS.CANADIAN_PROVINCES} />;
}
```

### Build Process

When client runs `npm run build`:
```
Bundle includes:
- Core code from node_modules/ → OBFUSCATED (unreadable)
- Config files from config/ → READABLE (plain JS, minified but not obfuscated)
```

**Result:**
- Client cannot understand core business logic (obfuscated)
- Client can easily modify configs (readable)
- All existing config functionality preserved (functions, React components, etc.)

### What Client Can/Cannot See

**❌ Client CANNOT See (Obfuscated in Core):**
- Permission checking logic
- Business algorithms
- Complex component internals
- API route handlers
- Authentication logic
- Database query builders
- Core utilities and helpers

**✅ Client CAN See (Readable Configs):**
- Form field definitions
- Menu structure
- Dropdown options
- Checklist items
- Card layouts
- Validation rules

**Is This Acceptable?**
✅ **Yes**, because configs contain **data definitions only**, not business logic.
✅ Client **needs** to see configs to customize them effectively.
✅ No sensitive algorithms or IP in config files.

---

## Core Updates Workflow

### You (Core Maintainer):
```bash
# 1. Make changes to core
cd office-core-source
vi src/app/components/EmployeeTable.jsx

# 2. Version bump
npm version minor  # 2.3.1 → 2.4.0

# 3. Build and publish obfuscated core
npm run publish:core

# 4. Write changelog
echo "v2.4.0 - Added employee export feature" >> CHANGELOG.md

# 5. Notify clients
# Email: "New version 2.4.0 available, update with: npm update @yourcompany/office-core"
```

### Client Updates Core:
```bash
# In client-a-office/
npm update @yourcompany/office-core
# 2.3.1 → 2.4.0 (obfuscated code updated)

npm run build
docker build -t client-a-office .
docker push registry.com/client-a-office

# Deploy updated version
```

**If client made config changes that conflict:** They fix their configs (not your problem).

---

## Protection Level Assessment

### What Client Cannot See:
- ✅ Business logic (permission checking, calculations)
- ✅ Algorithm implementations
- ✅ Code structure and flow
- ✅ Function names and variable names
- ✅ Comments and documentation

### What Client Can Still Do:
- ⚠️ Run the code (it works perfectly)
- ⚠️ Technically reverse engineer with HUGE effort (days/weeks)
- ⚠️ Debug with some difficulty (debugger protection makes it hard)

### Protection Level: **Medium-High**
- 95% of developers won't bother reverse engineering
- Would take expert 1-2 weeks of full-time work
- Legal protection (license forbids reverse engineering)
- Good enough for commercial SaaS

---

## Client Documentation Template

### README.md for Client Projects

```markdown
# Office Management System - Client Deployment

## What You Can Customize

✅ **Config Files** (in `config/` directory - Plain JavaScript)
- `clientData.js` - Dropdowns, provinces, terminals, validation rules
- `forms/*.config.js` - Form field definitions
- `checklists/*.config.js` - Checklist configurations
- `cards/*.config.js` - Card layouts
- `menu.config.js` - Navigation menu structure
- All configs are readable JavaScript files that you can edit

✅ **Environment Variables** (`.env` file)
- `DATABASE_URL` - Your PostgreSQL connection string
- Other secrets and API keys

✅ **Static Assets** (`public/` folder)
- Company logo
- Favicon
- Custom images

## What You CANNOT Modify

❌ **Core Application Code**
- Everything in `node_modules/@yourcompany/office-core/`
- Core package is obfuscated and protected
- Modifying core will break the application

## How to Update Configs

1. Edit config files in `config/` directory
2. Test locally: `npm run dev`
3. Deploy: `npm run build && docker build ...`

## How to Update Core Version

1. Check for updates: `npm outdated @yourcompany/office-core`
2. Update: `npm update @yourcompany/office-core`
3. Read CHANGELOG for breaking changes
4. Test locally
5. Deploy

## Deployment

### Option 1: Docker
```bash
docker build -t my-office .
docker run -p 3002:3002 --env-file .env my-office
```

### Option 2: Node.js
```bash
npm install
npm run build
npm start
```

## Support

Contact: support@yourcompany.com
Documentation: https://docs.yourcompany.com
```

---

## Next Steps (When Ready to Implement)

### Phase 1: Prepare Core Package
1. Install `javascript-obfuscator` and `fs-extra`
2. Create `scripts/build-and-obfuscate.js`
3. Test obfuscation on current project
4. Verify obfuscated code still works

### Phase 2: Separate Core from Configs
1. Identify what goes in core package vs client project
2. Move business logic to core (components, lib, API routes)
3. Keep configs in client template (all 63 config files as-is)
4. Test imports between core and configs

### Phase 3: Setup NPM Publishing
1. Choose distribution method:
   - Option A: Private NPM registry (e.g., Verdaccio, GitHub Packages)
   - Option B: Git as dependency (simpler, no NPM needed)
2. Configure package.json for publishing
3. Test publishing and installing

### Phase 4: Create Client Template
1. Create minimal client project structure
2. Add core as dependency
3. Add example configs
4. Write client documentation
5. Test deployment

### Phase 5: Migrate Existing Client
1. Create new client project from template
2. Copy existing configs
3. Test thoroughly
4. Switch production

---

## Cost Analysis

### Development Effort
- **Setup:** 3-5 days (one-time)
  - Obfuscation setup: 1 day
  - Core package structure: 1 day
  - Client template creation: 1 day
  - Testing: 1-2 days
- **Per client setup:** 1-2 hours (just configs)
- **Maintenance:** Minimal (just core updates)

### Infrastructure Costs
- **Private NPM registry:** $0-50/month (or use Git - free)
- **Per client:** Same as current (separate DB + hosting)

### Benefits
- ✅ Code protected from casual inspection
- ✅ Clients can customize configs (JS files, easy to edit)
- ✅ Easy to push core updates to all clients
- ✅ Scalable to many clients
- ✅ Clear separation: core vs configs
- ✅ No config conversion needed (keep existing 63 files)
- ✅ All config features preserved (functions, React components)

---

## Alternative: Git Submodule (If No NPM)

If you don't want to deal with NPM at all:

```bash
# Client project
git submodule add https://github.com/yourcompany/office-core.git core
git submodule update --remote

# Core is in core/ directory (obfuscated)
# Client configs in config/ directory
```

**Pros:** No NPM needed
**Cons:** Clients can see core files (even if obfuscated)

---

## Conclusion

**Obfuscation + NPM package distribution + JS configs** gives you:
- Business logic hidden from clients (obfuscated core)
- Config customization flexibility (readable JS files)
- Easy core updates (npm update)
- Good protection for commercial SaaS
- **Simplicity**: No config conversion needed, all 63 files stay as-is

### Key Simplification
By keeping configs as JavaScript files instead of converting to JSON:
- ✅ Zero migration effort for configs
- ✅ All existing functionality preserved (functions, React components, formatters)
- ✅ Client can edit configs with full IDE support
- ✅ Only core code needs obfuscation, not configs

**Protection level: Medium-High**
- Core business logic: Unreadable (obfuscated)
- Config data: Readable (intentionally, for client customization)
- Not 100% secure, but sufficient for 95% of commercial use cases

---

*Document created: 2025-11-13*
*Last updated: 2025-11-13 - Simplified to keep configs as JS files*
*Next review: When ready to start implementation*
