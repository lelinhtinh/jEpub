/**
 * jEpub TypeScript Type Definitions
 * Simple EPUB builder library for browsers
 */

import type JSZip from "jszip";

/**
 * Custom attributes for an XML element
 * Represented as key-value pairs where both keys and values are strings
 */
export interface jEpubMetadataAttributes {
    [attrName: string]: string;
}

/**
 * A callback function used to render a metadata item into a custom XHTML string for the title page
 * @param item The current metadata item being processed
 * @returns A valid XHTML string snippet to be injected into the template
 */
export type jEpubMetadataRenderCallback = (item: jEpubMetadataItem) => string;

/**
 * Represents a single metadata entry compliance with DCMI standards and customizable for EPUB generation.
 */
export interface jEpubMetadataItem {
    /** The qualified name of the XML element (e.g., 'dc:contributor', 'dc:rights', 'meta') */
    name: string;

    /** The text content or value of the metadata element */
    value: string;

    /** Optional XML attributes associated with the metadata element (e.g., { 'opf:role': 'aut' }) */
    attrs?: jEpubMetadataAttributes;

    /**
     * Defines whether or how the item should be rendered on the HTML title page
     * - `true`: Renders the item using the library's default built-in layout
     * - `false`: Completely skips rendering on the title page (only registers in book.opf)
     * - `Function`: A custom render callback to return a custom XHTML snippet
     */
    renderInTitlePage?: boolean | jEpubMetadataRenderCallback;

    /**
     * The human-readable display name used as a label on the title page
     * Only applicable when `renderInTitlePage` is set to `true`
     * If omitted, falls back to the capitalized element name (excluding prefix)
     */
    label?: string;
}

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
    /** Custom metadata */
    customMetadata?: jEpubMetadataItem[];
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
    /** HTML attributes to render on the <img> tag */
    attributes: Record<string, string>;
}

export interface jEpubImages {
    [name: string]: jEpubImage;
}

export type jEpubGenerateType =
    | 'blob'
    | 'arraybuffer'
    | 'uint8array'
    | 'nodebuffer';

export type jEpubGenerateTypeMap = {
    blob: Blob;
    arraybuffer: ArrayBuffer;
    uint8array: Uint8Array;
    nodebuffer: Buffer;
};

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
     * @param attributes - Optional HTML attributes to render on the <img> tag
     * @returns jEpub instance for method chaining
     * @throws Error if image data is invalid
     */
    image(data: Blob | ArrayBuffer, name: string, attributes?: Record<string, string>): this;

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
     * @param content Page content (supports HTML)
     * @param level Hierarchy level of the page
     * @returns jEpub instance for method chaining
     * @throws Error if title is empty or level is invalid
     */
    add(
        title: string,
        content?: string | string[] | null,
        level?: number
    ): this;

    /**
     * Generate the EPUB file
     * @param type Output format type
     * @param onUpdate Optional callback for progress updates
     * @returns Promise that resolves to the generated EPUB data
     * @throws Error if browser doesn't support the specified type
     */
    generate<
        T extends jEpubGenerateType
    >(
        type?: T,
        onUpdate?: jEpubUpdateCallback
    ): Promise<jEpubGenerateTypeMap[T]>;
}

// Global type augmentation for UMD usage
declare global {
    interface Window {
        jEpub: typeof jEpub;
    }
}
