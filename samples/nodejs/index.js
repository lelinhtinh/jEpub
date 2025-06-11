/**
 * jEpub Node.js ES Modules Example
 * Demonstrates how to use jEpub in a Node.js environment with ES modules
 */

import jEpub from '../../dist/jepub.es.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module equivalents of CommonJS globals
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('jEpub Node.js ES Modules Example');
console.log('==================================\n');

async function createAdvancedEpub() {
    try {
        console.log('Initializing jEpub with ES modules...');
        const jepub = new jEpub();

        // Initialize with comprehensive book details
        jepub.init({
            i18n: 'en',
            title: 'Node.js ES Modules Sample Book',
            author: 'Node.js Developer',
            publisher: 'ES Modules Publications',
            description:
                'A comprehensive EPUB book created with <b>jEpub</b> in Node.js using ES modules. This book demonstrates server-side EPUB generation with file processing capabilities.',
            tags: [
                'nodejs',
                'es-modules',
                'epub',
                'server-side',
                'javascript',
                'sample',
            ],
        });

        console.log('Book initialized with comprehensive metadata');

        // Set publication date to a specific date
        const publicationDate = new Date('2024-01-01');
        jepub.date(publicationDate);
        console.log(`Publication date set: ${publicationDate.toISOString()}`);

        // Set a custom UUID for the book
        const bookUuid = 'urn:uuid:550e8400-e29b-41d4-a716-446655440000';
        jepub.uuid(bookUuid);
        console.log(`Book UUID set: ${bookUuid}`);

        // Create content chapters
        const introContent = `
            <h1>ES Modules in Node.js</h1>
            <p>This book demonstrates the power of <strong>jEpub</strong> library in Node.js using ES modules.
            ES modules provide a more modern and standardized approach to module management in JavaScript.</p>

            <h2>Key Features Demonstrated</h2>
            <ul>
                <li><strong>ES Module Imports:</strong> Modern import/export syntax</li>
                <li><strong>File System Integration:</strong> Reading and processing files</li>
                <li><strong>Error Handling:</strong> Comprehensive error management</li>
                <li><strong>Progress Tracking:</strong> Real-time generation feedback</li>
                <li><strong>Statistics:</strong> Detailed generation metrics</li>
            </ul>

            <h2>Technical Capabilities</h2>
            <p>The jEpub library seamlessly integrates with Node.js file system operations,
            making it perfect for server-side EPUB generation workflows.</p>
        `;

        jepub.add('Introduction', introContent);
        console.log('Added introduction chapter');

        // Add multiple content chapters
        const topics = [
            {
                title: 'Understanding ES Modules',
                content: `
                    <h1>Understanding ES Modules</h1>
                    <p>ES modules (ECMAScript modules) are the official standard format to package JavaScript code for reuse.</p>

                    <h2>Benefits of ES Modules</h2>
                    <ul>
                        <li>Static module structure</li>
                        <li>Tree shaking support</li>
                        <li>Improved tooling</li>
                        <li>Better performance</li>
                    </ul>
                `,
            },
            {
                title: 'Server-Side EPUB Generation',
                content: `
                    <h1>Server-Side EPUB Generation</h1>
                    <p>Creating EPUB books on the server side offers numerous advantages for content management systems and publishing workflows.</p>

                    <h2>Use Cases</h2>
                    <ol>
                        <li><strong>Automated Publishing:</strong> Generate books from CMS content</li>
                        <li><strong>Batch Processing:</strong> Convert multiple documents at once</li>
                        <li><strong>Dynamic Content:</strong> Include real-time data in publications</li>
                        <li><strong>Custom Formatting:</strong> Apply consistent styling across publications</li>
                    </ol>
                `,
            },
        ];

        // Add all topic chapters
        topics.forEach((topic, index) => {
            jepub.add(topic.title, topic.content);
            console.log(`Added chapter ${index + 1}: ${topic.title}`);
        });

        // Add conclusion with system information
        const conclusionContent = `
            <h1>Conclusion</h1>
            <p>This example demonstrates the comprehensive capabilities of jEpub in a Node.js environment using ES modules.</p>

            <h2>Technical Notes</h2>
            <ul>
                <li><strong>Platform:</strong> ${process.platform}</li>
                <li><strong>Architecture:</strong> ${process.arch}</li>
                <li><strong>Node.js Version:</strong> ${process.version}</li>
                <li><strong>Chapters Created:</strong> ${topics.length + 2}</li>
            </ul>
        `;

        jepub.add('Conclusion', conclusionContent);
        console.log('Added conclusion chapter');

        // Add notes section
        const notesContent = `
            <h1>Development Notes</h1>
            <p>This EPUB was created as a demonstration of jEpub capabilities in Node.js.</p>

            <h2>Features Demonstrated</h2>
            <ul>
                <li>ES module imports and exports</li>
                <li>Dynamic content generation</li>
                <li>Progress monitoring</li>
                <li>Metadata customization</li>
            </ul>

            <p>For more information, visit the jEpub documentation.</p>
        `;

        jepub.notes(notesContent);
        console.log('Added notes section');

        // Generate the EPUB with progress tracking
        console.log('\nGenerating EPUB...');
        const startTime = Date.now();
        const epub = await jepub.generate('nodebuffer', (metadata) => {
            if (metadata.percent) {
                process.stdout.write(
                    `\rProgress: ${Math.round(metadata.percent)}%`
                );
            }
        });
        const endTime = Date.now();

        console.log('\n'); // New line after progress

        // Save the EPUB file
        const outputPath = path.join(
            __dirname,
            'generated-node-es-modules-book.epub'
        );
        fs.writeFileSync(outputPath, epub);

        // Display comprehensive statistics
        const stats = fs.statSync(outputPath);
        console.log('\nEPUB Generation Complete!');
        console.log('================================');
        console.log(`File: ${outputPath}`);
        console.log(`Size: ${(stats.size / 1024).toFixed(2)} KB`);
        console.log(`Generation Time: ${endTime - startTime}ms`);
        console.log(
            `Chapters: ${topics.length + 2} (including intro and conclusion)`
        );
        console.log(`UUID: ${bookUuid}`);
        console.log(`Date: ${publicationDate.toISOString()}`);

        return outputPath;
    } catch (error) {
        console.error('\nError creating EPUB:', error.message);
        console.error('Stack trace:', error.stack);
        process.exit(1);
    }
}

// Demonstrate static methods
function demonstrateUtilities() {
    console.log('\nDemonstrating jEpub Utility Functions');
    console.log('=======================================');

    const testHtml = `
        <div>
            <h1>Title</h1>
            <p>This is a <strong>test</strong> paragraph with <em>formatting</em>.</p>
            <ul>
                <li>Item 1</li>
                <li>Item 2</li>
            </ul>
        </div>
    `;

    console.log('Original HTML:');
    console.log(testHtml);
    console.log('\nConverted to text:');
    console.log(`   Converted: ${jEpub.html2text(testHtml)}`);
    console.log(`   No breaks: ${jEpub.html2text(testHtml, true)}`);
}

// Main execution function
async function main() {
    try {
        await createAdvancedEpub();
        demonstrateUtilities();
        console.log('\nExample completed successfully!');
    } catch (error) {
        console.error('Example failed:', error.message);
        process.exit(1);
    }
}

// Execute the example only if this file is run directly
const currentFile = fileURLToPath(import.meta.url);
const isMainModule = process.argv[1] && currentFile === process.argv[1];

if (isMainModule) {
    main().catch((error) => {
        console.error('Unhandled error:', error);
        process.exit(1);
    });
}

// Export functions for use as a module
export { main, createAdvancedEpub, demonstrateUtilities };
