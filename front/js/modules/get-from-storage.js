export function getFromStorage() {
    let storedProducts = localStorage.getItem("storedProducts");
    
    if (storedProducts == null) {
        return [];
    } else {
        return JSON.parse(storedProducts);
    }
}