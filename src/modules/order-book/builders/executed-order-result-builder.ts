import moment from 'moment';
import { Order } from '../domain/order';
import { OrderStatusEnum } from '../domain/order-status-enum';
import { OrderTypeEnum } from '../domain/order-type-enum';
import { OrderExpirationTypeEnum } from '../domain/order-expiration-type-enum';
import { ExecutedOrderResult } from '../dtos/executed-order-result';

type ExecutedOrderProps = {
  id: string;
  type: OrderTypeEnum;
  expirationType: OrderExpirationTypeEnum;
  createdAtEpoch: number;
  expirationDate: Date | null;
  expirationEpoch: number | null;
  initialStatus: OrderStatusEnum;
  executedQuantity: number;
  initialQuantity: number;
  initialValue: number;
  executedTotalValue: number;
};

class ExecutedOrder {
  constructor(public props: ExecutedOrderProps) {}

  get executedStatus(): OrderStatusEnum {
    const isFilled = this.props.executedQuantity === this.props.initialQuantity;

    if (this.props.expirationType === OrderExpirationTypeEnum.FillOrKill && !isFilled) {
      return OrderStatusEnum.Canceled;
    }

    if (this.props.executedQuantity === 0) {
      return this.props.initialStatus;
    }

    const status = isFilled ? OrderStatusEnum.Filled : OrderStatusEnum.PartiallyFilled;

    return status;
  }

  get remainingQuantity(): number {
    return this.props.initialQuantity - this.props.executedQuantity;
  }
}

export class ExecutedOrderResultBuilder {
  constructor({ executedOrder }: { executedOrder: ExecutedOrder }) {
    this.executedOrder = executedOrder;
    this.executedOrderMatches = [];
    this.processedAtEpoch = moment().valueOf();
  }

  executedOrder: ExecutedOrder;
  executedOrderMatches: ExecutedOrder[];
  processedAtEpoch: number;

  static createResultOf(order: Order) {
    const executedOrder = new ExecutedOrder({
      id: order.id,
      type: order.type,
      expirationType: order.expirationType,
      createdAtEpoch: order.createdAtEpoch,
      expirationDate: order.expirationDate,
      expirationEpoch: order.expirationEpoch,
      initialQuantity: order.quantity,
      initialStatus: order.status,
      initialValue: order.value,
      executedQuantity: 0,
      executedTotalValue: 0,
    });
    return new ExecutedOrderResultBuilder({ executedOrder });
  }

  public addOrderMatch(matchedOrder: Order, matchedQuantity: number, matchedValue: number): OrderStatusEnum {
    const executedOrderMatch = new ExecutedOrder({
      id: matchedOrder.id,
      type: matchedOrder.type,
      expirationType: matchedOrder.expirationType,
      createdAtEpoch: matchedOrder.createdAtEpoch,
      expirationDate: matchedOrder.expirationDate,
      expirationEpoch: matchedOrder.expirationEpoch,
      initialQuantity: matchedOrder.quantity,
      initialStatus: matchedOrder.status,
      initialValue: matchedOrder.value,
      executedQuantity: matchedQuantity,
      executedTotalValue: matchedValue,
    });

    this.executedOrderMatches.push(executedOrderMatch);
    this.executedOrder.props.executedTotalValue += matchedValue;
    this.executedOrder.props.executedQuantity += matchedQuantity;

    return executedOrderMatch.executedStatus;
  }

  getRemainingExecutedOrder(): Order | null {
    if (![OrderStatusEnum.PartiallyFilled, OrderStatusEnum.Pending].includes(this.executedOrder.executedStatus)) {
      return null;
    }

    const remainingOrder: Order = {
      id: this.executedOrder.props.id,
      createdAtEpoch: this.executedOrder.props.createdAtEpoch,
      expirationDate: this.executedOrder.props.expirationDate,
      expirationEpoch: this.executedOrder.props.expirationEpoch,
      expirationType: this.executedOrder.props.expirationType,
      quantity: this.executedOrder.remainingQuantity,
      status: this.executedOrder.executedStatus,
      type: this.executedOrder.props.type,
      value: this.executedOrder.props.initialValue,
    };

    return remainingOrder;
  }

  getResult(): ExecutedOrderResult {
    const executedOrder = {
      id: this.executedOrder.props.id,
      expirationType: this.executedOrder.props.expirationType,
      quantity: this.executedOrder.props.executedQuantity,
      status: this.executedOrder.executedStatus,
      type: this.executedOrder.props.type,
      totalValue: this.executedOrder.props.executedTotalValue,
    };

    const executedOrderMatches = this.executedOrderMatches.map(orderMatch => ({
      id: orderMatch.props.id,
      expirationType: orderMatch.props.expirationType,
      quantity: orderMatch.props.executedQuantity,
      status: orderMatch.executedStatus,
      type: orderMatch.props.type,
      totalValue: orderMatch.props.executedTotalValue,
    }));

    const executedOrderResult: ExecutedOrderResult = {
      executedOrder,
      executedOrderMatches,
      processedAtEpoch: this.processedAtEpoch,
    };

    return executedOrderResult;
  }
}
