/**
 * MIME type utilities and image detection
 */

/**
 * Detect image type from buffer
 * @param {Uint8Array} buffer - Image buffer to check
 * @returns {object|null} - Object with mime and ext properties, or null if not detected
 */
export function detectImageType(buffer) {
    if (!buffer || buffer.length < 12) {
        return null;
    }

    // PNG signature: 89 50 4E 47 0D 0A 1A 0A
    if (
        buffer[0] === 0x89 &&
        buffer[1] === 0x50 &&
        buffer[2] === 0x4e &&
        buffer[3] === 0x47 &&
        buffer[4] === 0x0d &&
        buffer[5] === 0x0a &&
        buffer[6] === 0x1a &&
        buffer[7] === 0x0a
    ) {
        return { mime: 'image/png', ext: 'png' };
    }

    // JPEG signature: FF D8 FF
    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
        return { mime: 'image/jpeg', ext: 'jpg' };
    }

    // GIF signature: 47 49 46 (GIF)
    if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) {
        return { mime: 'image/gif', ext: 'gif' };
    }

    // BMP signature: 42 4D (BM)
    if (buffer[0] === 0x42 && buffer[1] === 0x4d) {
        return { mime: 'image/bmp', ext: 'bmp' };
    }

    // WebP signature: 52 49 46 46 ... 57 45 42 50 (RIFF...WEBP)
    if (
        buffer[0] === 0x52 &&
        buffer[1] === 0x49 &&
        buffer[2] === 0x46 &&
        buffer[3] === 0x46 &&
        buffer[8] === 0x57 &&
        buffer[9] === 0x45 &&
        buffer[10] === 0x42 &&
        buffer[11] === 0x50
    ) {
        return { mime: 'image/webp', ext: 'webp' };
    }

    // SVG (text-based, check for XML declaration and svg tag)
    if (buffer.length >= 100) {
        try {
            const text = String.fromCharCode(...buffer.slice(0, 100));
            if (
                text.includes('<svg') ||
                (text.includes('<?xml') && text.includes('svg'))
            ) {
                return { mime: 'image/svg+xml', ext: 'svg' };
            }
        } catch {
            // Ignore decode errors
        }
    }

    // TIFF signature: 49 49 2A 00 (little-endian) or 4D 4D 00 2A (big-endian)
    if (
        (buffer[0] === 0x49 &&
            buffer[1] === 0x49 &&
            buffer[2] === 0x2a &&
            buffer[3] === 0x00) ||
        (buffer[0] === 0x4d &&
            buffer[1] === 0x4d &&
            buffer[2] === 0x00 &&
            buffer[3] === 0x2a)
    ) {
        return { mime: 'image/tiff', ext: 'tif' };
    }

    // ICO signature: 00 00 01 00
    if (
        buffer[0] === 0x00 &&
        buffer[1] === 0x00 &&
        buffer[2] === 0x01 &&
        buffer[3] === 0x00
    ) {
        return { mime: 'image/x-icon', ext: 'ico' };
    }

    return null;
}

/**
 * Convert MIME type to file extension
 * @param {string} mime - MIME type string
 * @returns {string|null} File extension or null if unsupported
 */
export function mime2ext(mime) {
    if (typeof mime !== 'string') {
        return null;
    }

    // Clean up MIME type - remove parameters and whitespace, convert to lowercase
    const cleanMime = mime.trim().toLowerCase().split(';')[0];

    // MIME type to extension mapping
    const MIME_TO_EXTENSION = {
        'image/jpg': 'jpg',
        'image/jpeg': 'jpg',
        'image/svg+xml': 'svg',
        'image/gif': 'gif',
        'image/apng': 'apng',
        'image/png': 'png',
        'image/webp': 'webp',
        'image/bmp': 'bmp',
        'image/tiff': 'tif',
        'image/x-icon': 'ico',
        'image/vnd.microsoft.icon': 'ico',
    };

    // Check direct mapping first
    if (MIME_TO_EXTENSION[cleanMime]) {
        return MIME_TO_EXTENSION[cleanMime];
    }

    // For other image types, extract extension from MIME type
    if (cleanMime.startsWith('image/')) {
        const extension = cleanMime.split('/')[1];
        // Only return if it's a known safe extension
        if (['gif', 'apng', 'png', 'webp', 'bmp'].includes(extension)) {
            return extension;
        }
    }

    return null;
}
