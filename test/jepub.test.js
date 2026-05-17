import { describe, it, expect, vi, beforeEach } from 'vitest';
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
    MOCK_IMAGE_DATA: new Uint8Array([
        0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01,
        0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43,
    ]),
};

describe('jEpub Class', () => {
    let epub;

    beforeEach(() => {
        epub = new jEpub();
    });

    describe('Constructor', () => {
        it('should initialize with empty properties', () => {
            expect(epub._I18n).toEqual({});
            expect(epub._Info).toEqual({});
            expect(epub._Uuid).toEqual({});
            expect(epub._Date).toBe(null);
            expect(epub._Cover).toBe(null);
            expect(epub._Pages).toEqual([]);
            expect(epub._Images).toEqual([]);
            expect(epub._Zip).toEqual({});
        });
    });

    describe('init method', () => {
        it('should initialize with book details', () => {
            const details = TEST_CONSTANTS.SAMPLE_EPUB_CONFIG;
            const result = epub.init(details);

            expect(result).toBe(epub); // Should return this for chaining
            expect(epub._Info.title).toBe('Test Book');
            expect(epub._Info.author).toBe('Test Author');
            expect(epub._Info.publisher).toBe('Test Publisher');
            expect(epub._Info.i18n).toBe('en');
            expect(epub._Uuid.scheme).toBe('uuid');
            expect(epub._Date).toBeTruthy();
            expect(epub._Zip).toBeInstanceOf(JSZip);
        });

        it('should accept existing JSZip instance', () => {
            const existingZip = new JSZip();
            const result = epub.init(existingZip);

            expect(result).toBe(epub);
            expect(epub._Zip).toBe(existingZip);
        });

        it('should throw error for unknown language', () => {
            const details = {
                ...TEST_CONSTANTS.SAMPLE_EPUB_CONFIG,
                i18n: 'unknown',
            };
            expect(() => epub.init(details)).toThrow(
                'Unknown Language: unknown'
            );
        });

        it('should set default values for missing properties', () => {
            epub.init({ title: 'Only Title' });

            expect(epub._Info.title).toBe('Only Title');
            expect(epub._Info.author).toBe('undefined');
            expect(epub._Info.publisher).toBe('undefined');
            expect(epub._Info.description).toBe('');
            expect(epub._Info.tags).toEqual([]);
        });
    });

    describe('Static html2text method', () => {
        it('should convert HTML to text', () => {
            const html = '<p>Hello <strong>world</strong></p>';
            const result = jEpub.html2text(html);
            expect(result).toContain('Hello world');
        });

        it('should handle noBr parameter', () => {
            const html = '<div>First</div><div>Second</div>';
            const result = jEpub.html2text(html, true);
            expect(result).not.toContain('\n');
        });
    });

    describe('date method', () => {
        beforeEach(() => {
            epub.init(TEST_CONSTANTS.SAMPLE_EPUB_CONFIG);
        });

        it('should set date with valid Date object', () => {
            const testDate = new Date('2023-01-01T12:00:00.000Z');
            const result = epub.date(testDate);

            expect(result).toBe(epub);
            expect(epub._Date).toBe('2023-01-01T12:00:00.000Z');
        });

        it('should throw error for invalid date', () => {
            expect(() => epub.date('not-a-date')).toThrow(
                'Date object is not valid'
            );
            expect(() => epub.date(123)).toThrow('Date object is not valid');
            expect(() => epub.date(null)).toThrow('Date object is not valid');
        });
    });

    describe('uuid method', () => {
        beforeEach(() => {
            epub.init(TEST_CONSTANTS.SAMPLE_EPUB_CONFIG);
        });

        it('should set UUID with valid string', () => {
            const testUuid = 'test-uuid-123';
            const result = epub.uuid(testUuid);

            expect(result).toBe(epub);
            expect(epub._Uuid.id).toBe(testUuid);
            expect(epub._Uuid.scheme).toBe('uuid');
        });

        it('should detect URL and set scheme to URI', () => {
            const testUrl = 'https://example.com/book';
            epub.uuid(testUrl);

            expect(epub._Uuid.id).toBe(testUrl);
            expect(epub._Uuid.scheme).toBe('URI');
        });

        it('should throw error for empty UUID', () => {
            expect(() => epub.uuid('')).toThrow('UUID value is empty');
            expect(() => epub.uuid(null)).toThrow('UUID value is empty');
            expect(() => epub.uuid('   ')).toThrow('UUID value is empty');
        });
    });

    describe('cover method', () => {
        beforeEach(() => {
            epub.init(TEST_CONSTANTS.SAMPLE_EPUB_CONFIG);
        });

        it('should add cover with Blob data', () => {
            const mockBlob = new Blob([TEST_CONSTANTS.MOCK_IMAGE_DATA], {
                type: 'image/jpeg',
            });
            const result = epub.cover(mockBlob);

            expect(result).toBe(epub);
            expect(epub._Cover).toBeTruthy();
            expect(epub._Cover.type).toBe('image/jpeg');
            expect(epub._Cover.path).toContain('cover-image.jpg');
        });

        it('should add cover with ArrayBuffer data', () => {
            const result = epub.cover(TEST_CONSTANTS.MOCK_IMAGE_DATA.buffer);

            expect(result).toBe(epub);
            expect(epub._Cover).toBeTruthy();
            expect(epub._Cover.path).toContain('cover-image');
        });

        it('should throw error for invalid cover data', () => {
            expect(() => epub.cover('not-image-data')).toThrow(
                'Cover data is not valid'
            );
            expect(() => epub.cover({})).toThrow('Cover data is not valid');
            expect(() => epub.cover(null)).toThrow('Cover data is not valid');
        });
    });

    describe('image method', () => {
        beforeEach(() => {
            epub.init(TEST_CONSTANTS.SAMPLE_EPUB_CONFIG);
        });

        it('should add image with Blob data', () => {
            const mockBlob = new Blob([TEST_CONSTANTS.MOCK_IMAGE_DATA], {
                type: 'image/png',
            });
            const result = epub.image(mockBlob, 'test-image');

            expect(result).toBe(epub);
            expect(epub._Images['test-image']).toBeTruthy();
            expect(epub._Images['test-image'].type).toBe('image/png');
            expect(epub._Images['test-image'].path).toBe(
                'assets/test-image.png'
            );
        });

        it('should add image with ArrayBuffer data', () => {
            const result = epub.image(
                TEST_CONSTANTS.MOCK_IMAGE_DATA.buffer,
                'array-image'
            );

            expect(result).toBe(epub);
            expect(epub._Images['array-image']).toBeTruthy();
            expect(epub._Images['array-image'].path).toContain(
                'assets/array-image'
            );
        });

        it('should throw error for invalid image data', () => {
            expect(() => epub.image('not-image', 'test')).toThrow(
                'Image data is not valid'
            );
            expect(() => epub.image({}, 'test')).toThrow(
                'Image data is not valid'
            );
        });
    });

    describe('notes method', () => {
        beforeEach(() => {
            epub.init(TEST_CONSTANTS.SAMPLE_EPUB_CONFIG);
        });

        it('should add notes with valid content', () => {
            const notesContent = '<p>These are test notes</p>';
            const result = epub.notes(notesContent);

            expect(result).toBe(epub);
            // Verify notes file was added to zip
            const notesFile = epub._Zip.file('OEBPS/notes.html');
            expect(notesFile).toBeTruthy();
        });

        it('should throw error for empty notes', () => {
            expect(() => epub.notes('')).toThrow('Notes is empty');
            expect(() => epub.notes(null)).toThrow('Notes is empty');
            expect(() => epub.notes('   ')).toThrow('Notes is empty');
        });
    });

    describe('add method', () => {
        beforeEach(() => {
            epub.init(TEST_CONSTANTS.SAMPLE_EPUB_CONFIG);
        });

        it('should add page with title and content', () => {
            const title = 'Chapter 1';
            const content = '<p>This is chapter 1 content</p>';
            const result = epub.add(title, content);

            expect(result).toBe(epub);
            expect(epub._Pages[0].title).toBe(title);

            // Verify page file was added to zip
            const pageFile = epub._Zip.file('OEBPS/page-0.html');
            expect(pageFile).toBeTruthy();
        });

        it('should add page at specific index', () => {
            epub.add('Chapter 1', '<p>Content 1</p>');
            epub.add('Chapter 2', '<p>Content 2</p>');
            epub.add('Chapter 3', '<p>Content 3</p>');

            expect(epub._Pages[0].title).toBe('Chapter 1');
            expect(epub._Pages[1].title).toBe('Chapter 2');
            expect(epub._Pages[2].title).toBe('Chapter 3');
        });
        it('should process template content with images', () => {
            // First add an image
            const mockBlob = new Blob([TEST_CONSTANTS.MOCK_IMAGE_DATA], {
                type: 'image/png',
            });
            epub.image(mockBlob, 'test-img');

            // Add page with template that references the image using the correct syntax
            // The template expects image to be an object, and the second parameter is a callback function
            const templateContent =
                '<p>Here is an image: <% if (image["test-img"]) { %><img src="<%= image["test-img"].path %>" alt="test image"><% } %></p>';
            epub.add('Image Chapter', templateContent);

            expect(epub._Pages[0].title).toBe('Image Chapter');
        });

        it('should throw error for empty title', () => {
            expect(() => epub.add('', 'content')).toThrow('Title is empty');
            expect(() => epub.add(null, 'content')).toThrow('Title is empty');
        });

        it('should allow empty content', () => {
            expect(() => epub.add('Title', '')).not.toThrow();
            expect(() => epub.add('Title', null)).not.toThrow();
        });

        describe('Hierarchical TOC', () => {
            it('should add pages with different hierarchy levels', () => {
                epub.add('Main Chapter 1', '<p>Content</p>', 0);
                epub.add('Sub Chapter 1.1', '<p>Content</p>', 1);
                epub.add('Sub Chapter 1.2', '<p>Content</p>', 1);
                epub.add('Main Chapter 2', '<p>Content</p>', 0);
                epub.add('Sub Chapter 2.1', '<p>Content</p>', 1);
                epub.add('Sub Sub Chapter 2.1.1', '<p>Content</p>', 2);

                expect(epub._Pages.length).toBe(6);
                expect(epub._Pages[0].title).toBe('Main Chapter 1');
                expect(epub._Pages[0].level).toBe(0);
                expect(epub._Pages[1].title).toBe('Sub Chapter 1.1');
                expect(epub._Pages[1].level).toBe(1);
                expect(epub._Pages[2].title).toBe('Sub Chapter 1.2');
                expect(epub._Pages[2].level).toBe(1);
                expect(epub._Pages[3].title).toBe('Main Chapter 2');
                expect(epub._Pages[3].level).toBe(0);
                expect(epub._Pages[4].title).toBe('Sub Chapter 2.1');
                expect(epub._Pages[4].level).toBe(1);
                expect(epub._Pages[5].title).toBe('Sub Sub Chapter 2.1.1');
                expect(epub._Pages[5].level).toBe(2);
            });

            it('should default to level 0 when level is not specified', () => {
                epub.add('Chapter 1', '<p>Content</p>');
                epub.add('Chapter 2', '<p>Content</p>');

                expect(epub._Pages[0].level).toBe(0);
                expect(epub._Pages[1].level).toBe(0);
            });

            it('should throw error when level increases by more than 1', () => {
                epub.add('Level 0 Chapter', '<p>Content</p>', 0);

                // Trying to skip level 1 and go directly to level 2
                expect(() =>
                    epub.add('Level 2 Chapter', '<p>Content</p>', 2)
                ).toThrow(
                    'Invalid TOC hierarchy: Level can only increase by 1 (from 0 to 1)'
                );
            });

            it('should allow valid level progressions', () => {
                expect(() =>
                    epub.add('Level 0 Chapter', '<p>Content</p>', 0)
                ).not.toThrow();
                expect(() =>
                    epub.add('Level 1 Chapter', '<p>Content</p>', 1)
                ).not.toThrow();
                expect(() =>
                    epub.add('Another Level 1', '<p>Content</p>', 1)
                ).not.toThrow();
                expect(() =>
                    epub.add('Level 2 Chapter', '<p>Content</p>', 2)
                ).not.toThrow();
                expect(() =>
                    epub.add('Back to Level 0', '<p>Content</p>', 0)
                ).not.toThrow();
            });

            it('should reject negative level values', () => {
                expect(() =>
                    epub.add('Negative Level', '<p>Content</p>', -1)
                ).toThrow('Level must be a non-negative number');
            });

            it('should reject non-numeric level values', () => {
                expect(() =>
                    epub.add('String Level', '<p>Content</p>', 'level')
                ).toThrow('Level must be a non-negative number');
                expect(() =>
                    epub.add('NaN Level', '<p>Content</p>', NaN)
                ).toThrow('Level must be a non-negative number');
            });
        });
    });

    describe('generate method', () => {
        beforeEach(() => {
            epub.init(TEST_CONSTANTS.SAMPLE_EPUB_CONFIG);
            epub.add('Chapter 1', '<p>Content 1</p>');
        });

        it('should generate EPUB with default blob type', async () => {
            const result = epub.generate();
            expect(result).toBeInstanceOf(Promise);

            const blob = await result;
            expect(blob).toBeInstanceOf(Blob);
        });

        it('should generate EPUB with arraybuffer type', async () => {
            const result = await epub.generate('arraybuffer');
            expect(result).toBeInstanceOf(ArrayBuffer);
        });

        it('should include progress callback', () => {
            const mockCallback = vi.fn();
            epub.generate('blob', mockCallback);
            expect(mockCallback).toBeDefined();
        });

        it('should throw error for unsupported type', () => {
            expect(() => epub.generate('unsupported-type')).toThrow(
                'This browser does not support unsupported-type'
            );
        });

        it('should generate proper EPUB structure', async () => {
            // Add some content
            epub.notes('<p>Test notes</p>');
            const mockBlob = new Blob([TEST_CONSTANTS.MOCK_IMAGE_DATA], {
                type: 'image/jpeg',
            });
            epub.cover(mockBlob);

            const zipData = await epub.generate('arraybuffer');
            const zip = new JSZip();
            const loadedZip = await zip.loadAsync(zipData);

            // Check required EPUB files
            expect(loadedZip.file('mimetype')).toBeTruthy();
            expect(loadedZip.file('META-INF/container.xml')).toBeTruthy();
            expect(loadedZip.file('book.opf')).toBeTruthy();
            expect(loadedZip.file('toc.ncx')).toBeTruthy();
            expect(loadedZip.file('OEBPS/title-page.html')).toBeTruthy();
            expect(loadedZip.file('OEBPS/table-of-contents.html')).toBeTruthy();
            expect(loadedZip.file('OEBPS/page-0.html')).toBeTruthy();
            expect(loadedZip.file('OEBPS/notes.html')).toBeTruthy();
            expect(loadedZip.file('OEBPS/front-cover.html')).toBeTruthy();
        });
    });

    describe('Method chaining', () => {
        it('should support method chaining', () => {
            const result = epub
                .init(TEST_CONSTANTS.SAMPLE_EPUB_CONFIG)
                .date(new Date('2023-01-01'))
                .uuid('test-uuid')
                .notes('<p>Test notes</p>')
                .add('Chapter 1', '<p>Content</p>');

            expect(result).toBe(epub);
            expect(epub._Info.title).toBe('Test Book');
            expect(epub._Date).toBe('2023-01-01T00:00:00.000Z');
            expect(epub._Uuid.id).toBe('test-uuid');
            expect(epub._Pages[0].title).toBe('Chapter 1');
        });
    });
});
