import { OrderBookPullResponse } from '../../dtos/order-book-pull-response';

export interface IQueueClient {
  deleteOrderBookMessage(id: string): Promise<void>;
  pullOrderBookMessages(): Promise<OrderBookPullResponse>;
}
