import { fetchData } from "./modules/fetch-data.js";
import { createProductImage } from "./modules/create-product-image.js";
import { createProductElement } from "./modules/create-product-element.js";
import { alertQuantityError } from "./modules/alert-quantity-error.js";
import { getStorageData } from "./modules/get-storage-data.js";
import { setStorageData } from "./modules/set-storage-data.js";
import { isSameProduct } from "./modules/is-same-product.js";
import { redirectToNewPage } from "./modules/redirect-to-new-page.js";

buildCartPage();

async function buildCartPage() {
    const storedProducts = getStorageData();
    const cartProducts = await Promise.all(storedProducts.map(createCartProduct));

    appendCartProducts(cartProducts);
    handleDeleteButtons();
    handleQuantityInputs();
    setTotals();
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
    cartProduct.dataset.price = productData.price;
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

function createProductDescription(productData, color) {
    const { name, price } = productData;
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
    const cartProduct = this.closest("article");

    if (window.confirm("Voulez-vous supprimer cet article ?")) {
        removeFromDom(cartProduct);
        removeFromStorage(cartProduct);
        setTotals();
    }
}

function removeFromDom(cartProduct) {
    cartProduct.remove();
}

function removeFromStorage(cartProduct) {
    const storedProducts = getStorageData();
    const updatedStorage = [];

    for (const storedProduct of storedProducts) {
        if (!isSameProduct(storedProduct, cartProduct.dataset)) {
            updatedStorage.push(storedProduct);
        }
    }

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
            } else {
                quantityInput.defaultValue = this.value;
                updateCartQuantity(this);
                setTotals();
            }
        });
    }
}

function updateCartQuantity(input) {
    const id = input.closest("article").dataset.id;
    const color = input.closest("article").dataset.color;
    const quantity = +input.value;
    const updatedStorage = updateStorage({ id, color, quantity });

    setStorageData(updatedStorage);
}

function updateStorage({ id, color, quantity }) {
    const storedProducts = getStorageData();
    const newProduct = { id, color, quantity };
    let updatedStorage = [];

    for (let storedProduct of storedProducts) {
        if (!isSameProduct(newProduct, storedProduct)) {
            updatedStorage.push(storedProduct);
        }
    }

    updatedStorage.push(newProduct);

    return updatedStorage;
}

function setTotals() {
    const quantityInputs = document.querySelectorAll(".itemQuantity");
    const totalQuantityElement = document.querySelector("#totalQuantity");
    const totalPriceElement = document.querySelector("#totalPrice");

    const totalQuantity = calculateTotalQuantity(quantityInputs);
    const totalPrice = calculateTotalPrice(quantityInputs);

    totalQuantityElement.textContent = totalQuantity.toString();
    totalPriceElement.textContent = totalPrice.toString();
}

function calculateTotalQuantity(quantityInputs) {
    let totalQuantity = 0;

    for (const quantityInput of quantityInputs) {
        totalQuantity += +quantityInput.value;
    }

    return totalQuantity;
}

function calculateTotalPrice(quantityInputs) {
    let totalPrice = 0;

    for (const quantityInput of quantityInputs) {
        const productQuantity = +quantityInput.value;
        const productPrice = +quantityInput.closest("article").dataset.price;

        totalPrice += productQuantity * productPrice;
    }

    return totalPrice;
}

function handleOrderForm() {
    const orderForm = document.forms[0];
    const orderInputs = Array.from(orderForm.elements);
    const orderFields = orderInputs.filter(
        (inputElement) => inputElement.type !== "submit"
    );

    orderForm.setAttribute("novalidate", true);

    setNoNumberPattern();
    isCartEmpty(orderInputs);
    checkValidityOnInput(orderFields);
    checkValidtyOnSubmit(orderForm, orderFields);
}

function setNoNumberPattern() {
    const firstName = document.querySelector("#firstName");
    const lastName = document.querySelector("#lastName");
    const noNumberPattern = "^([^\\d]+)$";

    firstName.setAttribute("pattern", noNumberPattern);
    lastName.setAttribute("pattern", noNumberPattern);
}

function isCartEmpty(inputs) {
    for (let input of inputs) {
        input.addEventListener("focus", function () {
            const storedProducts = getStorageData();

            if (storedProducts.length === 0) {
                alert("Votre panier est vide. Vous allez être redirigé vers la page d'accueil.");
                redirectToNewPage("index.html");
            }
        });
    }
}

function checkValidityOnInput(inputs) {
    for (let input of inputs) {
        input.addEventListener("input", function () {
            if (input.validity.valid) {
                input.nextElementSibling.textContent = "";
            } else {
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
        let isFormValid = true;
        event.preventDefault();

        for (let input of inputs) {
            if (!input.validity.valid) {
                isFormValid = false;
                displayInputError(input);
            }
        }

        if (isFormValid) {
            submitOrderForm(form);
        }
    });
}

async function submitOrderForm(form) {
    const orderData = createOrderData(form);
    const { orderId } = await postOrderData(orderData);

    /* localStorage.clear(); */
    redirectToNewPage("confirmation.html", { orderId });
}

function createOrderData(form) {
    const storedProducts = getStorageData();
    const orderProductIds = storedProducts.map(storedProduct => storedProduct.id);
    const orderFormData = new FormData(form);
    const orderData = {
        contact: {},
        products: orderProductIds,
    };

    for (const [key, value] of orderFormData) {
        orderData.contact[key] = value;
    }

    return orderData;
}

async function postOrderData(data) {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };

    return fetchData("products/order", options);
}
