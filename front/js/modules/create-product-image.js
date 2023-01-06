export function createProductImage(productData) {
    const productImage = document.createElement("img");

    productImage.src = productData.imageUrl;
    productImage.alt = productData.altTxt;

    return productImage;
}