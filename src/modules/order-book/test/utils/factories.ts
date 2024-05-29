import { Order } from '../../domain/order';
import { OrderExpirationTypeEnum } from '../../dtos/order-expiration-type-enum';
import { OrderTypeEnum } from '../../dtos/order-type-enum';
import { faker } from '@faker-js/faker';

export function createRandomOrder(payload?: Partial<Order>) {
  const expirationType = payload?.expirationType ?? faker.helpers.enumValue(OrderExpirationTypeEnum);
  const expirationDate = [OrderExpirationTypeEnum.DayOrder, OrderExpirationTypeEnum.GoodTillDate].includes(
    expirationType,
  )
    ? payload?.expirationDate
      ? new Date(payload?.expirationDate)
      : new Date()
    : null;

  return {
    id: payload?.id ?? faker.string.uuid(),
    type: payload?.type ?? faker.helpers.enumValue(OrderTypeEnum),
    value: payload?.value ?? faker.number.int(),
    createdAtEpoch: payload?.createdAtEpoch ?? new Date().valueOf(),
    expirationDate: expirationDate,
    expirationEpoch: expirationDate?.valueOf() ?? null,
    expirationType,
    quantity: payload?.quantity ?? faker.number.int() * 100,
  } as Order;
}
