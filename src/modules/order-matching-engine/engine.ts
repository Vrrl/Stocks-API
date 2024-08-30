import TYPES from '@src/core/types';
import { inject, injectable } from 'inversify';
import { IQueueClient } from './infra/queue/queue-client';
import { OrderBookMessage } from './dtos/order-book-message';
import { OrderEventType } from './domain/events/order-event-type';
import { OrderBook } from './domain/order-book';
import { MessageContentParser } from './utils/parsers/message-content-parser';
import { PostProcessingMapper } from './utils/mappers/post-processing-parser';
import { IEventNotifier } from './infra/event/event-notifier';
import { OrderCanceledMessage } from './dtos/post-processing-message/order-canceled-message';
import { OrderMutationFailedMessage } from './dtos/post-processing-message/order-mutation-failed-message';
import { OrderEditedMessage } from './dtos/post-processing-message/order-edited-message';

@injectable()
export class Engine {
  constructor(
    @inject(TYPES.IQueueClient)
    private readonly queueClient: IQueueClient,
    @inject(TYPES.IEventNotifier)
    private readonly eventNotifier: IEventNotifier,
    @inject(TYPES.OrderBook)
    private readonly orderBook: OrderBook,
  ) {}

  private processOrderCreated(content: unknown) {
    const { order } = MessageContentParser.parseOrderCreated(content);
    const executionResult = this.orderBook.executeOrder(order);

    const postProcessingMessages = PostProcessingMapper.mapExecutionResultToMessages(executionResult);
    if (postProcessingMessages.length) {
      this.eventNotifier.notifyBatch(postProcessingMessages);
    }
  }

  private processOrderCanceled(content: unknown) {
    const { order } = MessageContentParser.parseOrderCanceled(content);
    const canceledOrder = this.orderBook.removeOrder(order);

    const postProcessingMessage = canceledOrder
      ? new OrderCanceledMessage({ orderId: canceledOrder.id })
      : new OrderMutationFailedMessage({ id: order.id, reason: OrderMutationFailedMessage.FailErrors.ORDER_NOT_FOUND });

    this.eventNotifier.notifyBatch([postProcessingMessage]);
  }

  private processOrderEdited(content: unknown) {
    const { order } = MessageContentParser.parseOrderEdited(content);
    const removedOrder = this.orderBook.removeOrder(order);

    if (!removedOrder) {
      const failMessage = new OrderMutationFailedMessage({
        id: order.id,
        reason: OrderMutationFailedMessage.FailErrors.ORDER_NOT_FOUND,
      });
      this.eventNotifier.notifyBatch([failMessage]);
      return;
    }

    const executionResult = this.orderBook.executeOrder(order);

    const postProcessingMessages = [
      new OrderEditedMessage({
        orderId: order.id,
        shares: order.shares,
        expirationTimestamp: order.expirationTimestamp,
        expirationType: order.expirationType,
        unitValue: order.unitValue,
      }),
    ];

    postProcessingMessages.push(...PostProcessingMapper.mapExecutionResultToMessages(executionResult));

    if (postProcessingMessages.length) {
      this.eventNotifier.notifyBatch(postProcessingMessages);
    }
  }

  private processMessage(message: OrderBookMessage): void {
    switch (message.type) {
      case OrderEventType.OrderCreated:
        return this.processOrderCreated(message.content);
      case OrderEventType.OrderCanceled:
        return this.processOrderCanceled(message.content);
      case OrderEventType.OrderEdited:
        return this.processOrderEdited(message.content);
      default:
        return;
    }
  }

  public async startProcessing() {
    console.log('Starting process loop');
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { messages } = await this.queueClient.pullOrderBookMessages();
      for (const message of messages) {
        try {
          await this.processMessage(message);
        } catch (error) {
          console.error(String(error));
        }
        this.queueClient.deleteOrderBookMessage(message.id);
      }
    }
  }
}
