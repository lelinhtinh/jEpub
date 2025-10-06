import { describe, it, expect } from 'vitest';
import { parseDOM, html2text } from '../../src/utils/dom.js';

describe('DOM utilities', () => {
    describe('parseDOM', () => {
        it('should parse simple HTML to XHTML', () => {
            const html = '<p>Hello <strong>world</strong></p>';
            const result = parseDOM(html);
            expect(result).toContain('Hello');
            expect(result).toContain('world');
            expect(result).toContain('<p>');
            expect(result).toContain('<strong>');
        });

        it('should return plain text when outText is true', () => {
            const html = '<p>Hello <strong>world</strong></p>';
            const result = parseDOM(html, true);
            expect(result).toBe('Hello world');
        });

        it('should handle self-closing tags', () => {
            const html = '<p>Line 1<br>Line 2</p>';
            const result = parseDOM(html);
            expect(result).toContain('<br');
        });

        it('should handle nested elements', () => {
            const html =
                '<div><p>Paragraph in <em>emphasis <strong>and bold</strong></em></p></div>';
            const result = parseDOM(html);
            expect(result).toContain('<div>');
            expect(result).toContain('<p>');
            expect(result).toContain('<em>');
            expect(result).toContain('<strong>');
        });

        it('should handle attributes', () => {
            const html = '<p class="test" id="paragraph">Content</p>';
            const result = parseDOM(html);
            expect(result).toContain('class');
            expect(result).toContain('test');
            expect(result).toContain('Content');
        });

        it('should handle special characters', () => {
            const html = '<p>&lt;script&gt; &amp; special chars</p>';
            const result = parseDOM(html);
            expect(result).toContain('&lt;');
            expect(result).toContain('&amp;');
        });

        it('should handle empty input', () => {
            expect(parseDOM('')).toBe('');
            expect(parseDOM('', true)).toBe('');
        });

        it('should handle null and undefined input', () => {
            expect(parseDOM(null)).toBe('');
            expect(parseDOM(undefined)).toBe('');
            expect(parseDOM(null, true)).toBe('');
            expect(parseDOM(undefined, true)).toBe('');
        });

        it('should handle non-string input', () => {
            expect(parseDOM(123)).toBe('');
            expect(parseDOM({})).toBe('');
            expect(parseDOM([])).toBe('');
            expect(parseDOM(true)).toBe('');
        });

        it('should handle malformed HTML', () => {
            const html = '<p>Unclosed paragraph<div>Mixed nesting</p></div>';
            const result = parseDOM(html);
            expect(result).toBeTruthy();
            expect(typeof result).toBe('string');
        });

        it('should preserve whitespace in text content', () => {
            const html = '<p>  Multiple   spaces  </p>';
            const textResult = parseDOM(html, true);
            expect(textResult).toContain('Multiple   spaces');
        });

        it('should handle complex HTML structures', () => {
            const html = `
                <article>
                    <header>
                        <h1>Title</h1>
                        <p class="subtitle">Subtitle</p>
                    </header>
                    <section>
                        <p>First paragraph with <a href="#">link</a>.</p>
                        <ul>
                            <li>Item 1</li>
                            <li>Item 2</li>
                        </ul>
                    </section>
                </article>
            `;
            const result = parseDOM(html);
            expect(result).toContain('<article>');
            expect(result).toContain('<header>');
            expect(result).toContain('<h1>');
            expect(result).toContain('<ul>');
            expect(result).toContain('<li>');
        });
    });

    describe('html2text', () => {
        it('should convert simple HTML to plain text', () => {
            const html = '<p>Hello <strong>world</strong></p>';
            const result = html2text(html);
            expect(result).toBe('Hello world');
        });

        it('should handle block elements with line breaks', () => {
            const html = '<div>First</div><p>Second</p><h1>Third</h1>';
            const result = html2text(html);
            expect(result).toContain('First\nSecond\nThird');
        });

        it('should convert br tags to line breaks', () => {
            const html = 'Line 1<br>Line 2<br/>Line 3';
            const result = html2text(html);
            expect(result).toContain('Line 1\nLine 2\nLine 3');
        });

        it('should remove line breaks when noBr is true', () => {
            const html = '<div>First</div><p>Second</p>';
            const result = html2text(html, true);
            expect(result).toBe('First Second');
        });

        it('should handle list items with bullet points', () => {
            const html = '<ul><li>Item 1</li><li>Item 2</li></ul>';
            const result = html2text(html);
            expect(result).toContain('+ Item 1\n+ Item 2');
        });

        it('should remove style and script tags completely', () => {
            const html = `
                <div>Content</div>
                <style>body { color: red; }</style>
                <script>alert('hello');</script>
                <p>More content</p>
            `;
            const result = html2text(html);
            expect(result).not.toContain('color: red');
            expect(result).not.toContain('alert');
            expect(result).toContain('Content');
            expect(result).toContain('More content');
        });

        it('should handle nested elements', () => {
            const html =
                '<div><p>Outer <span>inner <strong>bold</strong></span> text</p></div>';
            const result = html2text(html);
            expect(result).toBe('Outer inner bold text');
        });

        it('should clean up excessive line breaks', () => {
            const html = '<div>First</div><br><br><br><p>Second</p>';
            const result = html2text(html);
            expect(result).not.toContain('\n\n\n');
            expect(
                result.split('\n').filter((line) => line.trim() === '').length
            ).toBeLessThanOrEqual(1);
        });

        it('should handle empty and invalid inputs', () => {
            expect(html2text('')).toBe('');
            expect(html2text(null)).toBe('');
            expect(html2text(undefined)).toBe('');
            expect(html2text(123)).toBe('');
            expect(html2text({})).toBe('');
        });

        it('should handle complex HTML with mixed content', () => {
            const html = `
                <article>
                    <h1>Article Title</h1>
                    <p>Introduction paragraph.</p>
                    <ul>
                        <li>First point</li>
                        <li>Second point</li>
                    </ul>
                    <p>Conclusion.</p>
                </article>
            `;
            const result = html2text(html);
            expect(result).toContain('Article Title');
            expect(result).toContain('Introduction paragraph');
            expect(result).toContain('+ First point');
            expect(result).toContain('+ Second point');
            expect(result).toContain('Conclusion');
        });

        it('should handle hr tags as line breaks', () => {
            const html = 'Before<hr>After<hr/>End';
            const result = html2text(html);
            expect(result).toContain('Before\nAfter\nEnd');
        });

        it('should preserve text content with special characters', () => {
            const html =
                '<p>&lt;script&gt; tag &amp; ampersand &quot;quotes&quot;</p>';
            const result = html2text(html);
            expect(result).toContain('<script>');
            expect(result).toContain('&');
            expect(result).toContain('"quotes"');
        });
    });
});
