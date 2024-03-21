import { z } from 'zod';

export enum OrderStatusEnum {
  Pending = 'Pending',
  Filled = 'Filled',
  Cancelled = 'Cancelled',
  PartiallyFilled = 'PartiallyFilled',
}

export const OrderStatusSchema = z.nativeEnum(OrderStatusEnum);
