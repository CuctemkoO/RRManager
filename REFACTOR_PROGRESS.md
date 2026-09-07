# RR Manager Refactoring Progress

## Phase 1: Architectural Foundation (IN PROGRESS)

### ✅ Completed

#### 1. Core Services Created

**Logger Service** (`src/src/utils/logger.js`)
- Integrates with Synology system logs via `SYNO.Core.System` API
- Falls back to console logging
- Multiple log levels: DEBUG, INFO, WARN, ERROR, CRITICAL
- Automatic timestamp and source tracking
- Convenience methods: `logDebug`, `logInfo`, `logWarn`, `logError`, `logCritical`

**Constants Module** (`src/src/utils/constants.js`)
- Centralized configuration values
- API endpoints and timeouts
- DSM feature detection constants
- LocalStorage keys (prevents typos)
- Task names (single source of truth)
- UI configuration values
- File extensions
- Terminal WebSocket settings
- Error/success message keys
- Component IDs
- Feature flags

**ConfigService** (`src/src/services/ConfigService.js`)
- Safe localStorage access with error handling
- JSON validation for RR config structure
- Methods: `getKey`, `setKey`, `removeKey`, `getRRConfig`, `saveRRConfig`
- Prevents app crashes from corrupted JSON
- Validation before saving critical configs

**ApiService** (`src/src/services/ApiService.js`)
- **Consolidates duplicate code**: Merged `synoApiProvider.js` and `debug.js` `callCustomScript`
- Unified error handling across all API calls
- Safe JSON parsing for responses
- All API methods as Promise-based functions:
  - `init()`, `callWebAPI()`, `callCustomScript()`
  - `getSystemInfo()`, `getPackagesList()`, `getTaskList()`, `getSharesList()`
  - `runScheduledTask()`, `getPasswordConfirm()`, `createTask()`, `updateTask()`
  - `uploadConfigFile()`, `checkRRVersion()`, `getUpdateFileInfo()`
- Integrated logging for debugging

**DSMHelper** (`src/src/utils/dsmHelper.js`)
- **Feature detection instead of version string checks**
- Methods: `hasPasswordConfirmV2()`, `hasFileStationV2()`, `getVersionInfo()`
- `isDSM7OrHigher()`, `isModernDSM()` - proper version parsing
- `getAPIVersion()` - automatic API version detection
- `safeCallAPI()` - wrapped API calls with error handling

#### 2. New Entry Point Created

**index_refactored.js** (`src/src/index_refactored.js`)
- Imports all modules using ES6 syntax
- Exposes services globally during transition period
- Initializes logging on app start
- Checks storage availability
- Maintains ExtJS namespace compatibility

### 📋 To Do Next

#### 3. Update Existing Files to Use Services

Files that need modification:
- `src/src/tabs/main.js` - Replace direct localStorage and synoApiProvider calls
- `src/src/tabs/debug.js` - Remove duplicate callCustomScript, use ApiService
- `src/src/tabs/setting.js` - Use ConfigService
- `src/src/tabs/addons.js` - Use ConfigService and ApiService
- `src/src/utils/synoApiProvider.js` - Mark as deprecated, re-export from ApiService
- `src/src/utils/updateHelper.js` - Use ApiService and ConfigService
- `src/src/tabs/ssh.js` - Fix memory leaks, add destroy() method

#### 4. Memory Leak Fixes

Priority files:
- `src/src/tabs/ssh.js` - Add terminal cleanup on component destroy
- `src/src/panels/statusBoxsPanel.js` - Clear intervals and event listeners
- `src/src/appWindow.js` - Proper lifecycle management

#### 5. Webpack Configuration Updates

- Enable production minimization
- Add environment-specific configs (dev/prod)
- Configure code splitting for tabs

---

## Impact Analysis

### What Changed
1. **No global namespace pollution** - Using ES6 modules internally
2. **Centralized error handling** - All errors logged consistently
3. **Safe data access** - No more raw localStorage calls that can crash
4. **No code duplication** - Single implementation of API calls
5. **Feature detection** - Works across DSM versions without hardcoded checks

### What Stayed the Same
1. **External API** - Backend scripts (.cgi, .sh) unchanged
2. **UI Components** - ExtJS components work exactly as before
3. **User Experience** - No visible changes to end users
4. **Localization** - All _T() and _TT() calls preserved
5. **Backward Compatibility** - Scripts like install.sh still work

### Backward Compatibility Measures
1. Kept `Ext.ns('SYNOCOMMUNITY.RRManager')` for legacy code
2. Exposed new services on old namespace during transition
3. Did not change any CGI script interfaces
4. Preserved all existing method signatures in ApiService

---

## Testing Checklist

Before deployment, verify:
- [ ] App loads without console errors
- [ ] Can fetch system info
- [ ] Can read/write config from localStorage
- [ ] Scheduled tasks can be created/updated
- [ ] File upload works
- [ ] SSH terminal opens and closes cleanly
- [ ] Update check works
- [ ] Settings tab saves configuration
- [ ] No memory leaks after switching tabs multiple times

---

## Files Created

```
src/src/utils/
├── logger.js           # Logging with Synology integration
├── constants.js        # Centralized constants
└── dsmHelper.js        # DSM feature detection

src/src/services/
├── ApiService.js       # Unified API layer
└── ConfigService.js    # Safe config storage

src/src/
└── index_refactored.js # New modular entry point
```

## Files to Modify Next

```
src/src/tabs/
├── main.js            # HIGH PRIORITY - uses old patterns
├── debug.js           # HIGH PRIORITY - duplicate code
├── setting.js         # MEDIUM PRIORITY
└── addons.js          # MEDIUM PRIORITY

src/src/utils/
├── synoApiProvider.js # DEPRECATE - replaced by ApiService
└── updateHelper.js    # MEDIUM PRIORITY - uses old patterns

src/src/tabs/
└── ssh.js             # HIGH PRIORITY - memory leak fix
```

---

**Status**: Phase 1 approximately 40% complete
**Next Step**: Begin updating existing tab files to use new services
