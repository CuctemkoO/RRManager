/**
 * ConfigService - Centralized configuration storage with validation
 * Replaces direct localStorage access with safe, validated methods
 */

import { STORAGE_KEYS } from '../utils/constants.js';
import { logError, logWarn, logInfo } from '../utils/logger.js';

/**
 * Validates JSON structure for RR Config
 * @param {any} config - Configuration object to validate
 * @returns {boolean} - True if valid
 */
function validateRRConfig(config) {
    if (!config || typeof config !== 'object') {
        return false;
    }
    
    // Basic structure validation
    const requiredFields = ['rr_version', 'rr_manager_config'];
    for (const field of requiredFields) {
        if (!(field in config)) {
            logWarn(`Missing required field: ${field}`, 'ConfigService');
            return false;
        }
    }
    
    // Validate rr_manager_config structure
    if (!config.rr_manager_config || typeof config.rr_manager_config !== 'object') {
        logWarn('Invalid rr_manager_config structure', 'ConfigService');
        return false;
    }
    
    return true;
}

/**
 * Safe JSON parser with error handling
 * @param {string} jsonString - JSON string to parse
 * @returns {any|null} - Parsed object or null on error
 */
function safeJSONParse(jsonString) {
    try {
        if (!jsonString) {
            return null;
        }
        return JSON.parse(jsonString);
    } catch (error) {
        logError(`Failed to parse JSON: ${error.message}`, 'ConfigService', error);
        return null;
    }
}

/**
 * ConfigService - Singleton for managing application configuration
 */
export const ConfigService = {
    /**
     * Get configuration value by key
     * @param {string} key - Storage key from STORAGE_KEYS
     * @param {boolean} validate - Whether to validate the config (for rrConfig)
     * @returns {any|null} - Configuration value or null
     */
    getKey(key, validate = false) {
        try {
            const raw = localStorage.getItem(key);
            if (!raw) {
                logInfo(`Key not found: ${key}`, 'ConfigService');
                return null;
            }
            
            const parsed = safeJSONParse(raw);
            
            if (validate && !validateRRConfig(parsed)) {
                logWarn(`Validation failed for key: ${key}`, 'ConfigService');
                return null;
            }
            
            return parsed;
        } catch (error) {
            logError(`Failed to get key ${key}: ${error.message}`, 'ConfigService', error);
            return null;
        }
    },

    /**
     * Set configuration value by key
     * @param {string} key - Storage key from STORAGE_KEYS
     * @param {any} value - Value to store (will be JSON.stringify'd)
     * @returns {boolean} - Success status
     */
    setKey(key, value) {
        try {
            const serialized = JSON.stringify(value);
            localStorage.setItem(key, serialized);
            logInfo(`Successfully set key: ${key}`, 'ConfigService');
            return true;
        } catch (error) {
            logError(`Failed to set key ${key}: ${error.message}`, 'ConfigService', error);
            return false;
        }
    },

    /**
     * Remove configuration value by key
     * @param {string} key - Storage key to remove
     * @returns {boolean} - Success status
     */
    removeKey(key) {
        try {
            localStorage.removeItem(key);
            logInfo(`Successfully removed key: ${key}`, 'ConfigService');
            return true;
        } catch (error) {
            logError(`Failed to remove key ${key}: ${error.message}`, 'ConfigService', error);
            return false;
        }
    },

    /**
     * Get RR Config with validation
     * @returns {any|null} - RR configuration object or null
     */
    getRRConfig() {
        return this.getKey(STORAGE_KEYS.RR_CONFIG, true);
    },

    /**
     * Save RR Config with validation
     * @param {any} config - RR configuration object
     * @returns {boolean} - Success status
     */
    saveRRConfig(config) {
        if (!validateRRConfig(config)) {
            logError('Attempted to save invalid RR config', 'ConfigService');
            return false;
        }
        return this.setKey(STORAGE_KEYS.RR_CONFIG, config);
    },

    /**
     * Get RR Manager Config
     * @returns {any|null} - RR Manager configuration object or null
     */
    getRRManagerConfig() {
        return this.getKey(STORAGE_KEYS.RR_MANAGER_CONFIG);
    },

    /**
     * Get cached shares list
     * @returns {Array|null} - Array of share objects or null
     */
    getSharesList() {
        return this.getKey(STORAGE_KEYS.SHARES_LIST);
    },

    /**
     * Cache shares list
     * @param {Array} shares - Array of share objects
     * @returns {boolean} - Success status
     */
    cacheSharesList(shares) {
        return this.setKey(STORAGE_KEYS.SHARES_LIST, shares);
    },

    /**
     * Clear all RR Manager related storage
     * @returns {boolean} - Success status
     */
    clearAll() {
        try {
            Object.values(STORAGE_KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
            logInfo('Cleared all RR Manager storage', 'ConfigService');
            return true;
        } catch (error) {
            logError(`Failed to clear storage: ${error.message}`, 'ConfigService', error);
            return false;
        }
    },

    /**
     * Check if storage is available and working
     * @returns {boolean} - True if localStorage is available
     */
    isStorageAvailable() {
        try {
            const testKey = '__rrm_test__';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            return true;
        } catch (error) {
            logError('localStorage is not available', 'ConfigService', error);
            return false;
        }
    }
};

export default ConfigService;
