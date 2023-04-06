import { StorageProduct } from '../interfaces/storage-product';

export function getStorageData(): StorageProduct[] {
  const storedProducts = localStorage.getItem('storedProducts');

  if (storedProducts === null) {
    return [];
  }

  return JSON.parse(storedProducts);
}
