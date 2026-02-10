/**
 * Cleans text by removing HTML tags, email addresses, and phone numbers.
 * Also truncates the text to the specified length.
 */
function cleanText(text, maxLength = 300) {
    if (!text) return "";

    // Remove HTML tags
    let cleaned = text.replace(/<[^>]*>?/gm, " ");

    // Remove email addresses
    cleaned = cleaned.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[Email Hidden]");

    // Remove phone numbers (simple pattern)
    cleaned = cleaned.replace(/(\+\d{1,2}\s?)?(\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}/g, "[Phone Hidden]");

    // Normalize whitespace
    cleaned = cleaned.replace(/\s+/g, " ").trim();

    // Truncate
    if (cleaned.length > maxLength) {
        cleaned = cleaned.substring(0, maxLength) + "...";
    }

    return cleaned;
}

module.exports = cleanText;
