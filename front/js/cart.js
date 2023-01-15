import { getData } from "./modules/get-data.js";
import { createProductImage } from "./modules/create-product-image.js";
import { getStorageData } from "./modules/get-storage-data.js";
import { setStorageData } from "./modules/set-storage-data.js";
import { setApiPath } from "./modules/set-api-path.js";

createDynamicCart();

async function createDynamicCart() {
    const storedProducts = getStorageData();

    const cartProduct = await Promise.all(storedProducts.map(createCartProduct));
    appendCartProduct(cartProduct);

    handleRemoveButtons();
    handleQuantityInputs();
    setTotals();
    handleOrderForm();
}

async function createCartProduct(storedProduct) {
    const {id, color, quantity} = storedProduct;
    const productData = await getData(id);

    const productArticle = document.createElement("article");
    const productImageContainer = createProductImageContainer(productData);
    const productContent = createProductContent(productData, color, quantity);

    productArticle.classList.add("cart__item");
    productArticle.dataset.id = id;
    productArticle.dataset.color = color;
    productArticle.dataset.price = productData.price;
    productArticle.append(productImageContainer, productContent);

    return productArticle;
}

function createProductImageContainer(productData) {
    const productImageContainer = document.createElement("div");
    const productImage = createProductImage(productData);

    productImageContainer.classList.add("cart__item__img");
    productImageContainer.append(productImage);

    return productImageContainer;
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
    const productDescription = document.createElement("div");
    const productName = createProductName(productData);
    const productColor = createProductColor(color);
    const productPrice = createProductPrice(productData);

    productDescription.classList.add("cart__item__content__description");
    productDescription.append(productName, productColor, productPrice);

    return productDescription;
}

function createProductName({ name }) {
    const productName = document.createElement("h2");

    productName.textContent = name;

    return productName;
}

function createProductColor(color) {
    const productColor = document.createElement("p");

    productColor.textContent = color;

    return productColor;
}

function createProductPrice({ price }) {
    const productPrice = document.createElement("p");

    productPrice.textContent = `${price} €`;

    return productPrice;
}

function createProductSettings(quantity) {
    const productSettings = document.createElement("div");
    const productQuantityContainer = createProductQuantityContainer(quantity);
    const productDeleteContainer = createProductDeleteContainer();

    productSettings.classList.add("cart__item__content__settings");
    productSettings.append(productQuantityContainer, productDeleteContainer);

    return productSettings;
}

function createProductQuantityContainer(quantity) {
    const productQuantityContainer = document.createElement("div");
    const productQuantityText = document.createElement("p");
    const productQuantityInput = createQuantityInput(quantity);

    productQuantityContainer.classList.add("cart__item__content__settings__quantity");
    productQuantityText.textContent = "Qté : ";
    productQuantityContainer.append(productQuantityText, productQuantityInput);

    return productQuantityContainer;
}

function createQuantityInput(quantity) {
    const productQuantityInput = document.createElement("input");

    productQuantityInput.classList.add("itemQuantity");
    productQuantityInput.type = "number";
    productQuantityInput.name = "itemQuantity";
    productQuantityInput.min = "1";
    productQuantityInput.max = "100";
    productQuantityInput.value = quantity;

    return productQuantityInput;
}

function createProductDeleteContainer() {
    const productDeleteContainer = document.createElement("div");
    const productDeleteText = document.createElement("p");

    productDeleteContainer.classList.add("cart__item__content__settings__delete");
    productDeleteText.classList.add("deleteItem");
    productDeleteText.textContent = "Supprimer";
    productDeleteContainer.append(productDeleteText);

    return productDeleteContainer;
}

function appendCartProduct(cartProduct) {
    const productsContainer = document.querySelector("#cart__items");

    productsContainer.append(...cartProduct);
}

function handleRemoveButtons() {
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
    const cartProductId = cartProduct.dataset.id;
    const cartProductColor = cartProduct.dataset.color;
    const storedProducts = getStorageData();
    let updatedStorage = [];

    for (const storedProduct of storedProducts) {
        if (
            !(
                storedProduct.color === cartProductColor &&
                storedProduct.id === cartProductId
            )
        ) {
            updatedStorage.push(storedProduct);
        }
    }

    setStorageData(updatedStorage);
}

function handleQuantityInputs() {
    const quantityInputs = document.querySelectorAll(".itemQuantity");

    for (const quantityInput of quantityInputs) {
        quantityInput.addEventListener("change", function () {
            const updatedStorage = updateCartQuantity.call(this);

            setStorageData(updatedStorage);
        });
    }
}

function updateCartQuantity() {
    const cartProduct = this.closest("article");
    const cartProductId = cartProduct.dataset.id;
    const cartProductColor = cartProduct.dataset.color;
    const currentQuantity = this.getAttribute("value");
    const updatedQuantity = +this.value;
    const storedProducts = getStorageData();

    switch (true) {
        case updatedQuantity > 100:
            alert("Veuillez choisir une quantité inférieure à 100");
            this.value = currentQuantity;
            break;
        case updatedQuantity < 1:
            alert("Veuillez choisir une quantité supérieure à 0");
            this.value = currentQuantity;
            break;
        default:
            for (const storedProduct of storedProducts) {
                if (
                    storedProduct.id === cartProductId &&
                    storedProduct.color === cartProductColor
                ) {
                    storedProduct.quantity = updatedQuantity;
                    this.setAttribute("value", updatedQuantity.toString());
                    setTotals();
                    break;
                }
            }
    }

    return storedProducts;
}

function setTotals() {
    const quantityInputs = document.querySelectorAll(".itemQuantity");
    const totalQuantityElement = document.querySelector("#totalQuantity");
    const totalPriceElement = document.querySelector("#totalPrice");

    let totalCartQuantity = 0;
    let totalCartPrice = 0;

    for (const quantityInput of quantityInputs) {
        const productQuantity = +quantityInput.getAttribute("value");
        const productPrice = +quantityInput.closest("article").dataset.price;
        const totalProductPrice = productQuantity * productPrice;

        totalCartQuantity += productQuantity;
        totalCartPrice += totalProductPrice;
    }

    totalQuantityElement.textContent = totalCartQuantity.toString();
    totalPriceElement.textContent = totalCartPrice.toString();
}

function handleOrderForm() {
    const orderForm = document.forms[0];
    const inputElements = Array.from(orderForm.elements);
    const formFields = inputElements.filter(inputElement => inputElement.type !== "submit");

    orderForm.setAttribute("novalidate", true);

    checkCart(inputElements);
    checkValidityOnInput(formFields);
    checkValidtyOnSubmit(orderForm, formFields);
}

function checkCart(inputs) {
    for (let input of inputs) {
        input.addEventListener("focus", function() {
            const storedProducts = getStorageData();

            if (storedProducts.length === 0) {
                alert("Votre panier est vide");
                this.blur();
            }
        });
    }
}

function checkValidityOnInput(inputs) {
    for (let input of inputs) {
        input.addEventListener("input", function() {
            if (input.validity.valid) {
                input.nextElementSibling.textContent = "";
            } else {
                showInputError(input);
            }
        });
    }
}

function showInputError(input) {
    const inputError = input.nextElementSibling;

    switch (true) {
        case input.validity.valueMissing:
            inputError.textContent = "Ce champ est requis";
            break;
        case input.validity.typeMismatch:
            inputError.textContent = "Le format n'est pas valide";
            break;
    }
}

function checkValidtyOnSubmit(form, inputs) {
    form.addEventListener("submit", function(event) {
        let isFormValid = true;
        event.preventDefault();

        for (let input of inputs) {
            if (!input.validity.valid) {
                isFormValid = false;
                showInputError(input);
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
    window.location.href = `http://127.0.0.1:5500/front/html/confirmation.html?order=${orderId}`;
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
    try {
        const apiPath = setApiPath("order");

        const response = await fetch(apiPath, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
    
        const result = await response.json();

        if (!response.ok) {
            throw new Error(JSON.stringify(result));
        }  

        return result;
    } catch (error) {
        console.error(error);
    }
}
