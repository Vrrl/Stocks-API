import { OrderBookMessage } from './order-book-message';

export interface OrderBookPullResponse {
  messages?: OrderBookMessage[];
}
