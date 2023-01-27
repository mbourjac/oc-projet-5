/**
 * Creates an image element with specific src and alt attributes.
 * @param {Object} data - The data for the image element.
 * @param {string} data.imageUrl - The source URL of the image.
 * @param {string} data.altTxt - The alternative text for the image.
 * @returns {HTMLImageElement} The created image element.
 */
export function createProductImage({ imageUrl, altTxt }) {
    const productImage = document.createElement("img");

    productImage.src = imageUrl;
    productImage.alt = altTxt;

    return productImage;
}
