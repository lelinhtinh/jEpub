# jEpub

EPUB Generator, using templates from [Pressbooks](https://pressbooks.com/), because it works perfectly with my old Lumia （。＞ω＜）。

## Demo

[jsfiddle.net/rhov44gg](https://jsfiddle.net/baivong/rhov44gg/embedded/result,resources,js,html/)

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

## Usage

```typescript
const jepub = new jEpub({
    i18n: 'en', // Internationalization
    title: 'Book title',
    author: 'Book author',
    publisher: 'Book publisher',
    description: '<b>Book</b> description', // optional
    tags: [ 'epub', 'tag' ] // optional
});
```

- **i18n** only include the language codes defined in [`i18n.json`](https://github.com/lelinhtinh/jEpub/raw/master/src/i18n.json)
- **description**: HTML string.

### Set published date

```typescript
jepub.date(date: object)
```

- **date**: Date Object.

### Set identifier

```typescript
jepub.uuid(id: string | number)
```

- **id** is unique.

### Add cover

```typescript
jepub.cover(buffer: object)
```

- **buffer**: ArrayBuffer Object from XMLHttpRequest.

### Add notes

```typescript
jepub.notes(content: string)
```

- **content**: HTML string.

### Add chapter `*`

```typescript
jepub.add(title: string, content: string | array)
```

- **title**: Plain text.
- **content**:
  - `string`: HTML string.
  - `array`: Plain text for each item.

### Generate EPUB `*`

```typescript
jepub.generate(type = 'blob')
```

- **type**: Possible values `blob` (*default*), `base64`, `binarystring`, `array`, `uint8array`, `arraybuffer`, `nodebuffer` (*NodeJS*).

## Development

```bash
npm start
```

This command can be executed automatically if you use **VSCode**, which is implemented by [AutoLaunch extension](https://github.com/lelinhtinh/jEpub/blob/master/.vscode/extensions.json#L15) and configured in [Development task](https://github.com/lelinhtinh/jEpub/blob/master/.vscode/tasks.json#L6).

Builds are concatenated and minified using [Webpack](https://webpack.js.org/) and [Babel](https://babeljs.io/).

```bash
npm run build
```

### VSCode

Fix [**Markdown All in One `#41`**](https://github.com/neilsustc/vscode-markdown/issues/41): Add to `keybindings.json`

```json
{
  "key": "shift+backspace",
  "command": "markdown.extension.onBackspaceKey",
  "when": "editorTextFocus && !editorHasSelection && !suggestWidgetVisible && editorLangId == 'markdown'"
},
{
  "key": "backspace",
  "command": "-markdown.extension.onBackspaceKey",
  "when": "editorTextFocus && !editorHasSelection && !suggestWidgetVisible && editorLangId == 'markdown'"
}
```

Start **Chrome** with the `--remote-debugging-port=9222` flag when debugging in the [`attach`](https://github.com/Microsoft/vscode-chrome-debug#attach) mode.

## License

ISC. Copyright 2018 [lelinhtinh](https://github.com/lelinhtinh)
