import { HttpError } from './http-error';

export class InternalServorError extends HttpError {
  static status = 500;

  constructor() {
    super(
      'Désolé, nous rencontrons un problème avec le serveur.',
      InternalServorError.status
    );
  }
}
