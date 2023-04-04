export function createProductElement(element, content, className) {
  const productElement = document.createElement(element);

  if (className) {
    productElement.classList.add(className);
  }

  productElement.textContent = content;

  return productElement;
}
