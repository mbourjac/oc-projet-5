import { fetchData } from "./modules/fetch-data.js";
import { getUrlParameter } from "./modules/get-url-parameter.js";
import { createProductImage } from "./modules/create-product-image.js";
import { alertQuantityError } from "./modules/alert-quantity-error.js";
import { getStorageData } from "./modules/get-storage-data.js";
import { setStorageData } from "./modules/set-storage-data.js";
import { isSameProduct } from "./modules/is-same-product.js";

createDynamicProduct();

async function createDynamicProduct() {
    const productId = getUrlParameter("id");
    const productData = await fetchData(`products/${productId}`);

    const productContainer = document.querySelector(".item__img");
    const productImage = createProductImage(productData);
    productContainer.append(productImage);

    setProductInformation(productData);
    appendColorOptions(productData);
    handleQuantityInput();
    handleCartButton(productData);
}

function setProductInformation({ name, price, description }) {
    const productTitle = document.querySelector("#title");
    const productPrice = document.querySelector("#price");
    const productDescription = document.querySelector("#description");

    productTitle.textContent = name;
    productPrice.textContent = price;
    productDescription.textContent = description;
}

function appendColorOptions({ colors }) {
    const colorsSelect = document.querySelector("#colors");
    const colorOptions = colors.map(createColorOption);

    colorsSelect.append(...colorOptions);
}

function createColorOption(color) {
    const colorOption = document.createElement("option");

    colorOption.setAttribute("value", color);
    colorOption.textContent = color;

    return colorOption;
}

function handleQuantityInput() {
    const quantityInput = document.querySelector("#quantity");

    quantityInput.required = true;
    
    quantityInput.addEventListener("change", function () {
        if (!this.validity.valid) {
            alertQuantityError(this);
            this.value = "0";
        }
    });
}

function handleCartButton({ name }) {
    const cartButton = document.querySelector("#addToCart");
    
    cartButton.addEventListener("click", function () {
        const colorsSelect = document.querySelector("#colors"); /* déclarer variable dans createDynamicProduct() ? */
        const quantityInput = document.querySelector("#quantity"); /* déclarer variable dans createDynamicProduct() ? */
        
        const color = colorsSelect.value;
        const quantity = +quantityInput.value;

        switch (true) {
            case color === "" && quantity === 0:
                alert("Veuillez choisir une couleur et renseigner la quantité.");
                break;
            case color === "":
                alert("Veuillez choisir une couleur.");
                break;
            case quantity === 0:
                alert("Veuillez renseigner la quantité.");
                break;
            default:
                addToCart(color, quantity);
                alert(`Le ${name} ${color} a bien été ajouté au panier en ${quantity} exemplaire(s).`);
        }
    });
}

function addToCart(color, quantity) {
    const id = getUrlParameter("id");
    const updatedStorage = addToStorage({ id, color, quantity });
    
    setStorageData(updatedStorage);
}

function addToStorage({ id, color, quantity }) {
    const storedProducts = getStorageData();
    const newProduct = { id, color, quantity };
    let updatedStorage = [];

    for (let storedProduct of storedProducts) {
        if (isSameProduct(newProduct, storedProduct)) {
            newProduct.quantity += storedProduct.quantity;
        } else {
            updatedStorage.push(storedProduct);
        }
    }

    updatedStorage.push(newProduct);

    return updatedStorage;
}
