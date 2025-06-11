# jEpub

[![npm version](https://badge.fury.io/js/jepub.svg)](https://www.npmjs.com/package/jepub)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Flelinhtinh%2FjEpub.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Flelinhtinh%2FjEpub?ref=badge_shield)

Simple EPUB builder library, works in modern browsers.

## Features

- 📚 Create EPUB books programmatically in browsers
- 🔧 Simple and intuitive API
- 🏷️ Full TypeScript support with type definitions
- 🌐 Internationalization support (21+ languages)
- 📱 Modern ES modules and UMD builds
- 🖼️ Image and cover support
- 📝 HTML content with EJS templating

## Demo

1. [/demo](https://lelinhtinh.github.io/jEpub/demo/)
2. [jsfiddle.net/rhov44gg](https://jsfiddle.net/baivong/rhov44gg/embedded/result,resources,js,html/)

## Installation

```bash
npm install --save jepub
```

You can also use it via a CDN:

```html
<!-- UMD build -->
<script src="https://unpkg.com/jepub/dist/jepub.js"></script>
```

or:

```html
<!-- UMD build -->
<script src="https://cdn.jsdelivr.net/npm/jepub/dist/jepub.js"></script>
```

For ES modules:

```html
<!-- ES module build -->
<script type="module">
  import jEpub from 'https://unpkg.com/jepub/dist/jepub.es.js';
</script>
```

### Dependencies

jEpub requires [JSZip](https://github.com/Stuk/jszip) and
[EJS](https://github.com/mde/ejs) as **external dependencies**.

⚠️ **Important**: Starting from v2+, JSZip and EJS are **not bundled** with
jEpub. You need to include them separately.

### For UMD builds (browser usage)

Make sure these libraries are loaded before jEpub:

```html
<!-- Required dependencies -->
<script src="https://unpkg.com/jszip/dist/jszip.min.js"></script>
<script src="https://unpkg.com/ejs/ejs.min.js"></script>

<!-- jEpub library -->
<script src="https://unpkg.com/jepub/dist/jepub.js"></script>
<script>
  const jepub = new jEpub();
  // jepub.init({
  // do something
</script>
```

### For ES modules

You need to install dependencies separately:

```bash
npm install jepub jszip ejs
```

```javascript
import jEpub from 'jepub';
// Dependencies will be resolved by your bundler

const jepub = new jEpub();
// jepub.init({
// do something
```

### TypeScript Support

jEpub includes full TypeScript type definitions. No additional `@types` packages
needed!

```typescript
import jEpub, { jEpubInitDetails, jEpubGenerateType } from 'jepub';

const details: jEpubInitDetails = {
  i18n: 'en',
  title: 'My Book',
  author: 'Author Name',
  publisher: 'Publisher',
  description: '<b>Book</b> description',
  tags: ['epub', 'typescript'],
};

const jepub = new jEpub();
jepub.init(details);

// Type-safe generate method
const epub: Promise<Blob> = jepub.generate('blob');
```

## API Reference

### Constructor

```typescript
const jepub = new jEpub();
```

### Methods

#### `init(details: jEpubInitDetails | JSZip): this`

Initialize the EPUB with book details or existing JSZip instance.

```typescript
interface jEpubInitDetails {
  i18n?: string; // Language code (e.g., 'en', 'fr', 'de', 'ja', 'ar' - supports 21+ languages)
  title?: string; // Book title
  author?: string; // Book author
  publisher?: string; // Book publisher
  description?: string; // Book description (supports HTML)
  tags?: string[]; // Book tags/categories
}

jepub.init({
  i18n: 'en',
  title: 'Book title',
  author: 'Book author',
  publisher: 'Book publisher',
  description: '<b>Book</b> description',
  tags: ['epub', 'tag'],
});
```

#### `date(date: Date): this`

Set custom publication date.

```typescript
jepub.date(new Date());
```

#### `uuid(id: string): this`

Set custom UUID for the book.

```typescript
jepub.uuid('unique-book-id');
```

#### `cover(data: Blob | ArrayBuffer): this`

Add cover image to the book.

```typescript
// From file input
const fileInput = document.querySelector(
  'input[type="file"]'
) as HTMLInputElement;
const file = fileInput.files?.[0];
if (file) {
  jepub.cover(file);
}

// From fetch
const response = await fetch('cover.jpg');
const arrayBuffer = await response.arrayBuffer();
jepub.cover(arrayBuffer);
```

#### `image(data: Blob | ArrayBuffer, name: string): this`

Add an image to the book.

```typescript
const response = await fetch('image.jpg');
const arrayBuffer = await response.arrayBuffer();
jepub.image(arrayBuffer, 'myImage');
```

Use in content: `<%= image['myImage'] %>`

#### `notes(content: string): this`

Add notes page to the book.

```typescript
jepub.notes('<p>These are my notes...</p>');
```

#### `add(title: string, content: string | string[], index?: number): this`

Add a page/chapter to the book.

```typescript
// HTML content
jepub.add('Chapter 1', '<h1>Chapter Title</h1><p>Content...</p>');

// With images
jepub.add('Chapter 2', '<p>Image: <%= image["myImage"] %></p>');

// Array of strings
jepub.add('Chapter 3', ['Line 1', 'Line 2', 'Line 3']);

// With specific index
jepub.add('Preface', '<p>Preface content</p>', 0);
```

#### `generate(type?: jEpubGenerateType, onUpdate?: jEpubUpdateCallback): Promise<Blob | ArrayBuffer | Uint8Array | Buffer>`

Generate the EPUB file.

```typescript
type jEpubGenerateType = 'blob' | 'arraybuffer' | 'uint8array' | 'nodebuffer';

// Generate as Blob (default)
const epub: Blob = await jepub.generate();

// Generate as ArrayBuffer
const buffer: ArrayBuffer = await jepub.generate('arraybuffer');

// With progress callback
const epub = await jepub.generate('blob', (metadata) => {
  console.log(`Progress: ${metadata.percent}% - ${metadata.currentFile}`);
});
```

### Static Methods

#### `jEpub.html2text(html: string, noBr?: boolean): string`

Convert HTML to plain text.

```typescript
const text = jEpub.html2text('<b>Bold</b> text', false);
// Returns: "Bold text"
```

## License

[ISC](./LICENSE). Copyright 2018 [lelinhtinh](https://github.com/lelinhtinh)
