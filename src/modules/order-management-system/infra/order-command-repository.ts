import { Order } from '../domain/order';

export interface IOrderCommandRepository {
  // hardDeleteRequest(id: string): Promise<void>;
  // deleteRequest(id: string): Promise<void>;
  save(order: Order): Promise<void>;
}
