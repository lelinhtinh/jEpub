# TypeScript Example

This example demonstrates comprehensive TypeScript integration with jEpub,
showcasing advanced type safety, modern JavaScript features, and professional
development practices.

## Features

- 🔒 **Full Type Safety**: Comprehensive TypeScript definitions and interfaces
- 🏗️ **Modern Architecture**: Class-based design with separation of concerns
- 🛡️ **Error Handling**: Custom error classes with proper error hierarchies
- 📊 **Statistics & Monitoring**: Performance tracking and detailed analytics
- 🖼️ **Image Management**: Type-safe image loading and processing
- 📝 **Content Generation**: Programmatic content creation with interfaces
- ⚙️ **Configuration**: Type-safe configuration management
- 🧪 **Testing Ready**: Exportable classes and functions for unit testing

## Prerequisites

- Node.js 18+ (with ES modules support)
- TypeScript 5.0+
- Built jEpub library

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Ensure jEpub is built:
   ```bash
   cd ../..
   npm run build
   cd samples/typescript
   ```

## How to Run

### Development Mode

```bash
npm run dev
```

This starts TypeScript in watch mode for development.

### Production Build and Run

```bash
npm run build
npm start
```

### Clean Build

```bash
npm run clean
npm run build
npm start
```

## Project Structure

```
typescript-example/
├── src/
│   └── index.ts              # Main application with all functionality
├── dist/                     # Compiled JavaScript output
├── tsconfig.json            # TypeScript configuration
├── package.json             # Dependencies and scripts
└── README.md               # This file
```

## TypeScript Features Demonstrated

### 1. Interface Design

```typescript
interface jEpubInitDetails {
  i18n?: string;
  title?: string;
  author?: string;
  publisher?: string;
  description?: string;
  tags?: string[];
}

interface BookChapter {
  title: string;
  content: string;
  order: number;
  tags?: string[];
  wordCount?: number;
}
```

### 2. Custom Error Classes

```typescript
class BookGenerationError extends Error {
  constructor(message: string, originalError?: Error) {
    super(`Book generation failed: ${message}`);
    this.name = 'BookGenerationError';
  }
}

class ImageLoadError extends Error {
  constructor(imagePath: string, originalError: Error) {
    super(`Failed to load image: ${imagePath}`);
    this.name = 'ImageLoadError';
  }
}
```

### 3. Generic Programming

```typescript
class ContentManager<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  getAll(): T[] {
    return this.items;
  }
}
```

### 4. Type-Safe Configuration

```typescript
interface GenerationConfig {
  outputFormat: jEpubGenerateType;
  includeTimestamp: boolean;
  compressionLevel: number;
  enableProgressTracking: boolean;
}
```

## Class Architecture

### TypeScriptEpubGenerator

Main orchestrator class that coordinates the entire EPUB generation process.

**Key Methods:**

- `initialize()`: Set up book metadata with type safety
- `loadImages()`: Load and process images with error handling
- `generateChapters()`: Create comprehensive book content
- `generateEpub()`: Generate final EPUB with progress tracking

### ImageManager

Handles all image-related operations with type safety.

**Features:**

- Safe image loading with existence checks
- MIME type detection
- Error recovery and reporting
- Loaded image tracking

### ContentGenerator

Static utility class for generating rich HTML content.

**Methods:**

- `generateTypeScriptChapter()`: Creates chapters about TypeScript features
- `generateImageChapter()`: Demonstrates image integration

### StatisticsCalculator

Calculates and displays comprehensive generation statistics.

**Metrics:**

- Chapter and word counts
- Generation time and file size
- Memory usage
- Performance analytics

## Features Demonstrated

### jEpub Integration

- ✅ Type-safe initialization with `jEpubInitDetails`
- ✅ Custom dates and UUID management
- ✅ Cover and content image handling
- ✅ Multiple chapter creation with rich HTML
- ✅ EJS templating for dynamic content
- ✅ Comprehensive notes section
- ✅ Progress tracking with callbacks
- ✅ Multiple output formats

### TypeScript Features

- ✅ Strict type checking
- ✅ Interface-based design
- ✅ Custom error hierarchies
- ✅ Generic type parameters
- ✅ Union types and optionals
- ✅ Type guards and assertions
- ✅ ES modules with proper imports/exports
- ✅ Modern async/await patterns

### Professional Practices

- ✅ Separation of concerns
- ✅ Error handling and recovery
- ✅ Performance monitoring
- ✅ Memory management
- ✅ Comprehensive logging
- ✅ Code organization and structure
- ✅ Documentation and comments

## Generated Content

The example creates a comprehensive EPUB book featuring:

### Book Structure

1. **Introduction**: TypeScript and EPUB generation overview
2. **TypeScript Features**: Advanced language features (multiple chapters)
3. **Image Integration**: Demonstration of type-safe image handling
4. **Configuration**: Best practices and project setup
5. **Technical Notes**: Comprehensive generation documentation

### Content Features

- Rich HTML formatting with CSS
- Code examples with syntax highlighting
- Tables and structured data
- Embedded images with EJS templating
- Professional documentation style

## Output

### Console Output

```
📚 jEpub TypeScript Example
===========================

🚀 Initializing TypeScript EPUB Generator...
✅ EPUB initialized with type-safe configuration
📅 Publication date: 2024-XX-XXTXX:XX:XX.XXXZ
🆔 Custom UUID: urn:uuid:typescript-epub-XXXXXXXXX

🖼️ Loading images with type safety...
✅ Image loaded: cover (XX.XX KB)
✅ Cover image added successfully
📊 Images loaded: X/X

📝 Generating chapters with TypeScript...
📄 Chapter added: Introduction to TypeScript EPUB Generation (XXX words)
📄 Chapter added: Advanced TypeScript Features (XXX words)
...

📊 Book Generation Statistics:
   📚 Total Chapters: X
   🖼️ Total Images: X
   📝 Total Words: X,XXX
   ⏱️ Generation Time: XXXms
   📁 File Size: XX.XX KB
   💾 Memory Used: XX MB
```

### Generated Files

- **EPUB File**: `typescript-epub-sample-[timestamp].epub`
- **Compiled JS**: `dist/index.js` and source maps
- **Type Declarations**: `dist/index.d.ts`

## TypeScript Configuration

### tsconfig.json Features

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Node",
    "strict": true,
    "esModuleInterop": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true
  }
}
```

### Key Benefits

- **Strict Mode**: Maximum type safety
- **ES2020 Target**: Modern JavaScript features
- **Source Maps**: Debugging support
- **Declarations**: Type information for consumers
- **ESNext Modules**: Modern module system

## Testing Support

The example exports all classes and types for unit testing:

```typescript
// Exported classes
export {
  TypeScriptEpubGenerator,
  ImageManager,
  ContentGenerator,
  StatisticsCalculator,
};

// Exported types
export type { BookChapter, ImageResource, BookStatistics, GenerationConfig };
```

## Production Considerations

### Code Quality

- ✅ Strict TypeScript compilation
- ✅ Comprehensive error handling
- ✅ Memory-efficient processing
- ✅ Progress tracking and monitoring
- ✅ Professional logging

### Scalability

- ✅ Modular class architecture
- ✅ Configurable generation options
- ✅ Extensible content generators
- ✅ Type-safe plugin system ready

### Maintenance

- ✅ Clear separation of concerns
- ✅ Interface-based contracts
- ✅ Comprehensive documentation
- ✅ Unit test ready structure

## Advanced Usage

### Custom Content Generators

```typescript
class MyContentGenerator extends ContentGenerator {
  public static generateCustomChapter(data: MyData): BookChapter {
    // Implementation with full type safety
  }
}
```

### Extended Configuration

```typescript
interface ExtendedConfig extends GenerationConfig {
  customTheme: string;
  plugins: string[];
}
```

### Error Handling

```typescript
try {
  await generator.generateEpub();
} catch (error) {
  if (error instanceof BookGenerationError) {
    // Handle book generation errors
  } else if (error instanceof ImageLoadError) {
    // Handle image loading errors
  }
}
```

This example demonstrates the full power of TypeScript for creating
maintainable, scalable, and type-safe EPUB generation workflows.
