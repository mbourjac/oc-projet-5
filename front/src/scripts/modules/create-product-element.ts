export function createProductElement<T extends keyof HTMLElementTagNameMap>(
  element: T,
  content: string,
  className?: string
): HTMLElementTagNameMap[T] {
  const productElement = document.createElement(element);

  if (className) productElement.classList.add(className);
  productElement.textContent = content;

  return productElement;
}
