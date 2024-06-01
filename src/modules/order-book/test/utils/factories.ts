import { Order } from '../../domain/order';
import { OrderExpirationTypeEnum } from '../../domain/order-expiration-type-enum';
import { OrderStatusEnum } from '../../domain/order-status-enum';
import { OrderTypeEnum } from '../../domain/order-type-enum';
import { faker } from '@faker-js/faker';

export function createRandomOrder(payload?: Partial<Order>) {
  const expirationType = payload?.expirationType ?? faker.helpers.enumValue(OrderExpirationTypeEnum);
  const expirationTimestamp = [OrderExpirationTypeEnum.DayOrder, OrderExpirationTypeEnum.GoodTillDate].includes(
    expirationType,
  )
    ? payload?.expirationTimestamp
      ? new Date(payload?.expirationTimestamp).valueOf()
      : new Date().valueOf()
    : null;

  return new Order({
    id: payload?.id ?? faker.string.uuid(),
    type: payload?.type ?? faker.helpers.enumValue(OrderTypeEnum),
    unitValue: payload?.unitValue ?? faker.number.int(),
    createdAtTimestamp: payload?.createdAtTimestamp ?? new Date().valueOf(),
    expirationTimestamp,
    expirationType,
    quantity: payload?.quantity ?? faker.number.int() * 100,
    status: payload?.status ?? OrderStatusEnum.Pending,
  });
}
