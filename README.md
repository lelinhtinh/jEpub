# jEpub

[![npm version](https://badge.fury.io/js/jepub.svg)](https://www.npmjs.com/package/jepub)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Flelinhtinh%2FjEpub.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Flelinhtinh%2FjEpub?ref=badge_shield)

Simple EPUB builder library, works in modern browsers.

## Demo

1. [/demo](https://lelinhtinh.github.io/jEpub/demo/)
2. [jsfiddle.net/rhov44gg](https://jsfiddle.net/baivong/rhov44gg/embedded/result,resources,js,html/)

## Installation

```bash
npm install --save jepub
```

You can also use it via a CDN:

```html
<script src="https://unpkg.com/jepub/dist/jepub.min.js"></script>
```

or:

```html
<script src="https://cdn.jsdelivr.net/npm/jepub/dist/jepub.min.js"></script>
```

## Dependencies

jEpub requires [JSZip](https://github.com/Stuk/jszip) and [EJS](https://github.com/mde/ejs). Make sure these libraries are loaded before starting your code.

```html
<script src="jszip.js"></script>
<script src="ejs.js"></script>
<script src="jepub.js"></script>
<script>
    const jepub = new jEpub()
    // jepub.init({
    // do something
</script>
```

## Usage

```typescript
const jepub = new jEpub()
jepub.init({
    i18n: 'en', // Internationalization
    title: 'Book title',
    author: 'Book author',
    publisher: 'Book publisher',
    description: '<b>Book</b> description', // optional
    tags: [ 'epub', 'tag' ] // optional
})
```

- **i18n** only include the language codes defined in [`i18n.json`](https://github.com/lelinhtinh/jEpub/blob/master/src/i18n.json)
- **description**: HTML string.
- **tags**: Array.

### Set published date

```typescript
jepub.date(date: object)
```

- **date**: Date Object.

### Set identifier

```typescript
jepub.uuid(id: string | number)
```

- **id**: Unique id.

### Add cover

```typescript
jepub.cover(data: object)
```

- **data**: A Blob or an ArrayBuffer object from XMLHttpRequest.

### Add notes

```typescript
jepub.notes(content: string)
```

- **content**: HTML string.

### Add chapter `*`

```typescript
jepub.add(title: string, content: string | array, index?:number)
```

- **title**: Plain text.
- **content**:
  - `string`: HTML string.
  - `array`: Plain text for each item.
- **index**: Item index.

### Add image

```typescript
jepub.image(data: object, IMG_ID: string)
```

- **data**: A Blob or an ArrayBuffer object from XMLHttpRequest.
- **IMG_ID**: Unique id.

Place `<%= image[IMG_ID] %>` inside the chapter's content *(HTML string only)*, where you want to display it.

### Generate EPUB `*`

```typescript
jepub.generate(type = 'blob')
```

- **type**: The type of EPUB to return. See [JSZip type option](https://stuk.github.io/jszip/documentation/api_jszip/generate_async.html#type-option).

### Static methods `+`

#### Convert HTML to text

```typescript
jEpub.html2text(html: string, noBr = false)
```

- **html**: HTML string.
- **noBr**: Boolean. Add line break after Block-level elements.

## Development

```bash
npm start
```

Builds are concatenated and minified using [Webpack](https://webpack.js.org/) and [Babel](https://babeljs.io/).

```bash
npm run build
```

## License

[ISC](./LICENSE). Copyright 2018 [lelinhtinh](https://github.com/lelinhtinh)

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Flelinhtinh%2FjEpub.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Flelinhtinh%2FjEpub?ref=badge_large)
