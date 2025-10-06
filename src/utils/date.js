/**
 * Date and time utilities
 */

/**
 * Get current moment in ISO format
 * @param {Date|string|number} [date=new Date()] - The date to convert
 * @returns {string} ISO date string
 */
export function getISODate(date = new Date()) {
    // If already a Date object, use it directly
    if (date instanceof Date) {
        return date.toISOString();
    }

    // Handle null explicitly as invalid
    if (date === null) {
        return new Date().toISOString();
    }

    // For other types, create a new Date object
    const dateObj = new Date(date);

    // If invalid date, use current date
    if (isNaN(dateObj.getTime())) {
        return new Date().toISOString();
    }

    return dateObj.toISOString();
}
