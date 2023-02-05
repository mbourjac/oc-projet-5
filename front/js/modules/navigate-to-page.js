import { setPageUrl } from "./set-page-url.js";

/**
 * Navigates the user to a specified page with provided parameters.
 * @param {string} page - The name of the page to navigate to.
 * @param {Object} [parameters] - An object containing key-value pairs of parameters to be added to the URL.
 */
export function navigateToPage(page, parameters) {
    const newPageUrl = setPageUrl(page, parameters);

    window.location.assign(newPageUrl);
}
