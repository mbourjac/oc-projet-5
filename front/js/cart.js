import { getData } from "./modules/get-data.js";
import { getStorageData } from "./modules/get-storage-data.js";
import { setStorageData } from "./modules/set-storage-data.js";
import { setApiPath } from "./modules/set-api-path.js";

createDynamicCart();

async function createDynamicCart() {
    const storedProducts = getStorageData();

    await Promise.all(storedProducts.map(createCartItem));

    handleRemoveButtons();
    handleQuantityInputs();
    setTotals();
    handleOrderForm();
}

async function createCartItem(storedProduct) {
    const productsContainer = document.querySelector("#cart__items");
    const productId = storedProduct.id;
    const productColor = storedProduct.color;
    const productQuantity = storedProduct.quantity;

    const productData = await getData(productId);

    productsContainer.innerHTML +=
        `<article class="cart__item" data-id="${productId}" data-color="${productColor}" data-price="${productData.price}">
            <div class="cart__item__img">
                <img src="${productData.imageUrl}" alt="${productData.altTxt}">
            </div>
            <div class="cart__item__content">
                <div class="cart__item__content__description">
                    <h2>${productData.name}</h2>
                    <p>${productColor}</p>
                    <p>${productData.price} €</p>
                </div>
                <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                        <p>Qté : </p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productQuantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                        <p class="deleteItem">Supprimer</p>
                    </div>
                </div>
            </div>
        </article>`;
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
