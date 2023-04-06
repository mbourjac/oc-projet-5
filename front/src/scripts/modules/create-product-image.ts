import { Product } from '../interfaces/product';

export function createProductImage({
  imageUrl,
  altTxt,
}: Product): HTMLImageElement {
  const productImage = document.createElement('img');

  productImage.src = imageUrl;
  productImage.alt = altTxt;

  return productImage;
}
