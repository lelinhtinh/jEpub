# ES Modules Example

This example demonstrates how to use jEpub with ES modules in a Node.js
environment.

## Features

- 🔧 ES module imports (`import`/`export`)
- 📁 File system operations for images
- 🖼️ Image handling with Node.js Buffers
- 📚 Multiple chapters with different content types
- 📊 Progress tracking during generation
- 🔄 Programmatic chapter creation
- 📝 Mixed content (HTML strings and text arrays)

## Prerequisites

- Node.js 14+ (with ES modules support)
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
   cd samples/es-modules
   ```

## How to Run

```bash
npm start
```

Or with Node.js watch mode for development:

```bash
npm run dev
```

## What It Does

The example creates a comprehensive EPUB book that includes:

1. **Book Metadata**: Title, author, publisher, description, tags
2. **Custom Date & UUID**: Sets publication date and unique identifier
3. **Cover Image**: Loads from demo folder and adds as cover
4. **Content Images**: Loads images and embeds using EJS templates
5. **Multiple Chapters**: Creates several chapters with different content
6. **Array Content**: Demonstrates using string arrays as chapter content
7. **Notes Section**: Adds detailed notes about the generation process
8. **Progress Tracking**: Shows generation progress in console

## Code Structure

### Key Components

- **ES Module Imports**: Clean import syntax for dependencies
- **File Operations**: Reading images using `fs.readFileSync()`
- **Buffer Handling**: Converting Node.js Buffers to ArrayBuffers
- **Error Handling**: Graceful handling of missing files
- **Progress Callbacks**: Real-time generation feedback

### Example Code Patterns

```javascript
// ES module imports
import jEpub from 'jepub';
import { readFileSync } from 'fs';

// Initialize with metadata
const jepub = new jEpub();
jepub.init({
  i18n: 'en',
  title: 'ES Modules Sample Book',
  // ... other metadata
});

// Add images from filesystem
const imageBuffer = readFileSync(imagePath);
jepub.image(imageBuffer.buffer, 'imageName');

// Generate with progress tracking
const epub = await jepub.generate('nodebuffer', (metadata) => {
  console.log(`${metadata.percent}% - ${metadata.currentFile}`);
});
```

## Output

The script generates:

- **Console Output**: Detailed progress and statistics
- **EPUB File**: `es-modules-sample.epub` in the current directory
- **File Statistics**: Size, chapter count, and generation details

## Features Demonstrated

### jEpub Features

- ✅ Book initialization and metadata
- ✅ Custom dates and UUIDs
- ✅ Cover and content images
- ✅ Multiple chapters (HTML and array content)
- ✅ EJS templating for images
- ✅ Notes section
- ✅ Progress callbacks
- ✅ Static utility methods

### ES Modules Features

- ✅ `import`/`export` syntax
- ✅ File URL imports
- ✅ Module detection (`import.meta.url`)
- ✅ Top-level await
- ✅ Modern JavaScript features

### Node.js Integration

- ✅ File system operations
- ✅ Buffer handling
- ✅ Path operations
- ✅ Process management
- ✅ Error handling

## Compatibility

- **Node.js**: 14+ (ES modules support required)
- **Package Type**: Must be set to `"module"` in package.json
- **File Extension**: Uses `.js` with ES modules
