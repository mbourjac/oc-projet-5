/**
 * Gets cart data from local storage.
 * @returns {Array} The stored products in the local storage, as an array of JSON objects.
 */
export function getStorageData() {
    let storedProducts = localStorage.getItem("storedProducts");

    if (storedProducts == null) {
        return [];
    } else {
        return JSON.parse(storedProducts);
    }
}
