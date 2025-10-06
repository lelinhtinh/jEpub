/**
 * DOM parsing and HTML utilities
 */

import {
    DOMParser as NodeDOMParser,
    XMLSerializer as NodeXMLSerializer,
} from '@xmldom/xmldom';

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
