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
- 📝 HTML content

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

jEpub requires [JSZip](https://github.com/Stuk/jszip)

⚠️ **Important**: Starting from v2+, JSZip are **not bundled** with jEpub. You
need to include them separately.

### For UMD builds (browser usage)

Make sure these libraries are loaded before jEpub:

```html
<!-- Required dependencies -->
<script src="https://unpkg.com/jszip/dist/jszip.min.js"></script>

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
npm install jepub jszip
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
interface jEpubMetadataItem {
  name: string; // Qualified XML element name (e.g. 'dc:contributor', 'meta')
  value: string; // Text content of the element
  attrs?: Record<string, string>; // Optional XML attributes (e.g. { 'opf:role': 'aut' })
  renderInTitlePage?: boolean | ((item: jEpubMetadataItem) => string); // Render on title page (default: false)
  label?: string; // Display label on the title page (when renderInTitlePage is true)
}

interface jEpubInitDetails {
  i18n?: string; // Language code (e.g., 'en', 'fr', 'de', 'ja', 'ar' - supports 21+ languages)
  title?: string; // Book title
  author?: string; // Book author
  publisher?: string; // Book publisher
  description?: string; // Book description (supports HTML)
  tags?: string[]; // Book tags/categories
  customMetadata?: jEpubMetadataItem[]; // Custom DCMI metadata entries
}

jepub.init({
  i18n: 'en',
  title: 'Book title',
  author: 'Book author',
  publisher: 'Book publisher',
  description: '<b>Book</b> description',
  tags: ['epub', 'tag'],
  customMetadata: [
    { name: 'dc:contributor', value: 'Jane Doe', attrs: { 'opf:role': 'edt' } },
  ],
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

#### `image(data: Blob | ArrayBuffer, name: string, attributes?: Record<string, string>): this`

Add an image to the book. Optionally pass `attributes` to render additional HTML
attributes (e.g. `alt`, `width`, `class`) onto the `<img>` tag.

```typescript
const response = await fetch('image.jpg');
const arrayBuffer = await response.arrayBuffer();
jepub.image(arrayBuffer, 'myImage');

// With custom attributes
jepub.image(arrayBuffer, 'myImage', { alt: 'A description', width: '480' });
```

Use in content: `<%= image['myImage'] %>`

#### `notes(content: string): this`

Add notes page to the book.

```typescript
jepub.notes('<p>These are my notes...</p>');
```

#### `add(title: string, content?: string | string[] | null, level?: number): this`

Add a page and chapter to the book.

```typescript
// HTML content
jepub.add('Chapter 1', '<p>Content...</p>');

// With images
jepub.add('Chapter 2', '<p>Image: <%= image["myImage"] %></p>');

// Array of strings
jepub.add('Chapter 3', ['Line 1', 'Line 2', 'Line 3']);

// With deep level
jepub.add('Chapter 3.1', '<p>Content...</p>', 1);
```

#### `addPage(chapters: Array<{ title: string; content?: string | null; level?: number }>): this`

Add **multiple chapters** to a single page to the book. A chapter's `content` is
optional — if it is omitted, `null`, or empty, the chapter renders with its
title only.

```typescript
// One page, four navigable chapters
jepub.addPage([
  // HTML content
  { title: 'Section 1', content: '<p>Content...</p>' },
  // With deep level
  { title: 'Section 1.1', content: '<p>Content...</p>', level: 1 },
  // With images
  { title: 'Section 2', content: '<p>Image: <%= image["myImage"] %></p>' },
  // Title-only chapter (no content)
  { title: 'Section 3' },
]);
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
