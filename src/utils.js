import {
    DOMParser as NodeDOMParser,
    XMLSerializer as NodeXMLSerializer,
} from '@xmldom/xmldom';

/**
 * Generates a RFC 4122 version 4 UUID
 * @see https://stackoverflow.com/a/2117523
 * @returns {string} A randomly generated UUID string
 * @throws {Error} If crypto.getRandomValues is not available
 */
export function uuidv4() {
    if (typeof crypto === 'undefined' || !crypto.getRandomValues) {
        throw new Error('crypto.getRandomValues is not available');
    }

    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
            c ^
            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
    );
}

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
 * Get current moment in ISO format
 * @param {Date} [date=new Date()] - The date to convert
 * @returns {string} ISO date string
 */
export function getISODate(date = new Date()) {
    return date.toISOString();
}

/**
 * Utility functions for jEpub library
 * Provides cross-platform utilities for UUID generation, HTML parsing, validation, etc.
 */

/**
 * Convert HTML to valid XHTML or plain text
 * @param {string} html - HTML string to parse
 * @param {boolean} [outText=false] - Return as plain text instead of XHTML
 * @returns {string} Parsed XHTML or plain text
 */
export function parseDOM(html, outText = false) {
    // Handle null, undefined, or non-string inputs
    if (html == null || typeof html !== 'string') {
        return '';
    }

    // Use global DOM when available (browser/happy-dom) or fallback to xmldom for Node.js
    const DOMParserToUse =
        typeof globalThis.DOMParser !== 'undefined'
            ? globalThis.DOMParser
            : NodeDOMParser;
    const XMLSerializerToUse =
        typeof globalThis.XMLSerializer !== 'undefined'
            ? globalThis.XMLSerializer
            : NodeXMLSerializer;

    const doc = new DOMParserToUse().parseFromString(
        `<!doctype html><body>${html}</body>`,
        'text/html'
    );

    // For browser environments, use doc.body; for xmldom, use doc.documentElement
    const bodyElement = doc.body || doc.documentElement;
    if (!doc || !bodyElement) {
        return '';
    }

    if (outText) {
        return bodyElement.textContent.trim();
    }

    const serializer = new XMLSerializerToUse();
    const serializedDoc = serializer.serializeToString(bodyElement);
    return serializedDoc.replace(/(^<body\s?[^>]*>|<\/body>$)/g, '');
}

/**
 * Convert HTML to plain text
 * @param {string} html - HTML string to convert
 * @param {boolean} [noBr=false] - Remove line breaks from output
 * @returns {string} Plain text content
 */
export function html2text(html, noBr = false) {
    if (typeof html !== 'string') {
        return '';
    }

    // Remove style and script tags completely
    let cleanHtml = html.replace(/<style([\s\S]*?)<\/style>/gi, '');
    cleanHtml = cleanHtml.replace(/<script([\s\S]*?)<\/script>/gi, '');

    // Convert block elements to line breaks
    cleanHtml = cleanHtml.replace(/<\/(div|p|li|dd|h[1-6])>/gi, '\n');
    cleanHtml = cleanHtml.replace(/<(br|hr)\s*[/]?>/gi, '\n');

    // Convert list items to bullet points
    cleanHtml = cleanHtml.replace(/<li>/gi, '+ ');

    // Remove all remaining HTML tags
    cleanHtml = cleanHtml.replace(/<[^>]+>/g, '');

    // Clean up excessive line breaks
    cleanHtml = cleanHtml.replace(/\n{3,}/g, '\n\n');

    // Use parseDOM for final text extraction
    const result = parseDOM(cleanHtml, true);

    // Remove line breaks if requested
    return noBr ? result.replace(/\n+/g, ' ') : result;
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

/**
 * Convert MIME type to file extension
 * @param {string} mime - MIME type string
 * @returns {string|null} File extension or null if unsupported
 */
export function mime2ext(mime) {
    if (typeof mime !== 'string') {
        return null;
    }

    // MIME type to extension mapping
    const MIME_TO_EXTENSION = {
        'image/jpg': 'jpg',
        'image/jpeg': 'jpg',
        'image/svg+xml': 'svg',
        'image/gif': 'gif',
        'image/apng': 'apng',
        'image/png': 'png',
        'image/webp': 'webp',
        'image/bmp': 'bmp',
    };

    // Check direct mapping first
    if (MIME_TO_EXTENSION[mime]) {
        return MIME_TO_EXTENSION[mime];
    }

    // For other image types, extract extension from MIME type
    if (mime.startsWith('image/')) {
        const extension = mime.split('/')[1];
        // Only return if it's a known safe extension
        if (['gif', 'apng', 'png', 'webp', 'bmp'].includes(extension)) {
            return extension;
        }
    }

    return null;
}
