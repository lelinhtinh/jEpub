import { describe, it, expect } from 'vitest';
import { isObject, isEmpty, validateUrl } from '../../src/utils/validation.js';

describe('Validation utilities', () => {
    describe('isObject', () => {
        it('should return true for plain objects', () => {
            expect(isObject({})).toBe(true);
            expect(isObject({ key: 'value' })).toBe(true);
        });

        it('should return false for null', () => {
            expect(isObject(null)).toBe(false);
        });

        it('should return true for arrays (original behavior)', () => {
            expect(isObject([])).toBe(true);
            expect(isObject([1, 2, 3])).toBe(true);
        });

        it('should return true for functions (original behavior)', () => {
            expect(isObject(() => {})).toBe(true);
            expect(isObject(function () {})).toBe(true);
        });

        it('should return false for primitives', () => {
            expect(isObject('string')).toBe(false);
            expect(isObject(123)).toBe(false);
            expect(isObject(true)).toBe(false);
            expect(isObject(undefined)).toBe(false);
        });

        it('should return true for Date objects (original behavior)', () => {
            expect(isObject(new Date())).toBe(true);
        });

        it('should return true for RegExp objects (original behavior)', () => {
            expect(isObject(/regex/)).toBe(true);
        });
    });

    describe('isEmpty', () => {
        it('should return true for null, false for undefined (original behavior)', () => {
            expect(isEmpty(null)).toBe(true);
            expect(isEmpty(undefined)).toBe(false);
        });

        it('should return true for empty strings', () => {
            expect(isEmpty('')).toBe(true);
            expect(isEmpty('   ')).toBe(true);
        });

        it('should return false for non-empty strings', () => {
            expect(isEmpty('hello')).toBe(false);
            expect(isEmpty('  hello  ')).toBe(false);
        });

        it('should return false for numbers', () => {
            expect(isEmpty(0)).toBe(false);
            expect(isEmpty(123)).toBe(false);
            expect(isEmpty(-1)).toBe(false);
        });

        it('should return false for booleans', () => {
            expect(isEmpty(true)).toBe(false);
            expect(isEmpty(false)).toBe(false);
        });

        it('should return false for objects and arrays', () => {
            expect(isEmpty({})).toBe(false);
            expect(isEmpty([])).toBe(false);
            expect(isEmpty({ key: 'value' })).toBe(false);
        });
    });

    describe('validateUrl', () => {
        it('should return true for valid HTTP URLs', () => {
            expect(validateUrl('http://example.com')).toBe(true);
            expect(validateUrl('https://example.com')).toBe(true);
            expect(validateUrl('https://www.example.com/path?query=1')).toBe(
                true
            );
        });

        it('should return true for valid FTP URLs', () => {
            expect(validateUrl('ftp://ftp.example.com')).toBe(true);
        });

        it('should return true for other valid protocols', () => {
            expect(validateUrl('mailto:test@example.com')).toBe(true);
            expect(validateUrl('tel:+1234567890')).toBe(true);
        });

        it('should return false for invalid URLs', () => {
            expect(validateUrl('not-a-url')).toBe(false);
            expect(validateUrl('http://')).toBe(false);
            expect(validateUrl('')).toBe(false);
            expect(validateUrl('just-text')).toBe(false);
        });

        it('should return false for null and undefined', () => {
            expect(validateUrl(null)).toBe(false);
            expect(validateUrl(undefined)).toBe(false);
        });

        it('should handle URLs with special characters (original behavior)', () => {
            expect(validateUrl('https://example.com/path with spaces')).toBe(
                true
            );
            expect(
                validateUrl(
                    'https://example.com/path%20with%20encoded%20spaces'
                )
            ).toBe(true);
        });

        it('should validate complex URLs', () => {
            expect(
                validateUrl(
                    'https://user:pass@example.com:8080/path?query=value#fragment'
                )
            ).toBe(true);
        });

        it('should work in environments without URL constructor', () => {
            // Mock environment without URL constructor
            const originalURL = globalThis.URL;
            delete globalThis.URL;

            expect(validateUrl('https://example.com')).toBe(true);
            expect(validateUrl('not-a-url')).toBe(false);

            // Restore URL constructor
            globalThis.URL = originalURL;
        });
    });
});
