import { getData } from "./modules/get-data.js";
import { createProductImage } from "./modules/create-product-image.js";
import { createProductElement } from "./modules/create-product-element.js";

createDynamicProducts();

async function createDynamicProducts() {
    const productsData = await getData("products");

    for (const productData of productsData) {
        const productsContainer = document.querySelector(".items");
        const productCard = createProductCard(productData);

        productsContainer.append(productCard);
    }
}

function createProductCard(productData) {
    const productCard = document.createElement("a");
    const productArticle = createProductArticle(productData);

    productCard.href = `./product.html?id=${productData._id}`;
    productCard.append(productArticle);

    return productCard;
}

function createProductArticle(productData) {
    const { name, description } = productData;
    const productArticle = document.createElement("article");
    const productImage = createProductImage(productData);
    const productTitle = createProductElement("h3", name, "productName");
    const productDescription = createProductElement("p", description, "productDescription");

    productArticle.append(productImage, productTitle, productDescription);

    return productArticle;
}
