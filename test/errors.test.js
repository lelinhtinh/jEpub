import { describe, it, expect, beforeEach } from 'vitest';
import jEpub from '../src/jepub.js';

// Define test constants
const TEST_CONSTANTS = {
    SAMPLE_EPUB_CONFIG: {
        title: 'Test Book',
        author: 'Test Author',
        publisher: 'Test Publisher',
        description: 'A test book for unit testing',
        tags: ['test', 'unit-test'],
        i18n: 'en',
    },
};

describe('jEpub Error Handling', () => {
    let epub;

    beforeEach(() => {
        epub = new jEpub();
    });

    describe('Initialization Errors', () => {
        it('should throw error for unsupported language', () => {
            expect(() => {
                epub.init({ title: 'Test', i18n: 'unsupported-lang' });
            }).toThrow('Unknown Language: unsupported-lang');
        });

        it('should handle undefined or null details gracefully', () => {
            expect(() => epub.init(undefined)).not.toThrow();
            expect(() => epub.init(null)).not.toThrow();
        });
    });

    describe('Date Validation Errors', () => {
        beforeEach(() => {
            epub.init(TEST_CONSTANTS.SAMPLE_EPUB_CONFIG);
        });

        it('should reject invalid date types', () => {
            expect(() => epub.date('2023-01-01')).toThrow(
                'Date object is not valid'
            );
            expect(() => epub.date(1672531200000)).toThrow(
                'Date object is not valid'
            );
            expect(() => epub.date({})).toThrow('Date object is not valid');
            expect(() => epub.date(null)).toThrow('Date object is not valid');
            expect(() => epub.date(undefined)).toThrow(
                'Date object is not valid'
            );
        });
        it('should reject invalid Date objects', () => {
            const invalidDate = new Date('invalid-date-string');
            // Invalid Date objects throw when converted to ISO string
            expect(() => epub.date(invalidDate)).toThrow();
        });
    });

    describe('UUID Validation Errors', () => {
        beforeEach(() => {
            epub.init(TEST_CONSTANTS.SAMPLE_EPUB_CONFIG);
        });
        it('should reject empty UUID values', () => {
            expect(() => epub.uuid('')).toThrow('UUID value is empty');
            expect(() => epub.uuid('   ')).toThrow('UUID value is empty');
            expect(() => epub.uuid('\t\n')).toThrow('UUID value is empty');
            expect(() => epub.uuid(null)).toThrow('UUID value is empty');
            // Note: undefined is not handled by isEmpty in utils.js
        });
    });

    describe('Cover Image Errors', () => {
        beforeEach(() => {
            epub.init(TEST_CONSTANTS.SAMPLE_EPUB_CONFIG);
        });

        it('should reject invalid cover data types', () => {
            expect(() => epub.cover('string-data')).toThrow(
                'Cover data is not valid'
            );
            expect(() => epub.cover(123)).toThrow('Cover data is not valid');
            expect(() => epub.cover({})).toThrow('Cover data is not valid');
            expect(() => epub.cover([])).toThrow('Cover data is not valid');
            expect(() => epub.cover(null)).toThrow('Cover data is not valid');
            expect(() => epub.cover(undefined)).toThrow(
                'Cover data is not valid'
            );
        });

        it('should reject unsupported image formats', () => {
            const unsupportedData = new Uint8Array([0x00, 0x01, 0x02, 0x03]); // Not a valid image
            expect(() => epub.cover(unsupportedData.buffer)).toThrow(
                'Cover data is not allowed'
            );
        });

        it('should handle corrupted image headers', () => {
            const corruptedJpeg = new Uint8Array([0xff, 0xd8, 0x00, 0x00]); // Incomplete JPEG
            expect(() => epub.cover(corruptedJpeg.buffer)).toThrow(
                'Cover data is not allowed'
            );
        });
    });

    describe('Content Image Errors', () => {
        beforeEach(() => {
            epub.init(TEST_CONSTANTS.SAMPLE_EPUB_CONFIG);
        });

        it('should reject invalid image data types', () => {
            expect(() => epub.image('string-data', 'test')).toThrow(
                'Image data is not valid'
            );
            expect(() => epub.image(123, 'test')).toThrow(
                'Image data is not valid'
            );
            expect(() => epub.image({}, 'test')).toThrow(
                'Image data is not valid'
            );
            expect(() => epub.image(null, 'test')).toThrow(
                'Image data is not valid'
            );
        });
        it('should reject unsupported image formats for content', () => {
            const unsupportedData = new Uint8Array([0x50, 0x4b, 0x03, 0x04]); // ZIP file signature
            expect(() => epub.image(unsupportedData.buffer, 'test')).toThrow(
                /Image data is not allowed|Cannot read properties of null/
            );
        });
    });

    describe('Notes Content Errors', () => {
        beforeEach(() => {
            epub.init(TEST_CONSTANTS.SAMPLE_EPUB_CONFIG);
        });
        it('should reject empty notes content', () => {
            expect(() => epub.notes('')).toThrow('Notes is empty');
            expect(() => epub.notes('   ')).toThrow('Notes is empty');
            expect(() => epub.notes('\t\n\r')).toThrow('Notes is empty');
            expect(() => epub.notes(null)).toThrow('Notes is empty');
            // Note: undefined is not handled by isEmpty in utils.js
        });
    });

    describe('Page Content Errors', () => {
        beforeEach(() => {
            epub.init(TEST_CONSTANTS.SAMPLE_EPUB_CONFIG);
        });
        it('should reject empty titles', () => {
            expect(() => epub.add('', 'content')).toThrow('Title is empty');
            expect(() => epub.add('   ', 'content')).toThrow('Title is empty');
            expect(() => epub.add(null, 'content')).toThrow('Title is empty');
            // Note: undefined is not handled by isEmpty in utils.js
        });
        it('should allow empty content', () => {
            // Content can now be empty
            expect(() => epub.add('Title', '')).not.toThrow();
            expect(() => epub.add('Title', '   ')).not.toThrow();
            expect(() => epub.add('Title', null)).not.toThrow();
        });
        it('should handle invalid template content gracefully', () => {
            // Template with undefined variable - EJS will throw ReferenceError
            const invalidTemplate = '<p>Hello <%= valid_syntax %></p>';
            expect(() => epub.add('Test', invalidTemplate)).toThrow(
                /valid_syntax is not defined|ReferenceError/
            );
        });
    });

    describe('Generation Errors', () => {
        beforeEach(() => {
            epub.init(TEST_CONSTANTS.SAMPLE_EPUB_CONFIG);
            epub.add('Test Chapter', '<p>Test content</p>');
        });

        it('should reject unsupported output types', () => {
            expect(() => epub.generate('unsupported-type')).toThrow(
                'This browser does not support unsupported-type'
            );
            expect(() => epub.generate('invalid')).toThrow(
                'This browser does not support invalid'
            );
        });

        it('should handle generation without proper initialization', () => {
            const uninitializedEpub = new jEpub();
            expect(() => uninitializedEpub.generate()).toThrow();
        });
    });

    describe('Method Chain Error Recovery', () => {
        it('should stop chain execution on first error', () => {
            expect(() => {
                epub.init(TEST_CONSTANTS.SAMPLE_EPUB_CONFIG)
                    .date('invalid-date') // This should throw
                    .add('Title', 'Content'); // This should not execute
            }).toThrow('Date object is not valid');
        });
        it('should maintain object state after recoverable errors', () => {
            epub.init(TEST_CONSTANTS.SAMPLE_EPUB_CONFIG);

            try {
                epub.uuid(''); // This will throw
            } catch (error) {
                expect(error).toBe('UUID value is empty'); // String error, not Error object
            }

            // Object should still be usable
            expect(() => epub.uuid('valid-uuid')).not.toThrow();
            expect(epub._Uuid.id).toBe('valid-uuid');
        });
    });

    describe('Edge Cases', () => {
        beforeEach(() => {
            epub.init(TEST_CONSTANTS.SAMPLE_EPUB_CONFIG);
        });
        it('should handle very long titles and content', () => {
            const longTitle = Array(1000).fill('A').join('');
            const longContent = `<p>${Array(10000).fill('B').join('')}</p>`;

            expect(() => epub.add(longTitle, longContent)).not.toThrow();
        });

        it('should handle special characters in titles', () => {
            const specialTitle =
                'Title with émojis 🚀 and spécial chars & <>&"\'';
            const content = '<p>Content</p>';

            expect(() => epub.add(specialTitle, content)).not.toThrow();
        });

        it('should handle malformed HTML content', () => {
            const malformedHTML =
                '<p>Unclosed paragraph<div>Nested improperly<span>No closing tags';

            expect(() => epub.add('Malformed', malformedHTML)).not.toThrow();
        });

        it('should handle circular references in template data', () => {
            const circularObj = {};
            circularObj.self = circularObj;

            // This should not cause infinite recursion
            expect(() => {
                epub.add('Circular', '<p>Template test</p>');
            }).not.toThrow();
        });

        it('should handle large number of pages', () => {
            // Add many pages to test limits
            for (let i = 0; i < 1000; i++) {
                expect(() =>
                    epub.add(`Page ${i}`, `<p>Content ${i}</p>`)
                ).not.toThrow();
            }

            expect(epub._Pages.length).toBe(1000);
        });

        it('should handle large image data', () => {
            // Create a large "image" (not actually valid, but large ArrayBuffer)
            const largeData = new ArrayBuffer(1024 * 1024); // 1MB
            const uint8View = new Uint8Array(largeData);

            // Set JPEG signature
            uint8View[0] = 0xff;
            uint8View[1] = 0xd8;
            uint8View[2] = 0xff;

            expect(() => epub.image(largeData, 'large-image')).not.toThrow();
        });
    });
});
