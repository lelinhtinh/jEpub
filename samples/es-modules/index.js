/**
 * jEpub ES Modules Example
 * Demonstrates how to use jEpub with ES modules in Node.js environment
 */

import jEpub from '../../dist/jepub.es.js';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('📚 jEpub ES Modules Example');
console.log('=========================\n');

async function createSampleEpub() {
    try {
        console.log('🚀 Initializing jEpub...');
        const jepub = new jEpub();

        // Initialize with book details
        jepub.init({
            i18n: 'en',
            title: 'ES Modules Sample Book',
            author: 'ES Developer',
            publisher: 'Module Publishers',
            description:
                'A sample EPUB book created with <b>jEpub</b> using ES modules in Node.js environment.',
            tags: ['sample', 'epub', 'javascript', 'es-modules', 'nodejs'],
        });

        console.log('✅ Book initialized with metadata');

        // Set custom publication date
        jepub.date(new Date());
        console.log('📅 Publication date set');

        // Set custom UUID
        jepub.uuid(`urn:uuid:es-modules-sample-${Date.now()}`);
        console.log('🆔 Custom UUID set');

        // Load and add cover image (using sample image from demo)
        try {
            const coverImagePath = join(
                __dirname,
                '../../demo/cover-image.jpg'
            );
            const coverImageBuffer = readFileSync(coverImagePath);
            jepub.cover(coverImageBuffer.buffer);
            console.log('🖼️ Cover image added');
        } catch (_error) {
            console.log('⚠️ Cover image not found, skipping...');
        }

        // Load and add content image
        try {
            const contentImagePath = join(
                __dirname,
                '../../demo/lorem-ipsum.jpg'
            );
            const contentImageBuffer = readFileSync(contentImagePath);
            jepub.image(contentImageBuffer.buffer, 'loremImage');
            console.log('🖼️ Content image added');
        } catch (_error) {
            console.log('⚠️ Content image not found, skipping...');
        }

        // Add introduction chapter
        const introContent = `
            <h1>Introduction</h1>
            <p>Welcome to this sample EPUB book created with <strong>jEpub</strong> using ES modules!</p>
            <p>This example demonstrates:</p>
            <ul>
                <li>ES module imports</li>
                <li>Node.js file system operations</li>
                <li>Image handling with Buffer</li>
                <li>Multiple chapters with HTML content</li>
                <li>EJS templating for images</li>
            </ul>
            <p>The book was generated on: <em>${new Date().toLocaleString()}</em></p>
        `;
        jepub.add('Introduction', introContent);
        console.log('📝 Introduction chapter added');

        // Add chapter with image
        const imageChapterContent = `
            <h1>Chapter with Image</h1>
            <p>This chapter demonstrates how to embed images using EJS templating:</p>
            <%= image["loremImage"] %>
            <p><em>Image embedded using EJS template: &lt;%= image["loremImage"] %&gt;</em></p>
            <h2>Technical Details</h2>
            <p>Images are processed and embedded into the EPUB structure automatically. The jEpub library handles:</p>
            <ul>
                <li>Image type detection</li>
                <li>MIME type assignment</li>
                <li>Path generation</li>
                <li>Template processing</li>
            </ul>
        `;
        jepub.add('Chapter with Image', imageChapterContent);
        console.log('📝 Image chapter added');

        // Add multiple chapters with different content types
        for (let i = 1; i <= 3; i++) {
            const chapterContent = `
                <h1>Chapter ${i}: ES Modules Features</h1>
                <p>This is chapter ${i} demonstrating various ES modules features and jEpub capabilities.</p>

                <h2>Section ${i}.1: Import/Export</h2>
                <p>ES modules provide a clean syntax for importing and exporting functionality:</p>
                <pre><code>import jEpub from 'jepub';
import { readFileSync } from 'fs';</code></pre>

                <h2>Section ${i}.2: Modern JavaScript</h2>
                <p>This example uses modern JavaScript features like:</p>
                <ul>
                    <li>Template literals</li>
                    <li>Async/await</li>
                    <li>Arrow functions</li>
                    <li>Destructuring</li>
                </ul>

                <h2>Section ${i}.3: File System Operations</h2>
                <p>Reading files in Node.js with ES modules:</p>
                <pre><code>const buffer = readFileSync(imagePath);
jepub.image(buffer.buffer, 'imageName');</code></pre>

                <blockquote>
                    <p><strong>Note:</strong> This chapter was generated programmatically using a loop,
                    demonstrating how easy it is to create multiple chapters with jEpub.</p>
                </blockquote>
            `;
            jepub.add(`Chapter ${i}: ES Modules Features`, chapterContent);
            console.log(`📝 Chapter ${i} added`);
        }

        // Add a chapter with array content (plain text)
        const plainTextContent = [
            'This chapter demonstrates using plain text arrays as content.',
            '',
            'Each item in the array becomes a paragraph in the EPUB.',
            '',
            'Benefits of using arrays:',
            '• Simple content structure',
            '• Easy programmatic generation',
            '• Clean separation of content',
            '',
            'This approach is perfect for:',
            '- Simple text-based content',
            '- Programmatically generated content',
            '- Content from external data sources',
            '',
            'The jEpub library automatically converts array items to HTML paragraphs.',
        ];
        jepub.add('Array Content Example', plainTextContent);
        console.log('📝 Array content chapter added');

        // Add notes
        const notesContent = `
            <h2>Development Notes</h2>
            <p>This EPUB was generated using:</p>
            <ul>
                <li><strong>jEpub</strong>: JavaScript EPUB generator</li>
                <li><strong>Node.js</strong>: Runtime environment</li>
                <li><strong>ES Modules</strong>: Module system</li>
                <li><strong>File System API</strong>: For image loading</li>
            </ul>

            <h3>Key Features Demonstrated:</h3>
            <ol>
                <li>ES module imports</li>
                <li>Book metadata configuration</li>
                <li>Image handling from filesystem</li>
                <li>Multiple chapter creation</li>
                <li>Mixed content types (HTML and arrays)</li>
                <li>EJS templating for images</li>
                <li>Custom dates and UUIDs</li>
                <li>Progress tracking</li>
            </ol>

            <p><em>Generated at: ${new Date().toISOString()}</em></p>
        `;
        jepub.notes(notesContent);
        console.log('📝 Notes added');

        // Generate EPUB with progress tracking
        console.log('\n🔄 Generating EPUB...');
        let lastPercent = 0;

        const epub = await jepub.generate('nodebuffer', (metadata) => {
            const percent = Math.round(metadata.percent);
            if (percent !== lastPercent && percent % 10 === 0) {
                console.log(
                    `   Progress: ${percent}% - ${metadata.currentFile}`
                );
                lastPercent = percent;
            }
        });

        // Save to file
        const outputPath = join(__dirname, 'es-modules-sample.epub');
        writeFileSync(outputPath, epub);

        console.log('\n✅ EPUB generation completed!');
        console.log(`📁 File saved: ${outputPath}`);
        console.log(`📊 File size: ${(epub.length / 1024).toFixed(2)} KB`);

        // Display book statistics
        console.log('\n📖 Book Statistics:');
        console.log(`   Title: ES Modules Sample Book`);
        console.log(`   Author: ES Developer`);
        console.log(
            `   Chapters: 6 (including introduction and array example)`
        );
        console.log(`   Images: 2 (cover + content image)`);
        console.log(`   Notes: Yes`);
        console.log(`   Generated: ${new Date().toLocaleString()}`);
    } catch (error) {
        console.error('❌ Error creating EPUB:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

// Helper function to demonstrate static method
function demonstrateStaticMethods() {
    console.log('\n🧪 Demonstrating static methods:');

    // Note: html2text uses DOMParser which is not available in Node.js
    // This static method is primarily designed for browser environments
    console.log(
        '   ⚠️ Static method html2text() is not available in Node.js environment'
    );
    console.log(
        '   💡 This method works in browser environments where DOMParser is available'
    );
    console.log(
        '   📚 For HTML to text conversion in Node.js, consider using libraries like:'
    );
    console.log('      - jsdom');
    console.log('      - cheerio');
    console.log('      - html-to-text');
}

// Run the example
async function main() {
    demonstrateStaticMethods();
    await createSampleEpub();

    console.log('\n🎉 ES Modules example completed successfully!');
    console.log('💡 Try opening the generated EPUB file in an EPUB reader.');
}

// Execute if this file is run directly
// Use proper ES module detection for cross-platform compatibility
const currentFile = fileURLToPath(import.meta.url);
const isMainModule = process.argv[1] && currentFile === process.argv[1];

if (isMainModule) {
    main().catch(console.error);
}
