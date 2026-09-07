/**
 * Constants for RR Manager Application
 * Centralized configuration to avoid magic numbers and strings
 */

// API Configuration
export const API = {
    PREFIX: '/webman/3rdparty/rr-manager/scripts/',
    TIMEOUT_MS: 60000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY_MS: 1000
};

// DSM Version Detection (Feature-based, not version string)
export const DSM_FEATURES = {
    // Modern DSM has SYNO.Core.User.PasswordConfirm v2
    PASSWORD_CONFIRM_V2: 'SYNO.Core.User.PasswordConfirm.v2',
    // Check for modern FileStation APIs
    FILESTATION_V2: 'SYNO.FileStation.List.v2'
};

// LocalStorage Keys
export const STORAGE_KEYS = {
    RR_CONFIG: 'rrConfig',
    RR_MANAGER_CONFIG: 'rrManagerConfig',
    SHARES_LIST: 'sharesList',
    RR_UPDATE_FILE_VERSION: 'rrUpdateFileVersion'
};

// Task Names (must match scheduled tasks in DSM)
export const TASK_NAMES = {
    SET_ROOT_PRIVS: 'SetRootPrivsToRrManager',
    RUN_RR_UPDATE: 'RunRrUpdate',
    APPLY_RR_CONFIG: 'ApplyRRConfig'
};

// Required Tasks List
export const REQUIRED_TASKS = [
    TASK_NAMES.RUN_RR_UPDATE,
    TASK_NAMES.APPLY_RR_CONFIG
];

// UI Configuration
export const UI = {
    STATUS_CHECK_INTERVAL_MS: 1500,
    MAX_STATUS_CHECK_ATTEMPTS: 350,
    DEFAULT_FONT_SIZE: 13,
    TERMINAL_THEME: {
        foreground: '#d2d2d2',
        background: '#2b2b2b',
        cursor: '#adadad',
        black: '#000000',
        red: '#d81e00',
        green: '#5ea702',
        yellow: '#cfae00',
        blue: '#427ab3',
        magenta: '#89658e',
        cyan: '#00a7aa',
        white: '#dbded8',
        brightBlack: '#686a66',
        brightRed: '#f54235',
        brightGreen: '#99e343',
        brightYellow: '#fdeb61',
        brightBlue: '#84b0d8',
        brightMagenta: '#bc94b7',
        brightCyan: '#37e6e8',
        brightWhite: '#f1f1f1'
    }
};

// File Extensions
export const FILE_EXTS = {
    ZIP: ['.zip'],
    IMG: ['.img', '.iso'],
    CONFIG: ['.json', '.conf']
};

// Terminal WebSocket Configuration
export const TERMINAL_WS = {
    PORT: 7681,
    PATH_SUFFIX: '/ws',
    TOKEN_PATH: '/token'
};

// Error Messages (keys for localization)
export const ERROR_MESSAGES = {
    SHARE_NOT_FOUND: 'share_notfound_msg',
    TASK_CREATE_FAILED: 'task_create_failed',
    CONFIG_PARSE_ERROR: 'config_parse_error',
    API_CALL_FAILED: 'api_call_failed',
    UPDATE_FAILED: 'update_failed'
};

// Success Messages (keys for localization)
export const SUCCESS_MESSAGES = {
    TASKS_CREATED: 'tasks_created_msg',
    CONFIG_APPLIED: 'rr_config_applied',
    UPDATE_COMPLETED: 'update_rr_completed'
};

// Component IDs
export const COMPONENT_IDS = {
    HEALTH_PANEL: 'healthPanel',
    STATUS_BOXS_PANEL: 'statusBoxsPanel',
    ACTIONS_PANEL: 'rrActionsPanel',
    TASK_TAB_PANEL: 'taskTabPanel'
};

// Feature Flags (can be overridden by config)
export const FEATURES = {
    ENABLE_AUTO_UPDATE_CHECK: true,
    ENABLE_ZMODEM: false,
    ENABLE_SIXEL: false,
    ENABLE_WEBGL_RENDERER: true
};
