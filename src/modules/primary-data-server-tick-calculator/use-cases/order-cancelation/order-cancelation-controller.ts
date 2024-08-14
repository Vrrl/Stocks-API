import TYPES from '@src/core/types';
import { OrderCancelationUseCase } from './order-cancelation';
import { inject, injectable } from 'inversify/lib/inversify';
import { QueueController } from '@src/core/infra/queue-controller';
import { OrderCancelationMessage } from './order-cancelation-message';

@injectable()
export class OrderCancelationController extends QueueController<OrderCancelationMessage> {
  messageType = OrderCancelationMessage;

  constructor(
    @inject(TYPES.OrderCancelationUseCase)
    private readonly orderCancelationUseCase: OrderCancelationUseCase,
  ) {
    super();
  }

  async perform(message: OrderCancelationMessage): Promise<void> {
    const { id } = message;

    await this.orderCancelationUseCase.execute({
      orderId: id,
    });
  }
}
