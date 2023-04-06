import { describe, it, expect } from 'vitest';
import { Product } from '../src/scripts/interfaces/product';
import { createProductImage } from '../src/scripts/modules/create-product-image';

describe('when creating a product image', () => {
  const product: Product = {
    colors: ['Pink', 'White'],
    _id: 'a557292fe5814ea2b15c6ef4bd73ed83',
    name: 'Kanap Autonoé',
    price: 1499,
    imageUrl: 'http://kanap/images/kanap04.jpeg',
    description: 'Donec mattis nisl tortor.',
    altTxt: "Photo d'un canapé rose, une à deux place",
  };
  const productImage = createProductImage(product);

  it('should create an image element', () => {
    expect(productImage).toBeInstanceOf(HTMLImageElement);
  });

  it('should set the src attribute with the provided url', () => {
    expect(productImage.src).toEqual(product.imageUrl);
  });

  it('should set the alt attribute with the provided text', () => {
    expect(productImage.alt).toEqual(product.altTxt);
  });
});
