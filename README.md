# jEpub

Tạo epub dựa trên mẫu từ [Pressbooks](pressbooks.com) vì nó hoạt động tốt trên chiếc Lumia cũ của mình （。＞ω＜）。

## Todo

- [x] Tạo epub mẫu.
- [ ] Cấu hình editor.
- [ ] Dựng template.
- [ ] Hoàn tất API.
- [ ] Tạo ảnh bìa từ tiêu đề.
- [ ] Dùng Webpack để dựng thư viện.
- [ ] Viết unit test với Jasmine và Karma.
- [ ] Đưa lên Github và NPM.

### API

- [ ] `uuid`: Mã định danh.
- [ ] `info`: Tên truyện, tác giả, giới thiệu, nguồn truyện.
- [ ] `cover`: Dữ liệu ảnh bìa dạng `arraybuffer` object.
- [ ] `add`: Thêm chương.
- [ ] `blob`: Xuất `Blob` object khi hoàn tất.

## Ghi chú

### Thư viện phụ thuộc

1. [`*` JSZip](https://github.com/Stuk/jszip): Tạo file và đóng gói epub.
2. [`*` ejs](https://github.com/mde/ejs): Chuyển đổi epub template.
3. [FileSaver.js](https://github.com/eligrey/FileSaver.js/): Tải epub sau khi hoàn tất.
4. [html2canvas](https://github.com/niklasvh/html2canvas/): Tạo book cover.
5. [JSZipUtils](https://github.com/Stuk/jszip-utils): Có thể dùng để tải book cover và một số file cố định khi đóng gói epub.

### Cấu trúc

- *Không thay đổi*
  - **container.xml**
  - **copyright.html**
  - **front-cover.html**
  - **jackson.css**
  - **mimetype**
- **page-*.html**
  - Tên chương
  - Nội dung chương
- **table-of-contents.html**
  - Mục lục
- **title-page.html**
  - Tên truyện
  - Tác giả
  - Nguồn truyện
  - Giới thiệu truyện
- **book.opf**
  - UUID
  - Mục lục
  - Tên truyện
  - Tác giả
  - Nguồn truyện
  - Giới thiệu truyện
- **toc.ncx**
  - UUID
  - Mục lục
  - Tên truyện
  - Tác giả

## Phát triển

### Lấy thời gian hiện tại

```js
(new Date).toISOString();
```

### Tạo UUID

[https://stackoverflow.com/a/2117523](https://stackoverflow.com/a/2117523)

```js
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
```

```js
function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}
```

### Thử nghiệm

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
