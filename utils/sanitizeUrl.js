/**
 * Strips tracking parameters (utm_*, ref, etc.) from a URL.
 */
function sanitizeUrl(urlString) {
    if (!urlString) return "";

    try {
        const url = new URL(urlString);
        const paramsToStrip = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "ref", "ref_src", "fbclid"];

        paramsToStrip.forEach(param => url.searchParams.delete(param));

        return url.toString();
    } catch (e) {
        // If URL is invalid, return as is or empty string
        return urlString;
    }
}

module.exports = sanitizeUrl;
