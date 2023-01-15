export async function getData(endpoint) {
    try {
        const apiPath = setApiPath(endpoint);
        const response = await fetch(apiPath);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(JSON.stringify(data));
        }  

        return data;
    } catch (error) {
        console.error(error);
        alert("Une erreur est survenue");
        redirectToHomepage();
    }
}

function setApiPath(endpoint) {
    const basePath = "http://localhost:3000/api/products";

    if (!endpoint) {
        return basePath;
    }

    return basePath + "/" + endpoint;
}

function redirectToHomepage() {
    const homepageUrl = setHomepageUrl();
    window.location.href = homepageUrl;
}

function setHomepageUrl() {
    const currentUrl = new URL(document.location);
    const urlOrigin = currentUrl.origin;
    const homepagePath = "/front/html/index.html";

    return urlOrigin + homepagePath;
}
