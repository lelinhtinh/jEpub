import { describe, it, expect } from 'vitest';
import { mime2ext, detectImageType } from '../../src/utils/mime.js';

describe('MIME utilities', () => {
    describe('mime2ext', () => {
        it('should convert common image MIME types to extensions', () => {
            expect(mime2ext('image/png')).toBe('png');
            expect(mime2ext('image/jpeg')).toBe('jpg');
            expect(mime2ext('image/jpg')).toBe('jpg');
            expect(mime2ext('image/gif')).toBe('gif');
            expect(mime2ext('image/bmp')).toBe('bmp');
            expect(mime2ext('image/webp')).toBe('webp');
            expect(mime2ext('image/svg+xml')).toBe('svg');
            expect(mime2ext('image/tiff')).toBe('tif');
            expect(mime2ext('image/x-icon')).toBe('ico');
            expect(mime2ext('image/vnd.microsoft.icon')).toBe('ico');
        });

        it('should handle MIME types with parameters', () => {
            expect(mime2ext('image/png; charset=utf-8')).toBe('png');
            expect(mime2ext('image/jpeg; quality=85')).toBe('jpg');
            expect(mime2ext('image/svg+xml; charset=utf-8')).toBe('svg');
        });

        it('should be case insensitive', () => {
            expect(mime2ext('IMAGE/PNG')).toBe('png');
            expect(mime2ext('Image/Jpeg')).toBe('jpg');
            expect(mime2ext('IMAGE/SVG+XML')).toBe('svg');
        });

        it('should handle MIME types with extra whitespace', () => {
            expect(mime2ext('  image/png  ')).toBe('png');
            expect(mime2ext('\timage/jpeg\n')).toBe('jpg');
        });

        it('should return null for unknown MIME types', () => {
            expect(mime2ext('image/unknown')).toBe(null);
            expect(mime2ext('application/pdf')).toBe(null);
            expect(mime2ext('text/plain')).toBe(null);
            expect(mime2ext('video/mp4')).toBe(null);
        });

        it('should return null for invalid inputs', () => {
            expect(mime2ext('')).toBe(null);
            expect(mime2ext('   ')).toBe(null);
            expect(mime2ext(null)).toBe(null);
            expect(mime2ext(undefined)).toBe(null);
            expect(mime2ext(123)).toBe(null);
            expect(mime2ext({})).toBe(null);
        });

        it('should handle malformed MIME types', () => {
            expect(mime2ext('image/')).toBe(null);
            expect(mime2ext('/png')).toBe(null);
            expect(mime2ext('image')).toBe(null);
            expect(mime2ext('png')).toBe(null);
        });

        it('should support all defined image formats', () => {
            const expectedMappings = {
                'image/png': 'png',
                'image/jpeg': 'jpg',
                'image/jpg': 'jpg',
                'image/gif': 'gif',
                'image/bmp': 'bmp',
                'image/webp': 'webp',
                'image/svg+xml': 'svg',
                'image/tiff': 'tif',
                'image/x-icon': 'ico',
                'image/vnd.microsoft.icon': 'ico',
            };

            Object.entries(expectedMappings).forEach(
                ([mimeType, expectedExt]) => {
                    expect(mime2ext(mimeType)).toBe(expectedExt);
                }
            );
        });

        it('should handle MIME types with complex parameters', () => {
            expect(
                mime2ext('image/png; boundary=something; charset=utf-8')
            ).toBe('png');
            expect(mime2ext('image/svg+xml; charset=utf-8; version=1.1')).toBe(
                'svg'
            );
        });
    });

    describe('detectImageType', () => {
        it('should return null for invalid inputs', () => {
            expect(detectImageType(null)).toBe(null);
            expect(detectImageType(undefined)).toBe(null);
            expect(detectImageType([])).toBe(null);
            expect(detectImageType(new Uint8Array(5))).toBe(null); // Too small buffer
        });

        it('should detect PNG images', () => {
            // PNG signature: 89 50 4E 47 0D 0A 1A 0A
            const pngBuffer = new Uint8Array([
                0x89,
                0x50,
                0x4e,
                0x47,
                0x0d,
                0x0a,
                0x1a,
                0x0a,
                0x00,
                0x00,
                0x00,
                0x0d, // Additional bytes to meet minimum length
            ]);
            const result = detectImageType(pngBuffer);
            expect(result).toEqual({ mime: 'image/png', ext: 'png' });
        });

        it('should detect JPEG images', () => {
            // JPEG signature: FF D8 FF
            const jpegBuffer = new Uint8Array([
                0xff,
                0xd8,
                0xff,
                0xe0,
                0x00,
                0x10,
                0x4a,
                0x46,
                0x49,
                0x46,
                0x00,
                0x01, // Additional bytes
            ]);
            const result = detectImageType(jpegBuffer);
            expect(result).toEqual({ mime: 'image/jpeg', ext: 'jpg' });
        });

        it('should detect GIF images', () => {
            // GIF signature: 47 49 46 (GIF)
            const gifBuffer = new Uint8Array([
                0x47,
                0x49,
                0x46,
                0x38,
                0x39,
                0x61,
                0x00,
                0x00,
                0x00,
                0x00,
                0x00,
                0x00, // Additional bytes
            ]);
            const result = detectImageType(gifBuffer);
            expect(result).toEqual({ mime: 'image/gif', ext: 'gif' });
        });

        it('should detect BMP images', () => {
            // BMP signature: 42 4D (BM)
            const bmpBuffer = new Uint8Array([
                0x42,
                0x4d,
                0x00,
                0x00,
                0x00,
                0x00,
                0x00,
                0x00,
                0x00,
                0x00,
                0x00,
                0x00, // Additional bytes
            ]);
            const result = detectImageType(bmpBuffer);
            expect(result).toEqual({ mime: 'image/bmp', ext: 'bmp' });
        });

        it('should detect WebP images', () => {
            // WebP signature: 52 49 46 46 ... 57 45 42 50 (RIFF...WEBP)
            const webpBuffer = new Uint8Array([
                0x52,
                0x49,
                0x46,
                0x46, // RIFF
                0x00,
                0x00,
                0x00,
                0x00, // File size
                0x57,
                0x45,
                0x42,
                0x50, // WEBP
            ]);
            const result = detectImageType(webpBuffer);
            expect(result).toEqual({ mime: 'image/webp', ext: 'webp' });
        });

        it('should detect TIFF images (little-endian)', () => {
            // TIFF signature: 49 49 2A 00 (little-endian)
            const tiffLEBuffer = new Uint8Array([
                0x49,
                0x49,
                0x2a,
                0x00,
                0x00,
                0x00,
                0x00,
                0x00,
                0x00,
                0x00,
                0x00,
                0x00, // Additional bytes
            ]);
            const result = detectImageType(tiffLEBuffer);
            expect(result).toEqual({ mime: 'image/tiff', ext: 'tif' });
        });

        it('should detect TIFF images (big-endian)', () => {
            // TIFF signature: 4D 4D 00 2A (big-endian)
            const tiffBEBuffer = new Uint8Array([
                0x4d,
                0x4d,
                0x00,
                0x2a,
                0x00,
                0x00,
                0x00,
                0x00,
                0x00,
                0x00,
                0x00,
                0x00, // Additional bytes
            ]);
            const result = detectImageType(tiffBEBuffer);
            expect(result).toEqual({ mime: 'image/tiff', ext: 'tif' });
        });

        it('should detect ICO images', () => {
            // ICO signature: 00 00 01 00
            const icoBuffer = new Uint8Array([
                0x00,
                0x00,
                0x01,
                0x00,
                0x01,
                0x00,
                0x00,
                0x00,
                0x00,
                0x00,
                0x00,
                0x00, // Additional bytes
            ]);
            const result = detectImageType(icoBuffer);
            expect(result).toEqual({ mime: 'image/x-icon', ext: 'ico' });
        });

        it('should detect SVG images with svg tag', () => {
            const svgContent =
                '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="50" height="50"/></svg>';
            const svgBuffer = new Uint8Array(
                svgContent.split('').map((c) => c.charCodeAt(0))
            );
            const result = detectImageType(svgBuffer);
            expect(result).toEqual({ mime: 'image/svg+xml', ext: 'svg' });
        });

        it('should detect SVG images with XML declaration', () => {
            const svgContent =
                '<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg"><rect/></svg>';
            // Pad content to ensure it's at least 100 characters (required by the detectImageType function)
            const paddedContent = svgContent.padEnd(100, ' ');
            const svgBuffer = new Uint8Array(
                paddedContent.split('').map((c) => c.charCodeAt(0))
            );
            const result = detectImageType(svgBuffer);
            expect(result).toEqual({ mime: 'image/svg+xml', ext: 'svg' });
        });

        it('should handle SVG detection errors gracefully', () => {
            // Create a buffer that's long enough but contains invalid characters that would cause String.fromCharCode to fail
            const invalidBuffer = new Uint8Array(150);
            invalidBuffer.fill(0xff); // Fill with invalid characters

            const result = detectImageType(invalidBuffer);
            expect(result).toBe(null);
        });

        it('should return null for unrecognized formats', () => {
            const unknownBuffer = new Uint8Array([
                0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09,
                0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f,
            ]);
            const result = detectImageType(unknownBuffer);
            expect(result).toBe(null);
        });

        it('should handle edge cases with minimum buffer sizes', () => {
            // Test with exactly 12 bytes (minimum required)
            const minBuffer = new Uint8Array(12);
            minBuffer.fill(0x00);
            const result = detectImageType(minBuffer);
            expect(result).toBe(null);
        });

        it('should distinguish between similar signatures', () => {
            // Test that partial matches don't trigger false positives
            const partialPngBuffer = new Uint8Array([
                0x89,
                0x50,
                0x4e,
                0x47,
                0x00,
                0x00,
                0x00,
                0x00, // Missing proper PNG signature end
                0x00,
                0x00,
                0x00,
                0x00,
            ]);
            const result = detectImageType(partialPngBuffer);
            expect(result).toBe(null);
        });

        it('should handle different JPEG variants', () => {
            // JPEG with different APP markers
            const jpegWithApp1 = new Uint8Array([
                0xff,
                0xd8,
                0xff,
                0xe1,
                0x00,
                0x16,
                0x45,
                0x78,
                0x69,
                0x66,
                0x00,
                0x00, // JPEG with EXIF
            ]);
            const result = detectImageType(jpegWithApp1);
            expect(result).toEqual({ mime: 'image/jpeg', ext: 'jpg' });
        });

        it('should handle GIF variants (87a and 89a)', () => {
            // GIF87a
            const gif87aBuffer = new Uint8Array([
                0x47, 0x49, 0x46, 0x38, 0x37, 0x61, 0x00, 0x00, 0x00, 0x00,
                0x00, 0x00,
            ]);
            const result87a = detectImageType(gif87aBuffer);
            expect(result87a).toEqual({ mime: 'image/gif', ext: 'gif' });

            // GIF89a
            const gif89aBuffer = new Uint8Array([
                0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x00, 0x00, 0x00, 0x00,
                0x00, 0x00,
            ]);
            const result89a = detectImageType(gif89aBuffer);
            expect(result89a).toEqual({ mime: 'image/gif', ext: 'gif' });
        });

        it('should not detect SVG for short buffers', () => {
            const shortSvgBuffer = new Uint8Array(50);
            const svgContent = '<svg width="100">';
            for (let i = 0; i < svgContent.length && i < 50; i++) {
                shortSvgBuffer[i] = svgContent.charCodeAt(i);
            }

            const result = detectImageType(shortSvgBuffer);
            expect(result).toBe(null); // Should not detect because buffer is too short for SVG detection
        });

        it('should handle realistic image file headers', () => {
            // More realistic PNG header
            const realisticPngBuffer = new Uint8Array([
                0x89,
                0x50,
                0x4e,
                0x47,
                0x0d,
                0x0a,
                0x1a,
                0x0a, // PNG signature
                0x00,
                0x00,
                0x00,
                0x0d,
                0x49,
                0x48,
                0x44,
                0x52, // IHDR chunk start
            ]);
            const result = detectImageType(realisticPngBuffer);
            expect(result).toEqual({ mime: 'image/png', ext: 'png' });
        });

        it('should detect image types consistently with different buffer lengths', () => {
            // Test PNG detection with various buffer lengths
            const basePngSignature = [
                0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
            ];

            // Test with minimum required length
            const minPngBuffer = new Uint8Array([
                ...basePngSignature,
                0x00,
                0x00,
                0x00,
                0x00,
            ]);
            expect(detectImageType(minPngBuffer)).toEqual({
                mime: 'image/png',
                ext: 'png',
            });

            // Test with longer buffer
            const longPngBuffer = new Uint8Array([
                ...basePngSignature,
                ...Array(100).fill(0x00),
            ]);
            expect(detectImageType(longPngBuffer)).toEqual({
                mime: 'image/png',
                ext: 'png',
            });
        });
    });
});
