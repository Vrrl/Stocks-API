import { Order } from '../../domain/order';

export interface IOrderQueryRepository {
  listByInvestorId(id: string): Promise<Order[]>;
}
