/**
 * Sets the URL for a specified page with provided parameters.
 * @param {string} page - The name of the page.
 * @param {Object} [parameters] - An object containing key-value pairs of parameters to be added to the URL.
 * @returns {URL} The URL of the page.
 */
export function setPageUrl(page, parameters) {
    const baseUrl = new URL("/front/html/", window.location.href);
    const pageUrl = new URL(page, baseUrl);

    if (parameters) {
        for (const [key, value] of Object.entries(parameters)) {
            pageUrl.searchParams.set(key, value);
        }
    }

    return pageUrl;
}
