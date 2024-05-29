import TYPES from '@src/core/types';
import { inject, injectable } from 'inversify';
import { IQueueClient } from './infra/queue/queue-client';
import { OrderBookMessage } from './dtos/order-book-message';
import { EventNames } from './dtos/event-names';
import { Order } from './domain/order';
import { OrderBook } from './domain/order-book';

@injectable()
export class Engine {
  constructor(
    @inject(TYPES.IQueueClient)
    private readonly queueClient: IQueueClient,
    @inject(TYPES.OrderBook)
    private readonly orderBook: OrderBook,
  ) {}

  private processOrderCreated(order: Order) {
    const executionResult = this.orderBook.executeOrder(order);
    console.log(executionResult);
  }

  private processMessage(message: OrderBookMessage): void {
    console.log('Mensagem recebida:', message);

    switch (message.type) {
      case EventNames.OrderCreated:
        return this.processOrderCreated(message.order);
      default:
        return;
    }
  }

  public async startProcessing() {
    console.log('Starting process loop');
    // eslint-disable-next-line no-constant-condition
    while (true) {
      console.log('Checking messagens...');
      const { messages } = await this.queueClient.pullOrderBookMessages();
      if (messages) {
        for (const message of messages) {
          await this.processMessage(message);

          await this.queueClient.deleteOrderBookMessage(message.id);
        }
      } else {
        console.log('No messages found, awaiting for next pull');
      }
    }
  }
}
