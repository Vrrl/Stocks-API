import { ExecutedOrdersResult } from '../../dtos/executed-order-result';
import { OrderExpiredMessage } from '../../dtos/post-processing-message/order-expired-message';
import { OrderMatchMessage } from '../../dtos/post-processing-message/order-match-message';
import { PostProcessingMessage } from '../../infra/event/post-processing-message';

export class PostProcessingMapper {
  static mapExecutionResultToMessages({
    targetOrderExecuted,
    targetOrderMatches,
    expiredOrders,
  }: ExecutedOrdersResult): PostProcessingMessage[] {
    const orderMatchMessages: OrderMatchMessage[] = [];

    if (targetOrderExecuted) {
      orderMatchMessages.push(
        new OrderMatchMessage({ ...targetOrderExecuted, matchedOrderIds: targetOrderMatches.map(x => x.id) }),
      );

      targetOrderMatches.forEach(x =>
        orderMatchMessages.push(new OrderMatchMessage({ ...x, matchedOrderIds: [targetOrderExecuted.id] })),
      );
    }

    const orderExpiredMessages: OrderExpiredMessage[] = expiredOrders.map(x => new OrderExpiredMessage(x));

    const messages = [...orderExpiredMessages, ...orderMatchMessages];

    return messages;
  }
}
