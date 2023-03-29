import { fetchData } from "./modules/fetch-data.js";
import { createProductImage } from "./modules/create-product-image.js";
import { createProductElement } from "./modules/create-product-element.js";
import { alertQuantityError } from "./modules/alert-quantity-error.js";
import { getStorageData } from "./modules/get-storage-data.js";
import { setStorageData } from "./modules/set-storage-data.js";
import { isSameProduct } from "./modules/is-same-product.js";
import { getMatchIndex } from "./modules/get-match-index.js";
import { replaceMatchedProduct } from "./modules/replace-matched-product.js";
import { navigateToPage } from "./modules/navigate-to-page.js";
createDynamicContent();
async function createDynamicContent() {
    const storedProducts = getStorageData();
    const cartProducts = await Promise.all(storedProducts.map(createCartProduct));
    appendCartProducts(cartProducts);
    setTotals();
    handleDeleteButtons();
    handleQuantityInputs();
    handleOrderForm();
}
async function createCartProduct(storedProduct) {
    const { id, color, quantity } = storedProduct;
    const productData = await fetchData(`products/${id}`);
    const cartProduct = document.createElement("article");
    const imageContainer = createImageContainer(productData);
    const productContent = createProductContent(productData, color, quantity);
    cartProduct.classList.add("cart__item");
    cartProduct.dataset.id = id;
    cartProduct.dataset.color = color;
    cartProduct.append(imageContainer, productContent);
    return cartProduct;
}
function createImageContainer(productData) {
    const imageContainer = document.createElement("div");
    const productImage = createProductImage(productData);
    imageContainer.classList.add("cart__item__img");
    imageContainer.append(productImage);
    return imageContainer;
}
function createProductContent(productData, color, quantity) {
    const productContent = document.createElement("div");
    const productDescription = createProductDescription(productData, color);
    const productSettings = createProductSettings(quantity);
    productContent.classList.add("cart__item__content");
    productContent.append(productDescription, productSettings);
    return productContent;
}
function createProductDescription({ name, price }, color) {
    const productDescription = document.createElement("div");
    const productName = createProductElement("h2", name);
    const productColor = createProductElement("p", color);
    const productPrice = createProductElement("p", `${price} €`);
    productDescription.classList.add("cart__item__content__description");
    productDescription.append(productName, productColor, productPrice);
    return productDescription;
}
function createProductSettings(quantity) {
    const productSettings = document.createElement("div");
    const quantityContainer = createQuantityContainer(quantity);
    const deleteButton = createDeleteButton();
    productSettings.classList.add("cart__item__content__settings");
    productSettings.append(quantityContainer, deleteButton);
    return productSettings;
}
function createQuantityContainer(quantity) {
    const quantityContainer = document.createElement("div");
    const quantityLabel = createProductElement("p", "Qté : ");
    const quantityInput = createQuantityInput(quantity);
    quantityContainer.classList.add("cart__item__content__settings__quantity");
    quantityContainer.append(quantityLabel, quantityInput);
    return quantityContainer;
}
function createQuantityInput(quantity) {
    const quantityInput = document.createElement("input");
    quantityInput.classList.add("itemQuantity");
    quantityInput.type = "number";
    quantityInput.name = "itemQuantity";
    quantityInput.min = "1";
    quantityInput.max = "100";
    quantityInput.value = quantity;
    quantityInput.required = true;
    return quantityInput;
}
function createDeleteButton() {
    const deleteButton = document.createElement("div");
    const deleteLabel = createProductElement("p", "Supprimer", "deleteItem");
    deleteButton.classList.add("cart__item__content__settings__delete");
    deleteButton.append(deleteLabel);
    return deleteButton;
}
function appendCartProducts(cartProducts) {
    const productsContainer = document.querySelector("#cart__items");
    productsContainer.append(...cartProducts);
}
function handleDeleteButtons() {
    const removeButtons = document.querySelectorAll(".deleteItem");
    for (const removeButton of removeButtons) {
        removeButton.addEventListener("click", removeCartProduct);
    }
}
function removeCartProduct() {
    const discardedProduct = this.closest("article");
    if (window.confirm("Voulez-vous supprimer cet article ?")) {
        removeFromDom(discardedProduct);
        removeFromStorage(discardedProduct);
        setTotals();
    }
}
function removeFromDom(discardedProduct) {
    discardedProduct.remove();
}
function removeFromStorage(discardedProduct) {
    const storedProducts = getStorageData();
    const updatedStorage = storedProducts.filter((storedProduct) => !isSameProduct(storedProduct, discardedProduct.dataset));
    setStorageData(updatedStorage);
}
function handleQuantityInputs() {
    const quantityInputs = document.querySelectorAll(".itemQuantity");
    for (const quantityInput of quantityInputs) {
        quantityInput.defaultValue = quantityInput.value;
        quantityInput.addEventListener("change", function () {
            if (!this.validity.valid) {
                alertQuantityError(this);
                this.value = quantityInput.defaultValue;
            }
            else {
                quantityInput.defaultValue = this.value;
                updateCartQuantity(this);
                setTotals();
            }
        });
    }
}
function updateCartQuantity(input) {
    const { id, color } = input.closest("article").dataset;
    const quantity = +input.value;
    const updatedStorage = updateStorage({ id, color, quantity });
    setStorageData(updatedStorage);
}
function updateStorage(updatedProduct) {
    const storedProducts = getStorageData();
    const matchIndex = getMatchIndex(storedProducts, updatedProduct);
    return replaceMatchedProduct(storedProducts, updatedProduct, matchIndex);
}
async function setTotals() {
    const quantityInputs = Array.from(document.querySelectorAll(".itemQuantity"));
    const totalQuantityElement = document.querySelector("#totalQuantity");
    const totalPriceElement = document.querySelector("#totalPrice");
    const totalQuantity = calculateTotalQuantity(quantityInputs);
    const totalPrice = await calculateTotalPrice(quantityInputs);
    totalQuantityElement.textContent = totalQuantity.toString();
    totalPriceElement.textContent = totalPrice.toString();
}
function calculateTotalQuantity(quantityInputs) {
    return quantityInputs.reduce((totalQuantity, { value }) => totalQuantity + +value, 0);
}
async function calculateTotalPrice(quantityInputs) {
    return quantityInputs.reduce(async (accPromise, quantityInput) => {
        const totalPrice = await accPromise;
        const quantity = +quantityInput.value;
        const { id } = quantityInput.closest("article").dataset;
        const { price } = await fetchData(`products/${id}`);
        return totalPrice + quantity * price;
    }, Promise.resolve(0));
}
function handleOrderForm() {
    const [orderForm] = document.forms;
    const orderInputs = [...orderForm.elements];
    const orderFields = orderInputs.filter(({ type }) => type !== "submit");
    orderForm.setAttribute("novalidate", true);
    setNoNumberPattern();
    isCartEmpty(orderInputs);
    checkValidityOnInput(orderFields);
    checkValidtyOnSubmit(orderForm, orderFields);
}
function setNoNumberPattern() {
    const firstName = document.querySelector("#firstName");
    const lastName = document.querySelector("#lastName");
    const noNumberPattern = "^\\D+$";
    firstName.setAttribute("pattern", noNumberPattern);
    lastName.setAttribute("pattern", noNumberPattern);
}
function isCartEmpty(inputs) {
    for (const input of inputs) {
        input.addEventListener("focus", function () {
            const storedProducts = getStorageData();
            if (storedProducts.length === 0) {
                alert("Votre panier est vide. Vous allez être redirigé vers la page d'accueil.");
                navigateToPage("index.html");
            }
        });
    }
}
function checkValidityOnInput(inputs) {
    for (const input of inputs) {
        input.addEventListener("input", function () {
            if (input.validity.valid) {
                input.nextElementSibling.textContent = "";
            }
            else {
                displayInputError(input);
            }
        });
    }
}
function displayInputError(input) {
    const inputErrorElement = input.nextElementSibling;
    switch (true) {
        case input.validity.valueMissing:
            inputErrorElement.textContent = "Ce champ est requis.";
            break;
        case input.validity.typeMismatch:
            inputErrorElement.textContent = "Le format n'est pas valide.";
            break;
        case input.validity.patternMismatch:
            inputErrorElement.textContent = "Les chiffres ne sont pas autorisés pour ce champ.";
            break;
    }
}
function checkValidtyOnSubmit(form, inputs) {
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        let isFormValid = true;
        for (const input of inputs) {
            if (!input.validity.valid) {
                isFormValid = false;
                displayInputError(input);
            }
        }
        if (isFormValid) {
            submitOrderForm(form);
        }
        else {
            alert("Veuillez corriger les champs indiqués.");
        }
    });
}
async function submitOrderForm(form) {
    const contact = createContactData(form);
    const products = createProductsData();
    const { orderId } = await postOrderData({ contact, products });
    localStorage.clear();
    navigateToPage("confirmation.html", { orderId });
}
function createContactData(form) {
    const orderFormData = new FormData(form);
    return Object.fromEntries(orderFormData.entries());
}
function createProductsData() {
    const storedProducts = getStorageData();
    return storedProducts.map(({ id }) => id);
}
async function postOrderData(orderData) {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
    };
    return fetchData("products/order", options);
}
