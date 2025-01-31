import 'reflect-metadata';
import { describe, expect, it } from 'vitest';
import { Order } from './order';
import { OrderStatusEnum } from './order-status-enum';
import { OrderTypeEnum } from './order-type-enum';
import { OrderExpirationTypeEnum } from './order-expiration-type-enum';
import moment from 'moment';
import { CoreErrors } from '@src/core/errors';
import { createRandomOrder } from '../tests/utils/factories';

describe('Order Domain', () => {
  const testDate = new Date();

  describe('createFromPrimitive method', () => {
    it('@ai-generated should create a valid Order instance from primitive values', () => {
      const order = Order.createFromPrimitive({
        shareholderId: '123',
        status: OrderStatusEnum.Pending,
        type: OrderTypeEnum.Buy,
        unitValue: 100,
        shares: 10,
        expirationType: OrderExpirationTypeEnum.GoodTillCancelled,
        expirationDate: null,
        createdAtDate: testDate.toISOString(),
        filledAtDate: null,
        hasPendingEdition: false,
        hasPendingCancelation: false,
      });

      expect(order).toBeInstanceOf(Order);
      expect(order.id).toBeDefined();
      expect(order.props.shareholderId).toBe('123');
      expect(order.props.status).toBe(OrderStatusEnum.Pending);
      expect(order.props.type).toBe(OrderTypeEnum.Buy);
      expect(order.props.unitValue.value).toBe(100);
      expect(order.props.shares).toBe(10);
      expect(order.props.expirationType).toBe(OrderExpirationTypeEnum.GoodTillCancelled);
      expect(order.props.expirationDate).toBeNull();
      expect(order.props.createdAtDate).toEqual(new Date(testDate.toISOString()));
      expect(order.props.filledAtDate).toBeNull();
      expect(order.props.hasPendingEdition).toBe(false);
      expect(order.props.hasPendingCancelation).toBe(false);
    });
  });

  describe('validation', () => {
    it('@ai-generated should throw error when expirationDate is before creationDate', () => {
      const creationDate = new Date();
      const expirationDate = moment(creationDate).subtract(1, 'day').toDate();

      expect(() =>
        createRandomOrder({
          expirationType: OrderExpirationTypeEnum.GoodTillDate,
          expirationDate: expirationDate.toISOString(),
          createdAtDate: creationDate.toISOString(),
        }),
      ).toThrowError(CoreErrors.InvalidPropsError);
    });

    it('@ai-generated should throw error when DayOrder expiration is not in same day', () => {
      const creationDate = new Date();
      const expirationDate = moment(creationDate).add(1, 'day').toDate();

      expect(() =>
        createRandomOrder({
          expirationType: OrderExpirationTypeEnum.DayOrder,
          expirationDate: expirationDate.toISOString(),
          createdAtDate: creationDate.toISOString(),
        }),
      ).toThrowError(CoreErrors.InvalidPropsError);
    });
  });

  describe('status changes', () => {
    it('@ai-generated should mark order as expired', () => {
      const order = createRandomOrder();

      order.markAsExpired();
      expect(order.toJson().status).toEqual(OrderStatusEnum.Expired);
    });

    it('@ai-generated should mark order as filled', () => {
      const order = createRandomOrder();

      order.markAsFilled(OrderStatusEnum.Filled);
      expect(order.toJson().status).toEqual(OrderStatusEnum.Filled);
    });
  });

  describe('pending states', () => {
    it('@ai-generated should mark and confirm pending cancelation', () => {
      const order = createRandomOrder();

      order.markAsPendingCancelation();
      expect(order.toJson().hasPendingCancelation).toBe(true);

      order.confirmPendingCancelation();
      expect(order.toJson().hasPendingCancelation).toBe(false);
      expect(order.toJson().status).toEqual(OrderStatusEnum.Canceled);
    });

    it('@ai-generated should throw error when confirming cancelation without pending state', () => {
      const order = createRandomOrder();

      expect(() => order.confirmPendingCancelation()).toThrowError(CoreErrors.UseCaseError);
    });
  });

  describe('updates', () => {
    it('@ai-generated should update expiration date', () => {
      const expirationDate = moment(testDate).add(1, 'day').toDate();

      const order = createRandomOrder({
        expirationType: OrderExpirationTypeEnum.GoodTillDate,
        expirationDate: expirationDate.toISOString(),
        createdAtDate: testDate.toISOString(),
      });

      const newExpirationDate = moment(testDate).add(1, 'day').toDate();
      order.updateExpirationDate(newExpirationDate);
      expect(order.toJson().expirationDate).toEqual(newExpirationDate.toISOString());
    });

    it('@ai-generated should update shares', () => {
      const order = createRandomOrder();

      order.updateShares(20);
      expect(order.toJson().shares).toEqual(20);
    });
  });
});
