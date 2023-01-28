import { isSameProduct } from "./is-same-product.js";

/**
 * Retrieves the index of a matching product in an array of stored products.
 * @param {Array<Object>} storedProducts - The products stored in local storage.
 * @param {Object} newProduct - The product to match with the stored products.
 * @return {number} - The index of the matching product, or -1 if no match is found.
 */
export function getMatchIndex(storedProducts, newProduct) {
    return storedProducts.findIndex((storedProduct) => isSameProduct(storedProduct, newProduct));
}
