/**
 * ApiService - Centralized API communication layer
 * Consolidates synoApiProvider.js and duplicate callCustomScript implementations
 * Provides unified error handling and retry logic
 */

import { API, STORAGE_KEYS } from '../utils/constants.js';
import { logError, logWarn, logInfo, logDebug } from '../utils/logger.js';

/**
 * Safe JSON parser for API responses
 * @param {any} responseText - Response text to parse
 * @returns {any|null} - Parsed object or null
 */
function safeParseResponse(responseText) {
    try {
        if (typeof responseText !== 'string' || responseText === '') {
            return responseText;
        }
        
        // Check if it looks like HTML (error page)
        if (responseText.trim().startsWith('<')) {
            logError('Received HTML response instead of JSON', 'ApiService');
            return null;
        }
        
        return JSON.parse(responseText);
    } catch (error) {
        logError(`Failed to parse API response: ${error.message}`, 'ApiService', error);
        return null;
    }
}

/**
 * ApiService - Singleton for all API communications
 */
export const ApiService = {
    sendWebAPI: null,
    isModernDSM: true,
    
    /**
     * Initialize the API service
     * @param {Function} sendWebAPI - DSM's sendWebAPI function
     * @param {boolean} isModernDSM - Whether this is modern DSM (7.x)
     */
    init(sendWebAPI, isModernDSM = true) {
        this.sendWebAPI = sendWebAPI;
        this.isModernDSM = isModernDSM;
        logInfo(`ApiService initialized (Modern DSM: ${isModernDSM})`, 'ApiService');
    },

    /**
     * Update DSM version flag
     * @param {boolean} isModernDSM 
     */
    setIsModernDSM(isModernDSM) {
        this.isModernDSM = isModernDSM;
    },

    /**
     * Generic WebAPI caller with Promise interface
     * @param {Object} args - WebAPI arguments
     * @returns {Promise<any>} - API response
     */
    callWebAPI(args) {
        return new Promise((resolve, reject) => {
            if (!this.sendWebAPI) {
                const error = new Error('ApiService not initialized. Call init() first.');
                logError(error.message, 'ApiService');
                reject(error);
                return;
            }

            const callbackArgs = {
                ...args,
                callback: (success, message) => {
                    if (success) {
                        resolve(message);
                    } else {
                        const errorMsg = message?.error || `API call failed: ${args.api}.${args.method}`;
                        logError(errorMsg, 'ApiService');
                        reject(errorMsg);
                    }
                }
            };

            this.sendWebAPI(callbackArgs);
        });
    },

    /**
     * Call custom CGI script
     * @param {string} scriptName - Script name (e.g., 'getConfig.cgi')
     * @param {Object} params - Optional query parameters
     * @returns {Promise<any>} - Script response
     */
    callCustomScript(scriptName, params = {}) {
        const url = `${API.PREFIX}${scriptName}`;
        
        logDebug(`Calling custom script: ${scriptName}`, 'ApiService');

        return new Promise((resolve, reject) => {
            Ext.Ajax.request({
                url: url,
                method: 'GET',
                timeout: API.TIMEOUT_MS,
                params: params,
                headers: {
                    'Content-Type': 'text/html'
                },
                success: (response) => {
                    const parsed = safeParseResponse(response.responseText);
                    if (parsed !== null) {
                        resolve(parsed);
                    } else {
                        resolve(response.responseText);
                    }
                },
                failure: (result) => {
                    let errorMsg = `Failed with status: ${result?.status || 'unknown'}`;
                    
                    if (typeof result?.responseText === 'string' && 
                        result.responseText && 
                        !result.responseText.startsWith('<')) {
                        const parsed = safeParseResponse(result.responseText);
                        if (parsed?.error) {
                            errorMsg = parsed.error;
                        }
                    }
                    
                    logError(errorMsg, 'ApiService');
                    reject(errorMsg);
                }
            });
        });
    },

    /**
     * Upload configuration file
     * @param {Object} jsonData - Configuration data to upload
     * @returns {Promise<any>} - Upload response
     */
    uploadConfigFile(jsonData) {
        const url = `${API.PREFIX}uploadConfigFile.cgi`;
        
        logInfo('Uploading configuration file', 'ApiService');

        return new Promise((resolve, reject) => {
            Ext.Ajax.request({
                url: url,
                method: 'POST',
                jsonData: jsonData,
                headers: {
                    'Content-Type': 'application/json'
                },
                success: (response) => {
                    const parsed = safeParseResponse(response.responseText);
                    resolve(parsed);
                },
                failure: (response) => {
                    const errorMsg = `Upload failed with status: ${response.status}`;
                    logError(errorMsg, 'ApiService');
                    reject(errorMsg);
                }
            });
        });
    },

    /**
     * Get system information
     * @returns {Promise<any>} - System info object
     */
    getSystemInfo() {
        logDebug('Fetching system info', 'ApiService');
        return this.callWebAPI({
            api: 'SYNO.DSM.Info',
            method: 'getinfo',
            version: 2
        });
    },

    /**
     * Get packages list
     * @returns {Promise<any>} - Packages list
     */
    getPackagesList() {
        logDebug('Fetching packages list', 'ApiService');
        return this.callWebAPI({
            api: 'SYNO.Core.Package',
            method: 'list',
            version: 2,
            params: {
                additional: ["maintainer", "dsm_app_launch_name", "url", "available_operation", "install_type"],
                ignore_hidden: false
            }
        });
    },

    /**
     * Get task scheduler list
     * @returns {Promise<any>} - Task list
     */
    getTaskList() {
        logDebug('Fetching task list', 'ApiService');
        return this.callWebAPI({
            api: 'SYNO.Core.TaskScheduler',
            method: 'list',
            version: 2,
            params: {
                sort_by: "next_trigger_time",
                sort_direction: "ASC",
                offset: 0,
                limit: 50
            }
        });
    },

    /**
     * Get shares list
     * @returns {Promise<any>} - Shares list
     */
    getSharesList() {
        logDebug('Fetching shares list', 'ApiService');
        return this.callWebAPI({
            api: 'SYNO.FileStation.List',
            method: 'list_share',
            version: 2,
            params: {
                filetype: 'dir',
                sort_by: 'name',
                check_dir: true,
                additional: ["real_path"],
                enum_cluster: false,
                node: 'fm_root'
            }
        });
    },

    /**
     * Run scheduled task
     * @param {string} taskName - Name of the task to run
     * @returns {Promise<any>} - Task execution response
     */
    runScheduledTask(taskName) {
        logInfo(`Running scheduled task: ${taskName}`, 'ApiService');
        return this.callWebAPI({
            api: 'SYNO.Core.EventScheduler',
            method: 'run',
            version: 1,
            params: { task_name: taskName },
            stop_when_error: false,
            mode: 'sequential'
        });
    },

    /**
     * Get password confirmation token
     * @param {string} password - User password
     * @returns {Promise<string>} - Confirmation token
     */
    getPasswordConfirm(password) {
        logDebug('Requesting password confirmation', 'ApiService');
        return this.callWebAPI({
            api: "SYNO.Core.User.PasswordConfirm",
            method: "auth",
            version: this.isModernDSM ? 2 : 1,
            params: { password: password }
        }).then(response => response?.SynoConfirmPWToken);
    },

    /**
     * Create scheduled task
     * @param {string} taskName - Task name
     * @param {string} operation - Task operation/script path
     * @param {string} token - Password confirmation token (optional)
     * @returns {Promise<any>} - Creation response
     */
    createTask(taskName, operation, token = "") {
        logInfo(`Creating task: ${taskName}`, 'ApiService');
        
        const params = {
            task_name: taskName,
            owner: { 0: "root" },
            event: "bootup",
            enable: false,
            depend_on_task: "",
            notify_enable: false,
            notify_mail: "",
            notify_if_error: false,
            operation_type: "script",
            operation: decodeURIComponent(operation)
        };

        if (token && token !== "") {
            params.SynoConfirmPWToken = token;
        }

        return this.callWebAPI({
            api: token ? "SYNO.Core.EventScheduler.Root" : "SYNO.Core.EventScheduler",
            method: "create",
            version: 1,
            params: params
        });
    },

    /**
     * Update scheduled task
     * @param {string} taskName - Task name
     * @param {string} operation - New operation/script path
     * @param {string} token - Password confirmation token (optional)
     * @returns {Promise<any>} - Update response
     */
    updateTask(taskName, operation, token = "") {
        logInfo(`Updating task: ${taskName}`, 'ApiService');
        
        const params = {
            task_name: taskName,
            owner: { 0: "root" },
            event: "bootup",
            enable: false,
            depend_on_task: "",
            notify_enable: false,
            notify_mail: "",
            notify_if_error: false,
            operation_type: "script",
            operation: decodeURIComponent(operation)
        };

        if (token && token !== "") {
            params.SynoConfirmPWToken = token;
        }

        return this.callWebAPI({
            api: token ? "SYNO.Core.EventScheduler.Root" : "SYNO.Core.EventScheduler",
            method: "set",
            version: 1,
            params: params
        });
    },

    /**
     * Check RR version from remote
     * @returns {Promise<any>} - Version info
     */
    checkRRVersion() {
        return this.callCustomScript('getRrReleaseInfo.cgi');
    },

    /**
     * Get update file info
     * @param {string} filePath - Path to update file
     * @returns {Promise<any>} - File info
     */
    getUpdateFileInfo(filePath) {
        return this.callCustomScript('readUpdateFile.cgi', { file: filePath });
    },

    /**
     * Run scheduler task with password confirmation
     * @param {string} token - Password confirmation token
     */
    sendRunSchedulerTaskWebAPI(token) {
        const args = {
            api: "SYNO.Core.EventScheduler",
            method: "run",
            version: 1,
            params: {
                task_name: "SetRootPrivsToRrManager"
            },
            callback: (success, message) => {
                if (!success) {
                    logError('Failed to run EventScheduler task', 'ApiService');
                }
            }
        };

        if (token && token !== "") {
            args.params.SynoConfirmPWToken = token;
        }

        if (this.sendWebAPI) {
            this.sendWebAPI(args);
        }
    }
};

export default ApiService;
