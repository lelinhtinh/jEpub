import { describe, it, expect } from 'vitest';
import {
    uuidv4,
    isObject,
    isEmpty,
    getISODate,
    parseDOM,
    html2text,
    validateUrl,
    mime2ext,
} from '../src/utils/index.js';

describe('Utils Module', () => {
    describe('uuidv4', () => {
        it('should generate a valid UUID v4', () => {
            const uuid = uuidv4();
            expect(uuid).toMatch(
                /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
            );
        });

        it('should generate unique UUIDs', () => {
            const uuid1 = uuidv4();
            const uuid2 = uuidv4();
            expect(uuid1).not.toBe(uuid2);
        });
        it('should throw error if crypto is not available', () => {
            // Skip this test in browser environments where crypto is read-only
            if (typeof window !== 'undefined') {
                return; // Skip in browser environment
            }

            const originalCrypto = globalThis.crypto;
            delete globalThis.crypto;

            expect(() => uuidv4()).toThrow(
                'crypto.getRandomValues is not available'
            );

            globalThis.crypto = originalCrypto;
        });
    });

    describe('isObject', () => {
        it('should return true for objects', () => {
            expect(isObject({})).toBe(true);
            expect(isObject({ key: 'value' })).toBe(true);
            expect(isObject([])).toBe(true);
            expect(isObject(new Date())).toBe(true);
        });

        it('should return true for functions', () => {
            expect(isObject(() => {})).toBe(true);
            expect(isObject(function () {})).toBe(true);
        });

        it('should return false for primitives', () => {
            expect(isObject(null)).toBe(false);
            expect(isObject(undefined)).toBe(false);
            expect(isObject('')).toBe(false);
            expect(isObject('string')).toBe(false);
            expect(isObject(123)).toBe(false);
            expect(isObject(true)).toBe(false);
        });
    });

    describe('isEmpty', () => {
        it('should return true for null', () => {
            expect(isEmpty(null)).toBe(true);
        });

        it('should return true for empty strings', () => {
            expect(isEmpty('')).toBe(true);
            expect(isEmpty('   ')).toBe(true);
            expect(isEmpty('\t\n')).toBe(true);
        });

        it('should return false for non-empty strings', () => {
            expect(isEmpty('hello')).toBe(false);
            expect(isEmpty(' hello ')).toBe(false);
            expect(isEmpty('0')).toBe(false);
        });
        it('should return false for non-string values', () => {
            expect(isEmpty(0)).toBe(false);
            expect(isEmpty(false)).toBe(false);
            expect(isEmpty([])).toBe(false);
            expect(isEmpty({})).toBe(false);
            expect(isEmpty(undefined)).toBe(false); // isEmpty doesn't handle undefined as empty
        });
    });

    describe('getISODate', () => {
        it('should return ISO date string for given date', () => {
            const testDate = new Date('2023-01-01T12:00:00.000Z');
            const result = getISODate(testDate);
            expect(result).toBe('2023-01-01T12:00:00.000Z');
        });

        it('should return current date if no date provided', () => {
            const before = new Date().toISOString();
            const result = getISODate();
            const after = new Date().toISOString();

            expect(result >= before).toBe(true);
            expect(result <= after).toBe(true);
        });
    });

    describe('parseDOM', () => {
        it('should parse HTML to XHTML by default', () => {
            const html = '<div><p>Hello <strong>world</strong></p></div>';
            const result = parseDOM(html);
            expect(result).toContain('Hello');
            expect(result).toContain('world');
        });

        it('should return plain text when outText is true', () => {
            const html = '<div><p>Hello <strong>world</strong></p></div>';
            const result = parseDOM(html, true);
            expect(result).toBe('Hello world');
        });

        it('should handle empty input', () => {
            expect(parseDOM('')).toBe('');
            expect(parseDOM(null)).toBe('');
            expect(parseDOM(undefined)).toBe('');
        });

        it('should handle non-string input', () => {
            expect(parseDOM(123)).toBe('');
            expect(parseDOM({})).toBe('');
            expect(parseDOM([])).toBe('');
        });
    });

    describe('html2text', () => {
        it('should convert basic HTML to text', () => {
            const html = '<p>Hello <strong>world</strong></p>';
            const result = html2text(html);
            expect(result).toContain('Hello world');
        });

        it('should handle block elements with line breaks', () => {
            const html = '<div>First</div><p>Second</p><h1>Third</h1>';
            const result = html2text(html);
            expect(result).toContain('First');
            expect(result).toContain('Second');
            expect(result).toContain('Third');
        });

        it('should remove line breaks when noBr is true', () => {
            const html = '<div>First</div><p>Second</p>';
            const result = html2text(html, true);
            expect(result).not.toContain('\n');
            expect(result).toContain('First Second');
        });

        it('should handle list items', () => {
            const html = '<ul><li>Item 1</li><li>Item 2</li></ul>';
            const result = html2text(html);
            expect(result).toContain('+ Item 1');
            expect(result).toContain('+ Item 2');
        });

        it('should remove script and style tags', () => {
            const html =
                '<div>Content</div><script>alert("test")</script><style>body{color:red}</style>';
            const result = html2text(html);
            expect(result).toContain('Content');
            expect(result).not.toContain('alert');
            expect(result).not.toContain('color:red');
        });

        it('should handle non-string input', () => {
            expect(html2text(null)).toBe('');
            expect(html2text(undefined)).toBe('');
            expect(html2text(123)).toBe('');
        });
    });

    describe('validateUrl', () => {
        it('should validate correct URLs', () => {
            expect(validateUrl('https://example.com')).toBe(true);
            expect(validateUrl('http://test.org')).toBe(true);
            expect(validateUrl('ftp://files.example.com')).toBe(true);
            expect(
                validateUrl('https://sub.domain.com/path?param=value#hash')
            ).toBe(true);
        });

        it('should reject invalid URLs', () => {
            expect(validateUrl('not-a-url')).toBe(false);
            expect(validateUrl('http://')).toBe(false);
            expect(validateUrl('://example.com')).toBe(false);
            expect(validateUrl('')).toBe(false);
        });

        it('should handle non-string input', () => {
            expect(validateUrl(null)).toBe(false);
            expect(validateUrl(undefined)).toBe(false);
            expect(validateUrl(123)).toBe(false);
            expect(validateUrl({})).toBe(false);
        });
    });

    describe('mime2ext', () => {
        it('should convert known MIME types to extensions', () => {
            expect(mime2ext('image/jpeg')).toBe('jpg');
            expect(mime2ext('image/jpg')).toBe('jpg');
            expect(mime2ext('image/png')).toBe('png');
            expect(mime2ext('image/gif')).toBe('gif');
            expect(mime2ext('image/webp')).toBe('webp');
            expect(mime2ext('image/bmp')).toBe('bmp');
            expect(mime2ext('image/svg+xml')).toBe('svg');
        });

        it('should handle image MIME types not in direct mapping', () => {
            expect(mime2ext('image/apng')).toBe('apng');
        });

        it('should return null for unknown MIME types', () => {
            expect(mime2ext('text/plain')).toBe(null);
            expect(mime2ext('application/json')).toBe(null);
            expect(mime2ext('image/unknown')).toBe(null);
        });

        it('should handle non-string input', () => {
            expect(mime2ext(null)).toBe(null);
            expect(mime2ext(undefined)).toBe(null);
            expect(mime2ext(123)).toBe(null);
            expect(mime2ext({})).toBe(null);
        });
    });
});
