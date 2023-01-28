/**
 * Gets cart data from local storage.
 * @returns {Array<Object>} The stored products in the local storage, as an array of JSON objects.
 */
export function getStorageData() {
    const storedProducts = localStorage.getItem("storedProducts");

    if (storedProducts === null) {
        return [];
    }

    return JSON.parse(storedProducts);
}
