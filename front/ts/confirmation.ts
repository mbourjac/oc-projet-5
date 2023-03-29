import { getUrlParameter } from "./modules/get-url-parameter.js";

displayOrderId();

/**
 * Displays the order ID on the page.
 */
function displayOrderId() {
    const orderIdElement = document.querySelector("#orderId");
    const orderId = getUrlParameter("orderId");

    orderIdElement.textContent = orderId;
}
