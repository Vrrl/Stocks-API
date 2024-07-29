import { MatchingEngineEventNames } from '../../domain/events/matching-engine-event-names';
import { ExecutedOrdersResult } from '../../dtos/executed-order-result';
import { EventMessage } from '../../infra/event/event-message';

export class PostProcessingParser {
  static parseExecutionResultToEvents({
    targetOrderExecuted,
    targetOrderMatches,
    runtimeChangedOrders,
  }: ExecutedOrdersResult): EventMessage[] {
    const orderExecutedEvents = targetOrderMatches.map(x => ({
      eventName: MatchingEngineEventNames.OrderStatusChanged,
      body: x,
    }));
    if (targetOrderExecuted) {
      orderExecutedEvents.push({ eventName: MatchingEngineEventNames.OrderStatusChanged, body: targetOrderExecuted });
    }

    const orderExpiredEvents = runtimeChangedOrders.map(x => ({
      eventName: MatchingEngineEventNames.OrderStatusChanged,
      body: x,
    }));

    const events = [...orderExpiredEvents, ...orderExecutedEvents];

    return events;
  }
}
