import { describe, it, expect } from 'vitest';
import { uuidv4 } from '../../src/utils/uuid.js';

describe('UUID utilities', () => {
    describe('uuidv4', () => {
        it('should generate a valid UUID v4', () => {
            const uuid = uuidv4();
            expect(uuid).toMatch(
                /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
            );
        });

        it('should generate unique UUIDs', () => {
            const uuid1 = uuidv4();
            const uuid2 = uuidv4();
            expect(uuid1).not.toBe(uuid2);
        });

        it('should always include version 4 identifier', () => {
            const uuid = uuidv4();
            expect(uuid.charAt(14)).toBe('4');
        });

        it('should have correct variant bits', () => {
            const uuid = uuidv4();
            const variantChar = uuid.charAt(19);
            expect(['8', '9', 'a', 'b']).toContain(variantChar.toLowerCase());
        });

        it('should generate multiple unique UUIDs', () => {
            const uuids = new Set();
            for (let i = 0; i < 100; i++) {
                uuids.add(uuidv4());
            }
            expect(uuids.size).toBe(100);
        });
    });
});
