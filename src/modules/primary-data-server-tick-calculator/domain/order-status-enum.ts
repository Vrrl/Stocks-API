import { z } from 'zod';

export enum OrderStatusEnum {
  Pending = 'Pending',
  PartiallyFilled = 'PartiallyFilled',
  Filled = 'Filled',
  Canceled = 'Canceled',
  Rejected = 'Rejected',
  Expired = 'Expired',
  Suspended = 'Suspended',
}

export const OrderStatusSchema = z.nativeEnum(OrderStatusEnum);
