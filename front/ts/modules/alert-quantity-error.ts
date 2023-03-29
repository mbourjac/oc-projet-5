/**
 * Alerts the user of any errors with the quantity input field.
 * @param {HTMLInputElement} input - The input element being checked for validity.
 */
export function alertQuantityError(input) {
    switch (true) {
        case input.validity.valueMissing:
            alert("Veuillez renseigner la quantité.");
            break;
        case input.validity.badInput:
            alert("Veuillez saisir un nombre.");
            break;
        case input.validity.rangeOverflow:
            alert("Veuillez choisir une quantité inférieure ou égale à 100.");
            break;
        case input.validity.rangeUnderflow:
            alert("Veuillez choisir une quantité supérieure à 0.");
            break;
    }
}
