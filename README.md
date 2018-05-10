# jEpub `WIP`

Tạo epub dựa trên mẫu từ [Pressbooks](https://pressbooks.com/) vì nó hoạt động tốt trên chiếc Lumia cũ của mình （。＞ω＜）。

## Todo

- [x] Tạo epub mẫu.
- [x] Cấu hình editor.
- [x] Dựng template.
- [ ] Hoàn tất API.
- [x] Dùng Webpack để dựng thư viện.
- [ ] Viết unit test với Jasmine và Karma.
- [x] Đưa lên Github và NPM.

### API

- [x] `uuid`: Mã định danh.
- [x] `notes`: Ghi chú.
- [x] `cover`: Dữ liệu ảnh bìa dạng `arraybuffer` object.
- [x] `add`: Thêm chương.
- [ ] `blob`: Xuất `Blob` object khi hoàn tất.

### Cài đặt

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

WIP *... đang phát triển*

## Ghi chú

### Thư viện phụ thuộc

1. [`*` JSZip](https://github.com/Stuk/jszip): Tạo file và đóng gói epub.
2. [`*` ejs](https://github.com/mde/ejs): Chuyển đổi epub template.
3. [FileSaver.js](https://github.com/eligrey/FileSaver.js/): Tải epub sau khi hoàn tất.
4. [JSZipUtils](https://github.com/Stuk/jszip-utils): Giải nén epub để test, tải book cover và một số file cố định khi đóng gói epub.

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
