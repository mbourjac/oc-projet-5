import { fetchData } from "./modules/fetch-data.js";
import { createProductImage } from "./modules/create-product-image.js";
import { createProductElement } from "./modules/create-product-element.js";

buildHomepage();

async function buildHomepage() {
    const productsData = await fetchData("products");
    const productItems = productsData.map(createProductItem);

    appendProductItems(productItems)
}

function createProductItem(productData) {
    const productItem = document.createElement("a");
    const productArticle = createProductArticle(productData);

    productItem.href = `./product.html?id=${productData._id}`;
    productItem.append(productArticle);

    return productItem;
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

function appendProductItems(productItems) {
    const productsContainer = document.querySelector(".items");

    productsContainer.append(...productItems);
}
