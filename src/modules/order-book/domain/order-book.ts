import { Order } from './order';
import { OrderExpirationTypeEnum } from './order-expiration-type-enum';
import { OrderTypeEnum } from './order-type-enum';
import { ExecutedOrderResultBuilder } from '../builders/executed-order-result-builder';
import { OrderStatusEnum } from './order-status-enum';
import _ from 'lodash';
import { ExecutedOrderResult } from '../dtos/executed-order-result';

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

  public removeOrder(order: Order) {
    const ordersList = this.orders[order.type];

    const targetIndex = ordersList.findIndex(x => x.id === order.id);

    if (targetIndex >= 0) {
      ordersList.splice(targetIndex, 1);
    }
  }

  public executeOrder(newOrder: Order): ExecutedOrderResult {
    const executionOrderResult = ExecutedOrderResultBuilder.createResultOf(newOrder);

    const oppositeTypeOrders = this.getOppositeTypeOrders(newOrder.type);
    let quantityToBeFilled = newOrder.quantity;

    const matchedOrders: Order[] = [];

    for (const oppositeTypeOrder of oppositeTypeOrders) {
      if (
        oppositeTypeOrder.expirationEpoch &&
        oppositeTypeOrder.expirationEpoch < executionOrderResult.processedAtEpoch
      ) {
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

    const matchedOrdersQuantities = _.sumBy(matchedOrders, matchedOrder => matchedOrder.quantity);

    const willNewOrderBeFilled = matchedOrdersQuantities >= newOrder.quantity;

    if (newOrder.expirationType !== OrderExpirationTypeEnum.FillOrKill || willNewOrderBeFilled) {
      for (const matchedOrder of matchedOrders) {
        const matchedOrderQuantity = Math.min(newOrder.quantity, matchedOrder.quantity);

        const matchedOrderValue = newOrder.type === OrderTypeEnum.Sell ? newOrder.value : matchedOrder.value;

        const orderMatchedStatus = executionOrderResult.addOrderMatch(
          matchedOrder,
          matchedOrderQuantity,
          matchedOrderValue,
        );

        if (orderMatchedStatus === OrderStatusEnum.PartiallyFilled) {
          matchedOrder.quantity = matchedOrder.quantity - matchedOrderQuantity;
          matchedOrder.status = orderMatchedStatus;
        } else {
          this.removeOrder(matchedOrder);
        }
      }

      const remainingNewOrder = executionOrderResult.getRemainingExecutedOrder();

      if (remainingNewOrder) {
        this.addOrder(remainingNewOrder);
      }
    }

    return executionOrderResult.getResult();
  }
}
