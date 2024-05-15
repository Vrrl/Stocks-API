import { z } from 'zod';

export enum OrderExpirationTypeEnum {
  DayOrder = 'DayOrder',
  GoodTillDate = 'GoodTillDate',
  AllOrNone = 'AllOrNone',
  FillOrKill = 'FillOrKill',
  GoodTillCancelled = 'GoodTillCancelled',
}

export const OrderExpirationTypeSchema = z.nativeEnum(OrderExpirationTypeEnum);
