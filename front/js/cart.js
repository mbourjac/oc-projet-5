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

/**
 * Creates a cart product element.
 * @async
 * @param {Object} storedProduct - The product retrieved from local storage.
 * @return {HTMLElement} cartProduct - The created cart product element.
 */
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

/**
 * Creates a container element for the product image.
 * @param {Object} productData - The data of the product.
 * @returns {HTMLElement} - The created image container element.
 */
function createImageContainer(productData) {
    const imageContainer = document.createElement("div");
    const productImage = createProductImage(productData);

    imageContainer.classList.add("cart__item__img");
    imageContainer.append(productImage);

    return imageContainer;
}

/**
 * Creates a product content element.
 * @param {Object} productData - The data of the product.
 * @param {string} color - The color of the product.
 * @param {number} quantity - The quantity of the product.
 * @returns {HTMLElement} - The created product content element.
 */
function createProductContent(productData, color, quantity) {
    const productContent = document.createElement("div");
    const productDescription = createProductDescription(productData, color);
    const productSettings = createProductSettings(quantity);

    productContent.classList.add("cart__item__content");
    productContent.append(productDescription, productSettings);

    return productContent;
}

/**
 * Creates a container element for the product description.
 * @param {Object} productData - The data of the product.
 * @param {string} productData.name - The name of the product.
 * @param {string} productData.price - The price of the product.
 * @param {string} color - The color of the product.
 * @returns {HTMLElement} - The container element for the product description.
 */
function createProductDescription({ name, price }, color) {
    const productDescription = document.createElement("div");
    const productName = createProductElement("h2", name);
    const productColor = createProductElement("p", color);
    const productPrice = createProductElement("p", `${price} €`);

    productDescription.classList.add("cart__item__content__description");
    productDescription.append(productName, productColor, productPrice);

    return productDescription;
}

/**
 * Creates a container element for the product settings including its quantity and delete button.
 * @param {number} quantity - The quantity of the product.
 * @returns {HTMLElement} - The container element for the product settings.
 */
function createProductSettings(quantity) {
    const productSettings = document.createElement("div");
    const quantityContainer = createQuantityContainer(quantity);
    const deleteButton = createDeleteButton();

    productSettings.classList.add("cart__item__content__settings");
    productSettings.append(quantityContainer, deleteButton);

    return productSettings;
}

/**
 * Creates a container element for the product quantity input and label.
 * @param {number} quantity - The quantity of the product.
 * @returns {HTMLElement} - The container element for the product quantity input and label.
 */
function createQuantityContainer(quantity) {
    const quantityContainer = document.createElement("div");
    const quantityLabel = createProductElement("p", "Qté : ");
    const quantityInput = createQuantityInput(quantity);

    quantityContainer.classList.add("cart__item__content__settings__quantity");
    quantityContainer.append(quantityLabel, quantityInput);

    return quantityContainer;
}

/**
 * Creates a quantity input element for a cart product.
 * @param {number} quantity - The quantity to be set in the input element.
 * @returns {HTMLElement} - The created quantity input element.
 */
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

/**
 * Creates a delete button element for a cart product.
 * @return {HTMLElement} deleteButton - The created delete button element.
 */
function createDeleteButton() {
    const deleteButton = document.createElement("div");
    const deleteLabel = createProductElement("p", "Supprimer", "deleteItem");

    deleteButton.classList.add("cart__item__content__settings__delete");
    deleteButton.append(deleteLabel);

    return deleteButton;
}

/**
 * Appends cart products to the container element.
 * @param {Array<HTMLElement>} cartProducts - The cart product elements to append.
 */
function appendCartProducts(cartProducts) {
    const productsContainer = document.querySelector("#cart__items");

    productsContainer.append(...cartProducts);
}

/**
 * Handles the click event for the delete buttons.
 */
function handleDeleteButtons() {
    const removeButtons = document.querySelectorAll(".deleteItem");

    for (const removeButton of removeButtons) {
        removeButton.addEventListener("click", removeCartProduct);
    }
}

/**
 * Removes a product from the DOM and local storage and sets totals accordingly.
 */
function removeCartProduct() {
    const discardedProduct = this.closest("article");

    if (window.confirm("Voulez-vous supprimer cet article ?")) {
        removeFromDom(discardedProduct);
        removeFromStorage(discardedProduct);
        setTotals();
    }
}

/**
 * Removes a product from the DOM.
 * @param {HTMLElement} discardedProduct - The cart product to be removed.
 */
function removeFromDom(discardedProduct) {
    discardedProduct.remove();
}

/**
 * Removes a product from local storage.
 * @param {HTMLElement} discardedProduct - The cart product to be removed.
 */
function removeFromStorage(discardedProduct) {
    const storedProducts = getStorageData();
    const updatedStorage = storedProducts.filter((storedProduct) => !isSameProduct(storedProduct, discardedProduct.dataset));

    setStorageData(updatedStorage);
}

/**
 * Handles the change event for the quantity input elements.
 */
function handleQuantityInputs() {
    const quantityInputs = document.querySelectorAll(".itemQuantity");

    for (const quantityInput of quantityInputs) {
        quantityInput.defaultValue = quantityInput.value;

        quantityInput.addEventListener("change", function () {
            if (!this.validity.valid) {
                alertQuantityError(this);
                this.value = quantityInput.defaultValue;
            } else {
                quantityInput.defaultValue = this.value;
                updateCartQuantity(this);
                setTotals();
            }
        });
    }
}

/**
 * Updates the quantity of a product in the cart.
 * @param {HTMLInputElement} input - The input element representing the quantity of the product to update.
 */
function updateCartQuantity(input) {
    const { id, color } = input.closest("article").dataset;
    const quantity = +input.value;
    const updatedStorage = updateStorage({ id, color, quantity });

    setStorageData(updatedStorage);
}

/**
 * Updates the storage data.
 * @param {Object} updatedProduct - The updated product replacing the matching one in local storage.
 * @returns {Array<Object>} - The updated storage data.
 */
function updateStorage(updatedProduct) {
    const storedProducts = getStorageData();
    const matchIndex = getMatchIndex(storedProducts, updatedProduct);

    return replaceMatchedProduct(storedProducts, updatedProduct, matchIndex);
}

/**
 * Sets total quantity of items and total price of the cart.
 */
async function setTotals() {
    const quantityInputs = Array.from(document.querySelectorAll(".itemQuantity"));
    const totalQuantityElement = document.querySelector("#totalQuantity");
    const totalPriceElement = document.querySelector("#totalPrice");

    const totalQuantity = calculateTotalQuantity(quantityInputs);
    const totalPrice = await calculateTotalPrice(quantityInputs);

    totalQuantityElement.textContent = totalQuantity.toString();
    totalPriceElement.textContent = totalPrice.toString();
}

/**
 * Calculates the total quantity of items in the cart.
 * @param {Array<HTMLInputElement>} quantityInputs - An array of quantity input elements.
 * @returns {number} The total quantity of items in the cart.
 */
function calculateTotalQuantity(quantityInputs) {
    return quantityInputs.reduce(
        (totalQuantity, { value }) => totalQuantity + +value,
        0
    );
}

/**
 * Calculates the total price of the cart.
 * @param {Array<HTMLInputElement>} quantityInputs - An array of quantity input elements.
 * @return {Promise<number>} The total price of the cart.
 */
async function calculateTotalPrice(quantityInputs) {
    return quantityInputs.reduce(async (accPromise, quantityInput) => {
        const totalPrice = await accPromise;
        const quantity = +quantityInput.value;
        const { id } = quantityInput.closest("article").dataset;
        const { price } = await fetchData(`products/${id}`);

        return totalPrice + quantity * price;
    }, Promise.resolve(0));
}

/**
 * Handles the validation and submission of the order form.
 */
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

/**
 * Sets a pattern for firstname and lastname fields to prevent numbers.
 */
function setNoNumberPattern() {
    const firstName = document.querySelector("#firstName");
    const lastName = document.querySelector("#lastName");
    const noNumberPattern = "^\\D+$";

    firstName.setAttribute("pattern", noNumberPattern);
    lastName.setAttribute("pattern", noNumberPattern);
}

/**
 * Checks if the cart is empty when an input element is focused.
 * @param {Array<HTMLInputElement>} inputs - The input elements of the form.
 */
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

/**
 * Handles the input event for the form inputs to be filled by the user.
 * @param {Array<HTMLInputElement>} inputs - The input elements to be filled by the user.
 */
function checkValidityOnInput(inputs) {
    for (const input of inputs) {
        input.addEventListener("input", function () {
            if (input.validity.valid) {
                input.nextElementSibling.textContent = "";
            } else {
                displayInputError(input);
            }
        });
    }
}

/**
 * Displays an error message based on the input validation state.
 * @param {HTMLInputElement} input - The input element to display the error for.
 */
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

/**
 * Handles the submit event for the form element.
 * @param {HTMLElement} form - The form element to add the event listener to.
 * @param {Array<HTMLInputElement>} inputs - The input elements to be filled by the user.
 */
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
        } else {
            alert("Veuillez corriger les champs indiqués.");
        }
    });
}

/**
 * Submits the given order form and sends the form data to server.
 * Then redirects the user to the confirmation page with the order ID.
 * @async
 * @param {HTMLFormElement} form - The form element to be submitted.
 */
async function submitOrderForm(form) {
    const contact = createContactData(form);
    const products = createProductsData();

    const { orderId } = await postOrderData({ contact, products });

    localStorage.clear();
    navigateToPage("confirmation.html", { orderId });
}

/**
 * Creates a contact object from a form element.
 * @param {HTMLFormElement} form - The form element to extract data from.
 * @returns {Object} - The contact data.
 */
function createContactData(form) {
    const orderFormData = new FormData(form);

    return Object.fromEntries(orderFormData.entries());
}

/**
 * Creates an array of product ids from local storage.
 * @returns {Array<string>} - The products data.
 */
function createProductsData() {
    const storedProducts = getStorageData();

    return storedProducts.map(({ id }) => id);
}

/**
 * Sends a POST request to the server with the provided order data.
 * @async
 * @param {Object} orderData - The order data to send to the server.
 * @return {Promise<Object>} - The server's response, containing the order ID.
 */
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
