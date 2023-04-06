import { describe, it, expect } from 'vitest';
import {
  isSameProduct,
  ProductIdentifier,
} from '../src/scripts/modules/is-same-product';

describe('when two stored products are compared', () => {
  const firstProduct: ProductIdentifier = {
    id: 'a557292fe5814ea2b15c6ef4bd73ed83',
    color: 'Pink',
  };

  it('should match products with same id and color', () => {
    const secondProduct: ProductIdentifier = {
      id: 'a557292fe5814ea2b15c6ef4bd73ed83',
      color: 'Pink',
    };
    const match = isSameProduct(firstProduct, secondProduct);

    expect(match).toBe(true);
  });

  it('should not match products with different ids', () => {
    const secondProduct: ProductIdentifier = {
      id: 'a6ec5b49bd164d7fbe10f37b6363f9fb',
      color: 'Pink',
    };
    const match = isSameProduct(firstProduct, secondProduct);

    expect(match).toBe(false);
  });

  it('should not match products with different colors', () => {
    const secondProduct: ProductIdentifier = {
      id: 'a557292fe5814ea2b15c6ef4bd73ed83',
      color: 'White',
    };
    const match = isSameProduct(firstProduct, secondProduct);

    expect(match).toBe(false);
  });

  it('should not match products with different ids and colors', () => {
    // FIXME
    const secondProduct: ProductIdentifier = {
      id: '77711f0e466b4ddf953f677d30b0efc9',
      color: 'Navy',
    };
    const match = isSameProduct(firstProduct, secondProduct);

    expect(match).toBe(false);
  });
});
