import { describe, it, expect } from 'vitest';
import { createProductElement } from '../src/scripts/modules/create-product-element';

describe('when creating a product element', () => {
  it('should return an HTMLElement', () => {
    const element = createProductElement('h2', 'Kanap Calycé');

    expect(element).toBeInstanceOf(HTMLElement);
  });

  it('should create an element of the provided type', () => {
    const element = createProductElement('h2', 'Kanap Calycé');

    expect(element.tagName.toLowerCase()).toBe('h2');
    expect(element).toBeInstanceOf(HTMLHeadingElement); // FIXME
  });

  it('should create an element with the provided content', () => {
    const element = createProductElement('h2', 'Kanap Calycé');

    expect(element.textContent).toBe('Kanap Calycé');
  });

  it('should add a class name if one is provided', () => {
    const element = createProductElement('h2', 'Kanap Calycé', 'product__name');

    expect(element.classList.contains('product__name')).toBe(true);
  });
});
