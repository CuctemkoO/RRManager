/**
 * DSM Helper Utilities
 * Feature detection and version-agnostic helpers for DSM compatibility
 */

import { logWarn, logInfo } from '../utils/logger.js';

/**
 * Detect DSM features instead of relying on version strings
 * This approach is more robust across DSM updates
 */
export const DSMHelper = {
    /**
     * Check if modern DSM password confirmation API v2 is available
     * @returns {boolean} - True if v2 API is available
     */
    hasPasswordConfirmV2() {
        try {
            // Try to detect if SYNO.Core.User.PasswordConfirm v2 exists
            // Modern DSM 7.2+ uses version 2
            if (window.SYNO && SYNO.API && SYNO.API.Info) {
                const apiInfo = SYNO.API.Info.getInfo('SYNO.Core.User.PasswordConfirm');
                return apiInfo && apiInfo.maxVersion >= 2;
            }
        } catch (e) {
            logWarn('Failed to detect PasswordConfirm API version', 'DSMHelper');
        }
        
        // Default to true for DSM 7.x, can be overridden
        return true;
    },

    /**
     * Check if FileStation List API v2 is available
     * @returns {boolean} - True if v2 API is available
     */
    hasFileStationV2() {
        try {
            if (window.SYNO && SYNO.API && SYNO.API.Info) {
                const apiInfo = SYNO.API.Info.getInfo('SYNO.FileStation.List');
                return apiInfo && apiInfo.maxVersion >= 2;
            }
        } catch (e) {
            logWarn('Failed to detect FileStation API version', 'DSMHelper');
        }
        
        return true;
    },

    /**
     * Get DSM version info in a structured way
     * @returns {Object|null} - Version info object or null
     */
    getVersionInfo() {
        try {
            if (window.SYNO && SYNO.DSM && SYNO.DSM.Info) {
                return {
                    major: SYNO.DSM.Info.majorVersion,
                    minor: SYNO.DSM.Info.minorVersion,
                    build: SYNO.DSM.Info.buildNumber,
                    string: SYNO.DSM.Info.versionString
                };
            }
        } catch (e) {
            logWarn('Failed to get DSM version info', 'DSMHelper');
        }
        
        return null;
    },

    /**
     * Check if running on DSM 7.x or higher
     * @returns {boolean} - True if DSM 7+
     */
    isDSM7OrHigher() {
        const version = this.getVersionInfo();
        if (version && version.major) {
            return version.major >= 7;
        }
        
        // Fallback: assume modern DSM if we can't detect
        return true;
    },

    /**
     * Check if running on DSM 7.2.2 or higher (has specific APIs)
     * @returns {boolean} - True if DSM 7.2.2+
     */
    isModernDSM() {
        const version = this.getVersionInfo();
        if (!version || !version.string) {
            return true; // Assume modern if can't detect
        }
        
        // Parse version string like "7.2.2-12345"
        const match = version.string.match(/^(\d+)\.(\d+)\.(\d+)/);
        if (match) {
            const [, major, minor, patch] = match.map(Number);
            
            if (major > 7) return true;
            if (major < 7) return false;
            
            if (minor > 2) return true;
            if (minor < 2) return false;
            
            return patch >= 2;
        }
        
        return true;
    },

    /**
     * Get appropriate API version for a given API name
     * @param {string} apiName - API name (e.g., 'SYNO.Core.User.PasswordConfirm')
     * @returns {number} - API version to use
     */
    getAPIVersion(apiName) {
        try {
            if (window.SYNO && SYNO.API && SYNO.API.Info) {
                const apiInfo = SYNO.API.Info.getInfo(apiName);
                if (apiInfo) {
                    return apiInfo.maxVersion || 1;
                }
            }
        } catch (e) {
            logWarn(`Failed to get API version for ${apiName}`, 'DSMHelper');
        }
        
        // Defaults based on API name
        const defaults = {
            'SYNO.Core.User.PasswordConfirm': this.hasPasswordConfirmV2() ? 2 : 1,
            'SYNO.FileStation.List': 2,
            'SYNO.DSM.Info': 2,
            'SYNO.Core.Package': 2,
            'SYNO.Core.TaskScheduler': 2,
            'SYNO.Core.EventScheduler': 1
        };
        
        return defaults[apiName] || 1;
    },

    /**
     * Safely call an API with version detection
     * @param {string} apiName - API name
     * @param {string} method - Method name
     * @param {Object} params - Parameters
     * @param {Function} callback - Callback function
     */
    safeCallAPI(apiName, method, params, callback) {
        const version = this.getAPIVersion(apiName);
        
        logInfo(`Calling ${apiName}.${method} v${version}`, 'DSMHelper');
        
        try {
            SYNO.API.currentManager.requestAPI(apiName, method, version, params, callback);
        } catch (error) {
            logWarn(`API call failed: ${error.message}`, 'DSMHelper');
            callback(false, { error: error.message });
        }
    }
};

export default DSMHelper;
