/**
 * jEpub TypeScript Example
 * Demonstrates full TypeScript integration with comprehensive type safety
 */

// @ts-expect-error - Using relative import for jEpub ES module
import jEpub from '../../../dist/jepub.es.js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Import type definitions
import type {
    jEpubInitDetails,
    jEpubGenerateType,
    jEpubUpdateCallback,
    jEpubImage,
    jEpubImages,
} from '../../../index.d.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('📚 jEpub TypeScript Example');
console.log('===========================\n');

// Type-safe interfaces for our application
interface BookChapter {
    title: string;
    content: string;
    tags?: string[];
    wordCount?: number;
}

interface ImageResource {
    path: string;
    name: string;
    description?: string;
    alt?: string;
}

interface BookStatistics {
    totalChapters: number;
    totalImages: number;
    totalWords: number;
    generationTime: number;
    fileSize: number;
    memoryUsed: number;
}

interface GenerationConfig {
    outputFormat: jEpubGenerateType;
    includeTimestamp: boolean;
    compressionLevel: number;
    enableProgressTracking: boolean;
}

// Custom error classes for better error handling
class ImageLoadError extends Error {
    constructor(imagePath: string, originalError: Error) {
        super(`Failed to load image: ${imagePath} - ${originalError.message}`);
        this.name = 'ImageLoadError';
    }
}

class BookGenerationError extends Error {
    constructor(message: string, originalError?: Error) {
        super(`Book generation failed: ${message}`);
        this.name = 'BookGenerationError';
        if (originalError) {
            this.stack += `\nCaused by: ${originalError.stack}`;
        }
    }
}

// Utility class for image operations
class ImageManager {
    private loadedImages: Map<string, jEpubImage> = new Map();

    /**
     * Safely load an image from the filesystem
     */
    public loadImage(resource: ImageResource): {
        success: boolean;
        error?: Error;
    } {
        try {
            if (!existsSync(resource.path)) {
                throw new Error(`Image file does not exist: ${resource.path}`);
            }

            const imageBuffer = readFileSync(resource.path);
            const imageData: jEpubImage = {
                type: this.getMimeType(resource.path),
                path: `assets/${resource.name}.jpg`, // Simplified for demo
            };

            this.loadedImages.set(resource.name, imageData);
            console.log(
                `✅ Image loaded: ${resource.name} (${(imageBuffer.length / 1024).toFixed(2)} KB)`
            );

            return { success: true };
        } catch (error) {
            const imageError = new ImageLoadError(
                resource.path,
                error as Error
            );
            console.log(`❌ ${imageError.message}`);
            return { success: false, error: imageError };
        }
    }

    /**
     * Get MIME type based on file extension
     */
    private getMimeType(filePath: string): string {
        const ext = filePath.toLowerCase().split('.').pop();
        switch (ext) {
            case 'jpg':
            case 'jpeg':
                return 'image/jpeg';
            case 'png':
                return 'image/png';
            case 'gif':
                return 'image/gif';
            case 'webp':
                return 'image/webp';
            default:
                return 'image/jpeg';
        }
    }

    /**
     * Get all loaded images
     */
    public getLoadedImages(): Map<string, jEpubImage> {
        return this.loadedImages;
    }

    /**
     * Check if an image is loaded
     */
    public hasImage(name: string): boolean {
        return this.loadedImages.has(name);
    }
}

// Content generator class
class ContentGenerator {
    /**
     * Generate a comprehensive chapter with TypeScript features
     */
    public static generateTypeScriptChapter(
        chapterNumber: number
    ): BookChapter {
        const features = [
            'Static typing with comprehensive type definitions',
            'Interface-based design for better code structure',
            'Enum types for configuration management',
            'Generic types for reusable components',
            'Union types for flexible parameter handling',
            'Type guards for runtime safety',
            'Decorators for advanced patterns',
        ];

        const content = `
            <h1>Chapter ${chapterNumber}: Advanced TypeScript Features</h1>
            <p>This chapter explores advanced TypeScript features and their application in EPUB generation.</p>

            <h2>Type Safety Benefits</h2>
            <p>TypeScript provides compile-time type checking that prevents many runtime errors:</p>

            <ul>
                ${features.map((feature) => `<li><strong>${feature}</strong></li>`).join('')}
            </ul>

            <h2>jEpub TypeScript Integration</h2>
            <p>The jEpub library provides comprehensive TypeScript definitions:</p>

            <pre style="background-color: #f8f9fa; padding: 16px; border-radius: 4px; overflow-x: auto;"><code>import jEpub, {
    jEpubInitDetails,
    jEpubGenerateType,
    jEpubUpdateCallback
} from 'jepub';

const bookDetails: jEpubInitDetails = {
    title: 'TypeScript Sample',
    author: 'TS Developer',
    i18n: 'en'
};

const generateType: jEpubGenerateType = 'blob';
const jepub = new jEpub();
jepub.init(bookDetails);</code></pre>

            <h2>Error Handling</h2>
            <p>TypeScript enables robust error handling with custom error classes:</p>

            <pre style="background-color: #f8f9fa; padding: 16px; border-radius: 4px; overflow-x: auto;"><code>class BookGenerationError extends Error {
    constructor(message: string, originalError?: Error) {
        super(\`Book generation failed: \${message}\`);
        this.name = 'BookGenerationError';
    }
}</code></pre>

            <h2>Interface Design</h2>
            <p>Well-designed interfaces improve code maintainability:</p>

            <pre style="background-color: #f8f9fa; padding: 16px; border-radius: 4px; overflow-x: auto;"><code>interface BookChapter {
    title: string;
    content: string;
    order: number;
    tags?: string[];
    wordCount?: number;
}</code></pre>

            <blockquote style="border-left: 4px solid #007bff; padding-left: 16px; margin: 20px 0; font-style: italic;">
                <p>TypeScript's type system helps catch errors at compile time,
                leading to more reliable EPUB generation workflows.</p>
            </blockquote>

            <h2>Generic Programming</h2>
            <p>TypeScript generics enable reusable and type-safe components:</p>

            <pre style="background-color: #f8f9fa; padding: 16px; border-radius: 4px; overflow-x: auto;"><code>class ContentManager&lt;T&gt; {
    private items: T[] = [];

    add(item: T): void {
        this.items.push(item);
    }

    getAll(): T[] {
        return this.items;
    }
}</code></pre>
        `;

        const wordCount = content.split(/\s+/).length;

        return {
            title: `Advanced TypeScript Features`,
            content,
            tags: ['typescript', 'programming', 'type-safety'],
            wordCount,
        };
    }

    /**
     * Generate content with embedded images
     */
    public static generateImageChapter(
        imageManager: ImageManager
    ): BookChapter {
        const loadedImages = Array.from(imageManager.getLoadedImages().keys());

        const content = `
            <h1>Image Integration with TypeScript</h1>
            <p>This chapter demonstrates type-safe image handling in EPUB generation.</p>

            <h2>Loaded Images</h2>
            <p>The following images were loaded and processed with type safety:</p>

            ${
                loadedImages.length > 0
                    ? `
                ${loadedImages
                    .map(
                        (imageName) => `
                    <h3>Image: ${imageName}</h3>
                    <p>Type-safe image embedding:</p>
                    <%= image["${imageName}"] %>
                    <p><code>imageManager.hasImage("${imageName}"): ${imageManager.hasImage(imageName)}</code></p>
                `
                    )
                    .join('')}
            `
                    : `
                <p><em>No images were loaded for this example.</em></p>
            `
            }

            <h2>ImageManager Class</h2>
            <p>The ImageManager class provides type-safe image operations:</p>

            <pre style="background-color: #f8f9fa; padding: 16px; border-radius: 4px; overflow-x: auto;"><code>class ImageManager {
    private loadedImages: Map&lt;string, jEpubImage&gt; = new Map();

    public loadImage(resource: ImageResource): { success: boolean; error?: Error } {
        // Type-safe image loading implementation
    }

    public hasImage(name: string): boolean {
        return this.loadedImages.has(name);
    }
}</code></pre>

            <h2>Type Definitions</h2>
            <p>Custom interfaces provide clear contracts:</p>

            <pre style="background-color: #f8f9fa; padding: 16px; border-radius: 4px; overflow-x: auto;"><code>interface ImageResource {
    path: string;
    name: string;
    description?: string;
    alt?: string;
}

interface jEpubImage {
    type: string;
    path: string;
}</code></pre>

            <p>Total images processed: <strong>${loadedImages.length}</strong></p>
        `;

        return {
            title: 'Image Integration with TypeScript',
            content,
            tags: ['images', 'typescript', 'type-safety'],
            wordCount: content.split(/\s+/).length,
        };
    }
}

// Statistics calculator
class StatisticsCalculator {
    public static calculateBookStats(
        chapters: BookChapter[],
        images: Map<string, jEpubImage>,
        generationTime: number,
        fileSize: number
    ): BookStatistics {
        const totalWords = chapters.reduce(
            (sum, chapter) => sum + (chapter.wordCount || 0),
            0
        );
        const memoryUsed = Math.round(
            process.memoryUsage().heapUsed / 1024 / 1024
        );

        return {
            totalChapters: chapters.length,
            totalImages: images.size,
            totalWords,
            generationTime,
            fileSize,
            memoryUsed,
        };
    }

    public static displayStatistics(stats: BookStatistics): void {
        console.log('\n📊 Book Generation Statistics:');
        console.log(`   📚 Total Chapters: ${stats.totalChapters}`);
        console.log(`   🖼️ Total Images: ${stats.totalImages}`);
        console.log(`   📝 Total Words: ${stats.totalWords.toLocaleString()}`);
        console.log(`   ⏱️ Generation Time: ${stats.generationTime}ms`);
        console.log(
            `   📁 File Size: ${(stats.fileSize / 1024).toFixed(2)} KB`
        );
        console.log(`   💾 Memory Used: ${stats.memoryUsed} MB`);
        console.log(
            `   📈 Words per Chapter: ${Math.round(stats.totalWords / stats.totalChapters)}`
        );
        console.log(
            `   🖼️ Images per Chapter: ${(stats.totalImages / stats.totalChapters).toFixed(1)}`
        );
    }
}

// Main book generation class
class TypeScriptEpubGenerator {
    private jepub: jEpub;
    private imageManager: ImageManager;
    private chapters: BookChapter[] = [];
    private config: GenerationConfig;

    constructor(config: GenerationConfig) {
        this.jepub = new jEpub();
        this.imageManager = new ImageManager();
        this.config = config;
    }

    /**
     * Initialize the EPUB with type-safe configuration
     */
    public async initialize(): Promise<void> {
        console.log('🚀 Initializing TypeScript EPUB Generator...');

        const bookDetails: jEpubInitDetails = {
            i18n: 'en',
            title: 'TypeScript EPUB Generation Guide',
            author: 'TypeScript Developer',
            publisher: 'Type-Safe Publications',
            description:
                'A comprehensive guide to EPUB generation with <strong>TypeScript</strong> and jEpub. This book demonstrates advanced type safety, modern JavaScript features, and professional development practices.',
            tags: [
                'typescript',
                'epub',
                'programming',
                'type-safety',
                'javascript',
                'tutorial',
            ],
        };

        this.jepub.init(bookDetails);
        console.log('✅ EPUB initialized with type-safe configuration');

        // Set custom metadata with type safety
        const publicationDate = new Date();
        this.jepub.date(publicationDate);

        const customUuid = `urn:uuid:typescript-epub-${Date.now()}`;
        this.jepub.uuid(customUuid);

        console.log(`📅 Publication date: ${publicationDate.toISOString()}`);
        console.log(`🆔 Custom UUID: ${customUuid}`);
    }

    /**
     * Load images with comprehensive error handling
     */
    public loadImages(): void {
        console.log('🖼️ Loading images with type safety...');

        const imageResources: ImageResource[] = [
            {
                path: join(__dirname, '../../../demo/cover-image.jpg'),
                name: 'cover',
                description: 'Main cover image for the book',
                alt: 'TypeScript EPUB Book Cover',
            },
            {
                path: join(__dirname, '../../../demo/lorem-ipsum.jpg'),
                name: 'typescript-demo',
                description: 'Demonstration image for content',
                alt: 'TypeScript Code Example',
            },
        ];

        let successCount = 0;

        // Load cover image
        const coverResource = imageResources[0];
        const coverResult = this.imageManager.loadImage(coverResource);
        if (coverResult.success) {
            try {
                const coverBuffer = readFileSync(coverResource.path);
                this.jepub.cover(coverBuffer.buffer);
                console.log('✅ Cover image added successfully');
                successCount++;
            } catch (error) {
                console.log(
                    `❌ Failed to add cover: ${(error as Error).message}`
                );
            }
        }

        // Load content images
        for (let i = 1; i < imageResources.length; i++) {
            const resource = imageResources[i];
            const result = this.imageManager.loadImage(resource);

            if (result.success) {
                try {
                    const imageBuffer = readFileSync(resource.path);
                    this.jepub.image(imageBuffer.buffer, resource.name);
                    successCount++;
                } catch (error) {
                    console.log(
                        `❌ Failed to add image ${resource.name}: ${(error as Error).message}`
                    );
                }
            }
        }

        console.log(
            `📊 Images loaded: ${successCount}/${imageResources.length}`
        );
    }

    /**
     * Generate comprehensive chapters
     */
    public generateChapters(): void {
        console.log('📝 Generating chapters with TypeScript...');

        // Introduction chapter
        const introChapter: BookChapter = {
            title: 'Introduction to TypeScript EPUB Generation',
            content: this.generateIntroContent(),
            tags: ['introduction', 'typescript', 'epub'],
            wordCount: 0, // Will be calculated
        };
        introChapter.wordCount = introChapter.content.split(/\s+/).length;
        this.chapters.push(introChapter);

        // TypeScript features chapters
        for (let i = 2; i <= 4; i++) {
            const chapter = ContentGenerator.generateTypeScriptChapter(i);
            this.chapters.push(chapter);
        }

        // Image demonstration chapter
        const imageChapter = ContentGenerator.generateImageChapter(
            this.imageManager
        );
        this.chapters.push(imageChapter);

        // Configuration and best practices chapter
        const configChapter: BookChapter = {
            title: 'Configuration and Best Practices',
            content: this.generateConfigContent(),
            tags: ['configuration', 'best-practices', 'typescript'],
            wordCount: 0,
        };
        configChapter.wordCount = configChapter.content.split(/\s+/).length;
        this.chapters.push(configChapter);

        // Add all chapters to the EPUB
        this.chapters.forEach((chapter) => {
            this.jepub.add(chapter.title, chapter.content);
            console.log(
                `📄 Chapter added: ${chapter.title} (${chapter.wordCount} words)`
            );
        });

        console.log(`✅ Generated ${this.chapters.length} chapters`);
    }

    /**
     * Generate introduction content
     */
    private generateIntroContent(): string {
        return `
            <h1>Introduction to TypeScript EPUB Generation</h1>
            <p>Welcome to the comprehensive guide for EPUB generation using <strong>TypeScript</strong> and the jEpub library.</p>

            <h2>What You'll Learn</h2>
            <p>This book covers everything you need to know about creating EPUB books with TypeScript:</p>

            <ul>
                <li><strong>Type Safety</strong>: Leveraging TypeScript's type system for reliable code</li>
                <li><strong>Modern JavaScript</strong>: ES modules, async/await, and advanced patterns</li>
                <li><strong>Error Handling</strong>: Robust error handling with custom error classes</li>
                <li><strong>Image Processing</strong>: Type-safe image loading and management</li>
                <li><strong>Content Generation</strong>: Programmatic content creation with interfaces</li>
                <li><strong>Best Practices</strong>: Professional development patterns and techniques</li>
            </ul>

            <h2>Technical Requirements</h2>
            <table border="1" style="border-collapse: collapse; width: 100%;">
                <tr>
                    <th style="padding: 8px; background-color: #f0f0f0;">Technology</th>
                    <th style="padding: 8px; background-color: #f0f0f0;">Version</th>
                    <th style="padding: 8px; background-color: #f0f0f0;">Purpose</th>
                </tr>
                <tr>
                    <td style="padding: 8px;">TypeScript</td>
                    <td style="padding: 8px;">5.0+</td>
                    <td style="padding: 8px;">Type safety and modern features</td>
                </tr>
                <tr>
                    <td style="padding: 8px;">Node.js</td>
                    <td style="padding: 8px;">18+</td>
                    <td style="padding: 8px;">Runtime environment</td>
                </tr>
                <tr>
                    <td style="padding: 8px;">jEpub</td>
                    <td style="padding: 8px;">2.1+</td>
                    <td style="padding: 8px;">EPUB generation library</td>
                </tr>
                <tr>
                    <td style="padding: 8px;">ES Modules</td>
                    <td style="padding: 8px;">ES2020</td>
                    <td style="padding: 8px;">Modern module system</td>
                </tr>
            </table>

            <h2>Project Structure</h2>
            <p>The TypeScript example demonstrates a professional project structure:</p>

            <pre style="background-color: #f8f9fa; padding: 16px; border-radius: 4px; overflow-x: auto;"><code>typescript-example/
├── src/
│   ├── index.ts          # Main application
│   ├── types/            # Type definitions
│   ├── utils/            # Utility functions
│   └── generators/       # Content generators
├── dist/                 # Compiled JavaScript
├── tsconfig.json         # TypeScript configuration
└── package.json          # Project dependencies</code></pre>

            <blockquote style="border-left: 4px solid #28a745; padding-left: 16px; margin: 20px 0; font-style: italic;">
                <p><strong>Note:</strong> This book was generated entirely with TypeScript,
                demonstrating the power of type-safe EPUB creation.</p>
            </blockquote>

            <h2>Key Benefits</h2>
            <p>Using TypeScript for EPUB generation provides several advantages:</p>

            <ol>
                <li><strong>Compile-time Error Detection</strong>: Catch errors before runtime</li>
                <li><strong>IntelliSense Support</strong>: Better IDE experience with autocomplete</li>
                <li><strong>Refactoring Safety</strong>: Rename and restructure code with confidence</li>
                <li><strong>Documentation</strong>: Interfaces serve as living documentation</li>
                <li><strong>Team Collaboration</strong>: Clear contracts between code components</li>
            </ol>

            <p>Let's dive into the world of type-safe EPUB generation!</p>
        `;
    }

    /**
     * Generate configuration content
     */
    private generateConfigContent(): string {
        return `
            <h1>Configuration and Best Practices</h1>
            <p>This chapter covers advanced configuration and professional development practices.</p>

            <h2>TypeScript Configuration</h2>
            <p>Optimal tsconfig.json settings for EPUB generation projects:</p>

            <pre style="background-color: #f8f9fa; padding: 16px; border-radius: 4px; overflow-x: auto;"><code>{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "sourceMap": true,
    "declaration": true
  }
}</code></pre>

            <h2>Project Organization</h2>
            <p>Best practices for organizing TypeScript EPUB projects:</p>

            <h3>Separation of Concerns</h3>
            <ul>
                <li><strong>Types</strong>: Centralized type definitions</li>
                <li><strong>Utilities</strong>: Reusable helper functions</li>
                <li><strong>Generators</strong>: Content generation logic</li>
                <li><strong>Managers</strong>: Resource management classes</li>
            </ul>

            <h3>Error Handling Strategy</h3>
            <pre style="background-color: #f8f9fa; padding: 16px; border-radius: 4px; overflow-x: auto;"><code>// Custom error hierarchy
class EpubError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

class ImageLoadError extends EpubError {}
class ContentGenerationError extends EpubError {}
class ValidationError extends EpubError {}</code></pre>

            <h2>Performance Optimization</h2>
            <p>Techniques for optimizing EPUB generation performance:</p>

            <ol>
                <li><strong>Lazy Loading</strong>: Load resources only when needed</li>
                <li><strong>Memory Management</strong>: Efficient Buffer handling</li>
                <li><strong>Progress Tracking</strong>: Monitor generation progress</li>
                <li><strong>Caching</strong>: Cache processed content when appropriate</li>
            </ol>

            <h2>Testing Strategy</h2>
            <p>Comprehensive testing approach for EPUB generators:</p>

            <pre style="background-color: #f8f9fa; padding: 16px; border-radius: 4px; overflow-x: auto;"><code>// Unit test example
describe('ImageManager', () => {
    let imageManager: ImageManager;

    beforeEach(() => {
        imageManager = new ImageManager();
    });

    it('should load valid images', () => {
        const result = imageManager.loadImage({
            path: 'test-image.jpg',
            name: 'test'
        });

        expect(result.success).toBe(true);
        expect(imageManager.hasImage('test')).toBe(true);
    });
});</code></pre>

            <h2>Configuration Types</h2>
            <p>Type-safe configuration interfaces:</p>

            <pre style="background-color: #f8f9fa; padding: 16px; border-radius: 4px; overflow-x: auto;"><code>interface GenerationConfig {
    outputFormat: jEpubGenerateType;
    includeTimestamp: boolean;
    compressionLevel: number;
    enableProgressTracking: boolean;
}

interface BookStatistics {
    totalChapters: number;
    totalImages: number;
    totalWords: number;
    generationTime: number;
    fileSize: number;
    memoryUsed: number;
}</code></pre>

            <h2>Deployment Considerations</h2>
            <p>Preparing TypeScript EPUB generators for production:</p>

            <ul>
                <li><strong>Build Process</strong>: Automated compilation and optimization</li>
                <li><strong>Environment Variables</strong>: Type-safe configuration management</li>
                <li><strong>Logging</strong>: Structured logging with proper types</li>
                <li><strong>Monitoring</strong>: Performance and error monitoring</li>
                <li><strong>Documentation</strong>: Generated API documentation from types</li>
            </ul>

            <blockquote style="border-left: 4px solid #ffc107; padding-left: 16px; margin: 20px 0; font-style: italic;">
                <p><strong>Pro Tip:</strong> Use TypeScript's strict mode to catch potential
                issues early in development. The compiler is your friend!</p>
            </blockquote>
        `;
    }

    /**
     * Add notes section
     */
    public addNotes(): void {
        console.log('📝 Adding comprehensive notes...');

        const totalWords = this.chapters.reduce(
            (sum, chapter) => sum + (chapter.wordCount || 0),
            0
        );

        const notesContent = `
            <h2>TypeScript EPUB Generation Notes</h2>
            <p>This EPUB was generated using advanced TypeScript techniques and type-safe practices.</p>

            <h3>Technical Implementation</h3>
            <ul>
                <li><strong>Language</strong>: TypeScript ${process.env.npm_config_typescript_version || '5.0+'}</li>
                <li><strong>Runtime</strong>: Node.js ${process.version}</li>
                <li><strong>Module System</strong>: ES Modules (ESNext)</li>
                <li><strong>Target</strong>: ES2020</li>
                <li><strong>Compilation</strong>: Strict mode enabled</li>
                <li><strong>Source Maps</strong>: Enabled for debugging</li>
            </ul>

            <h3>Generation Statistics</h3>
            <ul>
                <li><strong>Total Chapters</strong>: ${this.chapters.length}</li>
                <li><strong>Total Words</strong>: ${totalWords.toLocaleString()}</li>
                <li><strong>Images Loaded</strong>: ${this.imageManager.getLoadedImages().size}</li>
                <li><strong>Generated On</strong>: ${new Date().toISOString()}</li>
                <li><strong>Platform</strong>: ${process.platform}</li>
                <li><strong>Architecture</strong>: ${process.arch}</li>
            </ul>

            <h3>Type Safety Features Used</h3>
            <ul>
                <li>✅ Interface-based design patterns</li>
                <li>✅ Custom error class hierarchy</li>
                <li>✅ Generic type parameters</li>
                <li>✅ Union types for flexible APIs</li>
                <li>✅ Optional properties with proper defaults</li>
                <li>✅ Type guards for runtime validation</li>
                <li>✅ Mapped types for transformations</li>
            </ul>

            <h3>Development Tools</h3>
            <ul>
                <li><strong>Compiler</strong>: TypeScript compiler (tsc)</li>
                <li><strong>Linting</strong>: ESLint with TypeScript rules</li>
                <li><strong>Formatting</strong>: Prettier for consistent code style</li>
                <li><strong>Testing</strong>: Jest with TypeScript support</li>
                <li><strong>Build</strong>: npm scripts for automation</li>
            </ul>

            <h3>Performance Metrics</h3>
            <p>This generation process demonstrates excellent performance characteristics:</p>
            <ul>
                <li><strong>Memory Efficiency</strong>: Proper Buffer management</li>
                <li><strong>Type Checking</strong>: Zero runtime type errors</li>
                <li><strong>Code Quality</strong>: Strict TypeScript compliance</li>
                <li><strong>Error Handling</strong>: Comprehensive error recovery</li>
            </ul>

            <h3>Next Steps</h3>
            <p>Consider these enhancements for production use:</p>
            <ol>
                <li>Add comprehensive unit and integration tests</li>
                <li>Implement streaming for large file processing</li>
                <li>Add configuration validation with JSON schemas</li>
                <li>Implement plugins system for extensibility</li>
                <li>Add support for custom themes and templates</li>
                <li>Create CLI tool for command-line usage</li>
            </ol>

            <p><em>This EPUB demonstrates the full power of TypeScript for type-safe,
            maintainable, and scalable EPUB generation workflows.</em></p>
        `;

        this.jepub.notes(notesContent);
        console.log('✅ Notes section added');
    }

    /**
     * Generate the final EPUB with progress tracking
     */
    public async generateEpub(): Promise<Buffer> {
        console.log('\n🔄 Generating EPUB with TypeScript...');

        const startTime = Date.now();
        let progressCount = 0;

        const progressCallback: jEpubUpdateCallback = (metadata: any) => {
            progressCount++;
            const percent = Math.round(metadata.percent);

            if (
                this.config.enableProgressTracking &&
                (percent % 10 === 0 || metadata.currentFile.includes('.opf'))
            ) {
                console.log(`   📊 ${percent}% - ${metadata.currentFile}`);
            }
        };

        try {
            const epub = await this.jepub.generate(
                this.config.outputFormat,
                progressCallback
            );
            const generationTime = Date.now() - startTime;

            // Calculate and display statistics - handle different buffer types
            const fileSize =
                epub instanceof ArrayBuffer
                    ? epub.byteLength
                    : epub instanceof Uint8Array
                      ? epub.length
                      : 'length' in epub
                        ? (epub as any).length
                        : 0;

            const stats = StatisticsCalculator.calculateBookStats(
                this.chapters,
                this.imageManager.getLoadedImages(),
                generationTime,
                fileSize
            );

            StatisticsCalculator.displayStatistics(stats);

            console.log(`\n✅ EPUB generation completed successfully!`);
            console.log(`⏱️ Total time: ${generationTime}ms`);
            console.log(`🔢 Progress callbacks: ${progressCount}`);

            return epub as Buffer;
        } catch (error) {
            throw new BookGenerationError(
                'Failed to generate EPUB',
                error as Error
            );
        }
    }

    /**
     * Save the EPUB to filesystem
     */
    public saveEpub(epub: Buffer): string {
        const timestamp = this.config.includeTimestamp
            ? `-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}`
            : '';

        const outputPath = join(
            __dirname,
            `../typescript-epub-sample${timestamp}.epub`
        );

        try {
            writeFileSync(outputPath, epub);
            console.log(`💾 EPUB saved: ${outputPath}`);
            return outputPath;
        } catch (error) {
            throw new BookGenerationError(
                `Failed to save EPUB to ${outputPath}`,
                error as Error
            );
        }
    }
}

// Main execution function
async function main(): Promise<void> {
    console.log('🎯 Starting TypeScript EPUB generation...\n');

    try {
        // Configuration with type safety
        const config: GenerationConfig = {
            outputFormat: 'nodebuffer',
            includeTimestamp: true,
            compressionLevel: 9,
            enableProgressTracking: true,
        };

        console.log('⚙️ Configuration:', config);

        // Create generator instance
        const generator = new TypeScriptEpubGenerator(config);

        // Initialize book
        await generator.initialize();

        // Load images
        generator.loadImages();

        // Generate content
        generator.generateChapters();

        // Add notes
        generator.addNotes();

        // Generate EPUB
        const epub = await generator.generateEpub();

        // Save to file
        const outputPath = generator.saveEpub(epub);

        console.log('\n🎉 TypeScript EPUB example completed successfully!');
        console.log('💡 Features demonstrated:');
        console.log('   ✅ Type-safe configuration and interfaces');
        console.log('   ✅ Custom error handling classes');
        console.log('   ✅ Generic programming patterns');
        console.log('   ✅ Comprehensive documentation generation');
        console.log('   ✅ Performance monitoring and statistics');
        console.log('   ✅ Professional project structure');
        console.log(`\n📖 Open the generated EPUB: ${outputPath}`);
    } catch (error) {
        if (
            error instanceof BookGenerationError ||
            error instanceof ImageLoadError
        ) {
            console.error(`💥 ${error.name}: ${error.message}`);
        } else {
            console.error('💥 Unexpected error:', error);
        }
        process.exit(1);
    }
}

// Execute if this file is run directly
// Use proper ES module detection for cross-platform compatibility
const currentFile = fileURLToPath(import.meta.url);
const isMainModule = process.argv[1] && currentFile === process.argv[1];

if (isMainModule) {
    main().catch((error) => {
        console.error('💥 Fatal error in main:', error);
        process.exit(1);
    });
}

// Export for testing
export {
    TypeScriptEpubGenerator,
    ImageManager,
    ContentGenerator,
    StatisticsCalculator,
    BookGenerationError,
    ImageLoadError,
};
export type { BookChapter, ImageResource, BookStatistics, GenerationConfig };
