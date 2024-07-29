import TYPES from '@src/core/types';
import { inject, injectable } from 'inversify';
import { IQueueClient } from './infra/queue/queue-client';
import { OrderBookMessage } from './dtos/order-book-message';
import { OrderEventNames } from './domain/events/order-event-names';
import { OrderBook } from './domain/order-book';
import { MessageContentParser } from './utils/parsers/message-content-parser';
import { PostProcessingParser } from './utils/mappers/post-processing-mapper';
import { IEventNotifier } from './infra/event/event-notifier';

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

    const postProcessingEvents = PostProcessingParser.parseExecutionResultToEvents(executionResult);
    if (postProcessingEvents.length) {
      this.eventNotifier.notifyBatch(postProcessingEvents);
    }
  }

  private processMessage(message: OrderBookMessage): void {
    switch (message.type) {
      case OrderEventNames.OrderCreated:
        return this.processOrderCreated(message.content);
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
        await this.queueClient.deleteOrderBookMessage(message.id);
      }
    }
  }
}
