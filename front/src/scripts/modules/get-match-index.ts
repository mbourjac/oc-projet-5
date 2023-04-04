import { isSameProduct } from './is-same-product.js';

export function getMatchIndex(storedProducts, newProduct) {
  return storedProducts.findIndex((storedProduct) =>
    isSameProduct(storedProduct, newProduct)
  );
}
