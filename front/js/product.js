import { getData } from "./modules/get-data.js";
import { createProductImage } from "./modules/create-product-image.js";
import { getStorageData } from "./modules/get-storage-data.js";
import { setStorageData } from "./modules/set-storage-data.js";

createDynamicProduct();

async function createDynamicProduct() {
    const productId = getProductId();
    const productData = await getData(productId);

    const productContainer = document.querySelector(".item__img");
    const productImage = createProductImage(productData);
    productContainer.append(productImage);
    
    setProductInformation(productData);
    appendProductOptions(productData);

    const storageObject = createStorageObject(productId);
    handleCartButton(storageObject);
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

function createStorageObject(productId) {
    const storageObject = {
        id: productId,
        color: "",
        quantity: 0,
    };

    setStorageObjectColor();
    setStorageObjectQuantity();

    function setStorageObjectColor() {
        const productColors = document.querySelector("#colors");

        productColors.addEventListener("change", function () {
            storageObject.color = this.value;
        });
    }

    function setStorageObjectQuantity() {
        const productQuantity = document.querySelector("#quantity");

        productQuantity.addEventListener("change", function () {
            let updatedQuantity = +this.value;
    
            switch (true) {
                case updatedQuantity > 100:
                    alert("Veuillez choisir une quantité inférieure à 100");
                    this.value = "0";
                    storageObject.quantity = 0;
                    break;
                case updatedQuantity < 1:
                    alert("Veuillez choisir une quantité supérieure à 0");
                    this.value = "0";
                    storageObject.quantity = 0;
                    break;
                default:
                    storageObject.quantity = updatedQuantity;
            }
        });
    }

    return storageObject;
}

function handleCartButton(storageObject) {
    const cartButton = document.querySelector("#addToCart");

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
                addToCart(storageObject);
                /* alert("Article ajouté au panier"); */
        }
    });
}

function addToCart(storageObject) {
    const storedProducts = getStorageData();  
    
    if (storedProducts.length === 0) {
        storedProducts.push(storageObject);
    } else {
        for (const [index, storedProduct] of storedProducts.entries()) {
            if (storedProduct.id === storageObject.id && storedProduct.color === storageObject.color) {
                storedProduct.quantity = storedProduct.quantity + storageObject.quantity;
                break;
            }

            if (index === storedProducts.length - 1) {
                storedProducts.push(storageObject);
                break;
            }
        }
    }

    setStorageData(storedProducts);
}