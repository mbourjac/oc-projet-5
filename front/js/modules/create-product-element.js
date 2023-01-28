/**
 * Creates an HTML element with specified content and class.
 * @param {string} element - The type of HTML element to create.
 * @param {string} content - The text content of the created element.
 * @param {string} [className] - The class name to be added to the element.
 * @returns {HTMLElement} The created HTML element.
 */
export function createProductElement(element, content, className) {
    const productElement = document.createElement(element);

    if (className) {
        productElement.classList.add(className);
    }

    productElement.textContent = content;

    return productElement;
}
