import { getData } from "./modules/get-data.js";
import { getStorageData } from "./modules/get-storage-data.js";
import { setStorageData } from "./modules/set-storage-data.js";

createDynamicCart();

async function createDynamicCart() {
    const storedProducts = getStorageData();

    await Promise.all(storedProducts.map(createCartItem));

    handleRemoveButtons();
    handleQuantityInputs();
    setTotals();
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
