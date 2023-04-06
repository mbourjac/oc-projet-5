import { OrderBody } from './order-body';

export interface Order extends OrderBody {
  orderId: string;
}
