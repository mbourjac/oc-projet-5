import { getData } from "./modules/get-data.js";
import { createProductImage } from "./modules/create-product-image.js";

createDynamicProducts();

async function createDynamicProducts() {
    const productsData = await getData("http://localhost:3000/api/products");

    for (let productData of productsData) {
        const productsContainer = document.querySelector(".items");
        const productCard = createProductCard(productData);

        productsContainer.appendChild(productCard);
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
    const productArticle = document.createElement("article");
    const productImage = createProductImage(productData);
    const productTitle = createProductTitle(productData);
    const productDescription = createProductDescription(productData);

    productArticle.append(productImage, productTitle, productDescription);

    return productArticle;
}

function createProductTitle(productData) {
    const productTitle = document.createElement("h3");

    productTitle.classList.add("productName");
    productTitle.textContent = productData.name;

    return productTitle;
}

function createProductDescription(productData) {
    const productDescription = document.createElement("p");

    productDescription.classList.add("productDescription");
    productDescription.textContent = productData.description;

    return productDescription;
}