import { PostProcessingOrderExpiredUseCase } from './post-processing-order-expired';
import { inject, injectable } from 'inversify/lib/inversify';
import { QueueController } from '@src/core/infra/queue-controller';
import { PostProcessingOrderExpiredMessage } from './post-processing-order-expired-message';
import TYPES from '@src/modules/order-management/infra/types';

@injectable()
export class PostProcessingOrderExpiredController extends QueueController<PostProcessingOrderExpiredMessage> {
  messageType = PostProcessingOrderExpiredMessage;

  constructor(
    @inject(TYPES.PostProcessingOrderExpiredUseCase)
    private readonly postProcessingOrderExpiredUseCase: PostProcessingOrderExpiredUseCase,
  ) {
    super();
  }

  async perform(message: PostProcessingOrderExpiredMessage): Promise<void> {
    const { id, type, unitValue, shares, status, createdAtTimestamp, expirationType, expirationTimestamp } = message;

    await this.postProcessingOrderExpiredUseCase.execute({
      id,
      type,
      unitValue,
      shares,
      status,
      createdAtTimestamp,
      expirationType,
      expirationTimestamp,
    });
  }
}
