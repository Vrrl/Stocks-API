import { Order } from './order';
import { OrderExpirationTypeEnum } from './order-expiration-type-enum';
import { OrderTypeEnum } from './order-type-enum';
import { OrderProcessResultBuilder } from '../builders/order-process-result-builder';
import { OrderStatusEnum } from './order-status-enum';
import _ from 'lodash';
import { ExecutedOrderResult } from '../dtos/executed-order-result';
import { injectable } from 'inversify';

@injectable()
export class OrderBook {
  private orders: { [OrderTypeEnum.Buy]: Order[]; [OrderTypeEnum.Sell]: Order[] } = {
    [OrderTypeEnum.Buy]: [],
    [OrderTypeEnum.Sell]: [],
  };

  private getOppositeTypeOrders(type: OrderTypeEnum) {
    if (type === OrderTypeEnum.Buy) {
      return this.orders[OrderTypeEnum.Sell];
    } else {
      return this.orders[OrderTypeEnum.Buy];
    }
  }

  public addOrder(order: Order) {
    const ordersList = this.orders[order.type];
    ordersList.push(order);
    ordersList.sort((a, b) => b.unitValue - a.unitValue || a.createdAtTimestamp - b.createdAtTimestamp);
  }

  public removeOrder(order: Order) {
    const ordersList = this.orders[order.type];

    const targetIndex = ordersList.findIndex(x => x.id === order.id);

    if (targetIndex >= 0) {
      ordersList.splice(targetIndex, 1);
    }
  }

  public executeOrder(newOrder: Order): ExecutedOrderResult {
    const orderProcessResult = OrderProcessResultBuilder.createResultOf(newOrder);

    const oppositeTypeOrders = this.getOppositeTypeOrders(newOrder.type);
    let sharesToBeFilled = newOrder.shares;

    const matchedOrders: Order[] = [];

    for (const oppositeTypeOrder of oppositeTypeOrders) {
      if (
        oppositeTypeOrder.expirationTimestamp &&
        oppositeTypeOrder.expirationTimestamp < orderProcessResult.processedAtEpoch
      ) {
        oppositeTypeOrder.expire();
        this.removeOrder(oppositeTypeOrder);
        orderProcessResult.addRuntimeChangedOrder(oppositeTypeOrder);
        continue;
      }

      if (newOrder.type === OrderTypeEnum.Buy && newOrder.unitValue < oppositeTypeOrder.unitValue) {
        break;
      }

      if (newOrder.type === OrderTypeEnum.Sell && newOrder.unitValue > oppositeTypeOrder.unitValue) {
        break;
      }

      matchedOrders.push(oppositeTypeOrder);

      sharesToBeFilled = sharesToBeFilled > oppositeTypeOrder.shares ? sharesToBeFilled - oppositeTypeOrder.shares : 0;

      if (sharesToBeFilled === 0) {
        break;
      }
    }

    const matchedOrdersQuantities = _.sumBy(matchedOrders, matchedOrder => matchedOrder.shares);

    const willNewOrderBeFilled = matchedOrdersQuantities >= newOrder.shares;

    if (newOrder.expirationType !== OrderExpirationTypeEnum.FillOrKill || willNewOrderBeFilled) {
      for (const matchedOrder of matchedOrders) {
        const matchedOrderShares = Math.min(newOrder.shares, matchedOrder.shares);

        const matchedOrderValue = newOrder.type === OrderTypeEnum.Sell ? newOrder.unitValue : matchedOrder.unitValue;

        const orderMatchedStatus = orderProcessResult.addOrderMatch(
          matchedOrder,
          matchedOrderShares,
          matchedOrderValue,
        );

        if (orderMatchedStatus === OrderStatusEnum.PartiallyFilled) {
          matchedOrder.partiallyExecute(matchedOrderShares);
        } else {
          this.removeOrder(matchedOrder);
        }
      }

      const remainingNewOrder = orderProcessResult.getRemainingExecutedOrder();

      if (remainingNewOrder) {
        this.addOrder(remainingNewOrder);
      }
    }

    return orderProcessResult.getResult();
  }
}
