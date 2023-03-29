export function setStorageData(storedProducts) {
    localStorage.setItem('storedProducts', JSON.stringify(storedProducts));
}
