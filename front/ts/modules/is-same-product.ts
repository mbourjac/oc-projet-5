/**
 * Checks if two products are the same.
 * Two products are identical if they have the same id and color.
 * @param {Object} firstProduct - The first product to be compared.
 * @param {Object} secondProduct - The second product to be compared.
 * @returns {boolean} A Boolean value indicating whether the two products are the same.
 */
export function isSameProduct(firstProduct, secondProduct) {
    return (
        firstProduct.id === secondProduct.id &&
        firstProduct.color === secondProduct.color
    );
}
