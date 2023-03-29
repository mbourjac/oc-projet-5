import { getUrlParameter } from './modules/get-url-parameter.js';
displayOrderId();
function displayOrderId() {
    const orderIdElement = document.querySelector('#orderId');
    const orderId = getUrlParameter('orderId');
    orderIdElement.textContent = orderId;
}
