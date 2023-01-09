export function saveStorage(storedProducts) {
    localStorage.setItem("storedProducts", JSON.stringify(storedProducts));
}