import { StorageProduct } from '../interfaces/storage-product';
import { isSameProduct } from './is-same-product';

export function getMatchingProduct(
  storedProducts: StorageProduct[],
  newProduct: StorageProduct
): {
  matchingIndex: number;
  matchingProduct: StorageProduct | undefined;
} {
  const matchingIndex = storedProducts.findIndex((storedProduct) =>
    isSameProduct(storedProduct, newProduct)
  );

  const matchingProduct =
    matchingIndex !== -1 ? storedProducts[matchingIndex] : undefined;

  return {
    matchingIndex,
    matchingProduct,
  };
}
