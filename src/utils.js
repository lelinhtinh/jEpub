/**
 * Generates a UUID
 * based on: https://stackoverflow.com/a/2117523
 * @returns {string} uuid
 */

export function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

/**
 * Checks if a data is ArrayBuffer
 * @returns {boolean}
 */
export function isArrayBuffer(data) {
    return data instanceof ArrayBuffer;
}

/**
 * Checks if a value is empty
 * @returns {boolean}
 */
export function isEmpty(val) {
    if (val === null) {
        return true;
    } else if (typeof val === 'number') {
        return false;
    } else if (typeof val === 'string') {
        return !val.trim();
    }
    return false;
}

/**
 * Get current moment in ISO format
 * @param {Object} date
 * @returns {string} ISO date
 */
export function getISODate(date = new Date()) {
    return date.toISOString();
}

/**
 * Convert convert HTML to valid XHTML
 * @param {String} html
 * @param {String} outText return as plain text
 */
export function parseDOM(html, outText = false) {
    let doc = (new DOMParser).parseFromString(
        `<!doctype html><body>${html}`,
        'text/html');
    if (outText) return doc.body.textContent.trim();
    doc = (new XMLSerializer).serializeToString(doc.body);
    doc = doc.replace(/(^<body\s?[^>]*>|<\/body>$)/g, '');
    return doc;
}

/**
 * Convert HTML to plain text
 * @param {String} html
 */
export function html2text(html, noBr = false) {
    html = html.replace(/<style([\s\S]*?)<\/style>/gi, '');
    html = html.replace(/<script([\s\S]*?)<\/script>/gi, '');
    html = html.replace(/<\/(div|p|li|dd|h[1-6])>/gi, '\n');
    html = html.replace(/<(br|hr)\s*[/]?>/gi, '\n');
    html = html.replace(/<li>/ig, '+ ');
    html = html.replace(/<[^>]+>/g, '');
    html = html.replace(/\n{3,}/g, '\n\n');
    html = parseDOM(html, true);
    if (noBr) html = html.replace(/\n+/g, ' ');
    return html;
}
