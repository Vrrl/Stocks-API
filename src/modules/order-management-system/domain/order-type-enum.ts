import { z } from 'zod';

export enum OrderTypeEnum {
  Buy = 'Buy',
  Sell = 'Sell',
}

export const OrderTypeSchema = z.nativeEnum(OrderTypeEnum);
