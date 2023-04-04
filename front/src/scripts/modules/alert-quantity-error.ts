export function alertQuantityError(input) {
  switch (true) {
    case input.validity.valueMissing:
      alert('Veuillez renseigner la quantité.');
      break;
    case input.validity.badInput:
      alert('Veuillez saisir un nombre.');
      break;
    case input.validity.rangeOverflow:
      alert('Veuillez choisir une quantité inférieure ou égale à 100.');
      break;
    case input.validity.rangeUnderflow:
      alert('Veuillez choisir une quantité supérieure à 0.');
      break;
  }
}
