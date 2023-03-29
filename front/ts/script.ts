import { fetchData } from "./modules/fetch-data.js";
import { createProductImage } from "./modules/create-product-image.js";
import { createProductElement } from "./modules/create-product-element.js";
import { setPageUrl } from "./modules/set-page-url.js";

createDynamicContent();

async function createDynamicContent() {
    const productsData = await fetchData("products");
    const productItems = productsData.map(createProductItem);

    appendProductItems(productItems);
}

/**
 * Creates a product item with the product data.
 * @param {Object} productData - The product data.
 * @returns {HTMLAnchorElement} The created product item.
 */
function createProductItem(productData) {
    const productItem = document.createElement("a");
    const productArticle = createProductArticle(productData);
    const { _id: id } = productData;

    productItem.href = setPageUrl("product.html", { id });
    productItem.append(productArticle);

    return productItem;
}

/**
 * Creates an article element with the product data.
 * @param {Object} productData - The product data.
 * @returns {HTMLArticleElement} - The created article element.
 */
function createProductArticle(productData) {
    const { name, description } = productData;
    const productArticle = document.createElement("article");
    const productImage = createProductImage(productData);
    const productTitle = createProductElement("h3", name, "productName");
    const productDescription = createProductElement("p", description, "productDescription");

    productArticle.append(productImage, productTitle, productDescription);

    return productArticle;
}

/**
 * Appends product items to the container element.
 * @param {Array<HTMLElement>} productItems - The product items to append.
 */
function appendProductItems(productItems) {
    const productsContainer = document.querySelector(".items");

    productsContainer.append(...productItems);
}
