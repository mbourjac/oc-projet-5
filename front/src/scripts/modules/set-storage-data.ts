import { StorageProduct } from '../interfaces/storage-product';

export function setStorageData(storedProducts: StorageProduct[]): void {
  localStorage.setItem('storedProducts', JSON.stringify(storedProducts));
}
