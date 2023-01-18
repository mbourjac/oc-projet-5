export function setApiEndpoint(path) {
    const baseUrl = new URL("http://localhost:3000/api/");

    return new URL(path, baseUrl);
}
