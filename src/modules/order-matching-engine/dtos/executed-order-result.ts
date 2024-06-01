import { OrderExpirationTypeEnum } from '../domain/order-expiration-type-enum';
import { OrderStatusEnum } from '../domain/order-status-enum';
import { OrderTypeEnum } from '../domain/order-type-enum';

type ProcessedOrder = {
  id: string;
  type: OrderTypeEnum;
  expirationType: OrderExpirationTypeEnum;
  shares: number;
  totalValue: number;
  unitValue: number;
  status: OrderStatusEnum;
};

export interface ExecutedOrderResult {
  executedOrder: ProcessedOrder;
  executedOrderMatches: ProcessedOrder[];
  runtimeChangedOrders: ProcessedOrder[];
  processedAtEpoch: number;
}
