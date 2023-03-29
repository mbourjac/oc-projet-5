import { setApiEndpoint } from "./set-api-endpoint.js";
import { navigateToPage } from "./navigate-to-page.js";

export async function fetchData(resourcePath, options) {
    try {
        const apiEndpoint = setApiEndpoint(resourcePath);
        const response = await fetch(apiEndpoint, options);

        if (!response.ok) {
            handleHttpError(response);
        }

        const data = await response.json();

        return data;
    } catch (error) {
        if (error instanceof HttpError) {
            alert(error.message);
            console.error(`${error.name}: status ${error.status}`);
        } else {
            alert("Désolé, une erreur est survenue.");
            console.error(error);
        }

        navigateToPage("index.html");
    }
}

function handleHttpError(response) {
    switch (response.status) {
        case NotFoundError.status:
            throw new NotFoundError();
        case InternalServorError.status:
            throw new InternalServorError();
        default:
            throw new HttpError(response.statusText, response.status);
    }
}

class HttpError extends Error {
    constructor(message, status) {
        super(message);
        this.name = this.constructor.name;
        this.status = status;
    }
}

class NotFoundError extends HttpError {
    constructor() {
        super("Désolé, ce produit est introuvable.", NotFoundError.status);
    }

    static status = 404;
}

class InternalServorError extends HttpError {
    constructor() {
        super("Désolé, nous rencontrons un problème avec le serveur.", InternalServorError.status);
    }

    static status = 500;
}
