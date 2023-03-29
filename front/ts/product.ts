import { fetchData } from './modules/fetch-data.js';
import { getUrlParameter } from './modules/get-url-parameter.js';
import { createProductImage } from './modules/create-product-image.js';
import { alertQuantityError } from './modules/alert-quantity-error.js';
import { getStorageData } from './modules/get-storage-data.js';
import { setStorageData } from './modules/set-storage-data.js';
import { getMatchIndex } from './modules/get-match-index.js';
import { replaceMatchedProduct } from './modules/replace-matched-product.js';

createDynamicContent();

async function createDynamicContent() {
	const productId = getUrlParameter('id');
	const productData = await fetchData(`products/${productId}`);

	setPageTitle(productData);
	populateProductItem(productData);
	handleQuantityInput();
	handleCartButton(productData);
}

/**
 * Sets the title of the page with the name of the product.
 * @param {Object} productData - The data of the product.
 * @param {string} productData.name - The name of the product.
 */
function setPageTitle({ name }) {
	const pageTitle = document.querySelector('title');

	pageTitle.textContent = name;
}

/**
 * Populates the product item with the data provided.
 * @param {Object} productData - The data of the product to be displayed.
 */
function populateProductItem(productData) {
	const productContainer = document.querySelector('.item__img');
	const productImage = createProductImage(productData);
	productContainer.append(productImage);

	setProductInformation(productData);
	appendColorOptions(productData);
}

/**
 * Sets the text content of the name, price and description elements.
 * @param {Object} productData - The product data.
 * @param {string} productData.name - The name of the product.
 * @param {string} productData.price - The price of the product.
 * @param {string} productData.description - The description of the product.
 */
function setProductInformation({ name, price, description }) {
	const productTitle = document.querySelector('#title');
	const productPrice = document.querySelector('#price');
	const productDescription = document.querySelector('#description');

	productTitle.textContent = name;
	productPrice.textContent = price;
	productDescription.textContent = description;
}

function appendColorOptions({ colors }) {
	const colorsSelect = document.querySelector('#colors');
	const colorOptions = colors.map(createColorOption);

	colorsSelect.append(...colorOptions);
}

function createColorOption(color) {
	const colorOption = document.createElement('option');

	colorOption.setAttribute('value', color);
	colorOption.textContent = color;

	return colorOption;
}

function handleQuantityInput() {
	const quantityInput = document.querySelector('#quantity');

	quantityInput.required = true;

	quantityInput.addEventListener('change', function () {
		if (!this.validity.valid) {
			alertQuantityError(this);
			this.value = '0';
		}
	});
}

function handleCartButton({ name }) {
	const cartButton = document.querySelector('#addToCart');

	cartButton.addEventListener('click', function () {
		const colorsSelect = document.querySelector('#colors');
		const quantityInput = document.querySelector('#quantity');
		const color = colorsSelect.value;
		const quantity = +quantityInput.value;
		const errorMessage = checkSubmitErrors(color, quantity);

		if (errorMessage) {
			alert(errorMessage);
		} else {
			addToCart(color, quantity);
			alertAddedProduct({ name, color, quantity });
		}
	});
}

function checkSubmitErrors(color, quantity) {
	switch (true) {
		case color === '' && quantity === 0:
			return 'Veuillez choisir une couleur et renseigner la quantité.';
		case color === '':
			return 'Veuillez choisir une couleur.';
		case quantity === 0:
			return 'Veuillez renseigner la quantité.';
		default:
			return null;
	}
}

function addToCart(color, quantity) {
	const id = getUrlParameter('id');
	const updatedStorage = addToStorage({ id, color, quantity });

	setStorageData(updatedStorage);
}

function addToStorage(chosenProduct) {
	const storedProducts = getStorageData();
	const matchIndex = getMatchIndex(storedProducts, chosenProduct);

	if (matchIndex !== -1) {
		const storedProduct = storedProducts[matchIndex];
		const updatedProduct = {
			...chosenProduct,
			quantity: chosenProduct.quantity + storedProduct.quantity,
		};

		return replaceMatchedProduct(
			storedProducts,
			updatedProduct,
			matchIndex
		);
	}

	return [...storedProducts, chosenProduct];
}

function alertAddedProduct({ name, color, quantity }) {
	const addedMessage = `Le ${name} ${color} a bien été ajouté au panier en ${quantity} exemplaire.`;

	if (quantity === 1) {
		alert(addedMessage);
	} else {
		alert(addedMessage.replace('.', 's.'));
	}
}
