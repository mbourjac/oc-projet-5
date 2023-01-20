export function redirectToNewPage(path, parametersObject) {
    const newPageUrl = setNewPageUrl(path, parametersObject);
    
    window.location.assign(newPageUrl);
}

function setNewPageUrl(path, parametersObject) {
    const baseUrl = new URL("/front/html/", window.location.href);
    const newPageUrl = new URL(path, baseUrl);

    if (parametersObject) {
        for (const [key, value] of Object.entries(parametersObject)) {
            newPageUrl.searchParams.set(key, value);
        }
    }

    return newPageUrl;
}
