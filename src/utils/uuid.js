/**
 * UUID generation utilities
 */

/**
 * Generates a RFC 4122 version 4 UUID
 * @see https://stackoverflow.com/a/2117523
 * @returns {string} A randomly generated UUID string
 * @throws {Error} If crypto.getRandomValues is not available
 */
export function uuidv4() {
    if (typeof crypto === 'undefined' || !crypto.getRandomValues) {
        throw new Error('crypto.getRandomValues is not available');
    }

    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
            c ^
            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
    );
}
