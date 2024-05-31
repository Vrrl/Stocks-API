import { z } from 'zod';

export enum OrderExpirationTypeEnum {
  DayOrder = 'DayOrder',
  GoodTillDate = 'GoodTillDate',
  // AllOrNone = 'AllOrNone', Currently not supported as this implies the need of matching orders already existing in the book
  FillOrKill = 'FillOrKill',
  GoodTillCancelled = 'GoodTillCancelled',
}

export const OrderExpirationTypeSchema = z.nativeEnum(OrderExpirationTypeEnum);
