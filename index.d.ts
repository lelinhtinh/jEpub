/**
 * jEpub TypeScript Type Definitions
 * Simple EPUB builder library for browsers
 */

export interface jEpubInitDetails {
    /** Language code (e.g., 'en', 'fr', 'de', 'ja', 'ar' - supports 21+ languages) */
    i18n?: string;
    /** Book title */
    title?: string;
    /** Book author */
    author?: string;
    /** Book publisher */
    publisher?: string;
    /** Book description (supports HTML) */
    description?: string;
    /** Book tags/categories */
    tags?: string[];
}

export interface jEpubUuid {
    /** UUID scheme: 'uuid' or 'URI' */
    scheme: 'uuid' | 'URI';
    /** UUID or URI string */
    id: string;
}

export interface jEpubCover {
    /** MIME type of the cover image */
    type: string;
    /** Path to cover image within EPUB */
    path: string;
}

export interface jEpubImage {
    /** MIME type of the image */
    type: string;
    /** Path to image within EPUB */
    path: string;
}

export interface jEpubImages {
    [name: string]: jEpubImage;
}

export type jEpubGenerateType =
    | 'blob'
    | 'arraybuffer'
    | 'uint8array'
    | 'nodebuffer';

export interface jEpubGenerateOptions {
    /** Output type */
    type?: jEpubGenerateType;
    /** MIME type for the generated file */
    mimeType?: string;
    /** Compression method */
    compression?: 'STORE' | 'DEFLATE';
    /** Compression options */
    compressionOptions?: {
        level: number;
    };
}

export type jEpubUpdateCallback = (metadata: {
    percent: number;
    currentFile: string;
}) => void;

/**
 * Main jEpub class for creating EPUB books
 */
export default class jEpub {
    constructor();

    /**
     * Initialize the EPUB with book details or existing JSZip instance
     * @param details Book initialization details or JSZip instance
     * @returns jEpub instance for method chaining
     */
    init(details: jEpubInitDetails | JSZip): this;

    /**
     * Convert HTML to plain text
     * @param html HTML string to convert
     * @param noBr Whether to remove line breaks
     * @returns Plain text string
     */
    static html2text(html: string, noBr?: boolean): string;

    /**
     * Set custom publication date
     * @param date Publication date
     * @returns jEpub instance for method chaining
     * @throws Error if date is not valid
     */
    date(date: Date): this;

    /**
     * Set custom UUID for the book
     * @param id UUID string or URI
     * @returns jEpub instance for method chaining
     * @throws Error if UUID is empty
     */
    uuid(id: string): this;

    /**
     * Add cover image to the book
     * @param data Image data as Blob or ArrayBuffer
     * @returns jEpub instance for method chaining
     * @throws Error if cover data is invalid
     */
    cover(data: Blob | ArrayBuffer): this;

    /**
     * Add an image to the book
     * @param data Image data as Blob or ArrayBuffer
     * @param name Image name (without extension)
     * @returns jEpub instance for method chaining
     * @throws Error if image data is invalid
     */
    image(data: Blob | ArrayBuffer, name: string): this;

    /**
     * Add notes page to the book
     * @param content Notes content (supports HTML)
     * @returns jEpub instance for method chaining
     * @throws Error if content is empty
     */
    notes(content: string): this;

    /**
     * Add a page/chapter to the book
     * @param title Page title
     * @param content Page content (supports HTML and EJS templates)
     * @param index Optional index position for the page
     * @returns jEpub instance for method chaining
     * @throws Error if title or content is empty
     */
    add(title: string, content: string | string[], index?: number): this;

    /**
     * Generate the EPUB file
     * @param type Output format type
     * @param onUpdate Optional callback for progress updates
     * @returns Promise that resolves to the generated EPUB data
     * @throws Error if browser doesn't support the specified type
     */
    generate(
        type?: jEpubGenerateType,
        onUpdate?: jEpubUpdateCallback
    ): Promise<Blob | ArrayBuffer | Uint8Array | Buffer>;
}

// Global type augmentation for UMD usage
declare global {
    interface Window {
        jEpub: typeof jEpub;
    }
}
