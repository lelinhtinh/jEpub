import { vi } from 'vitest';

// Mock crypto for UUID generation in test environment
if (typeof globalThis.crypto === 'undefined') {
    globalThis.crypto = {
        getRandomValues: vi.fn((array) => {
            for (let i = 0; i < array.length; i++) {
                array[i] = Math.floor(Math.random() * 256);
            }
            return array;
        }),
    };
}

// Mock Blob constructor for testing
if (typeof globalThis.Blob === 'undefined') {
    globalThis.Blob = class {
        constructor(parts, options) {
            this.parts = parts;
            this.type = options?.type || '';
            this.size =
                parts?.reduce((acc, part) => acc + (part?.length || 0), 0) || 0;
        }
    };
}

// Global test constants
globalThis.TEST_CONSTANTS = {
    SAMPLE_HTML:
        '<h1>Test Title</h1><p>Test content with <strong>bold</strong> text.</p>',
    SAMPLE_EPUB_CONFIG: {
        title: 'Test Book',
        author: 'Test Author',
        publisher: 'Test Publisher',
        description: 'A test book for unit testing',
        tags: ['test', 'unit-test'],
        i18n: 'en',
    },
    MOCK_IMAGE_DATA: new Uint8Array([
        0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01,
        0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43,
    ]),
};
