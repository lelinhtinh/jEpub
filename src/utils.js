/**
 * Generates a UUID
 * based on: https://stackoverflow.com/a/2117523
 * @returns {string} uuid
 */

export function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
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

/**
 * https://gist.github.com/dperini/729294
 * @param {String} value
 */
export function validateUrl(value) {
    return /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
}

/**
 * Convert MIME type to extension
 * @param {String} mime
 */
export function mime2ext(mime) {
    let ext = null;
    switch (mime) {
    case 'image/gif':
        ext = 'gif';
        break;
    case 'image/apng':
        ext = 'apng';
        break;
    case 'image/jpg':
    case 'image/jpeg':
        ext = 'jpg';
        break;
    case 'image/png':
        ext = 'png';
        break;
    case 'image/webp':
        ext = 'webp';
        break;
    case 'image/svg+xml':
        ext = 'svg';
        break;
    case 'image/bmp':
        ext = 'bmp';
        break;
    default:
        ext = null;
        break;
    }
    return ext;
}
