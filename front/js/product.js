import { getData } from "./modules/get-data.js";
import { createProductImage } from "./modules/create-product-image.js";

createDynamicProduct();

async function createDynamicProduct() {
    const productId = getProductId();
    const productData = await getData(productId);

    const productContainer = document.querySelector(".item__img");
    const productImage = createProductImage(productData);
    productContainer.append(productImage);
    
    setProductInformation(productData);
    appendProductOptions(productData);    
}

function getProductId() {
    const currentUrl = new URL(document.location);

    return currentUrl.searchParams.get("id");
}

function setProductInformation(productData) {
    const productTitle = document.querySelector("#title");
    const productPrice = document.querySelector("#price");
    const productDescription = document.querySelector("#description");

    productTitle.textContent = productData.name;
    productPrice.textContent = productData.price; /* format ? */
    productDescription.textContent = productData.description;
}

function appendProductOptions({ colors }) {
    const productColors = document.querySelector("#colors");
    const productColorsData = colors;
    const productOptions = productColorsData.map(createProductOption);

    productColors.append(...productOptions);
}

function createProductOption(productColorData) {
    const productOption = document.createElement("option");
    const valueContent = productColorData.toLowerCase();

    productOption.setAttribute("value", valueContent);
    productOption.textContent = productColorData;

    return productOption;
}