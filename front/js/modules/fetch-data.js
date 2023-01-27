import { setApiEndpoint } from "./set-api-endpoint.js";
import { redirectToNewPage } from "./redirect-to-new-page.js";

/**
 * Fetches data from an API endpoint.
 * @async
 * @param {string} resourcePath - The resource path for the API endpoint
 * @param {Object} options - The options for the fetch request.
 * @returns {Promise<Object>} - A promise that resolves to the data fetched from the API endpoint.
 * @throws {HttpError} - If the HTTP response status is not ok.
 * @throws {Error} - If an error unrelated to the HTTP response status occurred during the fetch request.
 */
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
            alert("Désolé, une erreur est survenue.")
            console.error(error);
        }

        redirectToNewPage("index.html");
    }
}

/**
 * Handles HTTP errors.
 * @param {Object} response - The HTTP response object.
 * @throws {NotFoundError} - If the HTTP response status is 404.
 * @throws {InternalServerError} - If the HTTP response status is 500.
 * @throws {HttpError} - If the HTTP response status is different than 404 or 500, and with the status text and status code as parameters.
 */
function handleHttpError(response) {
    switch (response.status) {
        case 404:
            throw new NotFoundError();
        case 500:
            throw new InternalServorError();
        default:
            throw new HttpError(response.statusText, response.status);
    }
}

/**
 * HttpError class represents an error that occurs while making an HTTP request.
 * @extends {Error}
 * @param {string} message - The error message.
 * @param {number} status - The HTTP status code of the error.
 */
class HttpError extends Error {
    constructor(message, status) {
        super(message);
        this.name = this.constructor.name;
        this.status = status;
    }
}

/**
 * NotFoundError class represents an error that occurs when a resource is not found.
 * @extends {HttpError}
 */
class NotFoundError extends HttpError {
    constructor() {
        super("Désolé, ce produit est introuvable.", 404);
    }
}

/**
 * InternalServerError class represents an error that occurs when a server error is encountered.
 * @extends {HttpError}
 */
class InternalServorError extends HttpError {
    constructor() {
        super("Désolé, nous rencontrons un problème avec le serveur.", 500);
    }
}
