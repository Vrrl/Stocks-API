import { Order } from '../domain/order';

export class ExecutionOrderResult {
  executedOrder: Order;
  executedOrderMatches: Order[];
}
