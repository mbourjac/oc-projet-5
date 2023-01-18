import { getStorageData } from "./get-storage-data.js";
import { isSameProduct } from "./is-same-product.js";

export function updateStorageData(id, color, quantity, addQuantity) {
    const storedProducts = getStorageData();
    const newProduct = { id, color, quantity };
    const updatedProducts = [];

    for (let storedProduct of storedProducts) {
        if (isSameProduct(newProduct, storedProduct)) {
            if (addQuantity) {
                addQuantity(newProduct, storedProduct);
            }
        } else {
            updatedProducts.push(storedProduct);
        }
    }

    updatedProducts.push(newProduct);

    return updatedProducts;
}
