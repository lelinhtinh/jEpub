import { describe, it, expect, beforeEach } from 'vitest';
import JSZip from 'jszip';
import jEpub from '../src/jepub.js';

// Define test constants
const TEST_CONSTANTS = {
    SAMPLE_EPUB_CONFIG: {
        title: 'TOC Structure Test Book',
        author: 'Test Author',
        publisher: 'Test Publisher',
        description: 'A test book for TOC structure validation',
        tags: ['test', 'toc', 'hierarchy'],
        i18n: 'en',
    },
};

describe('jEpub TOC Structure Tests', () => {
    let epub;

    beforeEach(() => {
        epub = new jEpub();
        epub.init(TEST_CONSTANTS.SAMPLE_EPUB_CONFIG);
    });

    /**
     * Helper function to extract HTML content from generated epub
     * @param {ArrayBuffer} epubData - Generated epub data
     * @param {string} filePath - Path of the file to extract
     * @returns {Promise<string>} - The content of the file
     */
    async function extractFileContent(epubData, filePath) {
        const zip = new JSZip();
        const loadedZip = await zip.loadAsync(epubData);
        const file = loadedZip.file(filePath);
        if (!file) {
            throw new Error(`File not found: ${filePath}`);
        }
        return file.async('string');
    }

    describe('HTML Table of Contents Structure', () => {
        it('should correctly open and close <ul> tags for a flat hierarchy', async () => {
            // Create a flat TOC with all level 0 chapters
            epub.add('Chapter 1', '<p>Content</p>', 0);
            epub.add('Chapter 2', '<p>Content</p>', 0);
            epub.add('Chapter 3', '<p>Content</p>', 0);

            const epubData = await epub.generate('arraybuffer');
            const tocHtml = await extractFileContent(
                epubData,
                'OEBPS/table-of-contents.html'
            );

            // Verify there are no nested <ul> tags for flat hierarchy
            const nestedUlCount = (tocHtml.match(/<ul>\s*<ul>/g) || []).length;
            expect(nestedUlCount).toBe(0);

            // Verify all <ul> tags are properly closed
            const ulOpenCount = (tocHtml.match(/<ul>/g) || []).length;
            const ulCloseCount = (tocHtml.match(/<\/ul>/g) || []).length;
            expect(ulOpenCount).toBe(ulCloseCount);
        });

        it('should correctly open and close <ul> tags for a simple nested hierarchy', async () => {
            // Create a simple nested TOC
            epub.add('Main Chapter 1', '<p>Content</p>', 0);
            epub.add('Sub Chapter 1.1', '<p>Content</p>', 1);
            epub.add('Sub Chapter 1.2', '<p>Content</p>', 1);
            epub.add('Main Chapter 2', '<p>Content</p>', 0);

            const epubData = await epub.generate('arraybuffer');
            const tocHtml = await extractFileContent(
                epubData,
                'OEBPS/table-of-contents.html'
            );

            // Verify <ul> tags are nested for hierarchy
            const ulOpenCount = (tocHtml.match(/<ul>/g) || []).length;
            const ulCloseCount = (tocHtml.match(/<\/ul>/g) || []).length;

            // One outer <ul> plus one nested <ul> for the level 1 items
            expect(ulOpenCount).toBe(2);
            expect(ulCloseCount).toBe(2);
        });

        it('should correctly open and close <ul> tags for a complex nested hierarchy', async () => {
            // Create a complex nested TOC
            epub.add('Level 0 - Chapter 1', '<p>Content</p>', 0);
            epub.add('Level 1 - Chapter 1.1', '<p>Content</p>', 1);
            epub.add('Level 2 - Chapter 1.1.1', '<p>Content</p>', 2);
            epub.add('Level 2 - Chapter 1.1.2', '<p>Content</p>', 2);
            epub.add('Level 1 - Chapter 1.2', '<p>Content</p>', 1);
            epub.add('Level 0 - Chapter 2', '<p>Content</p>', 0);
            epub.add('Level 1 - Chapter 2.1', '<p>Content</p>', 1);
            epub.add('Level 0 - Chapter 3', '<p>Content</p>', 0);

            const epubData = await epub.generate('arraybuffer');
            const tocHtml = await extractFileContent(
                epubData,
                'OEBPS/table-of-contents.html'
            );

            // Verify all <ul> tags are properly closed
            const ulOpenCount = (tocHtml.match(/<ul>/g) || []).length;
            const ulCloseCount = (tocHtml.match(/<\/ul>/g) || []).length;

            // Should have proper nesting with balanced opening/closing tags
            expect(ulOpenCount).toBe(ulCloseCount);
            // We should have 4 <ul> tags: the outer one and the nesting levels
            expect(ulOpenCount).toBe(4);
        });

        it('should handle complex hierarchies with multiple level changes', async () => {
            // Create a TOC with multiple level increases and decreases
            epub.add('Level 0 - Chapter 1', '<p>Content</p>', 0);
            epub.add('Level 1 - Chapter 1.1', '<p>Content</p>', 1);
            epub.add('Level 2 - Chapter 1.1.1', '<p>Content</p>', 2);
            epub.add('Level 3 - Chapter 1.1.1.1', '<p>Content</p>', 3);
            epub.add('Level 1 - Chapter 1.2', '<p>Content</p>', 1); // Decrease by 2 levels
            epub.add('Level 0 - Chapter 2', '<p>Content</p>', 0); // Decrease by 1 level

            const epubData = await epub.generate('arraybuffer');
            const tocHtml = await extractFileContent(
                epubData,
                'OEBPS/table-of-contents.html'
            );

            // Verify all <ul> tags are properly closed
            const ulOpenCount = (tocHtml.match(/<ul>/g) || []).length;
            const ulCloseCount = (tocHtml.match(/<\/ul>/g) || []).length;

            // Should have balanced opening/closing tags
            expect(ulOpenCount).toBe(ulCloseCount);

            // We expect 4 <ul> tags: the outer one and three levels of nesting
            expect(ulOpenCount).toBe(4);
        });
    });

    describe('NCX Navigation Structure', () => {
        it('should correctly open and close <navPoint> tags for a flat hierarchy', async () => {
            // Create a flat TOC with all level 0 chapters
            epub.add('Chapter 1', '<p>Content</p>', 0);
            epub.add('Chapter 2', '<p>Content</p>', 0);
            epub.add('Chapter 3', '<p>Content</p>', 0);

            const epubData = await epub.generate('arraybuffer');
            const tocNcx = await extractFileContent(epubData, 'toc.ncx');

            // Count the number of opening and closing navPoint tags for content pages
            // The first two and last navPoints are for title page, TOC and possibly notes
            const contentNavPointOpenCount = (
                tocNcx.match(/<navPoint id="page-\d+"/g) || []
            ).length;

            // Count closing navPoints
            const navPointCloseCount = (tocNcx.match(/<\/navPoint>/g) || [])
                .length;

            // For flat hierarchy, each content page should have one navPoint
            expect(contentNavPointOpenCount).toBe(3); // 3 content pages

            // All navPoints should be closed (content pages + title page + TOC page)
            expect(navPointCloseCount).toBeGreaterThanOrEqual(
                contentNavPointOpenCount + 2
            );
        });

        it('should correctly open and close <navPoint> tags for a simple nested hierarchy', async () => {
            // Create a simple nested TOC
            epub.add('Main Chapter 1', '<p>Content</p>', 0);
            epub.add('Sub Chapter 1.1', '<p>Content</p>', 1);
            epub.add('Sub Chapter 1.2', '<p>Content</p>', 1);
            epub.add('Main Chapter 2', '<p>Content</p>', 0);

            const epubData = await epub.generate('arraybuffer');
            const tocNcx = await extractFileContent(epubData, 'toc.ncx');

            // Count the number of opening and closing navPoint tags
            const contentNavPointOpenCount = (
                tocNcx.match(/<navPoint id="page-\d+"/g) || []
            ).length;
            const navPointCloseCount = (tocNcx.match(/<\/navPoint>/g) || [])
                .length;

            // For this hierarchy, we should have 4 content navPoints
            expect(contentNavPointOpenCount).toBe(4);

            // All navPoints should be closed (content pages + title page + TOC page)
            expect(navPointCloseCount).toBeGreaterThanOrEqual(
                contentNavPointOpenCount + 2
            );
        });

        it('should correctly open and close <navPoint> tags for a complex nested hierarchy', async () => {
            // Create a complex nested TOC
            epub.add('Level 0 - Chapter 1', '<p>Content</p>', 0);
            epub.add('Level 1 - Chapter 1.1', '<p>Content</p>', 1);
            epub.add('Level 2 - Chapter 1.1.1', '<p>Content</p>', 2);
            epub.add('Level 2 - Chapter 1.1.2', '<p>Content</p>', 2);
            epub.add('Level 1 - Chapter 1.2', '<p>Content</p>', 1);
            epub.add('Level 0 - Chapter 2', '<p>Content</p>', 0);

            const epubData = await epub.generate('arraybuffer');
            const tocNcx = await extractFileContent(epubData, 'toc.ncx');

            // Count the number of opening and closing navPoint tags
            const contentNavPointOpenCount = (
                tocNcx.match(/<navPoint id="page-\d+"/g) || []
            ).length;
            const navPointCloseCount = (tocNcx.match(/<\/navPoint>/g) || [])
                .length;

            // For this hierarchy, we should have 6 content navPoints
            expect(contentNavPointOpenCount).toBe(6);

            // All navPoints should be closed (content pages + title page + TOC page)
            expect(navPointCloseCount).toBeGreaterThanOrEqual(
                contentNavPointOpenCount + 2
            );
        });

        it('should handle complex hierarchies with multiple level changes in NCX', async () => {
            // Create a TOC with multiple level changes
            epub.add('Level 0 - Chapter 1', '<p>Content</p>', 0);
            epub.add('Level 1 - Chapter 1.1', '<p>Content</p>', 1);
            epub.add('Level 2 - Chapter 1.1.1', '<p>Content</p>', 2);
            epub.add('Level 3 - Chapter 1.1.1.1', '<p>Content</p>', 3);
            epub.add('Level 1 - Chapter 1.2', '<p>Content</p>', 1); // Decrease by 2 levels
            epub.add('Level 0 - Chapter 2', '<p>Content</p>', 0); // Decrease by 1 level

            const epubData = await epub.generate('arraybuffer');
            const tocNcx = await extractFileContent(epubData, 'toc.ncx');

            // Count the number of opening and closing navPoint tags
            const contentNavPointOpenCount = (
                tocNcx.match(/<navPoint id="page-\d+"/g) || []
            ).length;
            const navPointCloseCount = (tocNcx.match(/<\/navPoint>/g) || [])
                .length;

            // For this hierarchy, we should have 6 content navPoints
            expect(contentNavPointOpenCount).toBe(6);

            // All navPoints should be closed (content + title + TOC pages)
            expect(navPointCloseCount).toBeGreaterThanOrEqual(
                contentNavPointOpenCount + 2
            );
        });
    });

    describe('Tag Content and Structure Validation', () => {
        it('should validate the HTML TOC structure matches chapter hierarchy', async () => {
            // Create a defined hierarchy
            epub.add('Main Chapter 1', '<p>Content</p>', 0);
            epub.add('Sub Chapter 1.1', '<p>Content</p>', 1);
            epub.add('Sub Sub Chapter 1.1.1', '<p>Content</p>', 2);
            epub.add('Main Chapter 2', '<p>Content</p>', 0);

            const epubData = await epub.generate('arraybuffer');
            const tocHtml = await extractFileContent(
                epubData,
                'OEBPS/table-of-contents.html'
            );

            // Check that nested <ul> tags are inside <li> tags
            // We should find <li> followed by <ul> for proper nesting
            const liUlPattern = /<li class="chaptertype-1">.*?<\/li>\s*<ul>/gs;
            const matches = tocHtml.match(liUlPattern);

            // Should find at least one match where a <ul> follows a </li>
            // for the hierarchical structure
            expect(matches).not.toBeNull();
            // In Node.js environment we can't use DOMParser directly
            // Instead we can check for balanced tags as a simpler alternative
            const ulOpenCount = (tocHtml.match(/<ul>/g) || []).length;
            const ulCloseCount = (tocHtml.match(/<\/ul>/g) || []).length;
            expect(ulOpenCount).toBe(ulCloseCount);

            const liOpenCount = (tocHtml.match(/<li/g) || []).length;
            const liCloseCount = (tocHtml.match(/<\/li>/g) || []).length;
            expect(liOpenCount).toBe(liCloseCount);
        });

        it('should validate the NCX structure matches chapter hierarchy', async () => {
            // Create a defined hierarchy
            epub.add('Main Chapter 1', '<p>Content</p>', 0);
            epub.add('Sub Chapter 1.1', '<p>Content</p>', 1);
            epub.add('Sub Sub Chapter 1.1.1', '<p>Content</p>', 2);
            epub.add('Main Chapter 2', '<p>Content</p>', 0);

            const epubData = await epub.generate('arraybuffer');
            const tocNcx = await extractFileContent(epubData, 'toc.ncx');

            // For proper nesting in NCX:
            // 1. Count the number of consecutive navPoints without closing
            // 2. Maximum nesting should equal the maximum hierarchy level + 1
            //    (+1 because we start with a navPoint)

            // Split by navPoint opening tags and count maximum consecutive openings
            const navPointParts = tocNcx.split('</navPoint>');
            let maxConsecutiveNavPoints = 0;

            for (const part of navPointParts) {
                const navPointCount = (part.match(/<navPoint /g) || []).length;
                maxConsecutiveNavPoints = Math.max(
                    maxConsecutiveNavPoints,
                    navPointCount
                );
            }

            // Maximum hierarchy level is 2, so max consecutive navPoints should be 3 + 1 (for built-in ones)
            expect(maxConsecutiveNavPoints).toBe(3);
            // In Node.js environment we can't use DOMParser directly
            // Instead we can check for balanced tags
            const navPointOpenCount = (tocNcx.match(/<navPoint /g) || [])
                .length;
            const navPointCloseCount = (tocNcx.match(/<\/navPoint>/g) || [])
                .length;
            expect(navPointOpenCount).toBe(navPointCloseCount);
        });
        it('should generate consistent playOrder values in NCX', async () => {
            // Create multiple chapters
            epub.add('Chapter 1', '<p>Content</p>', 0);
            epub.add('Chapter 2', '<p>Content</p>', 0);
            epub.add('Chapter 3', '<p>Content</p>', 0);

            const epubData = await epub.generate('arraybuffer');
            const tocNcx = await extractFileContent(epubData, 'toc.ncx');

            // Extract all playOrder values
            const playOrderPattern = /playOrder="(\d+)"/g;
            const playOrders = [];
            let match;

            while ((match = playOrderPattern.exec(tocNcx)) !== null) {
                playOrders.push(parseInt(match[1], 10));
            }

            // Check if playOrders are sequential
            for (let i = 1; i < playOrders.length; i++) {
                expect(playOrders[i]).toBe(playOrders[i - 1] + 1);
            }

            // The first playOrder should be 1
            expect(playOrders[0]).toBe(1);

            // Total number of playOrders should match number of chapters + 2 (title + TOC)
            expect(playOrders.length).toBe(5);
        });

        it('should handle a deeply complex hierarchical structure', async () => {
            // Creating a complex hierarchy with many branches and level changes
            // The structure models a complex book with parts, chapters, sections and subsections

            // Part 1
            epub.add('Part I: Fundamentals', '<p>Content</p>', 0);

            // Chapter 1 with sections
            epub.add('Chapter 1: Introduction', '<p>Content</p>', 1);
            epub.add('1.1 Background', '<p>Content</p>', 2);
            epub.add('1.2 Basic Concepts', '<p>Content</p>', 2);
            epub.add('1.2.1 First Subsection', '<p>Content</p>', 3);
            epub.add('1.2.2 Second Subsection', '<p>Content</p>', 3);

            // Chapter 2 with sections
            epub.add('Chapter 2: Theory', '<p>Content</p>', 1);
            epub.add('2.1 Foundational Principles', '<p>Content</p>', 2);
            epub.add('2.1.1 Key Concept A', '<p>Content</p>', 3);
            epub.add('2.1.2 Key Concept B', '<p>Content</p>', 3);
            epub.add('2.2 Advanced Topics', '<p>Content</p>', 2);

            // Part 2
            epub.add('Part II: Applications', '<p>Content</p>', 0);

            // Chapter 3
            epub.add('Chapter 3: Practical Use Cases', '<p>Content</p>', 1);
            epub.add('3.1 Example One', '<p>Content</p>', 2);
            epub.add('3.2 Example Two', '<p>Content</p>', 2);

            // Chapter 4 with deep nesting
            epub.add('Chapter 4: Advanced Applications', '<p>Content</p>', 1);
            epub.add('4.1 Complex Scenario', '<p>Content</p>', 2);
            epub.add('4.1.1 Setup', '<p>Content</p>', 3);
            epub.add('4.1.1.1 Initial Configuration', '<p>Content</p>', 4);
            epub.add('4.1.1.2 Parameter Setup', '<p>Content</p>', 4);
            epub.add('4.1.2 Execution', '<p>Content</p>', 3);
            epub.add('4.2 Results Analysis', '<p>Content</p>', 2);

            // Appendices at level 0
            epub.add('Appendix A', '<p>Content</p>', 0);
            epub.add('Appendix B', '<p>Content</p>', 0);

            // Generate the EPUB and inspect both HTML TOC and NCX content
            const epubData = await epub.generate('arraybuffer');
            const tocHtml = await extractFileContent(
                epubData,
                'OEBPS/table-of-contents.html'
            );
            const tocNcx = await extractFileContent(epubData, 'toc.ncx');

            // Verify HTML TOC structure
            const ulOpenCount = (tocHtml.match(/<ul>/g) || []).length;
            const ulCloseCount = (tocHtml.match(/<\/ul>/g) || []).length;
            expect(ulOpenCount).toBe(ulCloseCount);

            // Verify NCX structure
            const navPointOpenCount = (tocNcx.match(/<navPoint /g) || [])
                .length;
            const navPointCloseCount = (tocNcx.match(/<\/navPoint>/g) || [])
                .length;
            expect(navPointOpenCount).toBe(navPointCloseCount);

            // The maximum level is 4, so we should find at least 5 levels of nesting in the HTML TOC
            // (outer ul plus 4 nested levels)
            expect(ulOpenCount).toBeGreaterThanOrEqual(5);
        });
    });
});
