import { getUrlParameter } from "./modules/get-url-parameter.js";

showDynamicOrderId();

function showDynamicOrderId() {
    const orderIdElement = document.querySelector("#orderId");
    const orderId = getUrlParameter("orderId");

    orderIdElement.textContent = orderId;
}
