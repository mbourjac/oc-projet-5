/**
 * Sets cart data in local storage.
 * @param {Array<Object>} storedProducts - The products to be stored in the local storage, as an array of JSON objects.
 */
export function setStorageData(storedProducts) {
    localStorage.setItem("storedProducts", JSON.stringify(storedProducts));
}
