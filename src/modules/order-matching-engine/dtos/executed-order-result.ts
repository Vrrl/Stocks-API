import { Order } from '../domain/order';
import { OrderExpirationTypeEnum } from '../domain/order-expiration-type-enum';
import { OrderStatusEnum } from '../domain/order-status-enum';
import { OrderTypeEnum } from '../domain/order-type-enum';

export type ProcessedOrder = {
  id: string;
  type: OrderTypeEnum;
  expirationType: OrderExpirationTypeEnum;
  executedShares: number;
  executedTotalValue: number;
  executedUnitValue: number;
  currentStatus: OrderStatusEnum;
  processedAtTimestamp: number;
};

export interface ExecutedOrdersResult {
  targetOrderExecuted?: ProcessedOrder;
  targetOrderMatches: ProcessedOrder[];
  expiredOrders: Order[];
}
