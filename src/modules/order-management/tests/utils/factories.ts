import { Order } from '../../domain/order';
import { OrderExpirationTypeEnum } from '../../domain/order-expiration-type-enum';
import { OrderStatusEnum } from '../../domain/order-status-enum';
import { OrderTypeEnum } from '../../domain/order-type-enum';
import { faker } from '@faker-js/faker';

export function createRandomOrder(payload?: Partial<Parameters<typeof Order.createFromPrimitive>[0]>) {
  const expirationType = payload?.expirationType ?? faker.helpers.enumValue(OrderExpirationTypeEnum);
  const expirationDate = [OrderExpirationTypeEnum.DayOrder, OrderExpirationTypeEnum.GoodTillDate].includes(
    expirationType,
  )
    ? payload?.expirationDate
      ? new Date(payload.expirationDate).toISOString()
      : new Date().toISOString()
    : null;

  return Order.createFromPrimitive({
    shareholderId: payload?.shareholderId ?? faker.string.uuid(),
    status: payload?.status ?? OrderStatusEnum.Pending,
    type: payload?.type ?? faker.helpers.enumValue(OrderTypeEnum),
    unitValue: payload?.unitValue ?? faker.number.int({ min: 1, max: 1000 }),
    shares: payload?.shares ?? faker.number.int({ min: 1, max: 1000 }),
    expirationType,
    expirationDate,
    createdAtDate: payload?.createdAtDate ?? new Date().toISOString(),
    hasPendingEdition: payload?.hasPendingEdition ?? false,
    hasPendingCancelation: payload?.hasPendingCancelation ?? false,
  });
}
