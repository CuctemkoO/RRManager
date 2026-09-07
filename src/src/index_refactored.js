/**
 * RR Manager Application - Refactored Entry Point
 * Phase 1: Modular architecture with centralized services
 */

// Import core services
import { ApiService } from './services/ApiService';
import { ConfigService } from './services/ConfigService';
import { DSMHelper } from './utils/dsmHelper';
import { logInfo, logError, setLogLevel, LOG_LEVELS } from './utils/logger';
import { STORAGE_KEYS, TASK_NAMES, REQUIRED_TASKS, API } from './utils/constants';

// Import UI components
import AppWindow from './appWindow';

// Import tabs
import Main from './tabs/main';
import Addons from './tabs/addons';
import Settings from './tabs/setting';
import Debug from './tabs/debug';
import Ssh from './tabs/ssh';

// Import panels and components (for registration)
import HealthPanel from './panels/healthPanel';
import StatusBoxsPanel from './panels/statusBoxsPanel';
import statusBoxTmpl from './components/statusBoxTmpl';
import statusBox from './components/statusBox';
import AdvancedSearchField from './components/advancedSearchField';
import iframePanel from './components/iframePanel';

// Import settings tabs
import SettingsGeneralTab from './panels/settings/generalTab';
import RRConfigTab from './panels/settings/rrConfigTab';
import SynoInfoTab from './panels/settings/synoInfoTab';
import RrManagerConfigTab from './panels/settings/rrManagerConfigTab';

// Import debug tabs
import DebugGeneralTab from './panels/debug/generalTab';

// Import dialogs
import UploadFileDialog from './components/dialogs/uploadFileDialog';
import UpdateAvailableDialog from './components/dialogs/updateAvailableDialog';
import PasswordConfirmDialog from './components/dialogs/passwordConfirmDialog';

// Namespace definition (kept for ExtJS compatibility)
Ext.ns('SYNOCOMMUNITY.RRManager');

// Expose services globally for legacy code during transition
// TODO: Remove in Phase 2 when all code is migrated to imports
SYNOCOMMUNITY.RRManager.ApiService = ApiService;
SYNOCOMMUNITY.RRManager.ConfigService = ConfigService;
SYNOCOMMUNITY.RRManager.DSMHelper = DSMHelper;

// Application definition
Ext.define('SYNOCOMMUNITY.RRManager.AppInstance', {
    extend: 'SYNO.SDS.AppInstance',
    appWindowName: 'SYNOCOMMUNITY.RRManager.AppWindow',
    
    constructor: function () {
        // Initialize logging
        logInfo('RR Manager Application Starting...', 'AppInstance');
        
        // Verify storage availability
        if (!ConfigService.isStorageAvailable()) {
            logError('localStorage is not available. Application may not function correctly.', 'AppInstance');
        }
        
        this.callParent(arguments);
    }
});

// Helper function for setting empty icon (kept from original)
SYNOCOMMUNITY.RRManager.SetEmptyIcon = (e, t) => {
    let i = e.el.child(".contentwrapper");
    if (i) {
        for (; i.child(".contentwrapper");)
            i = i.child(".contentwrapper");
        t && !i.hasClass("san-is-empty") ? i.addClass("san-is-empty") : !t && i.hasClass("san-is-empty") && i.removeClass("san-is-empty");
    }
};

// Export services for use in other modules
export {
    ApiService,
    ConfigService,
    DSMHelper,
    AppWindow,
    Main,
    Addons,
    Settings,
    Debug,
    Ssh,
    HealthPanel,
    StatusBoxsPanel,
    statusBoxTmpl,
    statusBox,
    AdvancedSearchField,
    iframePanel,
    SettingsGeneralTab,
    RRConfigTab,
    SynoInfoTab,
    RrManagerConfigTab,
    DebugGeneralTab,
    UploadFileDialog,
    UpdateAvailableDialog,
    PasswordConfirmDialog
};

logInfo('RR Manager Application Modules Loaded', 'AppInstance');
