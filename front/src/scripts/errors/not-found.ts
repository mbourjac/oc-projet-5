import { HttpError } from './http-error';

export class NotFoundError extends HttpError {
  static status = 404;

  constructor() {
    super('Désolé, ce produit est introuvable.', NotFoundError.status);
  }
}
