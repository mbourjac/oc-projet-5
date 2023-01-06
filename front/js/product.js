import { getData } from "./modules/get-data.js";
import { createProductImage } from "./modules/create-product-image.js";

createDynamicProduct();

async function createDynamicProduct() {
    const fetchPath = generateFetchPath();
    const productData = await getData(fetchPath);

    const productContainer = document.querySelector(".item__img");
    const productImage = createProductImage(productData);
    productContainer.append(productImage);
    
    setProductInformation(productData);
    appendProductOptions(productData);    
}

function generateFetchPath() {
    const currentUrl = new URL(document.location);
    const productId = currentUrl.searchParams.get("id");

    return `http://localhost:3000/api/products/${productId}`;
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