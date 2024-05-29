import { OrderExpirationTypeEnum } from '../dtos/order-expiration-type-enum';
import { OrderStatusEnum } from '../dtos/order-status-enum';
import { OrderTypeEnum } from '../dtos/order-type-enum';

export class Order {
  id: string;
  type: OrderTypeEnum;
  value: number;
  quantity: number;
  status: OrderStatusEnum;
  createdAtEpoch: number;
  expirationType: OrderExpirationTypeEnum;
  expirationDate: Date | null;
  expirationEpoch: number | null;
}
