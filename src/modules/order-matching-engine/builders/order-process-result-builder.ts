import moment from 'moment';
import { Order } from '../domain/order';
import { OrderStatusEnum } from '../domain/order-status-enum';
import { OrderTypeEnum } from '../domain/order-type-enum';
import { OrderExpirationTypeEnum } from '../domain/order-expiration-type-enum';
import { ExecutedOrderResult } from '../dtos/executed-order-result';

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

  get executedStatus(): OrderStatusEnum {
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
  constructor({ executedOrder }: { executedOrder: ProcessedOrder }) {
    this.executedOrder = executedOrder;
    this.executedOrderMatches = [];
    this.runtimeChangedOrders = [];
    this.processedAtEpoch = moment().valueOf();
  }

  executedOrder: ProcessedOrder;
  executedOrderMatches: ProcessedOrder[];
  runtimeChangedOrders: Order[];
  processedAtEpoch: number;

  static createResultOf(order: Order) {
    const executedOrder = new ProcessedOrder({
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
    return new OrderProcessResultBuilder({ executedOrder });
  }

  public addOrderMatch(matchedOrder: Order, matchedShares: number, matchedValue: number): OrderStatusEnum {
    const executedOrderMatch = new ProcessedOrder({
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

    this.executedOrderMatches.push(executedOrderMatch);
    this.executedOrder.props.executedTotalValue += matchedValue;
    this.executedOrder.props.executedShares += matchedShares;

    return executedOrderMatch.executedStatus;
  }

  public addRuntimeChangedOrder(order: Order) {
    this.runtimeChangedOrders.push(order);
  }

  public getRemainingExecutedOrder(): Order | null {
    if (![OrderStatusEnum.PartiallyFilled, OrderStatusEnum.Pending].includes(this.executedOrder.executedStatus)) {
      return null;
    }

    const remainingOrder = new Order({
      id: this.executedOrder.props.id,
      createdAtTimestamp: this.executedOrder.props.createdAtTimestamp,
      expirationTimestamp: this.executedOrder.props.expirationTimestamp,
      expirationType: this.executedOrder.props.expirationType,
      shares: this.executedOrder.remainingShares,
      status: this.executedOrder.executedStatus,
      type: this.executedOrder.props.type,
      unitValue: this.executedOrder.props.initialValue,
    });

    return remainingOrder;
  }

  getResult(): ExecutedOrderResult {
    const executedOrder = {
      id: this.executedOrder.props.id,
      expirationType: this.executedOrder.props.expirationType,
      shares: this.executedOrder.props.executedShares,
      status: this.executedOrder.executedStatus,
      type: this.executedOrder.props.type,
      totalValue: this.executedOrder.props.executedTotalValue,
      unitValue: this.executedOrder.executedUnitValue,
    };

    const executedOrderMatches = this.executedOrderMatches.map(orderMatch => ({
      id: orderMatch.props.id,
      expirationType: orderMatch.props.expirationType,
      shares: orderMatch.props.executedShares,
      status: orderMatch.executedStatus,
      type: orderMatch.props.type,
      totalValue: orderMatch.props.executedTotalValue,
      unitValue: orderMatch.executedUnitValue,
    }));

    const runtimeChangedOrders = this.runtimeChangedOrders.map(order => ({
      id: order.props.id,
      expirationType: order.props.expirationType,
      shares: order.props.shares,
      status: order.props.status,
      type: order.props.type,
      totalValue: order.totalValue,
      unitValue: order.props.unitValue,
    }));

    const executedOrderResult: ExecutedOrderResult = {
      executedOrder,
      executedOrderMatches,
      runtimeChangedOrders,
      processedAtEpoch: this.processedAtEpoch,
    };

    return executedOrderResult;
  }
}
