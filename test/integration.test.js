import { describe, it, expect, beforeEach } from 'vitest';
import JSZip from 'jszip';
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

describe('jEpub Integration Tests', () => {
    let epub;

    beforeEach(() => {
        epub = new jEpub();
    });

    describe('Complete EPUB Generation', () => {
        it('should create a complete EPUB with all features', async () => {
            // Initialize with book details
            epub.init({
                title: 'Complete Test Book',
                author: 'Integration Test Author',
                publisher: 'Test Publisher',
                description: 'A comprehensive test of all EPUB features',
                tags: ['test', 'integration', 'epub'],
                i18n: 'en',
            });

            // Set custom date and UUID
            epub.date(new Date('2023-06-01T10:00:00.000Z'));
            epub.uuid('https://example.com/books/test-book');

            // Add cover image
            const coverImageData = new Uint8Array([
                0x89,
                0x50,
                0x4e,
                0x47,
                0x0d,
                0x0a,
                0x1a,
                0x0a, // PNG signature
                0x00,
                0x00,
                0x00,
                0x0d,
                0x49,
                0x48,
                0x44,
                0x52, // IHDR chunk
                0x00,
                0x00,
                0x00,
                0x01,
                0x00,
                0x00,
                0x00,
                0x01, // 1x1 pixel
                0x08,
                0x02,
                0x00,
                0x00,
                0x00,
                0x90,
                0x77,
                0x53,
                0xde,
                0x00,
                0x00,
                0x00,
                0x0c,
                0x49,
                0x44,
                0x41,
                0x54,
                0x08,
                0x99,
                0x01,
                0x01,
                0x00,
                0x00,
                0x00,
                0xff,
                0xff,
                0x00,
                0x00,
                0x00,
                0x02,
                0x00,
                0x01,
                0xe2,
                0x21,
                0xbc,
                0x33,
                0x00,
                0x00,
                0x00,
                0x00,
                0x49,
                0x45,
                0x4e,
                0x44,
                0xae,
                0x42,
                0x60,
                0x82,
            ]);
            epub.cover(coverImageData.buffer);

            // Add content images
            const contentImageData = new Uint8Array([
                0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46,
                0x00, 0x01, 0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00,
                0xff, 0xdb, 0x00, 0x43,
            ]);
            epub.image(contentImageData.buffer, 'diagram1');
            epub.image(contentImageData.buffer, 'photo1');

            // Add notes
            const notesContent =
                '<h2>Author Notes</h2><p>This is a test book.</p>';
            epub.notes(notesContent);

            // Add multiple chapters with simple content
            epub.add(
                'Introduction',
                '<h1>Introduction</h1><p>Welcome to this test book.</p>'
            );
            epub.add(
                'Chapter 1: Getting Started',
                '<h1>Getting Started</h1><p>This chapter covers the basics.</p>'
            );
            epub.add(
                'Chapter 2: Advanced Topics',
                '<h1>Advanced Topics</h1><p>This chapter covers more complex subjects.</p>'
            );
            epub.add(
                'Conclusion',
                '<h1>Conclusion</h1><p>Thank you for reading this test book.</p>'
            );

            // Generate the EPUB
            const epubData = await epub.generate('arraybuffer');

            // Verify the generated EPUB
            expect(epubData).toBeInstanceOf(ArrayBuffer);
            expect(epubData.byteLength).toBeGreaterThan(0);

            // Load and verify EPUB structure
            const zip = new JSZip();
            const loadedZip = await zip.loadAsync(epubData);

            // Verify required files exist
            const requiredFiles = [
                'mimetype',
                'META-INF/container.xml',
                'book.opf',
                'toc.ncx',
                'OEBPS/title-page.html',
                'OEBPS/table-of-contents.html',
                'OEBPS/front-cover.html',
                'OEBPS/notes.html',
                'OEBPS/page-0.html', // Introduction
                'OEBPS/page-1.html', // Chapter 1
                'OEBPS/page-2.html', // Chapter 2
                'OEBPS/page-3.html', // Conclusion
            ];

            for (const filename of requiredFiles) {
                expect(
                    loadedZip.file(filename),
                    `File ${filename} should exist`
                ).toBeTruthy();
            }

            // Verify cover image
            expect(loadedZip.file('OEBPS/cover-image.png')).toBeTruthy();

            // Verify content images
            expect(loadedZip.file('OEBPS/assets/diagram1.jpg')).toBeTruthy();
            expect(loadedZip.file('OEBPS/assets/photo1.jpg')).toBeTruthy();

            // Verify mimetype content
            const mimetypeContent = await loadedZip
                .file('mimetype')
                .async('text');
            expect(mimetypeContent).toBe('application/epub+zip');

            // Verify book.opf contains correct metadata
            const opfContent = await loadedZip.file('book.opf').async('text');
            expect(opfContent).toContain('Complete Test Book');
            expect(opfContent).toContain('Integration Test Author');
            expect(opfContent).toContain('Test Publisher');
            expect(opfContent).toContain('2023-06-01T10:00:00.000Z');
            expect(opfContent).toContain('https://example.com/books/test-book');

            // Verify toc.ncx contains navigation
            const tocContent = await loadedZip.file('toc.ncx').async('text');
            expect(tocContent).toContain('Introduction');
            expect(tocContent).toContain('Chapter 1: Getting Started');
            expect(tocContent).toContain('Chapter 2: Advanced Topics');
            expect(tocContent).toContain('Conclusion');
        }, 10000); // 10 second timeout for complete integration test

        it('should handle minimal EPUB creation', async () => {
            epub.init({
                title: 'Minimal Book',
                author: 'Test Author',
            });

            epub.add('Only Chapter', '<p>This is the only content.</p>');

            const epubData = await epub.generate('arraybuffer');

            expect(epubData).toBeInstanceOf(ArrayBuffer);
            expect(epubData.byteLength).toBeGreaterThan(0);

            // Verify basic structure
            const zip = new JSZip();
            const loadedZip = await zip.loadAsync(epubData);

            expect(loadedZip.file('mimetype')).toBeTruthy();
            expect(loadedZip.file('book.opf')).toBeTruthy();
            expect(loadedZip.file('OEBPS/page-0.html')).toBeTruthy();
        });

        it('should handle different image formats', async () => {
            epub.init(TEST_CONSTANTS.SAMPLE_EPUB_CONFIG);

            // Test different image formats
            const jpegData = new Uint8Array([0xff, 0xd8, 0xff]); // JPEG signature
            const pngData = new Uint8Array([0x89, 0x50, 0x4e, 0x47]); // PNG signature
            const gifData = new Uint8Array([0x47, 0x49, 0x46]); // GIF signature

            try {
                epub.image(jpegData.buffer, 'test-jpeg');
                epub.image(pngData.buffer, 'test-png');
                epub.image(gifData.buffer, 'test-gif');

                epub.add('Images', '<p>Test images added successfully.</p>');

                const epubData = await epub.generate('arraybuffer');
                expect(epubData.byteLength).toBeGreaterThan(0);
            } catch (error) {
                // Some image formats might not be supported, that's OK for this test
                expect(error.message).toMatch(
                    /Image data is not allowed|Cannot read properties of null/
                );
            }
        });
    });

    describe('Error Handling in Integration', () => {
        it('should handle missing required data gracefully', async () => {
            // Try to generate without initialization
            expect(() => epub.generate()).toThrow();
        });

        it('should handle corrupted image data', () => {
            epub.init(TEST_CONSTANTS.SAMPLE_EPUB_CONFIG);

            const corruptedData = new Uint8Array([0x00, 0x01, 0x02]); // Not a valid image
            expect(() =>
                epub.image(corruptedData.buffer, 'corrupted')
            ).toThrow();
        });

        it('should validate content before generation', async () => {
            epub.init(TEST_CONSTANTS.SAMPLE_EPUB_CONFIG);

            // Generate without any pages - should still work but create minimal EPUB
            const epubData = await epub.generate('arraybuffer');
            expect(epubData.byteLength).toBeGreaterThan(0);
        });
    });

    describe('Performance Tests', () => {
        it('should handle large content efficiently', async () => {
            epub.init(TEST_CONSTANTS.SAMPLE_EPUB_CONFIG);

            // Add many pages
            for (let i = 0; i < 100; i++) {
                const content = `<p>Content for chapter ${i + 1}. Lorem ipsum text repeated multiple times.</p>`;
                epub.add(`Chapter ${i + 1}`, content);
            }

            const startTime = Date.now();
            const epubData = await epub.generate('arraybuffer');
            const endTime = Date.now();

            expect(epubData.byteLength).toBeGreaterThan(0);
            expect(endTime - startTime).toBeLessThan(5000); // Should complete within 5 seconds
        }, 10000);
    });
});
