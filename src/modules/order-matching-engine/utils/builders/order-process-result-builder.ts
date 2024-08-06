import moment from 'moment';
import { Order } from '../../domain/order';
import { OrderStatusEnum } from '../../domain/order-status-enum';
import { OrderTypeEnum } from '../../domain/order-type-enum';
import { OrderExpirationTypeEnum } from '../../domain/order-expiration-type-enum';
import { ExecutedOrdersResult } from '../../dtos/executed-order-result';

type ProcessedOrderProps = {
  id: string;
  type: OrderTypeEnum;
  expirationType: OrderExpirationTypeEnum;
  createdAtTimestamp: number;
  expirationTimestamp: number | null;
  initialStatus: OrderStatusEnum;
  executedShares: number;
  initialShares: number;
  initialValue: number;
  executedTotalValue: number;
};

class ProcessedOrder {
  constructor(public props: ProcessedOrderProps) {}

  get currentStatus(): OrderStatusEnum {
    const isFilled = this.props.executedShares === this.props.initialShares;

    if (this.props.expirationType === OrderExpirationTypeEnum.FillOrKill && !isFilled) {
      return OrderStatusEnum.Canceled;
    }

    if (this.props.executedShares === 0) {
      return this.props.initialStatus;
    }

    const status = isFilled ? OrderStatusEnum.Filled : OrderStatusEnum.PartiallyFilled;

    return status;
  }

  get remainingShares(): number {
    return this.props.initialShares - this.props.executedShares;
  }

  get executedUnitValue(): number {
    return this.props.executedTotalValue / this.props.executedShares;
  }
}

export class OrderProcessResultBuilder {
  constructor({ targetOrder }: { targetOrder: ProcessedOrder }) {
    this.targetOrder = targetOrder;
    this.targetOrderMatches = [];
    this.expiredOrders = [];
    this.processedAtTimestamp = moment().valueOf();
  }

  targetOrder: ProcessedOrder;
  targetOrderMatches: ProcessedOrder[];
  expiredOrders: Order[];
  processedAtTimestamp: number;

  get isTargetOrderExecuted() {
    return this.targetOrder.currentStatus !== OrderStatusEnum.Pending;
  }

  static createResultOf(order: Order) {
    const targetOrder = new ProcessedOrder({
      id: order.id,
      type: order.type,
      expirationType: order.expirationType,
      createdAtTimestamp: order.createdAtTimestamp,
      expirationTimestamp: order.expirationTimestamp,
      initialShares: order.shares,
      initialStatus: order.status,
      initialValue: order.unitValue,
      executedShares: 0,
      executedTotalValue: 0,
    });
    return new OrderProcessResultBuilder({ targetOrder });
  }

  public addOrderMatch(matchedOrder: Order, matchedShares: number, matchedValue: number): OrderStatusEnum {
    const targetOrderMatch = new ProcessedOrder({
      id: matchedOrder.id,
      type: matchedOrder.type,
      expirationType: matchedOrder.expirationType,
      createdAtTimestamp: matchedOrder.createdAtTimestamp,
      expirationTimestamp: matchedOrder.expirationTimestamp,
      initialShares: matchedOrder.shares,
      initialStatus: matchedOrder.status,
      initialValue: matchedOrder.unitValue,
      executedShares: matchedShares,
      executedTotalValue: matchedValue,
    });

    this.targetOrderMatches.push(targetOrderMatch);
    this.targetOrder.props.executedTotalValue += matchedValue;
    this.targetOrder.props.executedShares += matchedShares;

    return targetOrderMatch.currentStatus;
  }

  public addExpiredOrder(order: Order) {
    this.expiredOrders.push(order);
  }

  public getRemainingOrder(): Order | null {
    if (![OrderStatusEnum.PartiallyFilled, OrderStatusEnum.Pending].includes(this.targetOrder.currentStatus)) {
      return null;
    }

    const remainingOrder = new Order({
      id: this.targetOrder.props.id,
      createdAtTimestamp: this.targetOrder.props.createdAtTimestamp,
      expirationTimestamp: this.targetOrder.props.expirationTimestamp,
      expirationType: this.targetOrder.props.expirationType,
      shares: this.targetOrder.remainingShares,
      status: this.targetOrder.currentStatus,
      type: this.targetOrder.props.type,
      unitValue: this.targetOrder.props.initialValue,
    });

    return remainingOrder;
  }

  public getResult(): ExecutedOrdersResult {
    const executedOrdersResult: ExecutedOrdersResult = {
      targetOrderExecuted: this.isTargetOrderExecuted
        ? {
            id: this.targetOrder.props.id,
            type: this.targetOrder.props.type,
            expirationType: this.targetOrder.props.expirationType,
            executedShares: this.targetOrder.props.executedShares,
            executedTotalValue: this.targetOrder.props.executedTotalValue,
            executedUnitValue: this.targetOrder.executedUnitValue,
            currentStatus: this.targetOrder.currentStatus,
            processedAtTimestamp: this.processedAtTimestamp,
          }
        : undefined,
      targetOrderMatches: this.targetOrderMatches.map(orderMatch => ({
        id: orderMatch.props.id,
        type: orderMatch.props.type,
        expirationType: orderMatch.props.expirationType,
        executedShares: orderMatch.props.executedShares,
        executedTotalValue: orderMatch.props.executedTotalValue,
        executedUnitValue: orderMatch.executedUnitValue,
        currentStatus: orderMatch.currentStatus,
        processedAtTimestamp: this.processedAtTimestamp,
      })),
      expiredOrders: this.expiredOrders,
    };

    return executedOrdersResult;
  }
}
