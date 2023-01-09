import { getData } from "./modules/get-data.js";
import { createProductImage } from "./modules/create-product-image.js";
import { getFromStorage } from "./modules/get-from-storage.js";
import { saveStorage } from "./modules/save-storage.js";

createDynamicProduct();

async function createDynamicProduct() {
    const productId = getProductId();
    const productData = await getData(productId);

    const productContainer = document.querySelector(".item__img");
    const productImage = createProductImage(productData);
    productContainer.append(productImage);
    
    setProductInformation(productData);
    appendProductOptions(productData);  
    createStorageObject();   
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
    const valueContent = productColorData;

    productOption.setAttribute("value", valueContent);
    productOption.textContent = productColorData;

    return productOption;
}

function createStorageObject() {
    const productId = getProductId();
    const productColors = document.querySelector("#colors");
    const productQuantity = document.querySelector("#quantity");
    const cartButton = document.querySelector("#addToCart");
    const storageObject = {};

    storageObject.id = productId;
    storageObject.color = "";
    storageObject.quantity = 0;

    productColors.addEventListener("change", function (event) {
        storageObject.color = event.target.value;
    });

    productQuantity.addEventListener("change", function (event) {
        let updatedQuantity = +event.target.value;

        switch (true) {
            case updatedQuantity > 100:
                alert("Veuillez choisir une quantité inférieure à 100");
                event.target.value = 0;
                storageObject.quantity = 0;
                break;
            case updatedQuantity < 1:
                alert("Veuillez choisir une quantité supérieure à 0");
                event.target.value = 0;
                storageObject.quantity = 0;
                break;
            default:
                storageObject.quantity = updatedQuantity;
        }
    });

    cartButton.addEventListener("click", function () {
        switch(true) {
            case (storageObject.color === "") && (storageObject.quantity === 0):
                alert("Veuillez choisir une couleur et renseigner la quantité");
                break;
            case storageObject.color === "":
                alert("Veuillez choisir une couleur");
                break;
            case storageObject.quantity === 0:
                alert("Veuillez renseigner la quantité");
                break;
            default:
                addToStorage(storageObject);
                /* alert("Article ajouté au panier"); */
        }
    });
}

function addToStorage(product) {
    const storedProducts = getFromStorage();  
    
    if (storedProducts.length === 0) {
        storedProducts.push(product);
    } else {
        for (const [index, storedProduct] of storedProducts.entries()) {
            if (storedProduct.id === product.id && storedProduct.color === product.color) {
                storedProduct.quantity = storedProduct.quantity + product.quantity;
                break;
            }

            if (index === storedProducts.length - 1) {
                storedProducts.push(product);
                break;
            }
        }
    }

    saveStorage(storedProducts);
}