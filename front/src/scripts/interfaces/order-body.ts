import { Contact } from './contact';

export interface OrderBody {
  contact: Contact;
  products: string[];
}
