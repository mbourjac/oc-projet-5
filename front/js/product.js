import { fetchData } from "./modules/fetch-data.js";
import { createProductImage } from "./modules/create-product-image.js";
import { alertQuantityError } from "./modules/alert-quantity-error.js";
import { updateStorageData } from "./modules/update-storage-data.js";
import { setStorageData } from "./modules/set-storage-data.js";

createDynamicProduct();

async function createDynamicProduct() {
    const productId = getProductId();
    const productData = await fetchData(`products/${productId}`);

    const productContainer = document.querySelector(".item__img");
    const productImage = createProductImage(productData);
    productContainer.append(productImage);

    setProductInformation(productData);
    appendColorOptions(productData);
    handleQuantityInput();
    handleCartButton();
}

function getProductId() {
    const currentUrl = new URL(document.location);

    return currentUrl.searchParams.get("id");
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

function handleCartButton() {
    const cartButton = document.querySelector("#addToCart");
    
    cartButton.addEventListener("click", function () {
        const colorsSelect = document.querySelector("#colors"); /* déclarer variable dans createDynamicProduct() ? */
        const quantityInput = document.querySelector("#quantity"); /* déclarer variable dans createDynamicProduct() ? */
        
        const selectedColor = colorsSelect.value;
        const selectedQuantity = +quantityInput.value;

        switch (true) {
            case selectedColor === "" && selectedQuantity === 0:
                alert("Veuillez choisir une couleur et renseigner la quantité.");
                break;
            case selectedColor === "":
                alert("Veuillez choisir une couleur.");
                break;
            case selectedQuantity === 0:
                alert("Veuillez renseigner la quantité.");
                break;
            default:
                addToCart(selectedColor, selectedQuantity);
                /* alert("Article ajouté au panier"); */
        }
    });
}

function addToCart(selectedColor, selectedQuantity) {
    const productId = getProductId(); /* passer variable depuis handleCartButton() ? */
    const updatedProducts = updateStorageData(productId, selectedColor, selectedQuantity, addQuantity);
    
    setStorageData(updatedProducts);
}

function addQuantity(newProduct, storedProduct) {
    newProduct.quantity += storedProduct.quantity;
}
