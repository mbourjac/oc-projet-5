export function getStorageData() {
    let storedProducts = localStorage.getItem("storedProducts");
    
    if (storedProducts == null) {
        return [];
    } else {
        return JSON.parse(storedProducts);
    }
}