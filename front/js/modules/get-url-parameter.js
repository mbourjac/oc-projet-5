/**
 * Gets a specific parameter from the current URL.
 * @param {string} parameter - The name of the parameter to be retrieved.
 * @returns {string} The value of the specified parameter.
 */
export function getUrlParameter(parameter) {
    const currentUrl = new URL(document.location);

    return currentUrl.searchParams.get(parameter);
}
