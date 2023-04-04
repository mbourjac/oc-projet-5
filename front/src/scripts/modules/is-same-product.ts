export function isSameProduct(firstProduct, secondProduct) {
  return (
    firstProduct.id === secondProduct.id &&
    firstProduct.color === secondProduct.color
  );
}
