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

describe('jEpub Advanced Features', () => {
    let epub;

    beforeEach(() => {
        epub = new jEpub();
    });

    describe('Multi-language Support', () => {
        it('should support English language', () => {
            expect(() =>
                epub.init({ ...TEST_CONSTANTS.SAMPLE_EPUB_CONFIG, i18n: 'en' })
            ).not.toThrow();
        });

        it('should support Chinese language', () => {
            expect(() =>
                epub.init({ ...TEST_CONSTANTS.SAMPLE_EPUB_CONFIG, i18n: 'zh' })
            ).not.toThrow();
        });

        it('should support Japanese language', () => {
            expect(() =>
                epub.init({ ...TEST_CONSTANTS.SAMPLE_EPUB_CONFIG, i18n: 'ja' })
            ).not.toThrow();
        });
    });

    describe('Content Formatting', () => {
        beforeEach(() => {
            epub.init(TEST_CONSTANTS.SAMPLE_EPUB_CONFIG);
        });

        it('should handle rich HTML content', () => {
            const richContent = `
        <div class="chapter">
          <h1>Chapter Title</h1>
          <p>This is a paragraph with <strong>bold</strong> and <em>italic</em> text.</p>
          <ul>
            <li>List item 1</li>
            <li>List item 2</li>
          </ul>
          <blockquote>This is a quoted text.</blockquote>
          <table>
            <tr><td>Cell 1</td><td>Cell 2</td></tr>
          </table>
        </div>
      `;

            expect(() => epub.add('Rich Content', richContent)).not.toThrow();
        });

        it('should handle nested HTML structures', () => {
            const nestedContent = `
        <div>
          <section>
            <article>
              <header><h1>Article Title</h1></header>
              <main>
                <p>Article content with <a href="#link">links</a>.</p>
                <div>
                  <span>Nested span content</span>
                </div>
              </main>
              <footer>Article footer</footer>
            </article>
          </section>
        </div>
      `;

            expect(() => epub.add('Nested HTML', nestedContent)).not.toThrow();
        });
    });

    describe('Metadata Validation', () => {
        it('should handle complex metadata structures', () => {
            const complexMetadata = {
                title: 'Advanced Test Book',
                author: 'Test Author with Credentials, PhD',
                publisher: 'Advanced Test Publishing House Inc.',
                description:
                    'A comprehensive test book with complex metadata and special characters: é, ñ, 中文, 日本語',
                tags: [
                    'advanced',
                    'test',
                    'metadata',
                    'international',
                    'special-chars',
                ],
                i18n: 'en',
            };

            expect(() => epub.init(complexMetadata)).not.toThrow();
            expect(epub._Info.title).toBe(complexMetadata.title);
            expect(epub._Info.tags).toEqual(complexMetadata.tags);
        });

        it('should handle empty optional fields', () => {
            const minimalMetadata = {
                title: 'Minimal Book',
                i18n: 'en',
            };

            epub.init(minimalMetadata);
            expect(epub._Info.author).toBe('undefined');
            expect(epub._Info.publisher).toBe('undefined');
            expect(epub._Info.description).toBe('');
            expect(epub._Info.tags).toEqual([]);
        });
    });

    describe('Large Content Handling', () => {
        beforeEach(() => {
            epub.init(TEST_CONSTANTS.SAMPLE_EPUB_CONFIG);
        });

        it('should handle books with many short pages', () => {
            // Add 50 short pages
            for (let i = 1; i <= 50; i++) {
                epub.add(
                    `Chapter ${i}`,
                    `<h1>Chapter ${i}</h1><p>Short content for chapter ${i}.</p>`
                );
            }

            expect(epub._Pages.length).toBe(50);
        });

        it('should handle pages with very long content', () => {
            const longContent = Array(1000)
                .fill(
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '
                )
                .join('');
            const wrappedContent = `<h1>Long Chapter</h1><p>${longContent}</p>`;

            expect(() =>
                epub.add('Long Chapter', wrappedContent)
            ).not.toThrow();
        });
    });

    describe('Special Characters and Encoding', () => {
        beforeEach(() => {
            epub.init(TEST_CONSTANTS.SAMPLE_EPUB_CONFIG);
        });

        it('should handle Unicode characters', () => {
            const unicodeContent = `
        <h1>Unicode Test 🚀</h1>
        <p>English: Hello World!</p>
        <p>Chinese: 你好世界！</p>
        <p>Japanese: こんにちは世界！</p>
        <p>Arabic: مرحبا بالعالم!</p>
        <p>Emoji: 📚📖✨🎉</p>
        <p>Mathematical: ∑ α²β³γ⁴ ∫∞</p>
      `;

            expect(() =>
                epub.add('Unicode Test', unicodeContent)
            ).not.toThrow();
        });

        it('should handle HTML entities', () => {
            const entityContent = `
        <h1>HTML Entities</h1>
        <p>&amp; &lt; &gt; &quot; &#39;</p>
        <p>&copy; &reg; &trade;</p>
        <p>&hellip; &mdash; &ndash;</p>
      `;

            expect(() =>
                epub.add('HTML Entities', entityContent)
            ).not.toThrow();
        });
    });
    describe('Edge Case Content', () => {
        beforeEach(() => {
            epub.init(TEST_CONSTANTS.SAMPLE_EPUB_CONFIG);
        });

        it('should handle content with only whitespace', () => {
            const whitespaceContent = '   \n\t   \r\n   ';
            // Now empty content is allowed
            expect(() =>
                epub.add('Whitespace Test', whitespaceContent)
            ).not.toThrow();
        });

        it('should handle content with mixed line endings', () => {
            const mixedLineEndings = '<p>Line 1\nLine 2\r\nLine 3\rLine 4</p>';
            expect(() =>
                epub.add('Mixed Line Endings', mixedLineEndings)
            ).not.toThrow();
        });

        it('should handle self-closing tags', () => {
            const selfClosingContent = `
        <h1>Self-Closing Tags</h1>
        <p>Image: <img src="test.jpg" alt="Test" /></p>
        <p>Line break: Text<br/>More text</p>
        <p>Horizontal rule:</p>
        <hr />
        <p>Input: <input type="text" value="test" /></p>
      `;

            expect(() =>
                epub.add('Self-Closing Tags', selfClosingContent)
            ).not.toThrow();
        });
    });

    describe('Hierarchical TOC Support', () => {
        it('should support hierarchical TOC structure', () => {
            epub.init(TEST_CONSTANTS.SAMPLE_EPUB_CONFIG);

            // Create a basic hierarchy
            expect(() =>
                epub.add('Main Chapter 1', '<p>Content</p>', 0)
            ).not.toThrow();
            expect(() =>
                epub.add('Sub Chapter 1.1', '<p>Content</p>', 1)
            ).not.toThrow();
            expect(() =>
                epub.add('Sub Chapter 1.2', '<p>Content</p>', 1)
            ).not.toThrow();
            expect(() =>
                epub.add('Main Chapter 2', '<p>Content</p>', 0)
            ).not.toThrow();

            expect(epub._Pages.length).toBe(4);
            expect(epub._Pages[0].level).toBe(0);
            expect(epub._Pages[1].level).toBe(1);
            expect(epub._Pages[2].level).toBe(1);
            expect(epub._Pages[3].level).toBe(0);
        });

        it('should handle deep nesting levels', () => {
            epub.init(TEST_CONSTANTS.SAMPLE_EPUB_CONFIG);

            epub.add('Level 0', '<p>Content</p>', 0);
            epub.add('Level 1', '<p>Content</p>', 1);
            epub.add('Level 2', '<p>Content</p>', 2);
            epub.add('Level 3', '<p>Content</p>', 3);

            expect(epub._Pages.length).toBe(4);
            for (let i = 0; i < 4; i++) {
                expect(epub._Pages[i].level).toBe(i);
            }
        });
    });
});
