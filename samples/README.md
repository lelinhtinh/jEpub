# jEpub Usage Examples

This directory contains comprehensive examples demonstrating different ways to
use the jEpub library across various environments and module systems.

## 📁 Available Examples

### 🌐 [UMD Browser](./umd-browser/)

#### Browser-based EPUB generation with UMD build

- ✨ Interactive web interface
- 📱 Works directly in browsers
- 🖼️ File upload support for images
- 📊 Real-time progress tracking
- 💾 Automatic EPUB download

**Use Case**: Client-side EPUB generation, web applications, demos

### 📦 [ES Modules](./es-modules/)

#### Modern JavaScript with ES modules in Node.js

- 🔧 ES module syntax (`import`/`export`)
- 📁 File system operations
- 🖼️ Image processing from filesystem
- 📚 Programmatic content generation
- 📊 Progress monitoring

**Use Case**: Modern Node.js applications, build tools, automation scripts

### 🟢 [Node.js](./nodejs/)

#### Node.js with ES modules

- 📦 ES module syntax (`import`/`export`)
- 📁 File system operations
- 🛡️ Comprehensive error handling
- 📈 Advanced statistics and monitoring
- 📝 Rich HTML content generation

**Use Case**: Node.js applications, server-side applications, production systems

### 🔷 [TypeScript](./typescript/)

#### Full TypeScript integration with advanced type safety

- 🔒 Complete type safety
- 🏗️ Professional class architecture
- 🛡️ Custom error hierarchies
- 📊 Performance monitoring
- 🧪 Export classes for testing
- ⚙️ Type-safe configuration

**Use Case**: Enterprise applications, type-safe development, large codebases

## 🚀 Quick Start

### Prerequisites

1. Ensure jEpub is built:
   ```bash
   npm run build
   ```

### Running Examples

#### UMD Browser

```bash
# Open samples/umd-browser/index.html in a browser
# Or serve with a local server:
npx serve samples/umd-browser
```

#### ES Modules

```bash
cd samples/es-modules
npm install
npm start
```

#### Node.js CommonJS

```bash
cd samples/nodejs
npm install
npm start
```

#### TypeScript

```bash
cd samples/typescript
npm install
npm run build
npm start
```

## 📋 Feature Comparison

| Feature               | UMD Browser | ES Modules | Node.js    | TypeScript |
| --------------------- | ----------- | ---------- | ---------- | ---------- |
| **Environment**       | Browser     | Node.js    | Node.js    | Node.js    |
| **Module System**     | UMD         | ES Modules | CommonJS   | ES Modules |
| **Type Safety**       | ❌          | ❌         | ❌         | ✅         |
| **File System**       | ❌          | ✅         | ✅         | ✅         |
| **Interactive UI**    | ✅          | ❌         | ❌         | ❌         |
| **Progress Tracking** | ✅          | ✅         | ✅         | ✅         |
| **Error Handling**    | Basic       | Good       | Advanced   | Advanced   |
| **Image Support**     | Upload      | Filesystem | Filesystem | Filesystem |
| **Testing Ready**     | ❌          | ❌         | Partial    | ✅         |
| **Production Ready**  | Demo        | Good       | Excellent  | Excellent  |

## 🎯 Choosing the Right Example

### For Learning

- **Start with**: UMD Browser (visual, interactive)
- **Then try**: ES Modules (modern syntax)
- **Advanced**: TypeScript (full type safety)

### For Production

- **Simple projects**: ES Modules
- **Enterprise/Large teams**: TypeScript
- **Legacy systems**: Node.js CommonJS
- **Web applications**: UMD Browser (as reference)

### For Specific Use Cases

#### Web Applications

```javascript
// UMD Browser example - client-side generation
const jepub = new jEpub();
jepub.init({ title: 'My Book' });
// ... add content ...
const epub = await jepub.generate('blob');
```

#### Build Tools & Automation

```javascript
// ES Modules - modern Node.js
import jEpub from 'jepub';
import { readFileSync } from 'fs';

const jepub = new jEpub();
// ... automated content generation ...
```

#### Server Applications

```javascript
// Node.js CommonJS - traditional server-side
const jEpub = require('jepub').default;
const fs = require('fs');

// ... robust server-side processing ...
```

#### Type-Safe Development

```typescript
// TypeScript - enterprise-grade
import jEpub, { jEpubInitDetails } from 'jepub';

const config: jEpubInitDetails = {
  title: 'My Book',
  author: 'Author Name',
};
```

## 📚 Common Patterns

### Basic EPUB Creation

All examples demonstrate this core pattern:

1. **Initialize** with book metadata
2. **Add cover** image (optional)
3. **Add chapters** with content
4. **Add images** for content (optional)
5. **Add notes** (optional)
6. **Generate** EPUB file

### Error Handling

```javascript
try {
  const epub = await jepub.generate('blob');
  // Handle success
} catch (error) {
  // Handle errors appropriately for your environment
}
```

### Progress Tracking

```javascript
const epub = await jepub.generate('blob', (metadata) => {
  console.log(`${metadata.percent}% - ${metadata.currentFile}`);
});
```

### Image Processing

```javascript
// Browser: File upload
const file = fileInput.files[0];
jepub.cover(file);

// Node.js: Filesystem
const imageBuffer = readFileSync('cover.jpg');
jepub.cover(imageBuffer.buffer);
```

## 🔧 Development Setup

### Dependencies

Each example has its own `package.json` with specific dependencies:

- **jEpub**: Main library (linked locally)
- **JSZip**: ZIP file creation
- **EJS**: Template processing
- **Type definitions**: For TypeScript example

### Testing Examples

Run the examples to ensure everything works:

```bash
# Test all examples
npm run build                    # Build jEpub first

# Test each example
cd samples/es-modules && npm install && npm start
cd samples/nodejs && npm install && npm start
cd samples/typescript && npm install && npm start

# Test UMD browser (manual)
# Open samples/umd-browser/index.html in browser
```

## 📖 Documentation

Each example directory contains:

- **README.md**: Detailed setup and usage instructions
- **Source code**: Fully commented implementation
- **package.json**: Dependencies and scripts
- **Example outputs**: Generated EPUB files

## 🤝 Contributing

When adding new examples:

1. Create a new directory in `samples/`
2. Include comprehensive README.md
3. Add package.json with dependencies
4. Demonstrate unique features or use cases
5. Include error handling and best practices
6. Update this main README.md

## 🆘 Troubleshooting

### Common Issues

#### Build Errors

```bash
# Ensure jEpub is built first
npm run build
```

#### Missing Dependencies

```bash
# Install dependencies in each example
cd samples/[example-name]
npm install
```

#### Image Loading Issues

- Check file paths in Node.js examples
- Verify image files exist in demo/ directory
- Ensure proper permissions

#### TypeScript Compilation

```bash
# Clean and rebuild TypeScript example
cd samples/typescript
npm run clean
npm run build
```

### Getting Help

1. Check the individual example READMEs
2. Review the main jEpub documentation
3. Examine the source code comments
4. Open issues for bugs or questions

## 📜 License

All examples are provided under the same license as jEpub (ISC).

---

**Happy EPUB generation!** 📚✨
