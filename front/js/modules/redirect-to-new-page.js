/**
 * Redirects to a new page.
 * @param {string} page - The name of the new page.
 * @param {Object} [parametersObject] - An object containing key-value pairs of parameters to be added to the URL.
 */
export function redirectToNewPage(page, parametersObject) {
    const newPageUrl = setNewPageUrl(page, parametersObject);
    
    window.location.assign(newPageUrl);
}

/**
 * Sets the URL of the new page.
 * @param {string} page - The name of the new page.
 * @param {Object} [parametersObject] - An object containing key-value pairs of parameters to be added to the URL.
 * @returns {URL} The URL of the new page.
 */
function setNewPageUrl(page, parametersObject) {
    const baseUrl = new URL("/front/html/", window.location.href);
    const newPageUrl = new URL(page, baseUrl);

    if (parametersObject) {
        for (const [key, value] of Object.entries(parametersObject)) {
            newPageUrl.searchParams.set(key, value);
        }
    }

    return newPageUrl;
}
