import { setApiEndpoint } from "./set-api-endpoint.js";
import { redirectToNewPage } from "./redirect-to-new-page.js";

export async function fetchData(path, options) {
    try {
        const apiEndpoint = setApiEndpoint(path);
        const response = await fetch(apiEndpoint, options);

        if (!response.ok) {
            handleError(response);
        }

        const data = await response.json();

        return data;
    } catch (error) {
        alert("Une erreur est survenue.");
        console.error(error);
        redirectToNewPage("index.html");
    }
}

function handleError(response) {
    switch(response.status) {
        case 404:
            throw new Error("Not Found: The requested resource could not be found.");
        case 500:
            throw new Error("Internal Server Error: There was a problem with the server.");
        default:
            throw new Error(`HTTP error! status: ${response.status}`);
    }
}
