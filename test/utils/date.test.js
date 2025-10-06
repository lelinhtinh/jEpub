import { describe, it, expect } from 'vitest';
import { getISODate } from '../../src/utils/date.js';

describe('Date utilities', () => {
    describe('getISODate', () => {
        it('should return current date in ISO format when no argument provided', () => {
            const result = getISODate();
            expect(result).toMatch(
                /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
            );
        });

        it('should format Date object to ISO string', () => {
            const date = new Date('2023-12-25T10:30:45.123Z');
            const result = getISODate(date);
            expect(result).toBe('2023-12-25T10:30:45.123Z');
        });

        it('should parse and format ISO date string', () => {
            const dateString = '2023-12-25T10:30:45.123Z';
            const result = getISODate(dateString);
            expect(result).toBe('2023-12-25T10:30:45.123Z');
        });

        it('should parse and format date string without milliseconds', () => {
            const dateString = '2023-12-25T10:30:45Z';
            const result = getISODate(dateString);
            expect(result).toBe('2023-12-25T10:30:45.000Z');
        });

        it('should handle timestamp numbers', () => {
            const timestamp = 1703506245123; // 2023-12-25T10:30:45.123Z
            const result = getISODate(timestamp);
            // Check the format and year-month-day part (time may vary due to timezone)
            expect(result).toMatch(
                /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
            );
            expect(result).toContain('2023-12-25');
        });

        it('should handle various date formats', () => {
            const formats = [
                '2023-12-25',
                '12/25/2023',
                'Dec 25, 2023',
                '2023/12/25',
            ];

            formats.forEach((format) => {
                const result = getISODate(format);
                expect(result).toMatch(
                    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
                );
                // Check for 2023 year and month 12 (may differ due to timezone)
                expect(result).toContain('2023');
                expect(result).toContain('-12-');
            });
        });

        it('should return current time for invalid date inputs', () => {
            const invalidInputs = ['invalid-date', '', null, undefined, {}];

            invalidInputs.forEach((input) => {
                const result = getISODate(input);
                expect(result).toMatch(
                    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
                );

                // Should be a valid recent date (current date for invalid inputs)
                const resultDate = new Date(result);
                const currentYear = new Date().getFullYear();
                expect(resultDate.getFullYear()).toBe(currentYear);
            });
        });

        it('should preserve timezone information by converting to UTC', () => {
            const date = new Date('2023-12-25T10:30:45.123+05:00');
            const result = getISODate(date);
            expect(result).toBe('2023-12-25T05:30:45.123Z'); // Converted to UTC
        });

        it('should handle edge dates', () => {
            // Test year boundaries
            expect(getISODate('2000-01-01')).toContain('2000-01-01');
            expect(getISODate('1999-12-31')).toContain('1999-12-31');

            // Test leap year
            expect(getISODate('2024-02-29')).toContain('2024-02-29');
        });
    });
});
