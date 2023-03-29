export function createProductImage({ imageUrl, altTxt }) {
    const productImage = document.createElement("img");

    productImage.src = imageUrl;
    productImage.alt = altTxt;

    return productImage;
}
