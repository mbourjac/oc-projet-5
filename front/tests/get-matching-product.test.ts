import { describe, it, expect } from 'vitest';
import { StorageProduct } from '../src/scripts/interfaces/storage-product';
import { getMatchingProduct } from '../src/scripts/modules/get-matching-product';

describe('when searching for a matching stored product', () => {
  const storedProducts: StorageProduct[] = [
    {
      id: 'a557292fe5814ea2b15c6ef4bd73ed83',
      color: 'Pink',
      quantity: 2,
    },
    {
      id: '77711f0e466b4ddf953f677d30b0efc9',
      color: 'Navy',
      quantity: 1,
    },
    {
      id: '034707184e8e4eefb46400b5a3774b5f',
      color: 'Red',
      quantity: 3,
    },
  ];

  it('should return the matching index and product when the product is found', () => {
    const newProduct: StorageProduct = {
      id: 'a557292fe5814ea2b15c6ef4bd73ed83',
      color: 'Pink',
      quantity: 1,
    };
    const result = getMatchingProduct(storedProducts, newProduct);

    expect(result.matchingIndex).toBe(0);
    expect(result.matchingProduct).toEqual(storedProducts[0]);
  });

  it('should return -1 as matching index and undefined as matching product when the product is not found', () => {
    const newProduct: StorageProduct = {
      id: '055743915a544fde83cfdfc904935ee7',
      color: 'Green',
      quantity: 2,
    };
    const result = getMatchingProduct(storedProducts, newProduct);

    expect(result.matchingIndex).toBe(-1);
    expect(result.matchingProduct).toBeUndefined();
  });
});
