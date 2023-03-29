/**
 * Sets the API endpoint for a given resource path.
 * @param {string} resourcePath - The resource path for the API endpoint.
 * @returns {URL} - The URL object for the API endpoint.
 */
export function setApiEndpoint(resourcePath) {
    const baseUrl = new URL("http://localhost:3000/api/");

    return new URL(resourcePath, baseUrl);
}
