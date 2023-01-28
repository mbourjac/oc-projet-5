/**
 * Replaces an existing product with an updated version of the product.
 * @param {Array<Object>} storedProducts - The products stored in local storage.
 * @param {Object} updatedProduct - The updated version of the product to replace.
 * @param {number} - The index of the product to replace.
 * @return {Array<Object>} - The updated array of products.
 */
export function replaceMatchedProduct(storedProducts, updatedProduct, matchIndex) {
    return [...storedProducts.slice(0, matchIndex), updatedProduct, ...storedProducts.slice(matchIndex + 1)];
}
