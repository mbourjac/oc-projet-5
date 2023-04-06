import { describe, it, expect } from 'vitest';
import { StorageProduct } from '../src/scripts/interfaces/storage-product';
import { replaceMatchedProduct } from '../src/scripts/modules/replace-matched-product';

describe('when a stored product is replaced with an updated one', () => {
  const storedProducts: StorageProduct[] = [
    {
      id: '034707184e8e4eefb46400b5a3774b5f',
      color: 'Red',
      quantity: 1,
    },
    { id: 'a557292fe5814ea2b15c6ef4bd73ed83', color: 'Pink', quantity: 2 },
    { id: '77711f0e466b4ddf953f677d30b0efc9', color: 'Navy', quantity: 4 },
  ];
  const updatedProduct: StorageProduct = {
    id: 'a557292fe5814ea2b15c6ef4bd73ed83',
    color: 'Pink',
    quantity: 5,
  };

  it('should return a new array with the updated product at the matching index', () => {
    const matchIndex = 1;
    const result = replaceMatchedProduct(
      storedProducts,
      updatedProduct,
      matchIndex
    );

    expect(result).toEqual([
      {
        id: '034707184e8e4eefb46400b5a3774b5f',
        color: 'Red',
        quantity: 1,
      },
      { id: 'a557292fe5814ea2b15c6ef4bd73ed83', color: 'Pink', quantity: 5 },
      { id: '77711f0e466b4ddf953f677d30b0efc9', color: 'Navy', quantity: 4 },
    ]);
    expect(result).not.toBe(storedProducts);
  });

  it('should not mutate the original array', () => {
    const matchIndex = 0;
    replaceMatchedProduct(storedProducts, updatedProduct, matchIndex);

    expect(storedProducts).toEqual([
      {
        id: '034707184e8e4eefb46400b5a3774b5f',
        color: 'Red',
        quantity: 1,
      },
      { id: 'a557292fe5814ea2b15c6ef4bd73ed83', color: 'Pink', quantity: 2 },
      { id: '77711f0e466b4ddf953f677d30b0efc9', color: 'Navy', quantity: 4 },
    ]);
  });
});
