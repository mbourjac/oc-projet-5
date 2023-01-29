/**
 * Redirects to a new page.
 * @param {string} page - The name of the new page.
 * @param {Object} [parameters] - An object containing key-value pairs of parameters to be added to the URL.
 */
export function redirectToNewPage(page, parameters) {
    const newPageUrl = setNewPageUrl(page, parameters);

    window.location.assign(newPageUrl);
}

/**
 * Sets the URL of the new page.
 * @param {string} page - The name of the new page.
 * @param {Object} [parameters] - An object containing key-value pairs of parameters to be added to the URL.
 * @returns {URL} The URL of the new page.
 */
function setNewPageUrl(page, parameters) {
    const baseUrl = new URL("/front/html/", window.location.href);
    const newPageUrl = new URL(page, baseUrl);

    if (parameters) {
        for (const [key, value] of Object.entries(parameters)) {
            newPageUrl.searchParams.set(key, value);
        }
    }

    return newPageUrl;
}
