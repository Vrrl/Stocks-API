import { Order } from '../domain/order';

export interface OrderBookMessage {
  id: string;
  type: string;
  order: Order;
}
