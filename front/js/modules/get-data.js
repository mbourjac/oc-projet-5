import { setApiEndpoint } from "./set-api-endpoint.js";
import { redirectToNewPage } from "./redirect-to-new-page.js";

export async function getData(path) {
    try {
        const apiEndpoint = setApiEndpoint(path);
        const response = await fetch(apiEndpoint);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(JSON.stringify(data));
        }  

        return data;
    } catch (error) {
        console.error(error);
        alert("Une erreur est survenue");
        redirectToNewPage("index.html");
    }
}
