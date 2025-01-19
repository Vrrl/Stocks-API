import TYPES from '@src/core/types';
import { PostProcessingOrderEditionUseCase } from './post-processing-order-edition';
import { inject, injectable } from 'inversify/lib/inversify';
import { QueueController } from '@src/core/infra/queue-controller';
import { PostProcessingOrderEditionMessage } from './post-processing-order-edition-message';

@injectable()
export class PostProcessingOrderEditionController extends QueueController<PostProcessingOrderEditionMessage> {
  messageType = PostProcessingOrderEditionMessage;

  constructor(
    @inject(TYPES.PostProcessingOrderEditionUseCase)
    private readonly postProcessingOrderEditionUseCase: PostProcessingOrderEditionUseCase,
  ) {
    super();
  }

  async perform(message: PostProcessingOrderEditionMessage): Promise<void> {
    const { orderId, expirationTimestamp: expirationDate, expirationType, shares, unitValue } = message;

    await this.postProcessingOrderEditionUseCase.execute({
      orderId,
      expirationTimestamp: expirationDate,
      expirationType,
      shares,
      unitValue,
    });
  }
}
