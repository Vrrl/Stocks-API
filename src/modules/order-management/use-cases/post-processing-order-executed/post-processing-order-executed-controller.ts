import { PostProcessingOrderExecutedUseCase } from './post-processing-order-executed';
import { inject, injectable } from 'inversify/lib/inversify';
import { QueueController } from '@src/core/infra/queue-controller';
import { PostProcessingOrderExecutedMessage } from './post-processing-order-executed-message';
import TYPES from '@src/modules/order-management/infra/types';

@injectable()
export class PostProcessingOrderExecutedController extends QueueController<PostProcessingOrderExecutedMessage> {
  messageType = PostProcessingOrderExecutedMessage;

  constructor(
    @inject(TYPES.PostProcessingOrderExecutedUseCase)
    private readonly postProcessingOrderExecutedUseCase: PostProcessingOrderExecutedUseCase,
  ) {
    super();
  }

  async perform(message: PostProcessingOrderExecutedMessage): Promise<void> {
    const {
      id,
      type,
      expirationType,
      executedShares,
      executedTotalValue,
      executedUnitValue,
      currentStatus,
      processedAtTimestamp,
      matchedOrderIds,
    } = message;

    await this.postProcessingOrderExecutedUseCase.execute({
      id,
      type,
      expirationType,
      executedShares,
      executedTotalValue,
      executedUnitValue,
      currentStatus,
      processedAtTimestamp,
      matchedOrderIds,
    });
  }
}
