import { OrderExpirationTypeEnum } from '@src/modules/order-management/domain/order-expiration-type-enum';
import { OrderTypeEnum } from './order-type-enum';
import { FinantialNumber } from '@src/core/domain/shared/finantial-number';

export interface Order {
  type: OrderTypeEnum;
  value: FinantialNumber;
  quantity: number;
  expirationType: OrderExpirationTypeEnum;
  expirationDate: Date | null;
}
