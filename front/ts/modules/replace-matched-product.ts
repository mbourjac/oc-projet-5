export function replaceMatchedProduct(
	storedProducts,
	updatedProduct,
	matchIndex
) {
	return [
		...storedProducts.slice(0, matchIndex),
		updatedProduct,
		...storedProducts.slice(matchIndex + 1),
	];
}
