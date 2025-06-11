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
// Cache for jsdom module
let jsdomModule = null;
let jsdomLoadAttempted = false;

/**
 * Lazy load jsdom in Node.js environment
 * @returns {Object|null} jsdom module or null if not available
 */
function getJSDOM() {
    if (!jsdomLoadAttempted) {
        jsdomLoadAttempted = true;
        try {
            // Use dynamic require to load jsdom only in Node.js
            const module = eval('require')('jsdom');
            jsdomModule = module;
        } catch {
            // jsdom not available, will fallback to simple parsing
            jsdomModule = null;
        }
    }
    return jsdomModule;
}

// HTML entity map for fallback text conversion
const HTML_ENTITIES = {
    '&nbsp;': ' ',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
};

/**
 * Simple HTML to text conversion fallback
 * @param {string} html - HTML string to convert
 * @returns {string} Plain text
 */
function simpleHtmlToText(html) {
    let text = html.replace(/<[^>]+>/g, '');

    // Replace HTML entities
    Object.entries(HTML_ENTITIES).forEach(([entity, replacement]) => {
        text = text.replace(new RegExp(entity, 'gi'), replacement);
    });

    return text.trim();
}

/**
 * Parse DOM using jsdom in Node.js environment
 * @param {string} html - HTML string to parse
 * @param {boolean} outText - Whether to return plain text
 * @returns {string|null} Parsed result or null if failed
 */
function parseWithJSDOM(html, outText) {
    const jsdom = getJSDOM();

    if (!jsdom) {
        return null;
    }

    try {
        const { JSDOM } = jsdom;
        const dom = new JSDOM(`<!doctype html><body>${html}</body>`);
        const document = dom.window.document;

        if (outText) {
            return document.body.textContent.trim();
        }

        // Convert to XHTML-like format
        const XMLSerializer = dom.window.XMLSerializer;
        if (XMLSerializer) {
            const serializer = new XMLSerializer();
            const doc = serializer.serializeToString(document.body);
            return doc.replace(/(^<body\s?[^>]*>|<\/body>$)/g, '');
        }

        // Fallback to innerHTML if XMLSerializer not available
        return document.body.innerHTML;
    } catch {
        return null;
    }
}

/**
 * Parse DOM using browser DOMParser
 * @param {string} html - HTML string to parse
 * @param {boolean} outText - Whether to return plain text
 * @returns {string} Parsed result
 */
function parseWithBrowserDOM(html, outText) {
    const doc = new DOMParser().parseFromString(
        `<!doctype html><body>${html}`,
        'text/html'
    );

    if (outText) {
        return doc.body.textContent.trim();
    }

    const serializedDoc = new XMLSerializer().serializeToString(doc.body);
    return serializedDoc.replace(/(^<body\s?[^>]*>|<\/body>$)/g, '');
}

/**
 * Convert HTML to valid XHTML or plain text
 * @param {string} html - HTML string to parse
 * @param {boolean} [outText=false] - Return as plain text instead of XHTML
 * @returns {string} Parsed XHTML or plain text
 */
export function parseDOM(html, outText = false) {
    // Validate input
    if (typeof html !== 'string') {
        return '';
    }

    // Check if running in Node.js environment
    if (typeof DOMParser === 'undefined') {
        // Node.js implementation using jsdom
        const jsdomResult = parseWithJSDOM(html, outText);

        if (jsdomResult !== null) {
            return jsdomResult;
        }

        // Fallback: Simple HTML processing without DOM parsing
        if (outText) {
            return simpleHtmlToText(html);
        }

        // For XHTML conversion, return as-is (simplified approach)
        return html;
    }

    // Browser implementation using DOMParser
    return parseWithBrowserDOM(html, outText);
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
 * @see https://gist.github.com/dperini/729294
 * @param {string} value - The URL string to validate
 * @returns {boolean} True if the value is a valid URL
 */
export function validateUrl(value) {
    if (typeof value !== 'string') {
        return false;
    }

    const urlRegex =
        /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;

    return urlRegex.test(value);
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

/**
 * Convert MIME type to file extension
 * @param {string} mime - MIME type string
 * @returns {string|null} File extension or null if unsupported
 */
export function mime2ext(mime) {
    if (typeof mime !== 'string') {
        return null;
    }

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
