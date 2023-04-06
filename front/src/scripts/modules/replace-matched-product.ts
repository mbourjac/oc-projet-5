import { StorageProduct } from '../interfaces/storage-product';

export function replaceMatchedProduct(
  storedProducts: StorageProduct[],
  updatedProduct: StorageProduct,
  matchIndex: number
): StorageProduct[] {
  return [
    ...storedProducts.slice(0, matchIndex),
    updatedProduct,
    ...storedProducts.slice(matchIndex + 1),
  ];
}
