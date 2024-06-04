import { ExecutedOrdersResult } from '../../dtos/executed-order-result';
import { EventMessage } from '../../infra/event/event-message';
import { EventNames } from '../../dtos/event-names';

export class PostProcessingParser {
  static parseExecutionResultToEvents({
    targetOrderExecuted,
    targetOrderMatches,
    runtimeChangedOrders,
  }: ExecutedOrdersResult): EventMessage[] {
    const orderExecutedEvents = targetOrderMatches.map(x => ({ eventName: EventNames.OrderExecuted, body: x }));
    if (targetOrderExecuted) {
      orderExecutedEvents.push({ eventName: EventNames.OrderExecuted, body: targetOrderExecuted });
    }

    const orderExpiredEvents = runtimeChangedOrders.map(x => ({ eventName: EventNames.OrderExecuted, body: x }));

    const events = [...orderExpiredEvents, ...orderExecutedEvents];

    return events;
  }
}
