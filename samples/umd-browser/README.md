# UMD Browser Example

This example demonstrates how to use jEpub with UMD build in a browser
environment.

## Features

- ✨ Interactive web interface
- 📚 Create EPUB books directly in the browser
- 🖼️ Support for cover and content images
- 📊 Progress tracking during generation
- 💾 Automatic download of generated EPUB

## How to Run

1. Ensure jEpub is built:

   ```bash
   npm run build
   ```

2. Open `index.html` in a modern web browser

3. Fill in the book details and optionally upload images

4. Click "Generate EPUB" to create and download your book

## Code Structure

The example includes:

- **HTML Form**: Input fields for book metadata
- **File Uploads**: Cover and content image support
- **Progress Tracking**: Real-time generation progress
- **Error Handling**: User-friendly error messages
- **Automatic Download**: Generated EPUB is automatically downloaded

## Dependencies

The example loads these external dependencies via CDN:

- JSZip: `https://unpkg.com/jszip/dist/jszip.min.js`
- EJS: `https://unpkg.com/ejs/ejs.min.js`
- jEpub: `../../dist/jepub.js` (local build)

## Key Features Demonstrated

1. **Initialization**: Setting up book metadata
2. **Cover Image**: Adding cover image from file upload
3. **Content Images**: Adding images with EJS templating
4. **Multiple Chapters**: Dynamic chapter creation
5. **Notes**: Adding notes page
6. **Progress Callback**: Tracking generation progress
7. **Error Handling**: Proper error handling and user feedback

## Browser Compatibility

Works in all modern browsers that support:

- ES2015+ features
- File API
- Blob URLs
- ArrayBuffer

## Example Output

The generated EPUB will include:

- Title page with metadata
- Cover image (if provided)
- Introduction chapter
- Additional chapters (if created)
- Table of contents
- Notes page
