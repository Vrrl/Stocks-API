import { OrderExpirationTypeEnum } from '../domain/order-expiration-type-enum';
import { OrderStatusEnum } from '../domain/order-status-enum';
import { OrderTypeEnum } from '../domain/order-type-enum';

type ExecutedOrder = {
  id: string;
  type: OrderTypeEnum;
  expirationType: OrderExpirationTypeEnum;
  shares: number;
  totalValue: number;
  status: OrderStatusEnum;
};

export interface ExecutedOrderResult {
  executedOrder: ExecutedOrder;
  executedOrderMatches: ExecutedOrder[];
  processedAtEpoch: number;
}
