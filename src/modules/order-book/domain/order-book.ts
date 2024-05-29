import { Order } from './order';
import { OrderExpirationTypeEnum } from '../dtos/order-expiration-type-enum';
import { OrderTypeEnum } from '../dtos/order-type-enum';
import { ExecutionOrderResult } from '../dtos/execution-order-result';
import { OrderStatusEnum } from '../dtos/order-status-enum';
import _ from 'lodash';

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
    ordersList.sort((a, b) => b.value - a.value || a.createdAtEpoch - b.createdAtEpoch);
  }

  public executeOrder(newOrder: Order): ExecutionOrderResult {
    const executionTimeEpoch = new Date().valueOf();
    const oppositeTypeOrders = this.getOppositeTypeOrders(newOrder.type);
    let quantityToBeFilled = newOrder.quantity;

    const matchedOrders: Order[] = [];

    for (const oppositeTypeOrder of oppositeTypeOrders) {
      if (oppositeTypeOrder.expirationEpoch && oppositeTypeOrder.expirationEpoch < executionTimeEpoch) {
        this.removeOrder(oppositeTypeOrder);
        continue;
      }

      if (newOrder.type === OrderTypeEnum.Buy && newOrder.value < oppositeTypeOrder.value) {
        break;
      }

      if (newOrder.type === OrderTypeEnum.Sell && newOrder.value > oppositeTypeOrder.value) {
        break;
      }

      matchedOrders.push(oppositeTypeOrder);

      quantityToBeFilled =
        quantityToBeFilled > oppositeTypeOrder.quantity ? quantityToBeFilled - oppositeTypeOrder.quantity : 0;

      if (quantityToBeFilled === 0) {
        break;
      }
    }

    const executedOrderMatches: Order[] = [];

    const matchedOrdersQuantities = _.sumBy(matchedOrders, matchedOrder => matchedOrder.quantity);

    const isNewOrderFilled = matchedOrdersQuantities >= newOrder.quantity;

    if (newOrder.expirationType === OrderExpirationTypeEnum.FillOrKill && !isNewOrderFilled) {
      newOrder.status = OrderStatusEnum.Canceled;
    } else {
      for (const matchedOrder of matchedOrders) {
        const matchedOrderQuantitiesAfter =
          newOrder.quantity < matchedOrder.quantity ? matchedOrder.quantity - newOrder.quantity : 0;

        const isMatchedOrderFilled = matchedOrderQuantitiesAfter === 0;

        matchedOrder.quantity = matchedOrderQuantitiesAfter;
        matchedOrder.status = isMatchedOrderFilled ? OrderStatusEnum.Filled : OrderStatusEnum.PartiallyFilled;

        executedOrderMatches.push({
          ...matchedOrder,
          value: newOrder.type === OrderTypeEnum.Sell ? newOrder.value : matchedOrder.value,
        });

        if (isMatchedOrderFilled) {
          this.removeOrder(matchedOrder);
        }
      }

      newOrder.quantity = newOrder.quantity - matchedOrdersQuantities;
      newOrder.status = isNewOrderFilled ? OrderStatusEnum.Filled : OrderStatusEnum.PartiallyFilled;

      if (!isNewOrderFilled) {
        this.addOrder(newOrder);
      }
    }

    return {
      executedOrderMatches,
      executedOrder: newOrder,
    };
  }

  public removeOrder(order: Order) {
    const ordersList = this.orders[order.type];

    const targetIndex = ordersList.findIndex(x => x.id === order.id);

    if (targetIndex >= 0) {
      ordersList.splice(targetIndex, 1);
    }
  }
}
