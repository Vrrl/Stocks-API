import { Order } from '../../domain/order';

export interface IOrderQueryRepository {
  listByShareholderId(id: string): Promise<Order[]>;
  getByShareholderId(shareholderId: string, id?: string): Promise<Order | undefined>;
  getById(id: string): Promise<Order | undefined>;
}
