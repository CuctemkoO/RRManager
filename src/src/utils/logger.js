/**
 * Logger utility for RR Manager
 * Integrates with Synology system logs when available
 * Falls back to console logging otherwise
 */

const LOG_LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    CRITICAL: 4
};

const CURRENT_LEVEL = LOG_LEVELS.DEBUG; // Can be configured via constants

/**
 * Send log to Synology system log if API is available
 * @param {string} level - Log level (INFO, WARN, ERROR, etc.)
 * @param {string} message - Log message
 * @param {string} source - Source component name
 */
function logToSynology(level, message, source = 'RRManager') {
    try {
        // Check if Synology WebAPI is available
        if (window.SYNO && window.SYNO.API) {
            // Use SYNO.Core.System log API if available
            const apiName = 'SYNO.Core.System';
            const method = 'log';
            const version = 1;
            
            // Map our levels to Synology levels
            const synoLevelMap = {
                'DEBUG': 'info',
                'INFO': 'info',
                'WARN': 'warning',
                'ERROR': 'error',
                'CRITICAL': 'critical'
            };
            
            const params = {
                type: 'rr_manager',
                level: synoLevelMap[level] || 'info',
                message: `[${source}] ${message}`
            };
            
            // Fire and forget - don't wait for response
            SYNO.API.currentManager.requestAPI(apiName, method, version, params);
        }
    } catch (e) {
        // Silently fail - we don't want logging errors to break the app
        console.debug('Failed to send log to Synology:', e);
    }
}

/**
 * Main logging function
 * @param {number} level - Log level from LOG_LEVELS
 * @param {string} message - Log message
 * @param {string} source - Source component name
 * @param {Error|null} error - Optional error object
 */
export function log(level, message, source = 'RRManager', error = null) {
    if (level < CURRENT_LEVEL) {
        return;
    }

    const levelName = Object.keys(LOG_LEVELS).find(key => LOG_LEVELS[key] === level) || 'UNKNOWN';
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${levelName}] [${source}]`;
    
    const fullMessage = error 
        ? `${prefix} ${message}: ${error.message || error}`
        : `${prefix} ${message}`;

    // Always log to console for development
    switch (level) {
        case LOG_LEVELS.DEBUG:
            console.debug(fullMessage);
            break;
        case LOG_LEVELS.INFO:
            console.info(fullMessage);
            break;
        case LOG_LEVELS.WARN:
            console.warn(fullMessage);
            break;
        case LOG_LEVELS.ERROR:
        case LOG_LEVELS.CRITICAL:
            console.error(fullMessage);
            break;
        default:
            console.log(fullMessage);
    }

    // Send to Synology log for WARN and above
    if (level >= LOG_LEVELS.WARN) {
        logToSynology(levelName, error ? `${message}: ${error.message}` : message, source);
    }
}

// Convenience methods
export const logDebug = (msg, src) => log(LOG_LEVELS.DEBUG, msg, src);
export const logInfo = (msg, src) => log(LOG_LEVELS.INFO, msg, src);
export const logWarn = (msg, src) => log(LOG_LEVELS.WARN, msg, src);
export const logError = (msg, src, err) => log(LOG_LEVELS.ERROR, msg, src, err);
export const logCritical = (msg, src, err) => log(LOG_LEVELS.CRITICAL, msg, src, err);

/**
 * Set logging level at runtime
 * @param {number} level - New log level
 */
export function setLogLevel(level) {
    if (LOG_LEVELS[level] !== undefined) {
        CURRENT_LEVEL = typeof level === 'string' ? LOG_LEVELS[level] : level;
        logInfo(`Log level set to ${Object.keys(LOG_LEVELS).find(key => LOG_LEVELS[key] === CURRENT_LEVEL)}`, 'Logger');
    }
}

export { LOG_LEVELS };
