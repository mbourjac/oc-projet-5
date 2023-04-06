import { StorageProduct } from '../interfaces/storage-product';

export type ProductIdentifier = Pick<StorageProduct, 'id' | 'color'>;

export function isSameProduct(
  firstProduct: ProductIdentifier,
  secondProduct: ProductIdentifier
): boolean {
  return (
    firstProduct.id === secondProduct.id &&
    firstProduct.color === secondProduct.color
  );
}
