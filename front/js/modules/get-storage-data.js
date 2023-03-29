export function getStorageData() {
    const storedProducts = localStorage.getItem("storedProducts");
    if (storedProducts === null) {
        return [];
    }
    return JSON.parse(storedProducts);
}
