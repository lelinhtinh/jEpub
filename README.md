# jEpub

Tạo EPUB dựa trên mẫu từ [Pressbooks](https://pressbooks.com/) vì nó hoạt động tốt trên chiếc Lumia cũ của mình （。＞ω＜）。

## Todo

- [x] Tạo EPUB mẫu.
- [x] Cấu hình editor.
- [x] Dựng template.
- [x] Hoàn tất API.
- [x] Dùng Webpack để dựng thư viện.
- [ ] Viết unit test với Jasmine và Karma.
- [x] Đưa lên Github và NPM.

### API

- [x] `uuid`: Mã định danh.
- [x] `notes`: Ghi chú.
- [x] `cover`: Dữ liệu ảnh bìa dạng ArrayBuffer object.
- [x] `add`: Thêm chương.
- [x] `generate`: Xuất EPUB data khi hoàn tất.

## Cài đặt

```bash
npm i -S jepub
```

### CDN

```html
<script src="https://unpkg.com/jepub/dist/jepub.js"></script>
```

hoặc

```html
<script src="https://cdn.jsdelivr.net/npm/jepub/dist/jepub.js"></script>
```

## Cách dùng

```typescript
const jepub = new jEpub({
    title: 'Tiêu đề',
    author: 'Tác giả',
    publisher: 'Nguồn sách',
    description: 'Giới thiệu' // Không bắt buộc
});
```

### Mã định danh

```typescript
jepub.uuid(id: string | number)
```

- `id` không được trùng lặp.

### Thêm bìa sách

```typescript
jepub.cover(buffer: object)
```

- `buffer` bắt buộc là dữ liệu dạng **ArrayBuffer** object.

### Thêm ghi chú

```typescript
jepub.notes(content: string)
```

- `content` có thể sử dụng **HTML string** và không được rỗng.

### Thêm chương `*`

```typescript
jepub.add(title: string, content: string | array);
```

- `title` không được dùng **HTML string** và không được rỗng.
- `content` không được rỗng. Nếu ở dạng `string` có thể sử dụng **HTML string**, còn ở dạng `array` thì không được dùng.

### Tạo EPUB `*`

```typescript
jepub.generate(type = 'blob')
```

- `type` bao gồm các giá trị:
  - `blob` (*mặc định*)
  - `base64`
  - `binarystring`
  - `array`
  - `uint8array`
  - `arraybuffer`
  - `nodebuffer` (*nodejs*)

## Ghi chú

### Thư viện phụ thuộc

1. [JSZip `*`](https://github.com/Stuk/jszip): Tạo file và đóng gói EPUB.
2. [ejs `*`](https://github.com/mde/ejs): Chuyển đổi EPUB template.
3. [FileSaver.js](https://github.com/eligrey/FileSaver.js/): Tải EPUB sau khi hoàn tất.
4. [JSZipUtils](https://github.com/Stuk/jszip-utils): Giải nén EPUB để test, tải book cover và một số file cố định khi đóng gói EPUB.

### Cấu trúc

- *Không thay đổi*
  - **container.xml**
  - **front-cover.html**
  - **jackson.css**
  - **mimetype**
- **notes.html**
  - Ghi chú
- **page-*.html**
  - Tên chương
  - Nội dung chương
- **table-of-contents.html**
  - Mục lục
- **title-page.html**
  - Tên sách
  - Tác giả
  - Nguồn sách
  - Giới thiệu sách
- **book.opf**
  - UUID
  - Mục lục
  - Bìa sách
  - Tên sách
  - Tác giả
  - Nguồn sách
  - Giới thiệu sách
- **toc.ncx**
  - UUID
  - Mục lục
  - Tên sách
  - Tác giả

#### Thử nghiệm ban đầu

[https://jsfiddle.net/baivong/rhov44gg/](https://jsfiddle.net/baivong/rhov44gg/)

### VSCode

Sửa lỗi gõ Tiếng Việt khi dùng extension **Markdown All in One**

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

### Google Chrome

Thêm `--remote-debugging-port=9222` vào trình khởi chạy Chrome, khi debug ở chế độ [**attach**](https://github.com/Microsoft/vscode-chrome-debug#attach).
