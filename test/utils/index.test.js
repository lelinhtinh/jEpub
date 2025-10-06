import { describe, it, expect } from 'vitest';

// Import all utilities from the main index
import {
    uuidv4,
    isObject,
    isEmpty,
    validateUrl,
    getISODate,
    mime2ext,
    parseDOM,
    html2text,
} from '../../src/utils/index.js';

describe('Utils Index - Integration Tests', () => {
    it('should export all utility functions', () => {
        expect(typeof uuidv4).toBe('function');
        expect(typeof isObject).toBe('function');
        expect(typeof isEmpty).toBe('function');
        expect(typeof validateUrl).toBe('function');
        expect(typeof getISODate).toBe('function');
        expect(typeof mime2ext).toBe('function');
        expect(typeof parseDOM).toBe('function');
        expect(typeof html2text).toBe('function');
    });

    it('should have working UUID generation', () => {
        const uuid = uuidv4();
        expect(uuid).toMatch(
            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        );
    });

    it('should have working validation functions', () => {
        expect(isObject({})).toBe(true);
        expect(isEmpty('')).toBe(true);
        expect(validateUrl('https://example.com')).toBe(true);
    });

    it('should have working date utilities', () => {
        const date = getISODate();
        expect(date).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it('should have working MIME utilities', () => {
        expect(mime2ext('image/png')).toBe('png');
    });

    it('should have working DOM utilities', () => {
        expect(parseDOM('<p>test</p>', true)).toBe('test');
        expect(html2text('<p>test</p>')).toBe('test');
    });

    describe('Cross-module integration', () => {
        it('should work together in realistic scenarios', () => {
            // Generate a unique ID
            const id = uuidv4();
            expect(isEmpty(id)).toBe(false);
            expect(isObject(id)).toBe(false);

            // Process some HTML content
            const html = '<div><p>Sample content</p></div>';
            const parsedHtml = parseDOM(html);
            const textContent = html2text(html);

            expect(isEmpty(parsedHtml)).toBe(false);
            expect(isEmpty(textContent)).toBe(false);
            expect(textContent).toBe('Sample content');

            // Handle dates and MIME types
            const currentDate = getISODate();
            const imageExt = mime2ext('image/jpeg');

            expect(
                validateUrl(`https://example.com/image-${id}.${imageExt}`)
            ).toBe(true);
            expect(isEmpty(currentDate)).toBe(false);
        });

        it('should handle edge cases across modules', () => {
            // Test with empty/null inputs across all functions
            expect(isEmpty(parseDOM(''))).toBe(true);
            expect(isEmpty(html2text(''))).toBe(true);
            expect(mime2ext('invalid')).toBe(null);
            expect(validateUrl('invalid')).toBe(false);

            // Test with valid inputs
            expect(isEmpty(uuidv4())).toBe(false);
            expect(isObject({})).toBe(true);
            expect(getISODate()).toMatch(/Z$/);
        });
    });
});
