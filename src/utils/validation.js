/**
 * Validation utilities
 */

/**
 * Checks if a value is an object (including functions)
 * @see https://stackoverflow.com/a/14706877
 * @param {*} obj - The value to check
 * @returns {boolean} True if the value is an object or function
 */
export function isObject(obj) {
    const type = typeof obj;
    return type === 'function' || (type === 'object' && !!obj);
}

/**
 * Checks if a value is empty
 * @param {*} val - The value to check
 * @returns {boolean} True if the value is null, empty string, or whitespace-only string
 */
export function isEmpty(val) {
    if (val === null) {
        return true;
    }

    if (typeof val === 'string') {
        return !val.trim();
    }

    return false;
}

/**
 * Validates if a string is a valid URL
 * @param {string} value - The URL string to validate
 * @returns {boolean} True if the value is a valid URL
 */
export function validateUrl(value) {
    // Check if value is a string
    if (typeof value !== 'string') {
        return false;
    }

    // Check if URL constructor is available
    if (typeof URL === 'undefined') {
        // Fallback to regex validation for environments without URL constructor
        return /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
            value
        );
    }

    try {
        new URL(value);
        return true;
    } catch {
        return false;
    }
}
