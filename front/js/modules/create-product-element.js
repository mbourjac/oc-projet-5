export function createProductElement(element, content, className) {
    const productElement = document.createElement(element);

    if (className !== undefined) {
        productElement.classList.add(className);
    }

    productElement.textContent = content;

    return productElement;
}