export function setApiPath(endpoint) {
    const basePath = "http://localhost:3000/api/products";

    if (!endpoint) {
        return basePath;
    }

    return `${basePath}/${endpoint}`;
}